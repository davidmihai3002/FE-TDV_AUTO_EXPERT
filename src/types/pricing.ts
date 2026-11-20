import type { FuelType, TransmissionType } from './fleet';

export interface LicenseCategory {
  id: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  badgeLabel: string | null;
  icon: string;
  sortOrder: number;
}

export interface PricingVehicle {
  id: string;
  slug: string;
  carName: string;
  transmission: TransmissionType;
  fuel: FuelType;
  imageUrl: string;
  instructorName: string | null;
  successRate: number | null;
  averageGrade: number | null;
  categoryCodes: string[];
  lessonPrice: number;
  pricesByCategory: Record<string, number>;
}

export interface PricingOptions {
  currency: 'RON';
  vatIncluded: boolean;
  processingFee: { amount: number; label: string };
  lessons: { min: number; max: number; default: number; step: number };
  categories: LicenseCategory[];
  vehicles: PricingVehicle[];
}

export interface QuoteSelection {
  categoryCode: string;
  vehicleId: string;
  lessons: number;
  transmission?: TransmissionType;
  fuel?: FuelType;
}

export interface QuoteBreakdown {
  currency: 'RON';
  vatIncluded: boolean;
  vehicle: { id: string; slug: string; carName: string; transmission: TransmissionType; fuel: FuelType };
  lessons: number;
  lines: { code: 'lessons' | 'processing_fee'; label: string; unitAmount: number; quantity: number; amount: number }[];
  subtotal: number;
  processingFee: number;
  total: number;
  computedAt: string;
}

export interface QuoteBreakdownVM {
  vehicleLabel: string;
  rateFormatted: string;
  lessonsLabel: string;
  feeLabel: string;
  feeFormatted: string | null;
  totalFormatted: string;
  vatIncluded: boolean;
}
