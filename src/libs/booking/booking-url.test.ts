import { describe, expect, it } from 'vitest';
import { bookingKey, parseBookingSearchParams, withBooking, withoutBooking } from './booking-url';

describe('booking-url', () => {
  it('parses a valid deep link', () => {
    expect(parseBookingSearchParams(new URLSearchParams('rezerva=tesla-model-3&lectii=20&categorie=b'))).toEqual({
      slug: 'tesla-model-3',
      prefill: { lessonsCount: 20, licenseCategory: 'B' },
    });
  });

  it.each(['Tesla', 'a--b', '-a', 'x'.repeat(101), 'a b'])('rejects slug %s', (slug) => {
    expect(parseBookingSearchParams(new URLSearchParams({ rezerva: slug })).slug).toBeNull();
  });

  it('drops invalid lessons / category', () => {
    const { prefill } = parseBookingSearchParams(new URLSearchParams('rezerva=a&lectii=0&categorie=B-E'));
    expect(prefill).toEqual({});
    expect(parseBookingSearchParams(new URLSearchParams('lectii=201')).prefill).toEqual({});
    expect(parseBookingSearchParams(new URLSearchParams('lectii=2.5')).prefill).toEqual({});
  });

  it('adds and removes booking params, keeping filters', () => {
    const sp = new URLSearchParams('transmisie=manuala');
    const withB = withBooking(sp, 'vw-golf-8', { lessonsCount: 15 });
    expect(withB.toString()).toBe('transmisie=manuala&rezerva=vw-golf-8&lectii=15');
    expect(withoutBooking(withB).toString()).toBe('transmisie=manuala');
    expect(bookingKey(withB)).toBe('vw-golf-8|15|');
    expect(bookingKey(sp)).toBe('');
  });
});
