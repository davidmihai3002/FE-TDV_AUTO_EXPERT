import { useEffect } from 'react';

export function useDocumentMeta({ title, noindex = false }: { title: string; noindex?: boolean }): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    let meta: HTMLMetaElement | null = null;
    if (noindex) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex';
      meta.dataset.errorPage = 'true';
      document.head.appendChild(meta);
    }
    return () => {
      document.title = previousTitle;
      meta?.remove();
    };
  }, [title, noindex]);
}
