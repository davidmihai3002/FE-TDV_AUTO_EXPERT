import { createContext, useContext } from 'react';
import type { RootStoreInstance } from './root-store';

const StoreContext = createContext<RootStoreInstance | null>(null);

export const StoreProvider = StoreContext.Provider;

export function useStore(): RootStoreInstance {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}

export function useOptionalStore(): RootStoreInstance | null {
  return useContext(StoreContext);
}
