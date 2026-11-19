import { Button, Container, PageTitle } from '@/components/ui';
import { ROUTES, pageTitle } from '@/config';

/** Basic 404; final visuals in ticket 07. */
export default function NotFoundPage() {
  return (
    <Container className="py-xl flex flex-col items-start gap-md">
      <title>{pageTitle('Pagina nu a fost găsită')}</title>
      <PageTitle>Pagina nu a fost găsită</PageTitle>
      <p className="text-body-lg text-on-surface-variant">Pagina pe care o cauți nu există sau a fost mutată.</p>
      <Button to={ROUTES.home}>Înapoi la pagina principală</Button>
    </Container>
  );
}
