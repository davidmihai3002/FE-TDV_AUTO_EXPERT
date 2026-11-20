import { flow, getRoot, getSnapshot, types, type Instance } from 'mobx-state-tree';
import {
  ApiError,
  FIELD_ORDER,
  createBooking,
  getFleetCar,
  mapApiIssuesToFieldErrors,
  postQuote,
  toCreateBookingRequest,
  validateBookingDraft,
} from '@/libs';
import type {
  BookingDraft,
  BookingEstimate,
  BookingField,
  BookingFieldErrors,
  BookingPrefill,
  CreateBookingResponse,
  FleetCar,
} from '@/types';
import type { FleetStoreInstance } from '../fleet';
import { isAbortError } from '../fleet/fleet-store';
import { BookingDraftModel } from './booking-draft-model';

export const DEFAULT_LICENSE_CATEGORY = 'B';
export const DEFAULT_LESSON_OPTIONS = [15, 20, 25, 30, 40, 50, 60] as const;

type SubmitErrorKind = 'generic' | 'rateLimited' | 'carUnavailable';
type NoticeKind = 'unknownCar' | 'generic';

const pickDefined = (o: BookingFieldErrors): BookingFieldErrors =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v)) as BookingFieldErrors;

export function withExtraOption(options: readonly number[], extra: number | null): number[] {
  if (extra == null || options.includes(extra)) return [...options];
  return [...options, extra].sort((a, b) => a - b);
}

