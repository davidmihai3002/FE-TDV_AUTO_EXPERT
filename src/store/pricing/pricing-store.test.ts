import { getSnapshot } from 'mobx-state-tree';
import { describe, expect, it, vi } from 'vitest';
import type { PricingOptions, PricingVehicle } from '@/types';
import { PricingStore } from './pricing-store';

vi.stubGlobal('window', { setTimeout: () => 0, clearTimeout: () => undefined });

const car = (slug: string, carName: string, transmission: 'manual' | 'automatic', fuel: 'petrol' | 'electric'): PricingVehicle => ({
  id: `id-${slug}`,
  slug,
  carName,
  transmission,
  fuel,
  imageUrl: '',
  instructorName: null,
  successRate: null,
  averageGrade: null,
  categoryCodes: ['B'],
  lessonPrice: transmission === 'manual' ? 35 : 38,
  pricesByCategory: { B: transmission === 'manual' ? 35 : 38 },
});

const OPTIONS: PricingOptions = {
  currency: 'RON',
  vatIncluded: true,
  processingFee: { amount: 25, label: 'Taxă de procesare' },
  lessons: { min: 15, max: 60, default: 15, step: 1 },
  categories: [{ id: 'c', code: 'B', name: 'Categoria B – Autoturism', shortName: 'Categoria B (Auto)', description: '', badgeLabel: 'Standard', icon: 'directions_car', sortOrder: 0 }],
  vehicles: [
    car('volkswagen-golf-r', 'Volkswagen Golf R', 'manual', 'petrol'),
    car('audi-a4-s-line', 'Audi A4 S-Line', 'manual', 'petrol'),
    car('audi-r8-lms', 'Audi R8 LMS', 'automatic', 'petrol'),
    car('honda-civic-si', 'Honda Civic Si', 'automatic', 'petrol'),
    car('vw-golf-8', 'VW Golf 8', 'automatic', 'petrol'),
    car('tesla-model-3', 'Tesla Model 3', 'automatic', 'electric'),
  ],
};

const ready = (fromUrl?: Parameters<ReturnType<typeof PricingStore.create>['receiveOptions']>[1]) => {
  const s = PricingStore.create({});
  s.receiveOptions(OPTIONS, fromUrl);
  return s;
};

describe('PricingStore', () => {
  it('defaults: B, manual, petrol, Audi A4 S-Line (first by name), 15 lessons → 550 lei; electric unavailable', () => {
    const s = ready();
    expect(getSnapshot(s.selection)).toMatchObject({ categoryCode: 'B', transmission: 'manual', fuel: 'petrol', lessons: 15 });
    expect(s.selectedVehicle?.slug).toBe('audi-a4-s-line');
    expect(s.displayTotal).toBe(550);
    expect(s.availableFuels.has('electric')).toBe(false);
    expect(s.bookingHref).toBe('/flota?rezerva=audi-a4-s-line&lectii=15&categorie=B');
  });

  it('automatic keeps petrol and picks Audi R8 LMS (595); electric then picks Tesla (595)', () => {
    const s = ready();
    s.setTransmission('automatic');
    expect(s.selection.fuel).toBe('petrol');
    expect(s.selectedVehicle?.slug).toBe('audi-r8-lms');
    expect(s.displayTotal).toBe(595);
    expect(s.availableFuels.has('electric')).toBe(true);
    s.setFuel('electric');
    expect(s.selectedVehicle?.slug).toBe('tesla-model-3');
    expect(s.displayTotal).toBe(595);
  });

  it('switching back to manual from electric falls back to petrol (never leaves a hole)', () => {
    const s = ready();
    s.setTransmission('automatic');
    s.setFuel('electric');
    s.setTransmission('manual');
    expect(s.selection.fuel).toBe('petrol');
    expect(s.selectedVehicle?.slug).toBe('audi-a4-s-line');
    expect(s.canBook).toBe(true);
  });

  it('ignores unavailable choices', () => {
    const s = ready();
    s.setFuel('electric');
    expect(s.selection.fuel).toBe('petrol');
  });

  it('lessons are clamped to 15..60 and change the total', () => {
    const s = ready();
    s.setLessons(30);
    expect(s.displayTotal).toBe(1075);
    s.setLessons(99);
    expect(s.selection.lessons).toBe(60);
    s.setLessons(3);
    expect(s.selection.lessons).toBe(15);
  });

  it('restores a valid URL selection; bogus values fall back to defaults', () => {
    const s = ready({ categoryCode: 'B', transmission: 'manual', fuel: 'petrol', vehicleSlug: 'volkswagen-golf-r', lessons: 20 });
    expect(s.selectedVehicle?.slug).toBe('volkswagen-golf-r');
    expect(s.selection.lessons).toBe(20);
    const bogus = ready({ categoryCode: 'X', transmission: 'warp', fuel: 'gpl', vehicleSlug: 'nope', lessons: 500 });
    expect(getSnapshot(bogus.selection)).toMatchObject({ categoryCode: 'B', transmission: 'manual', fuel: 'petrol', lessons: 60 });
    expect(bogus.selectedVehicle?.slug).toBe('audi-a4-s-line');
  });

  it('wizard: next only when valid; back; reset returns to step 1 and defaults', () => {
    const s = ready();
    expect(s.isFirstStep).toBe(true);
    s.next();
    s.next();
    expect(s.currentStep).toBe(2);
    s.back();
    expect(s.currentStep).toBe(1);
    s.setTransmission('automatic');
    s.setLessons(40);
    s.reset();
    expect(s.currentStep).toBe(0);
    expect(s.selection.transmission).toBe('manual');
    expect(s.displayTotal).toBe(550);
  });

  it('breakdown view model uses Romanian formatting', () => {
    const s = ready();
    s.setLessons(20);
    const vm = s.breakdownVM!;
    expect(vm.vehicleLabel).toBe('Tarif mașină (Audi A4 S-Line)');
    expect(vm.rateFormatted.replace(/\u00a0/g, ' ')).toBe('35 lei/lecție');
    expect(vm.lessonsLabel.replace(/\u00a0/g, ' ')).toBe('20 de lecții');
    expect(vm.totalFormatted.replace(/\u00a0/g, ' ')).toBe('725 lei');
  });
});
