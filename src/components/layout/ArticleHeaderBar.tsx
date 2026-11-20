import { Link } from 'react-router';
import { ArticleShareButton } from '@/components/blog-article/ArticleShareButton';
import { ARTICLE_COPY } from '@/components/blog-article/copy';
import { Icon } from '@/components/ui';
import { ROUTES } from '@/config';
import { cn, setHideOnScrollPinned, useHideOnScroll } from '@/libs';

export function ArticleHeaderBar() {
  const hidden = useHideOnScroll();
  return (
    <header
      data-hidden={hidden || undefined}
      onFocus={() => setHideOnScrollPinned(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHideOnScrollPinned(false);
      }}
      className={cn(
        'lg:hidden fixed top-0 inset-x-0 z-50 h-[72px] px-4 flex justify-between items-center',
        'bg-surface/90 backdrop-blur-md border-b border-surface-variant',
        'motion-safe:transition-transform motion-safe:duration-300',
        hidden && '-translate-y-full',
      )}
    >
      <Link
        to={ROUTES.blog}
        aria-label={ARTICLE_COPY.header.back}
        className="p-2.5 -m-2.5 text-on-surface-variant hover:text-primary rounded-full"
      >
        <Icon name="arrow_back" size={24} />
      </Link>
      <Link
        to={ROUTES.home}
        aria-label={ARTICLE_COPY.header.home}
        className="font-headline text-headline-md font-bold tracking-tight text-primary-fixed"
      >
        TDV Auto Expert
      </Link>
      <ArticleShareButton />
    </header>
  );
}
