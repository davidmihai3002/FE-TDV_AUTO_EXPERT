import { Link } from 'react-router';
import { ROUTES } from '@/config';
import { ARTICLE_COPY } from './copy';

export function ArticleBreadcrumb({ title }: { title: string }) {
  const link = 'hover:text-primary-container transition-colors';
  return (
    <nav aria-label={ARTICLE_COPY.breadcrumb.ariaLabel} className="hidden lg:block">
      <ol className="flex flex-wrap items-center gap-2 mb-4 text-label-sm text-on-surface-variant">
        <li>
          <Link to={ROUTES.home} className={link}>
            {ARTICLE_COPY.breadcrumb.home}
          </Link>
        </li>
        <li aria-hidden className="text-outline-variant">/</li>
        <li>
          <Link to={ROUTES.blog} className={link}>
            {ARTICLE_COPY.breadcrumb.blog}
          </Link>
        </li>
        <li aria-hidden className="text-outline-variant">/</li>
        <li>
          <span aria-current="page" className="block truncate max-w-[40ch] text-primary">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
}
