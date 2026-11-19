import { applySnapshot, types, type Instance } from 'mobx-state-tree';
import type { BookingDraft } from '@/types';

export const BookingDraftModel = types
  .model('BookingDraft', {
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTimeSlot: types.optional(types.enumeration(['', 'dimineata', 'pranz', 'seara']), ''),
    lessonsCount: types.maybeNull(types.integer),
    message: '',
    gdprConsent: false,
    website: '', // honeypot
  })
  .actions((self) => ({
    set<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
      (self as unknown as BookingDraft)[key] = value;
    },
    /** Keeps contact fields (name/phone/email) when booking another car in the same session. */
    resetBookingFields() {
      self.preferredDate = '';
      self.preferredTimeSlot = '';
      self.lessonsCount = null;
      self.message = '';
      self.gdprConsent = false;
      self.website = '';
    },
    resetAll() {
      applySnapshot(self, {});
    },
  }));

export type BookingDraftInstance = Instance<typeof BookingDraftModel>;