export const BookingStore = types
  .model('BookingStore', {
    draft: types.optional(BookingDraftModel, {}),
    car: types.maybeNull(types.frozen<FleetCar>()),
    carStatus: types.optional(types.enumeration(['idle', 'loading', 'ready']), 'idle'),
    notice: types.maybeNull(types.frozen<NoticeKind>()),
    licenseCategory: types.maybeNull(types.string),
    source: types.optional(types.enumeration(['card', 'deeplink']), 'card'),
    status: types.optional(types.enumeration(['idle', 'submitting', 'success', 'error']), 'idle'),
    fieldErrors: types.optional(types.frozen<BookingFieldErrors>(), {}),
    submitError: types.maybeNull(types.frozen<SubmitErrorKind>()),
    result: types.maybeNull(types.frozen<CreateBookingResponse>()),
    estimate: types.maybeNull(types.frozen<BookingEstimate>()),
    estimateStatus: types.optional(types.enumeration(['idle', 'loading', 'ready', 'error']), 'idle'),
  })
  .volatile(() => ({
    estimateAbort: null as AbortController | null,
    estimateTimer: undefined as number | undefined,
    carAbort: null as AbortController | null,
  }))
  .views((self) => ({
    get isOpen(): boolean {
      return self.carStatus === 'ready' && self.car !== null;
    },
    get isSubmitting(): boolean {
      return self.status === 'submitting';
    },
    get hasErrors(): boolean {
      return Object.keys(self.fieldErrors).length > 0;
    },
    get firstInvalidField(): BookingField | null {
      return FIELD_ORDER.find((f) => self.fieldErrors[f]) ?? null;
    },
    get lessonOptions(): number[] {
      return withExtraOption(DEFAULT_LESSON_OPTIONS, self.draft.lessonsCount);
    },
    get showValidationSummary(): boolean {
      return self.status === 'error' && !self.submitError && Object.keys(self.fieldErrors).length > 0;
    },
  }))
  .actions((self) => {
    function clearEstimateWork() {
      window.clearTimeout(self.estimateTimer);
      self.estimateAbort?.abort();
    }

    const fetchEstimate = flow(function* fetchEstimate(lessons: number) {
      if (!self.car) return;
      const ctrl = new AbortController();
      self.estimateAbort = ctrl;
      try {
        const q: { total: number } = yield postQuote(
          { categoryCode: self.licenseCategory ?? DEFAULT_LICENSE_CATEGORY, vehicleId: self.car.id, lessons },
          ctrl.signal,
        );
        self.estimate = { total: q.total, currency: 'RON', lessons };
        self.estimateStatus = 'ready';
      } catch (e) {
        if (isAbortError(e)) return;
        self.estimate = null;
        self.estimateStatus = 'error';
      }
    });

    function scheduleEstimate() {
      clearEstimateWork();
      const n = self.draft.lessonsCount;
      if (!self.car || n == null) {
        self.estimate = null;
        self.estimateStatus = 'idle';
        return;
      }
      if (!self.estimate) self.estimateStatus = 'loading';
      self.estimateTimer = window.setTimeout(
        () => void (self as unknown as { fetchEstimate(n: number): Promise<void> }).fetchEstimate(n),
        300,
      );
    }

    function open(car: FleetCar, prefill: BookingPrefill = {}, source: 'card' | 'deeplink' = 'card') {
      if (self.car?.id !== car.id) self.draft.resetBookingFields();
      self.car = car;
      self.carStatus = 'ready';
      self.notice = null;
      self.source = source;
      self.licenseCategory = prefill.licenseCategory ?? DEFAULT_LICENSE_CATEGORY;
      if (prefill.lessonsCount != null) self.draft.set('lessonsCount', prefill.lessonsCount);
      self.status = 'idle';
      self.fieldErrors = {};
      self.submitError = null;
      self.result = null;
      self.estimate = null;
      scheduleEstimate();
    }

    return {
      fetchEstimate,
      open,
      openForSlug: flow(function* openForSlug(slug: string, prefill: BookingPrefill) {
        if (self.car?.slug === slug && self.carStatus === 'ready') return;
        const local = getRoot<{ fleet: FleetStoreInstance }>(self).fleet.findBySlug(slug);
        if (local) {
          open(getSnapshot(local) as FleetCar, prefill, 'deeplink');
          return;
        }
        self.carAbort?.abort();
        const ctrl = new AbortController();
        self.carAbort = ctrl;
        self.carStatus = 'loading';
        try {
          const car: FleetCar = yield getFleetCar(slug, ctrl.signal);
          open(car, prefill, 'deeplink');
        } catch (e) {
          if (isAbortError(e)) return;
          self.carStatus = 'idle';
          self.notice = e instanceof ApiError && e.status === 404 ? 'unknownCar' : 'generic';
        }
      }),
      close() {
        clearEstimateWork();
        self.carAbort?.abort();
        if (self.status === 'success') self.draft.resetAll();
        self.car = null;
        self.carStatus = 'idle';
        self.status = 'idle';
        self.submitError = null;
        self.fieldErrors = {};
      },
      dismissNotice() {
        self.notice = null;
      },
      setField<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
        self.draft.set(key, value);
        if (key !== 'website' && self.fieldErrors[key as BookingField]) {
          const next = validateBookingDraft(getSnapshot(self.draft) as BookingDraft)[key as BookingField];
          self.fieldErrors = pickDefined({ ...self.fieldErrors, [key]: next });
        }
        if (key === 'lessonsCount') scheduleEstimate();
      },
      blurField(key: BookingField) {
        const next = validateBookingDraft(getSnapshot(self.draft) as BookingDraft)[key];
        self.fieldErrors = pickDefined({ ...self.fieldErrors, [key]: next });
      },
      submit: flow(function* submit() {
        if (self.isSubmitting || !self.car) return;
        const draft = getSnapshot(self.draft) as BookingDraft;
        const errors = validateBookingDraft(draft);
        self.fieldErrors = errors;
        self.submitError = null;
        if (Object.keys(errors).length) {
          self.status = 'error';
          return;
        }
        self.status = 'submitting';
        try {
          self.result = yield createBooking(toCreateBookingRequest(draft, self.car, self.licenseCategory));
          self.status = 'success';
        } catch (e) {
          const err = e instanceof ApiError ? e : null;
          self.status = 'error';
          const mapped = err?.status === 400 ? mapApiIssuesToFieldErrors(err.body?.issues) : {};
          if (Object.keys(mapped).length) {
            self.fieldErrors = mapped;
          } else {
            self.submitError =
              err?.status === 429 ? 'rateLimited' : err?.status === 404 ? 'carUnavailable' : 'generic';
          }
        }
      }),
    };
  });

export type BookingStoreInstance = Instance<typeof BookingStore>;
