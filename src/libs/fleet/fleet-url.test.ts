import { describe, expect, it } from 'vitest';
import {
  fleetFiltersKey,
  hasInvalidFleetParams,
  parseFleetSearchParams,
  toFleetApiParams,
  toFleetSearchParams,
} from './fleet-url';

describe('fleet-url', () => {
  it('parses Romanian params into API values', () => {
    expect(parseFleetSearchParams(new URLSearchParams('transmisie=manuala&combustibil=benzina&nivel=avansat'))).toEqual({
      transmission: 'manual',
      fuel: 'petrol',
      category: 'advanced',
    });
  });

  it('drops unknown values and flags them as invalid', () => {
    const sp = new URLSearchParams('combustibil=gpl&nivel=maestrie');
    expect(parseFleetSearchParams(sp)).toEqual({ category: 'mastery' });
    expect(hasInvalidFleetParams(sp)).toBe(true);
    expect(hasInvalidFleetParams(new URLSearchParams('nivel=maestrie&rezerva=x'))).toBe(false);
  });

  it('writes keys in a stable order and keeps booking params', () => {
    const keep = new URLSearchParams('rezerva=tesla-model-3&lectii=20&categorie=B&foo=bar');
    expect(toFleetSearchParams({ category: 'beginner', transmission: 'automatic' }, keep).toString()).toBe(
      'transmisie=automata&nivel=incepator&rezerva=tesla-model-3&lectii=20&categorie=B',
    );
    expect(fleetFiltersKey({})).toBe('');
  });

  it('maps to English API params', () => {
    expect(toFleetApiParams({ fuel: 'electric' })).toEqual({ transmission: undefined, fuel: 'electric', category: undefined });
  });
});
