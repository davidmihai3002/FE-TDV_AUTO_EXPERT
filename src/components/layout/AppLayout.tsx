import { Suspense, useEffect, type ReactNode } from 'react';
import { Outlet, ScrollRestoration, useMatches, useNavigation } from 'react-router';
import { PageLoader } from '@/components/feedback/PageLoader/PageLoader';
import { RouteProgressBar } from '@/components/feedback/RouteProgressBar';
import { useStore } from '@/store';
import { Footer } from './Footer';
import { Header } from './Header';
import { SkipLink } from './SkipLink';

export interface RouteHandle {
  headerVariant?: 'default' | 'article' | 'task';
  closeLabel?: string;
}

export function AppLayout({ children }: { children?: ReactNode }) {
  const { siteSettings } = useStore();
  const matches = useMatches();
  const navigation = useNavigation();
  const navigating = navigation.state !== 'idle';
  const handle = matches
    .map((m) => m.handle as RouteHandle | undefined)
    .reverse()
    .find((h) => h?.headerVariant);
  const variant = handle?.headerVariant ?? 'default';

  useEffect(() => {
    siteSettings.fetch();
  }, [siteSettings]);

  return (
    <>
      <SkipLink />
      <RouteProgressBar active={navigating} />
      <Header variant={variant} closeLabel={handle?.closeLabel} />
      <main id="main" tabIndex={-1} aria-busy={navigating || undefined} className="flex-1 outline-none">
        <Suspense fallback={<PageLoader variant="inline" />}>{children ?? <Outlet />}</Suspense>
      </main>
      {variant === 'article' ? (
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
