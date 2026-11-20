import type { SiteSettingsDto } from '@/types';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  to: string;
  end?: boolean;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Acasă', to: ROUTES.home, end: true },
  { label: 'Prețuri', to: ROUTES.pricing },
  { label: 'Flotă', to: ROUTES.fleet },
  { label: 'Blog', to: ROUTES.blog },
];

export const FOOTER_EXPLORE: readonly NavItem[] = PRIMARY_NAV.filter((l) => l.to !== ROUTES.home);

export const FOOTER_LEGAL: readonly { label: string; settingsKey: keyof Pick<SiteSettingsDto, 'privacyUrl' | 'termsUrl'> }[] = [
  { label: 'Politica de confidențialitate', settingsKey: 'privacyUrl' },
  { label: 'Termeni și condiții', settingsKey: 'termsUrl' },
];

export const FOOTER_TITLES = { explore: 'Explorează', resources: 'Resurse', contact: 'Contact' } as const;

export const CTA = {
  book: { label: 'Programează o lecție', to: ROUTES.fleet },
  calculate: { label: 'Nu ești sigur? Calculează prețul', to: ROUTES.pricing },
} as const;

export const A11Y_LABELS = {
  skipLink: 'Sari la conținut',
  home: 'TDV Auto Expert, pagina principală',
  primaryNav: 'Navigare principală',
  footerNav: 'Navigare subsol',
  openMenu: 'Deschide meniul',
  closeMenu: 'Închide meniul',
  close: 'Închide',
  pageLoading: 'Se încarcă pagina',
  contactSupport: 'Contactează-ne',
  contactLabels: { phone: 'Telefon:', email: 'Email:', address: 'Adresă:', schedule: 'Program:' },
} as const;

export const SITE_TITLE_SUFFIX = 'TDV Auto Expert';
export const pageTitle = (page: string) => `${page} · ${SITE_TITLE_SUFFIX}`;
