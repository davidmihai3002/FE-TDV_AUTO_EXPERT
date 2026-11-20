import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import {
  ArticleBody,
  ArticleCtaCard,
  ArticleHero,
  ArticleSeo,
  ArticleSkeleton,
  ArticleTocBar,
  ArticleTocSidebar,
  MobileArticleCtaBar,
  RelatedCarousel,
  RelatedInsightsCard,
} from '@/components/blog-article';
import { BLOG_NOT_FOUND_COPY, ErrorPage } from '@/components/feedback';
import { useActiveSection, useHideOnScroll } from '@/libs';
import { useStore, type BlogArticleInstance } from '@/store';

const BlogArticlePage = observer(function BlogArticlePage() {
  const { slug = '' } = useParams();
  const { blogArticle } = useStore();
  const status = blogArticle.statusOf(slug);
  const article = blogArticle.articleBySlug(slug);

  useEffect(() => {
    void blogArticle.fetchArticle(slug);
  }, [blogArticle, slug]);

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollPaddingBottom;
    html.style.scrollPaddingBottom = '96px';
    return () => {
      html.style.scrollPaddingBottom = previous;
    };
  }, []);

  if (article) return <ArticleView article={article} />;
  if (status === 'notFound') {
    return (
      <div className="max-lg:pt-[72px]">
        <ErrorPage variant="not-found" copy={BLOG_NOT_FOUND_COPY} />
      </div>
    );
  }
  if (status === 'error') {
    const error = blogArticle.errorOf(slug);
    return (
      <div className="max-lg:pt-[72px]">
        <ErrorPage
          variant={error?.variant === 'offline' ? 'offline' : 'server'}
          statusCode={error?.statusCode}
          connectionError={error?.variant === 'server' && error.statusCode === undefined}
          requestId={error?.requestId}
          onRetry={() => blogArticle.retryArticle(slug)}
        />
      </div>
    );
  }
  return <ArticleSkeleton />;
});

const ArticleView = observer(function ArticleView({ article }: { article: BlogArticleInstance }) {
  const { hash } = useLocation();
  const toc = article.toc;
  const activeId = useActiveSection(toc.map((t) => t.id));
  const headerHidden = useHideOnScroll();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) window.requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, [article.slug, hash]);

  return (
    <article>
      <ArticleSeo article={article} />
      <ArticleHero article={article} />

      <ArticleTocBar items={toc} activeId={activeId} headerHidden={headerHidden} />

      <div className="lg:max-w-[1280px] lg:mx-auto lg:px-margin-desktop lg:py-xl lg:grid lg:grid-cols-12 lg:gap-6 relative">
        <aside className="hidden lg:block lg:col-span-3 relative">
          <ArticleTocSidebar items={toc} activeId={activeId} />
        </aside>

        <div className="px-margin-mobile lg:px-0 lg:col-span-6">
          <ArticleBody blocks={article.content.blocks} />
        </div>

        <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
          <RelatedInsightsCard items={article.related} />
          <ArticleCtaCard />
        </div>
      </div>

      <RelatedCarousel items={article.related} />
      <MobileArticleCtaBar />
    </article>
  );
});

export default BlogArticlePage;
