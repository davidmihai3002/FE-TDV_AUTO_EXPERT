import { describe, expect, it } from 'vitest';
import type { BookingDraft } from '@/types';
import {
  addDaysIso,
  bucharestTodayIso,
  mapApiIssuesToFieldErrors,
  toCreateBookingRequest,
  validateBookingDraft,
} from './booking-validation';

const NOW = new Date('2026-11-18T22:30:00Z');

const draft = (over: Partial<BookingDraft> = {}): BookingDraft => ({
  fullName: 'Ana Popescu',
  phone: '0722 123 456',
  email: '',
  preferredDate: '2026-11-20',
  preferredTimeSlot: 'seara',
  lessonsCount: null,
  message: '',
  gdprConsent: true,
  website: '',
  ...over,
});

describe('booking dates', () => {
  it('uses the Bucharest calendar day', () => {
    expect(bucharestTodayIso(NOW)).toBe('2026-11-19');
    expect(addDaysIso('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('validateBookingDraft', () => {
  it('accepts a valid draft', () => {
    expect(validateBookingDraft(draft(), NOW)).toEqual({});
  });

  it('reports every required field in Romanian', () => {
    const e = validateBookingDraft(
      draft({ fullName: ' ', phone: '', preferredDate: '', preferredTimeSlot: '', gdprConsent: false }),
      NOW,
    );
    expect(e).toEqual({
      fullName: 'Câmp obligatoriu',
      phone: 'Câmp obligatoriu',
      preferredDate: 'Câmp obligatoriu',
      preferredTimeSlot: 'Alege o opțiune',
      gdprConsent: 'Trebuie să accepți prelucrarea datelor personale',
    });
  });

  it('checks formats and ranges', () => {
    const e = validateBookingDraft(
      draft({ fullName: 'Al', phone: '0212345678', email: 'x@', message: 'a'.repeat(1001) }),
      NOW,
    );
    expect(e.fullName).toBe('Minimum 3 caractere');
    expect(e.phone).toMatch(/^Număr de telefon invalid/);
    expect(e.email).toBe('Adresă de email invalidă');
    expect(e.message).toBe('Maximum 1000 caractere');
  });

  it.each([
    ['2026-11-19', 'Alege o dată începând de mâine'],
    ['2027-02-18', 'Alege o dată în următoarele 90 de zile'],
    ['2026-02-30', 'Dată invalidă'],
  ])('date %s → %s', (preferredDate, message) => {
    expect(validateBookingDraft(draft({ preferredDate }), NOW).preferredDate).toBe(message);
  });

  it('accepts +90 days', () => {
    expect(validateBookingDraft(draft({ preferredDate: '2027-02-17' }), NOW).preferredDate).toBeUndefined();
  });
});

describe('toCreateBookingRequest', () => {
  it('trims, omits empty optional fields and never sends a price', () => {
    const body = toCreateBookingRequest(draft({ fullName: ' Ana ', email: ' ', message: '' }), { id: 'car-1' }, 'B');
    expect(body).toEqual({
      fleetId: 'car-1',
      fullName: 'Ana',
      phone: '0722 123 456',
      preferredDate: '2026-11-20',
      preferredTimeSlot: 'seara',
      licenseCategory: 'B',
      gdprConsent: true,
      website: '',
    });
  });
});

describe('mapApiIssuesToFieldErrors', () => {
  it('maps by reason, then by field; ignores non-form paths', () => {
    expect(
      mapApiIssuesToFieldErrors([
        { path: 'phone', code: 'custom', message: 'Invalid Romanian mobile number', reason: 'phone' },
        { path: 'preferredDate', code: 'custom', message: 'x', reason: 'dateMax' },
        { path: 'lessonsCount', code: 'too_small', message: 'x' },
        { path: 'website', code: 'too_big', message: 'Bot detected' },
      ]),
    ).toEqual({
      phone: 'Număr de telefon invalid. Exemplu: 0712 345 678',
      preferredDate: 'Alege o dată în următoarele 90 de zile',
      lessonsCount: 'Introdu un număr între 15 și 60',
    });
  });
});
