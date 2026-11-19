/**
 * Romanian formatting helpers (plan §9 D1). Locale and time zone are fixed: the site is Romanian-only.
 * A non-breaking space (NBSP) sits before `lei` and `de` so amounts never wrap mid-value.
 */
export const LOCALE = 'ro-RO';
export const TIME_ZONE = 'Europe/Bucharest';
export const NBSP = '\u00A0';

const ronInteger = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const ronDecimal = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateLong = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric', timeZone: TIME_ZONE });
const dateShort = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric', timeZone: TIME_ZONE });
const isoDay = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TIME_ZONE });
const numberFormats = new Map<number, Intl.NumberFormat>();

function numberFormat(maxFractionDigits: number): Intl.NumberFormat {
  let nf = numberFormats.get(maxFractionDigits);
  if (!nf) {
    nf = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: maxFractionDigits });
    numberFormats.set(maxFractionDigits, nf);
  }
  return nf;
}

/** `1300 → "1.300 lei"`, `85.5 → "85,50 lei"`. Decimals only when non-zero (then always two). */
export function formatRon(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const text = Number.isInteger(rounded) ? ronInteger.format(rounded) : ronDecimal.format(rounded);
  return `${text}${NBSP}lei`;
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function toDate(input: string | Date): Date | null {
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;
  const m = DATE_ONLY.exec(input);
  // Date-only strings are calendar dates: anchor at noon UTC so no time zone can shift the day.
  const d = m ? new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12)) : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** `"2026-11-18" → "18 noiembrie 2026"`; `short` → `"18 nov. 2026"`. Invalid input → `""`. */
export function formatDate(input: string | Date, style: 'long' | 'short' = 'long'): string {
  const d = toDate(input);
  if (!d) return '';
  return (style === 'short' ? dateShort : dateLong).format(d);
}

/** `9.1 → "9,1"`, `1500 → "1.500"`. */
export function formatNumber(value: number, maxFractionDigits = 1): string {
  return numberFormat(maxFractionDigits).format(value);
}

/** `94.2 → "94,2%"` (input is a percentage, not a ratio; no space before `%`). */
export function formatPercent(value: number, maxFractionDigits = 1): string {
  return `${formatNumber(value, maxFractionDigits)}%`;
}

/**
 * Romanian phone numbers. Accepts `07xxxxxxxx`, `+407xxxxxxxx`, `00407xxxxxxxx` and landlines `0[23]xxxxxxxx`.
 * Returns display `"+40 712 345 678"` (landline `"+40 21 123 4567"`) and href `"tel:+40712345678"`, or `null`.
 */
export function formatPhone(raw: string): { display: string; href: string } | null {
  const digits = raw.replace(/[\s.()-]/g, '');
  let national: string | null = null;
  if (/^\+40\d{9}$/.test(digits)) national = digits.slice(3);
  else if (/^0040\d{9}$/.test(digits)) national = digits.slice(4);
  else if (/^0\d{9}$/.test(digits)) national = digits.slice(1);
  if (!national) return null;

  let display: string;
  if (/^7\d{8}$/.test(national)) {
    display = `+40 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
  } else if (/^[23]\d{8}$/.test(national)) {
    display = `+40 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
  } else {
    return null;
  }
  return { display, href: `tel:+40${national}` };
}

/**
 * Romanian plural with the "de" rule: `1 lecție`, `2 lecții`, `19 lecții`, `20 de lecții`, `101 lecții`, `120 de lecții`.
 * 0 is the exception: "0 lecții".
 */
export function pluralRo(n: number, one: string, few: string): string {
  const num = formatNumber(n, 0);
  if (n === 1) return `${num} ${one}`;
  const rest = Math.abs(n) % 100;
  if (n === 0 || (rest >= 1 && rest <= 19)) return `${num} ${few}`;
  return `${num}${NBSP}de${NBSP}${few}`;
}

/** `5 → "5 min de citit"`. */
export function formatReadTime(minutes: number): string {
  return `${formatNumber(minutes, 0)}${NBSP}min${NBSP}de citit`;
}

/** `YYYY-MM-DD` of the given instant in Europe/Bucharest. */
export function toIsoDate(d: Date): string {
  return isoDay.format(d);
}

/** Tomorrow's date (Europe/Bucharest) as `YYYY-MM-DD`; `min` for the booking date field. */
export function tomorrowIso(now: Date = new Date()): string {
  const [y, m, d] = toIsoDate(now).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}
