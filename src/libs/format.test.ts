import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatNumber,
  formatPercent,
  formatPhone,
  formatReadTime,
  formatRon,
  pluralRo,
  tomorrowIso,
} from './format';

// `~` marks a non-breaking space (U+00A0) in expected strings.
const nb = (s: string) => s.replace(/~/g, '\u00A0');

describe('formatRon', () => {
  it.each([
    [1300, '1.300~lei'],
    [35, '35~lei'],
    [0, '0~lei'],
    [85.5, '85,50~lei'],
    [1234567.8, '1.234.567,80~lei'],
    [99.999, '100~lei'],
  ])('%s → %s', (input, expected) => {
    expect(formatRon(input)).toBe(nb(expected));
  });
});

describe('formatDate', () => {
  it('long date', () => expect(formatDate('2026-11-18')).toBe('18 noiembrie 2026'));
  it('short date', () => expect(formatDate('2026-03-01', 'short')).toBe('1 mar. 2026'));
  it('uses Europe/Bucharest', () => expect(formatDate('2026-12-31T23:30:00Z')).toBe('1 ianuarie 2027'));
  it('invalid → empty', () => expect(formatDate('nope')).toBe(''));
});

describe('numbers', () => {
  it('formatNumber', () => {
    expect(formatNumber(9.1)).toBe('9,1');
    expect(formatNumber(1500)).toBe('1.500');
  });
  it('formatPercent', () => {
    expect(formatPercent(94.2)).toBe('94,2%');
    expect(formatPercent(100)).toBe('100%');
  });
});

describe('formatPhone', () => {
  it('mobile with spaces', () =>
    expect(formatPhone('0712 345 678')).toEqual({ display: '+40 712 345 678', href: 'tel:+40712345678' }));
  it('placeholder number', () =>
    expect(formatPhone('+40 700 000 000')).toEqual({ display: '+40 700 000 000', href: 'tel:+40700000000' }));
  it('0040 prefix', () => expect(formatPhone('0040712345678')).toEqual(formatPhone('+40712345678')));
  it('landline', () => expect(formatPhone('021 123 4567')).toEqual({ display: '+40 21 123 4567', href: 'tel:+40211234567' }));
  it('garbage → null', () => expect(formatPhone('12345')).toBeNull());
});

describe('pluralRo', () => {
  it.each([
    [0, '0 lecții'],
    [1, '1 lecție'],
    [2, '2 lecții'],
    [19, '19 lecții'],
    [20, '20~de~lecții'],
    [25, '25~de~lecții'],
    [100, '100~de~lecții'],
    [101, '101 lecții'],
    [119, '119 lecții'],
    [120, '120~de~lecții'],
    [1000, '1.000~de~lecții'],
  ])('%s → %s', (n, expected) => {
    expect(pluralRo(n, 'lecție', 'lecții')).toBe(nb(expected));
  });
});

describe('misc', () => {
  it('formatReadTime', () => expect(formatReadTime(5)).toBe(nb('5~min~de citit')));
  it('tomorrowIso crosses month in Bucharest time', () => {
    // 2026-11-30 23:30 UTC is already 1 December in Bucharest → tomorrow is 2 December
    expect(tomorrowIso(new Date('2026-11-30T23:30:00Z'))).toBe('2026-12-02');
    expect(tomorrowIso(new Date('2026-11-18T10:00:00Z'))).toBe('2026-11-19');
  });
});
