import { formatReadTime } from '@/libs';

/** /blog/:slug static copy (ticket 05 §5.1). Romanian only (D1). */
export const ARTICLE_COPY = {
  breadcrumb: { ariaLabel: 'Fir de navigare', home: 'Acasă', blog: 'Blog' },
  toc: { desktopTitle: 'Cuprins', mobileToggle: 'Cuprins', ariaLabel: 'Cuprinsul articolului' },
  related: {
    desktopTitle: 'Articole similare',
    mobileTitle: 'Continuă să înveți',
    ariaLabel: 'Articole similare',
    readLink: 'Citește',
  },
  cta: {
    card: {
      title: 'Gata să aplici?',
      body: 'Pune aceste principii în practică pe asfalt, într-o lecție individuală cu un instructor.',
      button: 'Programează o evaluare',
      pricingLink: 'Vezi prețurile',
    },
    bar: {
      title: 'Gata să stăpânești circuitul?',
      subtitle: 'Lecții individuale cu experți.',
      button: 'Programează o lecție',
      ariaLabel: 'Programează o lecție',
    },
  },
  header: { back: 'Înapoi la articole', share: 'Distribuie', home: 'TDV Auto Expert, pagina principală' },
  share: { copied: 'Link copiat' },
  readTime: (n: number) => formatReadTime(n),
  callout: { tip: 'Sfatul expertului', insight: 'Observația expertului' },
  state: {
    loading: 'Se încarcă articolul…',
    notFoundTitle: 'Articol negăsit | TDV Auto Expert',
    notFoundHeading: 'Articolul nu a fost găsit',
    notFoundBody: 'Este posibil să fi fost mutat sau să nu mai fie disponibil.',
    backToBlog: 'Înapoi la blog',
    errorHeading: 'Nu am putut încărca articolul',
    errorBody: 'Verifică-ți conexiunea și încearcă din nou.',
    retry: 'Încearcă din nou',
  },
  imageFallback: 'Imagine indisponibilă',
} as const;
