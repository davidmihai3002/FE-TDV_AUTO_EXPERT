import { Suspense, useEffect, type ReactNode } from 'react';
import { Outlet, ScrollRestoration, useMatches } from 'react-router';
import { useStore } from '@/store';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavProgress } from './NavProgress';
import { PageFallback } from './PageFallback';
import { SkipLink } from './SkipLink';

/** Page chrome. `children` replaces the outlet (used by the route error element). */
export interface RouteHandle {
  /** `article`: mobile article header bar + room for the fixed bottom CTA bar (blog article, ticket 05) */
  headerVariant?: 'default' | 'article';
}

export function AppLayout({ children }: { children?: ReactNode }) {
  const { siteSettings } = useStore();
  const matches = useMatches();
  const variant = matches.some((m) => (m.handle as RouteHandle | undefined)?.headerVariant === 'article')
    ? 'article'
    : 'default';

  useEffect(() => {
    siteSettings.fetch();
  }, [siteSettings]);

  return (
    <>
      <SkipLink />
      <NavProgress />
      <Header variant={variant} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}>{children ?? <Outlet />}</Suspense>
      </main>
      {variant === 'article' ? (
        // the mobile article page has a fixed bottom CTA bar: keep the footer clear of it
        <div className="max-lg:pb-[calc(96px+env(safe-area-inset-bottom))]">
          <Footer />
        </div>
      ) : (
        <Footer />
      )}
      <ScrollRestoration />
    </>
  );
}
