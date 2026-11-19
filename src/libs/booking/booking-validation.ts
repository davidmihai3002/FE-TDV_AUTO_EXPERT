import type {
  ApiIssue,
  BookingDraft,
  BookingField,
  BookingFieldErrors,
  CreateBookingRequest,
  FleetCar,
} from '@/types';
import { toIsoDate } from '../format';
import { VALIDATION_MESSAGES as V, isValidEmail, isValidRoPhone } from '../validation-messages';
import { BOOKING_COPY } from './booking-copy';

export const BOOKING_MAX_DAYS_AHEAD = 90;
export const FULL_NAME_MIN = 3;
export const FULL_NAME_MAX = 100;
export const MESSAGE_MAX = 1000;
/** Mirrors 03's seeded range; the server is authoritative. */
export const LESSONS_MIN = 15;
export const LESSONS_MAX = 60;

export const FIELD_ORDER: readonly BookingField[] = [
  'fullName',
  'phone',
  'email',
  'preferredDate',
  'preferredTimeSlot',
  'lessonsCount',
  'message',
  'gdprConsent',
];

/** Today in Europe/Bucharest as YYYY-MM-DD. */
export const bucharestTodayIso = (now: Date = new Date()) => toIsoDate(now);

/** Calendar-day arithmetic in UTC (DST-safe). */
export function addDaysIso(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function isRealIsoDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** Client rules mirror the BE zod schema (POST /bookings). Returns only invalid fields. */
export function validateBookingDraft(draft: BookingDraft, now: Date = new Date()): BookingFieldErrors {
  const errors: BookingFieldErrors = {};
  const name = draft.fullName.trim();
  if (!name) errors.fullName = V.required;
  else if (name.length < FULL_NAME_MIN) errors.fullName = V.minLength(FULL_NAME_MIN);
  else if (name.length > FULL_NAME_MAX) errors.fullName = V.maxLength(FULL_NAME_MAX);

  if (!draft.phone.trim()) errors.phone = V.required;
  else if (!isValidRoPhone(draft.phone)) errors.phone = V.phone;

  if (draft.email.trim() && !isValidEmail(draft.email)) errors.email = V.email;

  const today = bucharestTodayIso(now);
  if (!draft.preferredDate) errors.preferredDate = V.required;
  else if (!isRealIsoDate(draft.preferredDate)) errors.preferredDate = V.dateInvalid;
  else if (draft.preferredDate < addDaysIso(today, 1)) errors.preferredDate = V.dateMin;
  else if (draft.preferredDate > addDaysIso(today, BOOKING_MAX_DAYS_AHEAD))
    errors.preferredDate = BOOKING_COPY.errors.dateMax;

  if (!draft.preferredTimeSlot) errors.preferredTimeSlot = V.select;
  if (draft.message.length > MESSAGE_MAX) errors.message = V.maxLength(MESSAGE_MAX);
  if (!draft.gdprConsent) errors.gdprConsent = V.consent;
  return errors;
}

export function toCreateBookingRequest(
  draft: BookingDraft,
  car: Pick<FleetCar, 'id'>,
  licenseCategory: string | null,
): CreateBookingRequest {
  const email = draft.email.trim();
  const message = draft.message.trim();
  return {
    fleetId: car.id,
    fullName: draft.fullName.trim(),
    phone: draft.phone.trim(),
    ...(email ? { email } : {}),
    preferredDate: draft.preferredDate,
    preferredTimeSlot: draft.preferredTimeSlot as CreateBookingRequest['preferredTimeSlot'],
    ...(licenseCategory ? { licenseCategory } : {}),
    ...(draft.lessonsCount != null ? { lessonsCount: draft.lessonsCount } : {}),
    ...(message ? { message } : {}),
    gdprConsent: true,
    website: draft.website,
  };
}

/** Romanian message per field; reason-specific first. Never shows the English API text. */
const FIELD_FALLBACK: Record<BookingField, string> = {
  fullName: V.minLength(FULL_NAME_MIN),
  phone: V.phone,
  email: V.email,
  preferredDate: V.dateInvalid,
  preferredTimeSlot: V.select,
  lessonsCount: V.numberRange(LESSONS_MIN, LESSONS_MAX),
  message: V.maxLength(MESSAGE_MAX),
  gdprConsent: V.consent,
};

const REASON_MESSAGE: Record<string, string> = {
  phone: V.phone,
  dateMin: V.dateMin,
  dateMax: BOOKING_COPY.errors.dateMax,
  dateInvalid: V.dateInvalid,
};

/** Maps BE `issues[]` to form fields. Issues on non-form paths (website, fleetId…) are ignored. */
export function mapApiIssuesToFieldErrors(issues: ApiIssue[] = []): BookingFieldErrors {
  const out: BookingFieldErrors = {};
  for (const issue of issues) {
    const field = issue.path.split('.')[0] as BookingField;
    if (!(field in FIELD_FALLBACK) || out[field]) continue;
    out[field] = (issue.reason && REASON_MESSAGE[issue.reason]) || FIELD_FALLBACK[field];
  }
  return out;
}
