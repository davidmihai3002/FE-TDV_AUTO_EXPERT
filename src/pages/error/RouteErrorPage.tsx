import { isRouteErrorResponse, useRouteError } from 'react-router';
import { AppLayout, Button, Container, PageTitle } from '@/components';
import { pageTitle } from '@/config';
import NotFoundPage from '../not-found/NotFoundPage';

/** Router error element, rendered inside the normal chrome. Final visuals in ticket 07. */
export default function RouteErrorPage() {
  const error = useRouteError();
  if (import.meta.env.DEV) console.error(error);
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <AppLayout>
      {notFound ? (
        <NotFoundPage />
      ) : (
        <Container className="py-xl flex flex-col items-start gap-md">
          <title>{pageTitle('A apărut o eroare')}</title>
          <PageTitle>A apărut o eroare</PageTitle>
          <p className="text-body-lg text-on-surface-variant">Ceva nu a funcționat. Încearcă din nou.</p>
          <Button onClick={() => window.location.reload()} leadingIcon="refresh">
            Încearcă din nou
          </Button>
        </Container>
      )}
    </AppLayout>
  );
}
