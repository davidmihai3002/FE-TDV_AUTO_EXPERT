import { ErrorPage } from '@/components/feedback/ErrorPage/ErrorPage';

/** The `*` route: any path other than /, /preturi, /flota, /blog, /blog/:slug. */
export default function NotFoundPage() {
  return <ErrorPage variant="not-found" />;
}
