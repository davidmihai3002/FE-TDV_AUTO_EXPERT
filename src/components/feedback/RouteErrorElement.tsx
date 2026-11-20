import { useLocation, useNavigate, useRevalidator, useRouteError } from 'react-router';
import { reportError, toUiError } from '@/libs';
import { ErrorPage } from './ErrorPage/ErrorPage';

const CHUNK_RELOAD_KEY = 'tdv:chunk-reload';
const isChunkLoadError = (e: unknown) =>
  e instanceof Error && /dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(e.message);

export function RouteErrorElement() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const location = useLocation();

  if (isChunkLoadError(error) && navigator.onLine && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
    window.location.reload();
    return null;
  }

  const ui = toUiError(error);
  if (ui.variant !== 'not-found') reportError(error, { route: location.pathname });
  const e = error instanceof Error ? error : null;

  return (
    <ErrorPage
      key={location.key}
      variant={ui.variant}
      statusCode={ui.statusCode}
      requestId={ui.requestId}
      onRetry={async () => {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
        if (e) await navigate(location, { replace: true });
        else await revalidator.revalidate();
      }}
      debug={e ? { message: e.message, stack: e.stack } : undefined}
    />
  );
}

export function RootErrorElement() {
  const error = useRouteError();
  reportError(error, { boundary: 'root-route' });
  const e = error instanceof Error ? error : null;
  return <ErrorPage variant="server" standalone onRetry={() => window.location.reload()} debug={e ? { message: e.message, stack: e.stack } : undefined} />;
}
