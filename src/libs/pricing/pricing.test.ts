import { describe, expect, it } from 'vitest';
import { formatRon } from '../format';
import { calculateQuote, clampToStep } from './calculate-quote';
import { lessonsLabel, rateLabel } from './pricing-copy';
import { buildBookingHref, parsePricingSearchParams, toPricingSearchParams } from './pricing-url';

describe('calculateQuote (must match the BE computeQuote)', () => {
  it.each([
    ['C1 design fixture', 85, 15, 25, 1300, '1.300 lei'],
    ['C2 design fixture, no fee', 35, 10, 0, 350, '350 lei'],
    ['C3 Golf R', 35, 15, 25, 550, '550 lei'],
    ['C4 A4 × 30', 35, 30, 25, 1075, '1.075 lei'],
    ['C5 Tesla', 38, 15, 25, 595, '595 lei'],
    ['C6 Golf 8 × 60', 38, 60, 25, 2305, '2.305 lei'],
  ])('%s', (_l, rate, lessons, fee, total, formatted) => {
    const q = calculateQuote({ rate, lessons, fee });
    expect(q.total).toBe(total);
    expect(formatRon(q.total).replace(/\u00a0/g, ' ')).toBe(formatted);
  });

  it('C16 formatting helpers', () => {
    expect(formatRon(350.5).replace(/\u00a0/g, ' ')).toBe('350,50 lei');
    expect(lessonsLabel(1)).toBe('1 lecție');
    expect(lessonsLabel(15)).toBe('15 lecții');
    expect(lessonsLabel(20).replace(/\u00a0/g, ' ')).toBe('20 de lecții');
    expect(rateLabel(35).replace(/\u00a0/g, ' ')).toBe('35 lei/lecție');
  });
});

describe('clampToStep', () => {
  it('clamps and snaps to the step grid', () => {
    expect(clampToStep(10, 15, 60, 1)).toBe(15);
    expect(clampToStep(99, 15, 60, 1)).toBe(60);
    expect(clampToStep(17, 15, 60, 5)).toBe(15);
    expect(clampToStep(18, 15, 60, 5)).toBe(20);
    expect(clampToStep(62, 15, 62, 5)).toBe(60);
    expect(clampToStep(Number.NaN, 15, 60, 1)).toBe(15);
  });
});

describe('pricing URL', () => {
  it('round-trips the selection and builds the booking deep link', () => {
    const sp = toPricingSearchParams({
      categoryCode: 'B',
      transmission: 'manual',
      fuel: 'petrol',
      vehicleSlug: 'audi-a4-s-line',
      lessons: 15,
    });
    expect(sp.toString()).toBe('categorie=B&cutie=manual&combustibil=petrol&masina=audi-a4-s-line&lectii=15');
    expect(parsePricingSearchParams(sp)).toEqual({
      categoryCode: 'B',
      transmission: 'manual',
      fuel: 'petrol',
      vehicleSlug: 'audi-a4-s-line',
      lessons: 15,
    });
    expect(parsePricingSearchParams(new URLSearchParams('lectii=abc')).lessons).toBeNull();
    expect(buildBookingHref('volkswagen-golf-r', 20, 'B')).toBe('/flota?rezerva=volkswagen-golf-r&lectii=20&categorie=B');
  });
});
