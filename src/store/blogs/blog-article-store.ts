import { flow, types, type Instance } from 'mobx-state-tree';
import { ApiError, buildToc, getBlogArticle, toUiError, type UiError } from '@/libs';
import type { ArticleImage, BlogArticle, BlogContentV2, TocItem } from '@/types';

const Ref = types.model('BlogRef', { slug: types.string, name: types.string });
const Author = types.model('BlogAuthor', {
  slug: types.string,
  name: types.string,
  role: types.maybeNull(types.string),
  avatarUrl: types.maybeNull(types.string),
  avatarAlt: types.string,
  bio: types.maybeNull(types.string),
});
const ImageRef = types.model('BlogImageRef', {
  url: types.string,
  alt: types.string,
  width: types.maybeNull(types.number),
  height: types.maybeNull(types.number),
});
const RelatedArticleModel = types.model('RelatedArticle', {
  id: types.string,
  slug: types.string,
  title: types.string,
  category: types.maybeNull(Ref),
  image: types.model('RelatedImage', { url: types.string, alt: types.string }),
  readTimeMinutes: types.number,
  publishedAt: types.string,
});

/** `slug` is the identifier (map key); `id` stays a plain string. */
export const BlogArticleModel = types
  .model('BlogArticle', {
    slug: types.identifier,
    id: types.string,
    title: types.string,
    category: types.maybeNull(Ref),
    tags: types.array(Ref),
    author: Author,
    publishedAt: types.string,
    updatedAt: types.string,
    readTimeMinutes: types.number,
    coverImage: ImageRef,
    // read-only render data; frozen avoids modelling the 6-way block union in MST
    content: types.frozen<BlogContentV2>(),
    images: types.frozen<ArticleImage[]>(),
    related: types.array(RelatedArticleModel),
    seo: types.frozen<{ title: string; description: string; ogImage: string }>(),
  })
  .views((self) => ({
    get toc(): TocItem[] {
      return buildToc(self.content.blocks);
    },
  }));

export type BlogArticleInstance = Instance<typeof BlogArticleModel>;
export type ArticleStatus = 'idle' | 'loading' | 'loaded' | 'notFound' | 'error';

const isAbort = (e: unknown) => e instanceof ApiError && e.kind === 'abort';

export const BlogArticleStore = types
  .model('BlogArticleStore', {
    /** cache across navigation, keyed by slug */
    articles: types.map(BlogArticleModel),
    statuses: types.map(types.enumeration<ArticleStatus>('ArticleStatus', ['idle', 'loading', 'loaded', 'notFound', 'error'])),
    errors: types.map(types.frozen<UiError>()),
  })
  .volatile(() => ({ abort: null as AbortController | null, inFlightSlug: null as string | null }))
  .views((self) => ({
    articleBySlug(slug: string) {
      return self.articles.get(slug);
    },
    errorOf(slug: string): UiError | undefined {
      return self.errors.get(slug);
    },
    statusOf(slug: string): ArticleStatus {
      return self.statuses.get(slug) ?? 'idle';
    },
  }))
  .actions((self) => {
    const fetchArticle = flow(function* fetchArticle(slug: string) {
      const status = self.statuses.get(slug);
      if (status === 'loaded' || status === 'notFound') return; // cache hit
      if (status === 'loading' && self.inFlightSlug === slug) return; // same request in flight (StrictMode)
      if (self.inFlightSlug && self.inFlightSlug !== slug) {
        self.abort?.abort();
        self.statuses.set(self.inFlightSlug, 'idle');
      }
      const ctrl = new AbortController();
      self.abort = ctrl;
      self.inFlightSlug = slug;
      self.statuses.set(slug, 'loading');
      try {
        const dto: BlogArticle = yield getBlogArticle(slug, ctrl.signal);
        self.articles.put(dto as never);
        self.statuses.set(slug, 'loaded');
      } catch (e) {
        if (isAbort(e)) return;
        const notFound = e instanceof ApiError && (e.status === 404 || e.status === 400);
        self.statuses.set(slug, notFound ? 'notFound' : 'error');
        self.errors.set(slug, toUiError(e));
        if (import.meta.env.DEV && !notFound) console.warn('[blog-article] fetch failed', e);
      } finally {
        if (self.inFlightSlug === slug) self.inFlightSlug = null;
      }
    });
    return {
      fetchArticle,
      retryArticle(slug: string) {
        self.statuses.set(slug, 'idle');
        self.errors.delete(slug);
        return fetchArticle(slug);
      },
    };
  });

export type BlogArticleStoreInstance = Instance<typeof BlogArticleStore>;
