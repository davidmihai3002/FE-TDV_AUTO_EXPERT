import { cast, flow, types } from 'mobx-state-tree';
import { FALLBACK_SITE_SETTINGS } from '@/config';
import { api, formatPhone, getErrorMessage } from '@/libs';
import type { SiteSettingsDto } from '@/types';
import { RequestStatus } from './models/request-status';

const SocialLink = types.model('SocialLink', { platform: types.string, url: types.string });

const Contact = types.model('Contact', {
  phone: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  address: types.maybeNull(types.string),
  schedule: types.maybeNull(types.string),
});

export const SiteSettings = types.model('SiteSettings', {
  brandName: types.string,
  tagline: types.string,
  footerDescription: types.string,
  copyrightText: types.string,
  contact: Contact,
  currency: types.optional(types.literal('RON'), 'RON'),
  privacyUrl: types.maybeNull(types.string),
  termsUrl: types.maybeNull(types.string),
  socials: types.array(SocialLink),
  updatedAt: types.maybeNull(types.string),
});

export const SiteSettingsStore = types
  .model('SiteSettingsStore', {
    settings: types.optional(SiteSettings, FALLBACK_SITE_SETTINGS),
    status: types.optional(RequestStatus, 'idle'),
    error: types.maybeNull(types.string),
  })
  .views((self) => ({
    get phone(): { display: string; href: string } | null {
      return self.settings.contact.phone ? formatPhone(self.settings.contact.phone) : null;
    },
    get supportHref(): string | null {
      const { email } = self.settings.contact;
      if (email) return `mailto:${email}`;
      return this.phone?.href ?? null;
    },
  }))
  .actions((self) => ({
    fetch: flow(function* fetch() {
      if (self.status === 'pending' || self.status === 'done') return;
      self.status = 'pending';
      try {
        const dto: SiteSettingsDto = yield api.get<SiteSettingsDto>('/site-settings');
        self.settings = cast(dto);
        self.status = 'done';
        self.error = null;
      } catch (e) {
        self.error = getErrorMessage(e);
        self.status = 'error';
        if (import.meta.env.DEV) console.warn('[site-settings] using fallback', e);
      }
    }),
  }));
