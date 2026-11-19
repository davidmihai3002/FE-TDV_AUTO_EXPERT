import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  BLOGS_COPY,
  BlogCard,
  BlogCardSkeleton,
  BlogCategoryFilter,
  BlogGrid,
  BlogsEmptyState,
  BlogsErrorState,
  BlogsPageHeader,
  FeaturedBlog,
  FeaturedBlogSkeleton,
  LoadMoreButton,
} from '@/components/blogs';
import { ROUTES } from '@/config';
import { BLOGS_PARAM, MD_UP, buildCategoryHref, parseBlogsSearchParams, useMediaQuery, withPages } from '@/libs';
import { PAGE_SIZE, useStore } from '@/store';

const LIST_ID = 'blog-list';
const GRID_HEADING_ID = 'latest-articles-heading';

/** One DOM instance per section; CSS `order` swaps hero/filters between breakpoints (§2.3). */
const BlogsPage = observer(function BlogsPage() {
  const { blogsList: store } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(MD_UP);
  const { category, search, pages } = parseBlogsSearchParams(searchParams);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    void store.fetchCategories();
    void store.fetchFeatured();
  }, [store]);

  useEffect(() => {
    void store.syncFromUrl({ category, search, pages });
  }, [store, category, search, pages]);

  useEffect(() => {
    if (store.status === 'loading') setAnnouncement(BLOGS_COPY.a11y.loading);
  }, [store.status]);

  const onLoadMore = useCallback(async () => {
    const before = store.items.length;
    const nextPages = await store.loadMore();
    if (nextPages == null) return;
    setSearchParams((sp) => withPages(sp, nextPages), { replace: true });
    setAnnouncement(BLOGS_COPY.a11y.loaded(store.items.length - before));
    // move focus to the first newly added card's link
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`#${LIST_ID} > li:nth-child(${before + 1}) a`)?.focus();
    });
  }, [store, setSearchParams]);

  const onReset = useCallback(() => navigate(ROUTES.blog), [navigate]);
  const onRetry = useCallback(() => {
    store.retry();
    void store.syncFromUrl({ category, search, pages });
  }, [store, category, search, pages]);

  const variant = isDesktop ? 'card' : 'row';
  const initialLoading = (store.status === 'loading' || store.status === 'idle') && store.items.length === 0;
  const showFeaturedSlot = !category && !search;
  const featuredLoading = showFeaturedSlot && (store.featuredStatus === 'idle' || store.featuredStatus === 'loading');
  const activeName = store.activeCategory?.name;

  const origin = window.location.origin;
  const canonical = `${origin}${category && store.activeCategory ? buildCategoryHref(category) : ROUTES.blog}`;
  const title = activeName ? BLOGS_COPY.meta.titleCategory(activeName) : BLOGS_COPY.meta.title;
  const visiblePosts = [...(store.showFeatured && store.featured ? [store.featured] : []), ...store.items];

  return (
    <div className="flex flex-col gap-xl pb-xl md:gap-0 md:pb-0">
      <title>{title}</title>
      <meta name="description" content={BLOGS_COPY.meta.description} />
      <link rel="canonical" href={canonical} />
      {searchParams.has(BLOGS_PARAM.search) && <meta name="robots" content="noindex,follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={BLOGS_COPY.meta.description} />
      <meta property="og:url" content={canonical} />
      {store.featured && <meta property="og:image" content={store.featured.image} />}

      <BlogsPageHeader title={BLOGS_COPY.pageTitle} subtitle={BLOGS_COPY.pageSubtitle} className="order-1" />

      {/* featured: mobile after the chips, desktop first */}
      {showFeaturedSlot && (featuredLoading || store.showFeatured) && (
        <section className="order-3 md:order-2 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop md:py-xl">
          {store.showFeatured && store.featured ? (
            <FeaturedBlog post={store.featured} variant={isDesktop ? 'hero' : 'card'} />
          ) : (
            <FeaturedBlogSkeleton variant={isDesktop ? 'hero' : 'card'} />
          )}
        </section>
      )}

      {store.categoriesStatus !== 'error' && (
        <section
          className={`order-2 md:order-3 w-full max-w-7xl mx-auto md:px-margin-desktop md:pb-xl ${
            showFeaturedSlot && (featuredLoading || store.showFeatured) ? '' : 'md:pt-xl'
          }`}
        >
          <BlogCategoryFilter
            categories={store.visibleCategories}
            activeSlug={category}
            isLoading={store.categoriesStatus === 'idle' || store.categoriesStatus === 'loading'}
          />
        </section>
      )}

      <section
        aria-labelledby={GRID_HEADING_ID}
        className="order-4 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop md:pb-xl"
      >
        <h2 id={GRID_HEADING_ID} className="sr-only">
          {BLOGS_COPY.a11y.gridHeading}
        </h2>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        {store.status === 'error' ? (
          <BlogsErrorState onRetry={onRetry} />
        ) : initialLoading ? (
          <BlogGrid variant={variant} busy>
            {Array.from({ length: isDesktop ? PAGE_SIZE : 3 }, (_, i) => (
              <li key={i}>
                <BlogCardSkeleton variant={variant} />
              </li>
            ))}
          </BlogGrid>
        ) : store.isEmpty ? (
          <BlogsEmptyState onReset={onReset} hasFilter={store.hasFilter} searchTerm={search} />
        ) : (
          <>
            <BlogGrid id={LIST_ID} variant={variant} busy={store.status === 'loading'} dimmed={store.status === 'loading'}>
              {store.items.map((post) => (
                <li key={post.id}>
                  <BlogCard post={post} variant={variant} />
                </li>
              ))}
            </BlogGrid>
            {(store.hasMore || store.loadMoreError) && (
              <div className="mt-sm md:mt-xl flex flex-col items-center gap-2">
                {store.hasMore && (
                  <LoadMoreButton
                    onClick={() => void onLoadMore()}
                    isLoading={store.status === 'loadingMore'}
                    label={BLOGS_COPY.loadMore}
                    controls={LIST_ID}
                  />
                )}
                {store.loadMoreError && (
                  <p role="alert" className="text-label-sm text-error">
                    {BLOGS_COPY.loadMoreError}{' '}
                    <button type="button" onClick={() => void onLoadMore()} className="underline hover:no-underline">
                      {BLOGS_COPY.loadMoreRetry}
                    </button>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {visiblePosts.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: title,
            url: canonical,
            inLanguage: 'ro-RO',
            blogPost: visiblePosts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              image: p.image,
              datePublished: p.publishedAt,
              author: { '@type': 'Person', name: p.author },
              url: `${origin}${p.href}`,
            })),
          })}
        </script>
      )}
    </div>
  );
});

export default BlogsPage;
