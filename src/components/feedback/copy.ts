import type { ErrorVariant } from '@/libs';

/** Loading & error copy (ticket 07 §5.1). Romanian only (D1); contact phone/email come from site settings. */
export const LOADER_COPY = {
  title: 'Inițializăm sistemele tehnice...',
  subtitle: 'Calibrăm parametrii de performanță',
  // mobile screen copy, kept but unused: one copy set so the announced text doesn't change on rotate (Q2)
  titleAlt: 'Sincronizăm telemetria...',
  subtitleAlt: 'Calibrăm modulele expert',
  brand: 'TDV Auto Expert',
  tagline: 'Precizie în fiecare viraj',
  srLabel: 'Se încarcă pagina, te rugăm să aștepți',
  telemetry: ['V-SYNC: OK | TEL-RX: 459.2', 'LAT: --.-- | LNG: --.--'],
} as const;

export type ErrorAction =
  | { kind: 'link'; label: string; icon: string; to: string }
  | { kind: 'href'; label: string; icon: string; href: string }
  | { kind: 'retry'; label: string; icon: string };

export interface ErrorCopy {
  documentTitle: string;
  chip: string;
  chipIcon: string;
  icon: string;
  title: string;
  titleMobile: string;
  message: string;
  messageMobile: string;
  primary: ErrorAction;
  secondary: ErrorAction;
  tertiary?: ErrorAction;
  suggestions?: { label: string; links: { label: string; to: string }[] };
  decoCode: string;
}

/** `{phone}` in an href is replaced with the tel: target of the site settings phone. */
export const CONTACT_ACTION: ErrorAction = { kind: 'href', label: 'Contactează-ne', icon: 'support_agent', href: '{phone}' };
const HOME: ErrorAction = { kind: 'link', label: 'Înapoi la pagina principală', icon: 'home', to: '/' };
const RETRY: ErrorAction = { kind: 'retry', label: 'Încearcă din nou', icon: 'refresh' };

export const ERROR_COPY: Record<ErrorVariant, ErrorCopy> = {
  server: {
    documentTitle: 'Eroare tehnică · TDV Auto Expert',
    chip: 'Cod eroare 500',
    chipIcon: 'memory',
    icon: 'warning',
    title: 'Avarie de sistem: defecțiune tehnică detectată',
    titleMobile: 'Defecțiune tehnică detectată',
    message:
      'Modulele noastre au întâmpinat o anomalie neașteptată. Recalibrăm telemetria ca să revenim la precizia obișnuită. Încearcă din nou în câteva momente.',
    messageMobile: 'Modulele se recalibrează. Încearcă din nou sau întoarce-te la pagina principală.',
    primary: RETRY,
    secondary: CONTACT_ACTION,
    tertiary: HOME,
    decoCode: 'SYS.ERR // 500',
  },
  'not-found': {
    documentTitle: 'Pagina nu a fost găsită · TDV Auto Expert',
    chip: 'Cod eroare 404',
    chipIcon: 'signpost',
    icon: 'wrong_location',
    title: 'Viraj greșit: traseul nu există',
    titleMobile: 'Traseul nu există',
    message:
      'Pagina pe care o cauți a fost mutată, redenumită sau n-a existat niciodată. Hai să te readucem pe drumul cel bun.',
    messageMobile: 'Drumul acesta nu există. Întoarce-te la pagina principală.',
    primary: HOME,
    secondary: CONTACT_ACTION,
    suggestions: {
      label: 'Poate te interesează:',
      links: [
        { label: 'Flota și programări', to: '/flota' },
        { label: 'Prețuri', to: '/preturi' },
        { label: 'Blog', to: '/blog' },
      ],
    },
    decoCode: 'SYS.ERR // 404',
  },
  offline: {
    documentTitle: 'Fără conexiune · TDV Auto Expert',
    chip: 'Conexiune pierdută',
    chipIcon: 'signal_disconnected',
    icon: 'wifi_off',
    title: 'Semnal pierdut: nicio conexiune detectată',
    titleMobile: 'Fără conexiune',
    message:
      'Nu putem contacta serverele TDV Auto Expert. Verifică-ți conexiunea la internet. Ne reconectăm automat imediat ce revii online.',
    messageMobile: 'Se pare că ești offline. Reîncercăm automat când revii online.',
    primary: RETRY,
    secondary: HOME,
    decoCode: 'SYS.ERR // NET',
  },
};

/** Ticket 05: unknown /blog/:slug. */
export const BLOG_NOT_FOUND_COPY: Partial<ErrorCopy> = {
  documentTitle: 'Articolul nu a fost găsit · TDV Auto Expert',
  title: 'Articolul nu a fost găsit',
  titleMobile: 'Articol inexistent',
  message:
    'Este posibil ca articolul să fi fost mutat sau retras. Între timp, citește cele mai noi sfaturi pentru șoferi.',
  primary: { kind: 'link', label: 'Vezi toate articolele', icon: 'article', to: '/blog' },
};

export const INLINE_ERROR_COPY: Record<ErrorVariant, { title: string; message: string }> & {
  button: string;
  busy: string;
} = {
  server: { title: 'Nu am putut încărca această secțiune', message: 'Ceva nu a funcționat de partea noastră. Încearcă din nou.' },
  offline: { title: 'Ești offline', message: 'Reconectează-te ca să încărcăm această secțiune.' },
  'not-found': { title: 'Nimic de afișat aici', message: 'Acest conținut nu mai este disponibil.' },
  button: 'Încearcă din nou',
  busy: 'Se reîncearcă…',
};

export const A11Y_COPY = {
  loaderSr: LOADER_COPY.srLabel,
  progressLabel: 'Se încarcă pagina următoare',
  progressValueText: 'Se încarcă',
  errorPrefix: (code: number | string) => `Eroare ${code}: `,
  backOnline: 'Conexiune restabilită, reîncărcăm',
  retrying: 'Se reîncearcă…',
  retrySection: (section: string) => `Încearcă din nou: încarcă secțiunea ${section}`,
  connectionErrorChip: 'Eroare de conexiune',
} as const;

export const CONTACT_LINE = {
  lead: 'Ai nevoie de ajutor? Sună-ne la ',
  or: ' sau scrie-ne la ',
  end: '.',
  ref: (id: string) => ` Cod referință: ${id.slice(0, 8)}`,
  noscript: 'Activează JavaScript pentru a vedea site-ul TDV Auto Expert.',
} as const;
