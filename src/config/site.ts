import type { SiteSettingsDto } from '@/types';

export const FALLBACK_SITE_SETTINGS: SiteSettingsDto = {
  brandName: 'TDV Auto Expert',
  tagline: 'Precizie la volan.',
  footerDescription:
    'Precizie la volan. Pregătim noua generație de șoferi cu abilitățile, încrederea și cunoștințele tehnice necesare pentru a conduce în siguranță pe orice drum.',
  copyrightText: 'TDV Auto Expert. Toate drepturile rezervate.',
  contact: {
    phone: '+40 700 000 000',
    email: 'contact@tdvautoexpert.ro',
    address: 'Str. Exemplu nr. 1, București',
    schedule: 'Luni – Vineri: 08:00 – 20:00, Sâmbătă: 09:00 – 14:00',
  },
  currency: 'RON',
  privacyUrl: null,
  termsUrl: null,
  socials: [
    { platform: 'facebook', url: 'https://facebook.com/tdvautoexpert' },
    { platform: 'instagram', url: 'https://instagram.com/tdvautoexpert' },
  ],
  updatedAt: null,
};
