import { flow, types, type Instance } from 'mobx-state-tree';
import { ApiError, BLOGS_MAX_PAGE_SIZE, getBlogCategories, getBlogs, isValidCategorySlug } from '@/libs';
import type { BlogCategory, BlogListItem, BlogListQuery, Paginated } from '@/types';
import { BlogCategoryModel, BlogListItemModel } from './models';

export const PAGE_SIZE = 6;

const Status = types.enumeration('BlogsStatus', ['idle', 'loading', 'loadingMore', 'success', 'error']);
const isAbort = (e: unknown) => e instanceof ApiError && e.kind === 'abort';

interface SyncArgs {
  category: string | null;
  search: string | null;
  pages: number;
}

export const BlogsListStore = types
  .model('BlogsListStore', {
    /** grid items, accumulated across "load more" */
    items: types.array(BlogListItemModel),
    featured: types.maybeNull(BlogListItemModel),
    categories: types.array(BlogCategoryModel),
    total: 0,
    pagesLoaded: 0,
    /** active filter (slug), mirrors ?categorie= */
    category: types.maybeNull(types.string),
    /** mirrors ?cauta= (no search box yet) */
    search: types.maybeNull(types.string),
    status: types.optional(Status, 'idle'),
    featuredStatus: types.optional(Status, 'idle'),
    categoriesStatus: types.optional(Status, 'idle'),
    loadMoreError: false,
  })
  .volatile(() => ({ abort: null as AbortController | null, pendingKey: null as string | null }))
  .views((self) => ({
    get hasFilter(): boolean {
      return self.category !== null || self.search !== null;
    },
    /** Hero only on the unfiltered view; when filtered, the featured post appears in the grid instead. */
    get showFeatured(): boolean {
      return !this.hasFilter && self.featured !== null && self.featuredStatus === 'success';
    },
    get visibleCategories() {
      return self.categories.filter((c) => c.postCount > 0);
    },
    get hasMore(): boolean {
      return self.items.length < self.total;
    },
    get isEmpty(): boolean {
      return self.status === 'success' && self.items.length === 0 && !this.showFeatured;
    },
    get activeCategory() {
      return self.categories.find((c) => c.slug === self.category) ?? null;
    },
    gridQuery(): Omit<BlogListQuery, 'page' | 'pageSize'> {
      return {
        category: self.category ?? undefined,
        search: self.search ?? undefined,
        // unfiltered view: the featured post is in the hero, not the grid
        featured: self.category || self.search ? undefined : false,
      };
    },
  }))
  .actions((self) => ({
    fetchCategories: flow(function* fetchCategories() {
      if (self.categoriesStatus === 'loading' || self.categoriesStatus === 'success') return;
      self.categoriesStatus = 'loading';
      try {
        const res: { items: BlogCategory[] } = yield getBlogCategories();
        self.categories.replace(res.items as never);
        self.categoriesStatus = 'success';
      } catch (e) {
        self.categoriesStatus = 'error'; // chips hidden; the page still works via the URL
        if (import.meta.env.DEV) console.warn('[blogs] categories failed', e);
      }
    }),

    fetchFeatured: flow(function* fetchFeatured() {
      if (self.featuredStatus === 'loading' || self.featuredStatus === 'success') return;
      self.featuredStatus = 'loading';
      try {
        const res: Paginated<BlogListItem> = yield getBlogs({ featured: true, pageSize: 1 });
        self.featured = (res.items[0] ?? null) as never;
        self.featuredStatus = 'success';
      } catch (e) {
        self.featuredStatus = 'error'; // hero hidden quietly
        if (import.meta.env.DEV) console.warn('[blogs] featured failed', e);
      }
    }),

    /**
     * Sync from the URL. `?pagina=N` is restored in as few requests as possible (pages of up to 24 items, in parallel)
     * instead of N sequential "load more" calls.
     */
    syncFromUrl: flow(function* syncFromUrl({ category, search, pages }: SyncArgs) {
      const sameFilters = self.category === category && self.search === search;
      if (sameFilters && self.status === 'success' && self.pagesLoaded === pages) return; // cache hit / after loadMore
      const key = JSON.stringify([category, search, pages]);
      if (self.status === 'loading' && self.pendingKey === key) return; // identical request already in flight
      self.pendingKey = key;

      self.abort?.abort();
      const ctrl = new AbortController();
      self.abort = ctrl;
      self.category = category;
      self.search = search;
      self.loadMoreError = false;

      if (category && !isValidCategorySlug(category)) {
        // malformed slug: empty state, no request (API would 400)
        self.items.clear();
        self.total = 0;
        self.pagesLoaded = pages;
        self.status = 'success';
        return;
      }

      self.status = 'loading';
      const wanted = PAGE_SIZE * pages;
      const chunk = Math.min(wanted, BLOGS_MAX_PAGE_SIZE);
      const requests = Math.ceil(wanted / chunk);
      try {
        const results: Paginated<BlogListItem>[] = yield Promise.all(
          Array.from({ length: requests }, (_, i) =>
            getBlogs({ ...self.gridQuery(), page: i + 1, pageSize: chunk }, ctrl.signal),
          ),
        );
        const items = results.flatMap((r) => r.items).slice(0, wanted);
        self.items.replace(items as never);
        self.total = results[0]?.total ?? 0;
        self.pagesLoaded = pages;
        self.status = 'success';
        self.pendingKey = null;
      } catch (e) {
        if (isAbort(e)) return;
        self.status = 'error';
        self.pendingKey = null;
        if (import.meta.env.DEV) console.warn('[blogs] list failed', e);
      }
    }),

    /** Appends the next page; resolves to the new number of loaded pages (or null on failure). */
    loadMore: flow(function* loadMore() {
      if (self.status !== 'success' || !self.hasMore) return null;
      self.status = 'loadingMore';
      self.loadMoreError = false;
      try {
        const res: Paginated<BlogListItem> = yield getBlogs({
          ...self.gridQuery(),
          page: self.pagesLoaded + 1,
          pageSize: PAGE_SIZE,
        });
        const known = new Set(self.items.map((i) => i.id));
        self.items.push(...(res.items.filter((i) => !known.has(i.id)) as never[]));
        self.total = res.total;
        self.pagesLoaded += 1;
        self.status = 'success';
        return self.pagesLoaded;
      } catch (e) {
        self.status = 'success';
        self.loadMoreError = true;
        if (import.meta.env.DEV) console.warn('[blogs] load more failed', e);
        return null;
      }
    }),

    retry() {
      self.status = 'idle'; // forces the next syncFromUrl to refetch
    },
  }));

export type BlogsListStoreInstance = Instance<typeof BlogsListStore>;
