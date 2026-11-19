export type TransmissionType = 'manual' | 'automatic';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
/** Training level (badge + `nivel` filter). Not the license category (`B`). */
export type CarCategory = 'beginner' | 'fundamentals' | 'advanced' | 'mastery';
export type BodyType = 'compact' | 'hatchback' | 'sedan' | 'coupe' | 'suv';

export interface Instructor {
  id: string;
  fullName: string;
  /** E.164, e.g. "+40721555101" */
  phoneNumber: string;
  photoUrl: string | null;
  photoAlt: string | null;
}

export interface FleetCar {
  id: string;
  slug: string;
  carName: string;
  series: string | null;
  category: CarCategory;
  badgeLabel: string | null;
  transmission: TransmissionType;
  transmissionLabel: string | null;
  fuel: FuelType;
  bodyType: BodyType | null;
  horsepower: number | null;
  zeroToHundredSeconds: number | null;
  imageUrl: string;
  imageAlt: string;
  successRate: number | null;
  averageGrade: number | null;
  displayOrder: number;
  instructor: Instructor | null;
}

/** API-side (English) values; the URL uses Romanian values (see libs/fleet/fleet-url.ts). Single-select in the UI. */
export interface FleetFilters {
  transmission?: TransmissionType;
  fuel?: FuelType;
  category?: CarCategory;
}

export interface FleetFacets {
  transmission: Record<TransmissionType, number>;
  fuel: Record<FuelType, number>;
  category: Record<CarCategory, number>;
}

export interface FleetListResponse {
  items: FleetCar[];
  total: number;
  page: number;
  pageSize: number;
  facets: FleetFacets;
}
