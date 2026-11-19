import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppLayout } from '@/components';
import { NotFoundPage, RouteErrorPage } from '@/pages';

const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [{ path: '__ui', lazy: lazyPage(() => import('@/pages/ui-kit/UiKitPage')) }]
  : [];

// Romanian paths (plan §9 D1); use ROUTES.* everywhere else. Old English paths intentionally 404.
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, lazy: lazyPage(() => import('@/pages/landing/LandingPage')) },
      { path: 'preturi', lazy: lazyPage(() => import('@/pages/pricing/PricingPage')) },
      // ?rezerva=<slug> opens the BookingDialog (ticket 06)
      { path: 'flota', lazy: lazyPage(() => import('@/pages/fleet/FleetPage')) },
      { path: 'blog', lazy: lazyPage(() => import('@/pages/blogs/BlogsPage')) },
      { path: 'blog/:slug', lazy: lazyPage(() => import('@/pages/blog-article/BlogArticlePage')) },
      ...devRoutes,
      // static: already in the main bundle via RouteErrorPage
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
