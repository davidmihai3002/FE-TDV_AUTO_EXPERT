import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './index.css';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { reportError } from './libs/report-error';
import { router } from './router';
import { rootStore } from './store/root-store';
import { StoreProvider } from './store/store-context';

// render() replaces #root's children, which removes the index.html boot loader
createRoot(document.getElementById('root')!, {
  onUncaughtError: (error, info) => reportError(error, { kind: 'uncaught', componentStack: info.componentStack }),
  onCaughtError: (error, info) => reportError(error, { kind: 'caught', componentStack: info.componentStack }),
  onRecoverableError: (error) => reportError(error, { kind: 'recoverable' }),
}).render(
  <StrictMode>
    {/* outermost: last resort when providers/router/layout crash */}
    <ErrorBoundary>
      <StoreProvider value={rootStore}>
        <RouterProvider router={router} />
      </StoreProvider>
    </ErrorBoundary>
  </StrictMode>,
);
