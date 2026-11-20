import { Link } from 'react-router';
import { Icon, Skeleton } from '@/components/ui';
import { formatDate } from '@/libs';
import type { BlogListItemInstance } from '@/store';
import { BLOGS_COPY } from './blogs-copy';
import { BlogImage } from './BlogImage';

export interface FeaturedBlogProps {
  post: BlogListItemInstance;
  variant: 'hero' | 'card';
}

const STRETCH = "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";
const RING =
  'has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-primary-container';

export function FeaturedBlog({ post, variant }: FeaturedBlogProps) {
  if (variant === 'hero') {
    return (
      <article
        className={`relative w-full h-[520px] lg:h-[600px] rounded-xl overflow-hidden border border-surface-container-highest shadow-deep group cursor-pointer ${RING}`}
      >
        <BlogImage
          src={post.image}
          alt={post.imageAlt}
          width={1152}
          height={600}
          priority
          className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-lg lg:p-xl w-full md:w-3/4">
          <span className="inline-block bg-primary-container text-on-primary-container px-sm py-xs rounded-xs text-label-sm font-bold mb-md uppercase tracking-wider">
            {post.category.name}
          </span>
          <h2 className="text-headline-xl text-primary mb-md leading-[60px]">
            <Link to={post.href} className={STRETCH}>
              {post.title}
            </Link>
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-lg max-w-3xl line-clamp-3">{post.excerpt}</p>
          <span
            aria-hidden
            className="inline-flex items-center gap-1 text-primary-container group-hover:text-primary transition-colors text-label-md uppercase tracking-wider"
          >
            {BLOGS_COPY.featuredCta.desktop}
            <Icon name="arrow_forward" size={16} />
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`relative bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden shadow-deep-mobile group ${RING}`}
    >
      <div className="w-full h-48 relative">
        <BlogImage src={post.image} alt={post.imageAlt} width={358} height={192} priority />
        <span className="absolute top-sm left-sm bg-error-container text-on-error-container px-sm py-xs rounded-xs text-label-sm">
          {post.category.name}
        </span>
      </div>
      <div className="p-md flex flex-col gap-sm">
        <p className="flex items-center gap-xs text-on-surface-variant text-label-sm">
          <Icon name="calendar_today" size={16} />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <h2 className="text-headline-md text-on-surface group-hover:text-primary-container transition-colors">
          <Link to={post.href} className={STRETCH}>
            {post.title}
          </Link>
        </h2>
        <p className="text-body-md text-on-surface-variant line-clamp-3">{post.excerpt}</p>
        <span
          aria-hidden
          className="text-label-md text-secondary mt-xs flex items-center gap-xs w-max group-hover:text-primary-container transition-colors"
        >
          {BLOGS_COPY.featuredCta.mobile}
          <Icon name="arrow_forward" size={18} />
        </span>
      </div>
    </article>
  );
}

export function FeaturedBlogSkeleton({ variant }: { variant: 'hero' | 'card' }) {
  if (variant === 'hero') return <Skeleton className="w-full h-[520px] lg:h-[600px] rounded-xl bg-surface-container" />;
  return (
    <div aria-hidden className="bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-md flex flex-col gap-sm">
        <Skeleton shape="text" className="w-1/3" />
        <Skeleton shape="text" className="h-6 w-5/6" />
        <Skeleton lines={3} />
      </div>
    </div>
  );
}
