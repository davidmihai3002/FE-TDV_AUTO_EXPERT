import { Link } from 'react-router';
import { Icon, Skeleton } from '@/components/ui';
import { cn } from '@/libs';
import type { BlogListItemInstance } from '@/store';
import { BLOGS_COPY } from './blogs-copy';
import { BlogImage } from './BlogImage';

export interface BlogCardProps {
  post: BlogListItemInstance;
  variant: 'card' | 'row';
}

const STRETCH = "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";
const RING =
  'has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-primary-container';

export function BlogCard({ post, variant }: BlogCardProps) {
  if (variant === 'row') {
    return (
      <article
        className={cn(
          'relative bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex gap-sm p-sm group active:scale-[0.99] transition-transform',
          RING,
        )}
      >
        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden relative">
          <BlogImage src={post.image} alt={post.imageAlt} width={96} height={96} />
        </div>
        <div className="flex flex-col justify-center gap-xs flex-grow min-w-0">
          <h3 className="text-label-md text-on-surface group-hover:text-primary-container transition-colors line-clamp-2 font-body">
            <Link to={post.href} className={STRETCH}>
              {post.title}
            </Link>
          </h3>
          <p className="text-label-sm text-on-surface-variant">
            <span className="sr-only">{BLOGS_COPY.a11y.rowMeta(post.category.name, post.readTimeMinutes)}</span>
            <span aria-hidden className="flex flex-wrap items-center gap-xs">
              {post.category.name} <span>•</span> {BLOGS_COPY.readTime(post.readTimeMinutes)}
            </span>
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'relative bg-surface-container border border-surface-container-highest rounded-lg overflow-hidden shadow-deep flex flex-col h-full group',
        'transition-all duration-300 hover:border-primary-container hover:shadow-lift motion-safe:hover:-translate-y-1',
        RING,
      )}
    >
      <div className="relative h-56 w-full overflow-hidden border-b border-surface-container-highest">
        <BlogImage
          src={post.image}
          alt={post.imageAlt}
          width={368}
          height={224}
          className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="p-lg flex flex-col flex-grow">
        <p className="text-primary-container text-label-sm font-bold uppercase tracking-wider mb-sm">
          {post.category.name}
        </p>
        <h3 className="text-headline-md text-primary mb-sm leading-snug">
          <Link to={post.href} className={STRETCH}>
            {post.title}
          </Link>
        </h3>
        <p className="text-body-md text-on-surface-variant mb-lg flex-grow line-clamp-4">{post.excerpt}</p>
        <span
          aria-hidden
          className="inline-flex self-start items-center gap-1 text-primary-container group-hover:text-primary transition-colors text-label-md mt-auto pt-md border-t border-surface-container-highest uppercase tracking-wider"
        >
          {BLOGS_COPY.cardCta}
          <Icon name="arrow_right_alt" size={16} />
        </span>
      </div>
    </article>
  );
}

export function BlogCardSkeleton({ variant }: { variant: 'card' | 'row' }) {
  if (variant === 'row') {
    return (
      <div aria-hidden className="bg-surface-container-highest border border-outline-variant rounded-xl flex gap-sm p-sm">
        <Skeleton className="w-24 h-24 shrink-0 rounded-lg" />
        <div className="flex flex-col justify-center gap-2 flex-grow">
          <Skeleton shape="text" className="w-11/12" />
          <Skeleton shape="text" className="w-1/2 h-3" />
        </div>
      </div>
    );
  }
  return (
    <div aria-hidden className="bg-surface-container border border-surface-container-highest rounded-lg overflow-hidden h-full">
      <Skeleton className="h-56 rounded-none" />
      <div className="p-lg flex flex-col gap-3">
        <Skeleton shape="text" className="w-1/3 h-3" />
        <Skeleton shape="text" className="h-6 w-5/6" />
        <Skeleton lines={3} />
      </div>
    </div>
  );
}
