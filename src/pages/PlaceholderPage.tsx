import { Container, PageTitle } from '@/components/ui';
import { pageTitle } from '@/config';

/** Temporary page body until the page's own ticket lands. */
export function PlaceholderPage({ title, documentTitle }: { title: string; documentTitle?: string }) {
  return (
    <Container className="py-xl">
      <title>{documentTitle ?? pageTitle(title)}</title>
      <PageTitle>{title}</PageTitle>
      <p className="mt-md text-body-lg text-on-surface-variant">În curând.</p>
    </Container>
  );
}
