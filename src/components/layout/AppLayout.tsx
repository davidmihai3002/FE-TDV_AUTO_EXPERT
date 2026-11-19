import { Suspense, useEffect, type ReactNode } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { useStore } from '@/store';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavProgress } from './NavProgress';
import { PageFallback } from './PageFallback';
import { SkipLink } from './SkipLink';

/** Page chrome. `children` replaces the outlet (used by the route error element). */
export function AppLayout({ children }: { children?: ReactNode }) {
  const { siteSettings } = useStore();

  useEffect(() => {
    siteSettings.fetch();
  }, [siteSettings]);

  return (
    <>
      <SkipLink />
      <NavProgress />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}>{children ?? <Outlet />}</Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
