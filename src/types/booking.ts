export type BookingTimeSlot = 'dimineata' | 'pranz' | 'seara';
export type BookingStatus = 'noua' | 'confirmata' | 'anulata';

export interface BookingPrefill {
  lessonsCount?: number;
  licenseCategory?: string;
}

export interface BookingDraft {
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTimeSlot: BookingTimeSlot | '';
  lessonsCount: number | null;
  message: string;
  gdprConsent: boolean;
  website: string;
}

export interface CreateBookingRequest {
  fleetId: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTimeSlot: BookingTimeSlot;
  licenseCategory?: string;
  lessonsCount?: number;
  message?: string;
  gdprConsent: true;
  website?: string;
}

export interface CreateBookingResponse {
  id: string;
  status: BookingStatus;
}

export type BookingField = Exclude<keyof BookingDraft, 'website'>;
export type BookingFieldErrors = Partial<Record<BookingField, string>>;

export interface BookingEstimate {
  total: number;
  currency: 'RON';
  lessons: number;
}
