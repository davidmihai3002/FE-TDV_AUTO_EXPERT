import { flow, types, type Instance } from 'mobx-state-tree';
import {
  ApiError,
  FUEL_ORDER_DESKTOP,
  PRICING_COPY,
  STEPS,
  TRANSMISSION_ORDER,
  buildBookingHref,
  calculateQuote,
  clampToStep,
  formatRon,
  getPricingOptions,
  lessonsLabel,
  postQuote,
  rateLabel,
  toUiError,
  type PricingUrlSelection,
  type UiError,
  type StepId,
} from '@/libs';
import type {
  FuelType,
  PricingOptions,
  PricingVehicle,
  QuoteBreakdown,
  QuoteBreakdownVM,
  TransmissionType,
} from '@/types';

const Status = types.enumeration('PricingStatus', ['idle', 'loading', 'ready', 'error']);
const isAbort = (e: unknown) => e instanceof ApiError && e.kind === 'abort';
const byCarName = (a: PricingVehicle, b: PricingVehicle) => a.carName.localeCompare(b.carName, 'ro');

const Selection = types.model('PricingSelection', {
  categoryCode: types.maybeNull(types.string),
  transmission: types.maybeNull(types.enumeration<TransmissionType>(['manual', 'automatic'])),
  fuel: types.maybeNull(types.enumeration<FuelType>(['petrol', 'diesel', 'electric', 'hybrid'])),
  vehicleId: types.maybeNull(types.string),
  lessons: 15,
});

