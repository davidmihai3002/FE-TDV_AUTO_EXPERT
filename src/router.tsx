import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { RootErrorElement, RouteErrorElement } from '@/components/feedback/RouteErrorElement';
import { PageLoader } from '@/components/feedback/PageLoader/PageLoader';
import { AppLayout, type RouteHandle } from '@/components/layout';
import { NotFoundPage } from '@/pages';

const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      { path: '__ui', lazy: lazyPage(() => import('@/pages/ui-kit/UiKitPage')) },
      { path: '__states', lazy: lazyPage(() => import('@/pages/dev/StatesPreviewPage')) },
    ]
  : [];

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RootErrorElement />,
    HydrateFallback: () => <PageLoader variant="fullscreen" />,
    children: [
      {
        errorElement: <RouteErrorElement />,
        children: [
          { index: true, lazy: lazyPage(() => import('@/pages/landing/LandingPage')) },
          {
            path: 'preturi',
            handle: { headerVariant: 'task', closeLabel: 'Închide calculatorul de preț' } satisfies RouteHandle,
            lazy: lazyPage(() => import('@/pages/pricing/PricingPage')),
          },
          { path: 'flota', lazy: lazyPage(() => import('@/pages/fleet/FleetPage')) },
          { path: 'blog', lazy: lazyPage(() => import('@/pages/blogs/BlogsPage')) },
          {
            path: 'blog/:slug',
            handle: { headerVariant: 'article' } satisfies RouteHandle,
            lazy: lazyPage(() => import('@/pages/blog-article/BlogArticlePage')),
          },
          ...devRoutes,
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
]);
