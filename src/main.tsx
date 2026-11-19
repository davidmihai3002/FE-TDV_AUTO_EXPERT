import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './index.css';
import { router } from './router';
import { rootStore } from './store/root-store';
import { StoreProvider } from './store/store-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider value={rootStore}>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
);
