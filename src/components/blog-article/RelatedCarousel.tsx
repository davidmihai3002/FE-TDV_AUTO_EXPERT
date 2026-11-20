import { useId } from 'react';
import { Link } from 'react-router';
import { Icon } from '@/components/ui';
import { ROUTES } from '@/config';
import type { RelatedArticle } from '@/types';
import { ARTICLE_COPY } from './copy';

export function RelatedCarousel({ items }: { items: RelatedArticle[] }) {
  const headingId = useId();
  if (!items.length) return null;
  return (
    <section aria-labelledby={headingId} className="lg:hidden mt-lg px-margin-mobile">
      <h2 id={headingId} className="text-headline-md text-on-surface mb-md">
        {ARTICLE_COPY.related.mobileTitle}
      </h2>
      <ul
        role="list"
        aria-label={ARTICLE_COPY.related.ariaLabel}
        className="flex overflow-x-auto gap-4 pb-md -mx-margin-mobile px-margin-mobile snap-x snap-mandatory hide-scrollbar"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="group relative w-64 shrink-0 snap-center bg-surface-container rounded-xl border border-surface-variant overflow-hidden flex flex-col shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)]"
          >
            <img src={item.image.url} alt="" loading="lazy" className="h-32 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              {item.category && <p className="text-label-sm text-secondary mb-2">{item.category.name}</p>}
              <h3 className="text-body-lg font-semibold text-on-surface mb-2 font-body">
                <Link
                  to={ROUTES.blogArticle(item.slug)}
                  className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                >
                  {item.title}
                </Link>
              </h3>
              <span aria-hidden className="mt-auto text-label-md text-primary-fixed flex items-center gap-1">
                {ARTICLE_COPY.related.readLink}
                <Icon name="arrow_forward" size={16} />
              </span>
            </div>
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl border-2 border-primary-container/50 pointer-events-none opacity-0 group-hover:opacity-100 group-has-[a:focus-visible]:opacity-100 transition-opacity"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
