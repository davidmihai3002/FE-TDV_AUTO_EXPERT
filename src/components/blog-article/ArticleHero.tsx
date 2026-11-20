import { Icon } from '@/components/ui';
import { formatDate } from '@/libs';
import type { BlogArticleInstance } from '@/store';
import { ArticleAvatar } from './ArticleAvatar';
import { ArticleBreadcrumb } from './ArticleBreadcrumb';
import { ARTICLE_COPY } from './copy';

export function ArticleHero({ article }: { article: BlogArticleInstance }) {
  const { author, category, coverImage } = article;
  const readTime = (
    <span className="flex items-center gap-1">
      <Icon name="schedule" size={16} />
      {ARTICLE_COPY.readTime(article.readTimeMinutes)}
    </span>
  );
  return (
    <header className="relative pt-[72px] lg:pt-0 lg:overflow-hidden">
      <div className="relative w-full h-72 lg:absolute lg:inset-0 lg:h-full">
        <img
          src={coverImage.url}
          alt={coverImage.alt}
          width={coverImage.width ?? undefined}
          height={coverImage.height ?? undefined}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent lg:via-surface/80" />
      </div>

      <div className="relative z-10 px-margin-mobile -mt-16 lg:mt-0 lg:z-20 lg:max-w-[1280px] lg:mx-auto lg:px-margin-desktop lg:pt-48 lg:pb-24 lg:min-h-[614px] lg:flex lg:flex-col lg:justify-end">
        <div className="lg:max-w-[768px]">
          <ArticleBreadcrumb title={article.title} />

          <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
            {category && (
              <span className="bg-primary-container text-on-primary-container px-2 py-1 rounded-xs text-label-sm">
                {category.name}
              </span>
            )}
            {article.tags.slice(0, 2).map((t) => (
              <span key={t.slug} className="bg-surface-container text-on-surface-variant border border-outline-variant px-2 py-1 rounded-xs text-label-sm">
                {t.name}
              </span>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-4 mb-md">
            {category && (
              <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-xs text-label-sm font-bold uppercase tracking-wider">
                {category.name}
              </span>
            )}
            <span className="text-label-md text-on-surface-variant">{readTime}</span>
          </div>

          <h1 className="text-headline-lg-mobile text-on-background mb-4 lg:text-headline-xl lg:text-primary lg:mb-md text-balance">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-label-md text-on-surface-variant border-b border-surface-variant pb-md mb-md lg:hidden">
            <span className="flex items-center gap-2">
              <ArticleAvatar author={author} size={32} decorative />
              {author.name}
            </span>
            {readTime}
          </div>
          <div className="hidden lg:flex items-center gap-4 border-t border-surface-variant pt-md mt-md">
            <ArticleAvatar author={author} size={48} />
            <div>
              <p className="text-body-md font-bold text-primary">{author.name}</p>
              <p className="text-label-sm text-on-surface-variant">
                {author.role && (
                  <>
                    {author.role} <span aria-hidden>•</span>{' '}
                  </>
                )}
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
