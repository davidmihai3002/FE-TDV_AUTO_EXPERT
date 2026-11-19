import { describe, expect, it } from 'vitest';
import { isValidRoPhone } from './validation-messages';
import { mapApiIssues } from './api-errors';
import { buildQueryString } from './api-client';

describe('isValidRoPhone', () => {
  it.each([
    ['0712 345 678', true],
    ['+40712345678', true],
    ['0712.345.678', true],
    ['0040712345678', false],
    ['0212345678', false],
    ['071234567', false],
  ])('%s → %s', (input, expected) => expect(isValidRoPhone(input)).toBe(expected));
});

describe('mapApiIssues', () => {
  it('maps reason first', () => {
    expect(mapApiIssues([{ path: 'phone', code: 'custom', message: 'x', reason: 'phone' }])).toEqual({
      phone: 'Număr de telefon invalid. Exemplu: 0712 345 678',
    });
  });
  it('unknown code → Câmp invalid', () => {
    expect(mapApiIssues([{ path: 'name', code: 'weird', message: 'x' }])).toEqual({ name: 'Câmp invalid' });
  });
  it('keeps the first issue per field', () => {
    expect(
      mapApiIssues([
        { path: 'email', code: 'custom', message: 'x', reason: 'email' },
        { path: 'email', code: 'too_small', message: 'y' },
      ]),
    ).toEqual({ email: 'Adresă de email invalidă' });
  });
});

describe('buildQueryString', () => {
  it('skips empty values and repeats arrays', () => {
    expect(buildQueryString({ a: 1, b: '', c: null, d: undefined, t: ['manual', 'automatic'], f: false })).toBe(
      '?a=1&t=manual&t=automatic&f=false',
    );
  });
  it('empty → empty string', () => expect(buildQueryString({})).toBe(''));
});
