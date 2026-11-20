import { useEffect, useId, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui';
import { buildCategoryHref, cn } from '@/libs';
import type { BlogCategory } from '@/types';
import { BLOGS_COPY } from './blogs-copy';

export interface BlogCategoryFilterProps {
  categories: Pick<BlogCategory, 'id' | 'slug' | 'name'>[];
  activeSlug: string | null;
  isLoading?: boolean;
}

const CHIP_BASE =
  'relative inline-flex items-center px-md py-xs min-h-8 md:min-h-7 rounded-pill text-label-md whitespace-nowrap border transition-colors ' +
  "after:absolute after:-inset-y-2 after:inset-x-0 after:content-['']";
const CHIP_ACTIVE = 'bg-primary-container text-on-primary-container border-transparent hover:opacity-90';
const CHIP_INACTIVE =
  'bg-surface-container-high border-outline-variant text-on-surface hover:border-primary-container ' +
  'md:bg-surface-container md:border-surface-container-highest md:text-on-surface-variant md:hover:text-primary';
const SKELETON_WIDTHS = [96, 140, 128, 96, 150];

export function BlogCategoryFilter({ categories, activeSlug, isLoading }: BlogCategoryFilterProps) {
  const [searchParams] = useSearchParams();
  const labelId = useId();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) return;
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [activeSlug, categories.length]);

  const chip = (slug: string | null, label: React.ReactNode, key: string) => {
    const active = slug === activeSlug;
    return (
      <li key={key}>
        <Link
          ref={active ? activeRef : undefined}
          to={buildCategoryHref(slug, searchParams)}
          aria-current={active ? 'page' : undefined}
          className={cn(CHIP_BASE, active ? CHIP_ACTIVE : CHIP_INACTIVE)}
        >
          {label}
        </Link>
      </li>
    );
  };

  return (
    <nav aria-label={BLOGS_COPY.a11y.filterNav} aria-describedby={labelId}>
      <div className="w-full overflow-x-auto md:overflow-visible hide-scrollbar px-margin-mobile pb-sm md:px-0 md:pb-md md:border-b md:border-surface-container-highest">
        <div className="flex items-center gap-sm w-max md:w-auto md:flex-wrap">
          <span id={labelId} className="hidden md:inline text-label-md text-on-surface-variant mr-md uppercase tracking-wider">
            {BLOGS_COPY.filterLabel}
          </span>
          {isLoading ? (
            <div aria-hidden className="flex gap-sm">
              {SKELETON_WIDTHS.map((w, i) => (
                <div key={i} style={{ width: w }}>
                  <Skeleton className="h-7 rounded-pill" />
                </div>
              ))}
            </div>
          ) : (
            <ul role="list" className="flex items-center gap-sm md:flex-wrap">
              {chip(
                null,
                <>
                  <span className="md:hidden">{BLOGS_COPY.allChip.mobile}</span>
                  <span className="hidden md:inline">{BLOGS_COPY.allChip.desktop}</span>
                </>,
                'all',
              )}
              {categories.map((c) => chip(c.slug, c.name, c.id))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
