import { Button } from '@/components/ui';
import { ROUTES } from '@/config';
import { ARTICLE_COPY } from './copy';

export function MobileArticleCtaBar() {
  const c = ARTICLE_COPY.cta.bar;
  return (
    <aside
      aria-label={c.ariaLabel}
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-container-highest/95 backdrop-blur-md border-t border-outline-variant/30 px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="flex justify-between items-center gap-3 max-w-[1280px] mx-auto">
        <div className="min-w-0">
          <p className="text-label-md text-on-surface">{c.title}</p>
          <p className="text-label-sm text-on-surface-variant">{c.subtitle}</p>
        </div>
        <Button to={ROUTES.fleet} size="sm" radius="xs" className="shrink-0 px-6 py-2 font-semibold shadow-lg">
          {c.button}
        </Button>
      </div>
    </aside>
  );
}
