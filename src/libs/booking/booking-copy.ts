import type { BookingTimeSlot } from '@/types';
import { VALIDATION_MESSAGES } from '../validation-messages';

/** BookingDialog copy (ticket 06 §5.1). Romanian only, comma-below ș/ț. */
export const BOOKING_COPY = {
  title: 'Programează o lecție',
  description: 'Completează datele și te sunăm pentru confirmare.',
  summaryInstructor: (name: string) => `Instructor: ${name}`,
  summaryCategory: (code: string) => `Categoria ${code}`,
  fields: {
    fullName: { label: 'Nume complet', placeholder: 'ex. Ana Popescu' },
    phone: { label: 'Telefon', placeholder: '07xx xxx xxx', hint: 'Te sunăm pe acest număr pentru confirmare.' },
    email: { label: 'Email', placeholder: 'nume@exemplu.ro' },
    preferredDate: { label: 'Data preferată' },
    preferredTimeSlot: { label: 'Interval orar', placeholder: 'Alege o opțiune' },
    lessonsCount: { label: 'Număr lecții', none: 'Nu știu încă', hint: 'Opțional — îți arătăm o estimare de preț.' },
    message: { label: 'Mesaj', placeholder: 'Ex.: prefer să încep cu traseul de examen.' },
    gdpr: {
      before: 'Sunt de acord cu prelucrarea datelor personale conform ',
      link: 'Politicii de confidențialitate',
      after: '.',
      newTab: ' (se deschide într-o filă nouă)',
    },
    website: 'Website',
  },
  slots: {
    dimineata: 'Dimineața (08–12)',
    pranz: 'Prânz (12–16)',
    seara: 'Seara (16–20)',
  } satisfies Record<BookingTimeSlot, string>,
  estimate: {
    loading: 'Calculăm estimarea…',
    label: 'Estimare:',
    for: 'pentru',
    note: 'Preț orientativ, confirmat la telefon.',
  },
  submit: 'Trimite cererea',
  submitting: 'Se trimite…',
  cancel: 'Renunță',
  footerNote: 'Nu se percepe nicio plată online.',
  success: {
    title: 'Mulțumim! Te contactăm în cel mai scurt timp pentru confirmare.',
    car: 'Mașina',
    date: 'Data preferată',
    slot: 'Interval orar',
    lessons: 'Număr lecții',
    estimate: 'Estimare',
    close: 'Închide',
  },
  errors: {
    dateMax: 'Alege o dată în următoarele 90 de zile',
    generic: 'Nu am putut trimite cererea. Te rugăm să încerci din nou.',
    rateLimited: 'Ai trimis prea multe cereri. Încearcă din nou peste câteva minute.',
    carUnavailable: 'Această mașină nu mai este disponibilă. Alege altă mașină din flotă.',
    carUnavailableAction: 'Alege altă mașină',
    summary: VALIDATION_MESSAGES.formSummary,
  },
} as const;
