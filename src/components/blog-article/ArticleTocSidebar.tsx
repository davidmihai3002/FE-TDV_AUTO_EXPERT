import { cn } from '@/libs';
import type { TocItem } from '@/types';
import { ARTICLE_COPY } from './copy';
import { jumpToSection } from './toc-scroll';

export function ArticleTocSidebar({ items, activeId }: { items: TocItem[]; activeId?: string }) {
  if (!items.length) return null;
  return (
    <div className="sticky top-[100px] max-h-[calc(100vh-124px)] overflow-y-auto bg-surface-container/50 border border-surface-variant rounded-xl p-md shadow-2xl backdrop-blur-sm">
      <h2 className="text-label-md text-primary uppercase tracking-widest mb-md pb-4 border-b border-surface-variant font-body">
        {ARTICLE_COPY.toc.desktopTitle}
      </h2>
      <nav aria-label={ARTICLE_COPY.toc.ariaLabel}>
        <ol className="flex flex-col gap-4">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    jumpToSection(item.id);
                  }}
                  className={cn(
                    'flex items-center gap-3 text-body-md transition-colors',
                    active ? 'text-primary-container' : 'text-on-surface-variant hover:text-primary',
                  )}
                >
                  <span aria-hidden className={cn('size-1 shrink-0 rounded-[9999px]', active ? 'bg-primary-container' : 'bg-outline-variant')} />
                  {item.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