export const PricingStore = types
  .model('PricingStore', {
    options: types.maybeNull(types.frozen<PricingOptions>()),
    optionsStatus: types.optional(Status, 'idle'),
    selection: types.optional(Selection, {}),
    currentStep: 0,
    serverQuote: types.maybeNull(types.frozen<QuoteBreakdown>()),
    quoteStatus: types.optional(Status, 'idle'),
    carGone: false,
    optionsError: types.maybeNull(types.frozen<UiError>()),
  })
  .volatile(() => ({ quoteAbort: null as AbortController | null, quoteTimer: undefined as number | undefined }))
  .views((self) => ({
    get vehiclesForCategory(): PricingVehicle[] {
      const code = self.selection.categoryCode ?? '';
      return self.options?.vehicles.filter((v) => v.categoryCodes.includes(code)) ?? [];
    },
    get availableTransmissions(): Set<TransmissionType> {
      return new Set(this.vehiclesForCategory.map((v) => v.transmission));
    },
    get availableFuels(): Set<FuelType> {
      return new Set(
        this.vehiclesForCategory.filter((v) => v.transmission === self.selection.transmission).map((v) => v.fuel),
      );
    },
    get availableVehicles(): PricingVehicle[] {
      return this.vehiclesForCategory
        .filter((v) => v.transmission === self.selection.transmission && v.fuel === self.selection.fuel)
        .sort(byCarName);
    },
    get selectedVehicle(): PricingVehicle | null {
      return this.availableVehicles.find((v) => v.id === self.selection.vehicleId) ?? null;
    },
    get rate(): number | null {
      const v = this.selectedVehicle;
      return v ? (v.pricesByCategory[self.selection.categoryCode ?? ''] ?? v.lessonPrice) : null;
    },
    get localTotal(): number | null {
      if (!self.options || this.rate == null) return null;
      return calculateQuote({ rate: this.rate, lessons: self.selection.lessons, fee: self.options.processingFee.amount })
        .total;
    },
    get displayTotal(): number | null {
      const s = self.serverQuote;
      if (s && s.vehicle.id === self.selection.vehicleId && s.lessons === self.selection.lessons) return s.total;
      return this.localTotal;
    },
    get totalFormatted(): string | null {
      return this.displayTotal == null ? null : formatRon(this.displayTotal);
    },
    get breakdownVM(): QuoteBreakdownVM | null {
      const v = this.selectedVehicle;
      const total = this.totalFormatted;
      if (!self.options || !v || this.rate == null || !total) return null;
      const fee = self.options.processingFee;
      return {
        vehicleLabel: PRICING_COPY.estimate.vehicleRate(v.carName),
        rateFormatted: rateLabel(this.rate),
        lessonsLabel: lessonsLabel(self.selection.lessons),
        feeLabel: fee.label,
        feeFormatted: fee.amount > 0 ? formatRon(fee.amount) : null,
        totalFormatted: total,
        vatIncluded: self.options.vatIncluded,
      };
    },
    isStepValid(step: StepId): boolean {
      const s = self.selection;
      switch (step) {
        case 'category':
          return !!s.categoryCode && this.vehiclesForCategory.length > 0;
        case 'transmission':
          return !!s.transmission && this.availableTransmissions.has(s.transmission);
        case 'fuel':
          return !!s.fuel && this.availableFuels.has(s.fuel);
        case 'vehicle':
          return !!this.selectedVehicle;
        case 'lessons': {
          const l = self.options?.lessons;
          return !!l && Number.isInteger(s.lessons) && s.lessons >= l.min && s.lessons <= l.max;
        }
      }
    },
    get canBook(): boolean {
      return STEPS.every((st) => this.isStepValid(st));
    },
    get bookingHref(): string | null {
      if (!this.canBook) return null;
      return buildBookingHref(this.selectedVehicle!.slug, self.selection.lessons, self.selection.categoryCode!);
    },
    get isFirstStep(): boolean {
      return self.currentStep === 0;
    },
    get isLastStep(): boolean {
      return self.currentStep === STEPS.length - 1;
    },
    get isEmpty(): boolean {
      return self.optionsStatus === 'ready' && (self.options?.vehicles.length ?? 0) === 0;
    },
    get urlSelection() {
      return {
        categoryCode: self.selection.categoryCode,
        transmission: self.selection.transmission,
        fuel: self.selection.fuel,
        vehicleSlug: this.selectedVehicle?.slug ?? null,
        lessons: self.selection.lessons,
      };
    },
  }))
  .actions((self) => {
    const sendQuote = flow(function* sendQuote() {
      const vehicle = self.selectedVehicle;
      if (!vehicle || !self.selection.categoryCode) return;
      self.quoteAbort?.abort();
      const ctrl = new AbortController();
      self.quoteAbort = ctrl;
      self.quoteStatus = 'loading';
      try {
        const q: QuoteBreakdown = yield postQuote(
          {
            categoryCode: self.selection.categoryCode,
            vehicleId: vehicle.id,
            lessons: self.selection.lessons,
            transmission: vehicle.transmission,
            fuel: vehicle.fuel,
          },
          ctrl.signal,
        );
        if (q.vehicle.id !== self.selection.vehicleId || q.lessons !== self.selection.lessons) return;
        self.serverQuote = q;
        self.quoteStatus = 'ready';
        if (import.meta.env.DEV && self.localTotal !== null && self.localTotal !== q.total) {
          console.warn(`[pricing] FE/BE drift: local ${self.localTotal} vs server ${q.total}`);
        }
      } catch (e) {
        if (isAbort(e)) return;
        self.quoteStatus = 'error';
        if (e instanceof ApiError && e.status === 404) {
          self.carGone = true;
          void (self as unknown as { refetchOptions(): Promise<void> }).refetchOptions();
        }
      }
    });

    function scheduleQuote() {
      window.clearTimeout(self.quoteTimer);
      self.quoteAbort?.abort();
      if (!self.selectedVehicle) {
        self.quoteStatus = 'idle';
        return;
      }
      self.quoteTimer = window.setTimeout(() => void (self as unknown as { sendQuote(): Promise<void> }).sendQuote(), 300);
    }

    function cascade() {
      const s = self.selection;
      if (!s.transmission || !self.availableTransmissions.has(s.transmission)) {
        s.transmission = TRANSMISSION_ORDER.find((t) => self.availableTransmissions.has(t)) ?? null;
      }
      if (!s.fuel || !self.availableFuels.has(s.fuel)) {
        s.fuel = FUEL_ORDER_DESKTOP.find((f) => self.availableFuels.has(f)) ?? null;
      }
      if (!self.selectedVehicle) s.vehicleId = self.availableVehicles[0]?.id ?? null;
      scheduleQuote();
    }

    function applySelection(fromUrl?: PricingUrlSelection) {
      const o = self.options;
      if (!o) return;
      const s = self.selection;
      const categories = [...o.categories].sort((a, b) => a.sortOrder - b.sortOrder);
      s.categoryCode = categories.find((c) => c.code === fromUrl?.categoryCode)?.code ?? categories[0]?.code ?? null;
      const t = fromUrl?.transmission as TransmissionType | null | undefined;
      const f = fromUrl?.fuel as FuelType | null | undefined;
      s.transmission = t && TRANSMISSION_ORDER.includes(t) ? t : 'manual';
      s.fuel = f && FUEL_ORDER_DESKTOP.includes(f) ? f : null;
      const urlCar = o.vehicles.find((v) => v.slug === fromUrl?.vehicleSlug);
      s.vehicleId = urlCar?.id ?? null;
      s.lessons = clampToStep(fromUrl?.lessons ?? o.lessons.default, o.lessons.min, o.lessons.max, o.lessons.step);
      cascade();
    }

    const refetchOptions = flow(function* refetchOptions() {
      try {
        const options: PricingOptions = yield getPricingOptions();
        self.options = options;
        cascade();
      } catch {
        return;
      }
    });

    function receiveOptions(options: PricingOptions, fromUrl?: PricingUrlSelection) {
      self.options = options;
      self.optionsStatus = 'ready';
      applySelection(fromUrl);
    }

    return {
      sendQuote,
      refetchOptions,
      receiveOptions,
      fetchOptions: flow(function* fetchOptions(fromUrl?: PricingUrlSelection) {
        if (self.optionsStatus === 'loading') return;
        if (self.optionsStatus === 'ready') {
          if (fromUrl) applySelection(fromUrl);
          return;
        }
        self.optionsStatus = 'loading';
        try {
          const options: PricingOptions = yield getPricingOptions();
          receiveOptions(options, fromUrl);
        } catch (e) {
          self.optionsStatus = 'error';
          self.optionsError = toUiError(e);
          if (import.meta.env.DEV) console.warn('[pricing] options failed', e);
        }
      }),
      retry() {
        self.optionsStatus = 'idle';
      },
      setCategory(code: string) {
        self.selection.categoryCode = code;
        self.carGone = false;
        cascade();
      },
      setTransmission(t: TransmissionType) {
        if (!self.availableTransmissions.has(t)) return;
        self.selection.transmission = t;
        self.carGone = false;
        cascade();
      },
      setFuel(f: FuelType) {
        if (!self.availableFuels.has(f)) return;
        self.selection.fuel = f;
        self.carGone = false;
        cascade();
      },
      setVehicle(id: string) {
        if (!self.availableVehicles.some((v) => v.id === id)) return;
        self.selection.vehicleId = id;
        self.carGone = false;
        scheduleQuote();
      },
      setLessons(n: number) {
        const l = self.options?.lessons;
        if (!l) return;
        self.selection.lessons = clampToStep(n, l.min, l.max, l.step);
        scheduleQuote();
      },
      next() {
        if (self.isStepValid(STEPS[self.currentStep]) && !self.isLastStep) self.currentStep += 1;
      },
      back() {
        if (!self.isFirstStep) self.currentStep -= 1;
      },
      reset() {
        self.serverQuote = null;
        self.carGone = false;
        self.currentStep = 0;
        applySelection();
      },
      dispose() {
        window.clearTimeout(self.quoteTimer);
        self.quoteAbort?.abort();
      },
    };
  });

export type PricingStoreInstance = Instance<typeof PricingStore>;
