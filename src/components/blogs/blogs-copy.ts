import { formatReadTime, pluralRo } from '@/libs';

/** /blog static copy (ticket 04 §5.1). Romanian only; where layouts differ: `mobile` / `desktop`. */
export const BLOGS_COPY = {
  pageTitle: 'Sfaturi de expert',
  pageSubtitle: 'Stăpânește drumul, câte un sfat pe rând.',
  filterLabel: 'Filtrează după categorie:',
  allChip: { mobile: 'Toate subiectele', desktop: 'Toate modulele' },
  featuredCta: { mobile: 'Citește articolul complet', desktop: 'Citește analiza tehnică completă' },
  cardCta: 'Accesează modulul',
  readTime: (n: number) => formatReadTime(n),
  loadMore: { mobile: 'Încarcă mai multe articole', desktop: 'Încarcă mai multe module' },
  empty: {
    title: 'Încă nu există articole aici',
    body: 'Nu am publicat încă nimic pe această temă. Revino în curând sau răsfoiește toate subiectele.',
    reset: 'Arată toate subiectele',
    searchTitle: (q: string) => `Niciun rezultat pentru „${q}”`,
    searchBody: 'Încearcă alt termen sau răsfoiește toate articolele.',
  },
  error: {
    title: 'Nu am putut încărca articolele',
    body: 'Verifică-ți conexiunea și încearcă din nou.',
    retry: 'Încearcă din nou',
  },
  loadMoreError: 'Nu am putut încărca mai multe articole.',
  loadMoreRetry: 'Reîncearcă',
  a11y: {
    loading: 'Se încarcă articolele…',
    loaded: (n: number) =>
      n === 1 ? 'Încă 1 articol încărcat' : `Încă ${pluralRo(n, 'articol', 'articole')} încărcate`,
    gridHeading: 'Cele mai noi articole',
    filterNav: 'Categorii de articole',
    rowMeta: (category: string, minutes: number) => `${category}, ${formatReadTime(minutes)}`,
    imageFallback: 'Imagine indisponibilă',
  },
  meta: {
    title: 'Blog - TDV Auto Expert',
    titleCategory: (name: string) => `${name} – Blog - TDV Auto Expert`,
    description:
      'Sfaturi de la instructorii TDV Auto Expert: condus defensiv, siguranță rutieră, întreținerea mașinii și tehnică de conducere. Stăpânește drumul, câte un sfat pe rând.',
  },
} as const;
