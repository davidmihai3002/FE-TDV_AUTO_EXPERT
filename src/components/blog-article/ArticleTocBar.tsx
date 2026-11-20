import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { cn, setHideOnScrollPinned } from '@/libs';
import type { TocItem } from '@/types';
import { ARTICLE_COPY } from './copy';
import { jumpToSection } from './toc-scroll';

export function ArticleTocBar({ items, activeId, headerHidden }: { items: TocItem[]; activeId?: string; headerHidden: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHideOnScrollPinned(open);
    return () => setHideOnScrollPinned(false);
  }, [open]);

  if (!items.length) return null;
  return (
    <div
      className={cn(
        'lg:hidden sticky z-40 bg-surface/95 backdrop-blur-md border-b border-surface-variant px-margin-mobile py-3 mb-8 motion-safe:transition-[top] motion-safe:duration-300',
        headerHidden ? 'top-0' : 'top-[72px]',
      )}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center text-label-md text-on-surface"
      >
        <span className="flex items-center gap-2">
          <Icon name="list" size={20} className="text-primary-container" />
          {ARTICLE_COPY.toc.mobileToggle}
        </span>
        <span className={cn('inline-flex motion-safe:transition-transform motion-safe:duration-200', open && 'rotate-180')}>
          <Icon name="expand_more" size={24} />
        </span>
      </button>
      <nav id={menuId} aria-label={ARTICLE_COPY.toc.ariaLabel} hidden={!open} className="mt-4 pb-2">
        <ol className="flex flex-col gap-3 text-body-md text-on-surface-variant border-l border-surface-variant pl-4">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    jumpToSection(item.id);
                  }}
                  className={cn(
                    'block pl-3 -ml-[17px] border-l-2 transition-colors hover:text-primary-container',
                    active ? 'text-primary-container border-primary-container' : 'border-transparent',
                  )}
                >
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
