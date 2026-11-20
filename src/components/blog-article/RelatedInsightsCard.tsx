import { useId } from 'react';
import { Link } from 'react-router';
import { Icon } from '@/components/ui';
import { ROUTES } from '@/config';
import type { RelatedArticle } from '@/types';
import { ARTICLE_COPY } from './copy';

export function RelatedInsightsCard({ items }: { items: RelatedArticle[] }) {
  const headingId = useId();
  if (!items.length) return null;
  return (
    <aside aria-labelledby={headingId} className="bg-surface-container border border-surface-variant rounded-xl p-md shadow-xl">
      <h2 id={headingId} className="flex items-center gap-2 text-label-md text-primary uppercase tracking-widest mb-md pb-4 border-b border-surface-variant font-body">
        <Icon name="insights" size={24} />
        {ARTICLE_COPY.related.desktopTitle}
      </h2>
      <ul className="flex flex-col gap-md">
        {items.map((item) => (
          <li key={item.id}>
            <Link to={ROUTES.blogArticle(item.slug)} className="group block">
              <img
                src={item.image.url}
                alt=""
                loading="lazy"
                className="w-full h-32 object-cover rounded-lg mb-3 border border-surface-variant group-hover:border-primary-container group-focus-visible:border-primary-container transition-colors"
              />
              <h3 className="text-body-md font-bold text-primary group-hover:text-primary-container line-clamp-2 font-body">
                {item.title}
              </h3>
              {item.category && <p className="text-label-sm text-on-surface-variant mt-1">{item.category.name}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
