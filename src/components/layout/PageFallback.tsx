import { Container, Skeleton } from '@/components/ui';

/** Minimal Suspense fallback while a route chunk loads (ticket 07 refines). */
export function PageFallback() {
  return (
    <Container className="py-xl" aria-busy="true">
      <Skeleton className="h-12 w-2/3 mb-md" />
      <Skeleton lines={3} className="max-w-2xl" />
    </Container>
  );
}
