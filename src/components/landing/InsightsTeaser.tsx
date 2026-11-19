import { Link } from 'react-router';
import { Button, Icon, Skeleton } from '@/components/ui';
import { ROUTES } from '@/config';
import { cn, formatDate } from '@/libs';
import type { BlogListItem, LandingSection } from '@/types';
import { insightCategoryTone } from './insight-category-tone';
import { LANDING_COPY } from './landing-copy';
import { SafeImage } from './SafeImage';
import { SectionEyebrow } from './SectionEyebrow';

const STRETCH = "after:absolute after:inset-0 after:content-['']";

/** Desktop: image card, no excerpt. Mobile: text card with excerpt. Whole card clickable. */
export function InsightCard({ post }: { post: BlogListItem }) {
  const href = ROUTES.blogArticle(post.slug);
  return (
    <article
      className={cn(
        'relative group flex flex-col gap-2 p-4 rounded-xl shadow-sm bg-surface-container hover:bg-surface-container-high transition-colors',
        'md:gap-0 md:p-0 md:rounded-lg md:shadow-none md:bg-surface-container-low md:hover:bg-surface-container-low md:border md:border-outline-variant/30 md:overflow-hidden',
        'has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-container',
      )}
    >
      <div className="hidden md:block aspect-video w-full bg-surface-container relative overflow-hidden">
        <SafeImage
          src={post.image}
          alt={post.imageAlt || post.title}
          loading="lazy"
          width={640}
          height={360}
          fallbackIcon="article"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 motion-safe:group-hover:scale-105 motion-safe:transition-all motion-safe:duration-500"
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-sm md:p-md md:flex-grow">
        <div className="flex justify-between items-center gap-3 text-[12px] leading-4 md:text-label-sm">
          <span className={cn('font-semibold uppercase tracking-wider md:font-medium md:tracking-widest md:text-primary-container', insightCategoryTone(post.category?.slug))}>
            {post.category?.name}
          </span>
          <time dateTime={post.publishedAt} className="text-on-surface-variant shrink-0">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h3 className="font-headline text-[17px] leading-snug font-semibold text-primary md:text-[20px] md:leading-7 md:text-on-surface md:line-clamp-2">
          {post.title}
        </h3>
        <p className="md:hidden text-[13px] leading-5 text-on-surface-variant line-clamp-2">{post.excerpt}</p>
        <Link
          to={href}
          aria-label={LANDING_COPY.readMoreAria(post.title)}
          className={cn(
            'mt-auto pt-1 md:pt-0 inline-flex items-center gap-1 text-[13px] font-semibold md:text-label-md text-secondary hover:text-secondary-fixed transition-colors focus-visible:outline-none',
            STRETCH,
          )}
        >
          {LANDING_COPY.readMore}
          <Icon name="arrow_forward" size={16} />
        </Link>
      </div>
    </article>
  );
}

export interface InsightsTeaserProps {
  section: LandingSection;
  posts: BlogListItem[];
  status: 'idle' | 'loading' | 'success' | 'error';
  onRetry: () => void;
}

export function InsightsTeaser({ section, posts, status, onRetry }: InsightsTeaserProps) {
  if (status === 'success' && posts.length === 0) return null; // nothing to tease
  const href = section.primaryCtaHref ?? ROUTES.blog;
  const label = section.primaryCtaLabel ?? LANDING_COPY.viewAllArticles;
  return (
    <section
      aria-labelledby="insights-heading"
      className="order-5 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-md px-margin-mobile py-6 md:px-margin-desktop md:py-0 md:gap-0"
    >
      <div className="flex flex-col md:gap-md md:mb-lg">
        {section.eyebrow && <SectionEyebrow icon={section.eyebrowIcon} label={section.eyebrow} tone="primary" />}
        <h2 id="insights-heading" className="text-headline-md md:text-headline-lg text-primary">
          {section.title}
        </h2>
        {section.subtitle && <p className="mt-1 md:mt-0 text-body-md leading-relaxed md:leading-6 text-on-surface-variant">{section.subtitle}</p>}
      </div>
      {status === 'error' ? (
        <p className="text-body-md text-on-surface-variant">
          {LANDING_COPY.blogsError}{' '}
          <button type="button" onClick={onRetry} className="text-secondary hover:underline">
            {LANDING_COPY.blogsRetry}
          </button>
        </p>
      ) : (
        <ul role="list" aria-busy={status !== 'success' || undefined} className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-gutter">
          {status === 'success'
            ? posts.map((p) => (
                <li key={p.id} className="flex">
                  <div className="w-full flex">
                    <InsightCard post={p} />
                  </div>
                </li>
              ))
            : [0, 1, 2].map((i) => (
                <li key={i} aria-hidden className="rounded-xl md:rounded-lg overflow-hidden bg-surface-container">
                  <Skeleton className="hidden md:block aspect-video rounded-none" />
                  <div className="p-4 md:p-md flex flex-col gap-2">
                    <Skeleton shape="text" className="w-1/2 h-3" />
                    <Skeleton shape="text" className="w-5/6 h-5" />
                    <Skeleton shape="text" className="w-1/3 h-3" />
                  </div>
                </li>
              ))}
        </ul>
      )}
      <div className="flex justify-center pt-2 md:pt-0 md:mt-lg">
        <Button to={href} variant="tonal-neutral" trailingIcon="library_books" block className="md:hidden py-3.5">
          {label}
        </Button>
        <Button to={href} variant="outline" className="hidden md:inline-flex">
          {label}
        </Button>
      </div>
    </section>
  );
}
