import type { BookingPrefill } from '@/types';

export const BOOKING_PARAM = { slug: 'rezerva', lessons: 'lectii', category: 'categorie' } as const;

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CATEGORY_RE = /^[A-Z0-9]{1,8}$/;

/** `?rezerva=<slug>&lectii=<n>&categorie=<cod>`; invalid values are dropped silently. */
export function parseBookingSearchParams(sp: URLSearchParams): { slug: string | null; prefill: BookingPrefill } {
  const rawSlug = sp.get(BOOKING_PARAM.slug);
  const slug = rawSlug && rawSlug.length <= 100 && SLUG_RE.test(rawSlug) ? rawSlug : null;

  const prefill: BookingPrefill = {};
  const rawLessons = sp.get(BOOKING_PARAM.lessons);
  if (rawLessons && /^\d+$/.test(rawLessons)) {
    const n = Number(rawLessons);
    if (n >= 1 && n <= 200) prefill.lessonsCount = n;
  }
  const rawCategory = sp.get(BOOKING_PARAM.category)?.trim().toUpperCase();
  if (rawCategory && CATEGORY_RE.test(rawCategory)) prefill.licenseCategory = rawCategory;

  return { slug, prefill };
}

/** Stable key for effects: only the booking part of the URL. */
export function bookingKey(sp: URLSearchParams): string {
  const { slug, prefill } = parseBookingSearchParams(sp);
  return slug ? `${slug}|${prefill.lessonsCount ?? ''}|${prefill.licenseCategory ?? ''}` : '';
}

export function withBooking(sp: URLSearchParams, slug: string, prefill: BookingPrefill = {}): URLSearchParams {
  const next = withoutBooking(sp);
  next.set(BOOKING_PARAM.slug, slug);
  if (prefill.lessonsCount != null) next.set(BOOKING_PARAM.lessons, String(prefill.lessonsCount));
  if (prefill.licenseCategory) next.set(BOOKING_PARAM.category, prefill.licenseCategory);
  return next;
}

/** Removes the three booking keys, keeps filters. */
export function withoutBooking(sp: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(sp);
  Object.values(BOOKING_PARAM).forEach((k) => next.delete(k));
  return next;
}
