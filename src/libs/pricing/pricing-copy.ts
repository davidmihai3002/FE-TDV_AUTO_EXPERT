import type { FuelType, TransmissionType } from '@/types';
import { formatRon, pluralRo } from '../format';

/** /preturi static copy (ticket 03 §2.4, §5.1). Romanian only (D1). */
export const PRICING_COPY = {
  title: { desktop: 'Calculator de preț personalizat', mobile: 'Calculator de preț' },
  lead: {
    desktop:
      'Configurează-ți profilul de pregătire și obține pe loc o estimare exactă pentru lecțiile cu instructorii noștri.',
    mobile: 'Configurează-ți planul de învățare.',
  },
  section: {
    category: { desktop: 'Alege categoria de permis', mobile: 'Categoria de permis' },
    transmission: 'Alege cutia de viteze',
    fuel: 'Alege tipul de combustibil',
    vehicle: 'Alege mașina',
    lessons: 'Numărul de lecții',
  },
  lessons: {
    captionDesktop: 'Durata pregătirii',
    captionMobile: (min: number) => `Minimum ${lessonsLabel(min)}`,
    rangeDesktop: (min: number, max: number) => [`Min: ${min}`, `Max: ${max}`] as const,
    help: (min: number) => `Alege numărul de lecții de conducere. Pachetul minim este de ${lessonsLabel(min)}.`,
  },
  progress: (i: number, n: number) => `Pasul ${i} din ${n}`,
  estimate: {
    titleDesktop: 'Estimare live',
    titleMobile: 'Preț estimat',
    vehicleRate: (carName: string) => `Tarif mașină (${carName})`,
    lessons: 'Lecții selectate',
    total: 'Total estimat',
    vat: 'TVA inclus',
    disclaimer: '*Prețul final se confirmă după evaluare',
    showDetails: 'Vezi detalii',
    hideDetails: 'Ascunde detaliile',
    announce: (total: string) => `Total estimat: ${total}`,
    checkFailed: 'Verificarea prețului a eșuat — prețul final se confirmă la rezervare.',
    carGone: 'Această mașină nu mai este disponibilă — te rugăm să alegi alta.',
  },
  cta: {
    book: 'Rezervă acum',
    bookAria: (carName: string, lessons: number) => `Rezervă acum: ${carName}, ${lessonsLabel(lessons)}`,
    next: 'Pasul următor',
    nextDisabledHint: 'Alege o opțiune pentru a continua',
    back: 'Înapoi',
    reset: 'Resetează',
  },
  vehicle: {
    description: (instructor: string, successRate: string | null) =>
      successRate ? `Instructor ${instructor} · ${successRate} promovabilitate` : `Instructor ${instructor}`,
  },
  state: {
    loadError: 'Nu am putut încărca prețurile momentan.',
    retry: 'Încearcă din nou',
    empty: 'Actualizăm prețurile — sună-ne pentru o ofertă.',
    loading: 'Se încarcă prețurile…',
  },
  header: { close: 'Închide calculatorul de preț' },
  meta: {
    title: 'Calculator de preț – TDV Auto Expert',
    description:
      'Configurează-ți cursul de conducere și află pe loc prețul estimat: alege cutia de viteze, combustibilul, mașina și numărul de lecții.',
  },
} as const;

export const STEPS = ['category', 'transmission', 'fuel', 'vehicle', 'lessons'] as const;
export type StepId = (typeof STEPS)[number];
export const STEP_TITLES: Record<StepId, string> = {
  category: 'Categorie',
  transmission: 'Cutie de viteze',
  fuel: 'Combustibil',
  vehicle: 'Mașină',
  lessons: 'Lecții',
};
export const SECTION_ICONS: Record<StepId, string> = {
  category: 'directions_car',
  transmission: 'settings_input_component',
  fuel: 'local_gas_station',
  vehicle: 'directions_car',
  lessons: 'calendar_month',
};

export const TRANSMISSION_COPY: Record<
  TransmissionType,
  { title: string; description: string; iconDesktop: string; iconMobile: string }
> = {
  manual: {
    title: 'Manuală',
    description: 'Control complet asupra schimbării vitezelor și a mecanicii mașinii.',
    iconDesktop: 'settings_input_svideo',
    iconMobile: 'settings_input_component',
  },
  automatic: {
    title: 'Automată',
    description: 'Condus simplificat, cu accent pe atenția în trafic.',
    iconDesktop: 'auto_transmission',
    iconMobile: 'smart_toy',
  },
};
export const TRANSMISSION_ORDER: TransmissionType[] = ['manual', 'automatic'];
export const DISABLED_REASON: Record<TransmissionType, string> = {
  manual: 'Indisponibil cu cutie manuală',
  automatic: 'Indisponibil cu cutie automată',
};

export const FUEL_COPY: Record<FuelType, { title: string; description: string; icon: string }> = {
  electric: { title: 'Electric', description: 'Zero emisii, o experiență de condus modernă.', icon: 'ev_station' },
  petrol: { title: 'Benzină', description: 'Motor clasic cu ardere internă.', icon: 'local_gas_station' },
  diesel: { title: 'Motorină', description: 'Eficiență ridicată pentru trasee lungi.', icon: 'oil_barrel' },
  // not in design; copy is a proposal (Q6)
  hybrid: { title: 'Hibrid', description: 'Asistență electrică, cu autonomia unui motor pe benzină.', icon: 'energy_savings_leaf' },
};
/** Defaults pick the first available fuel in desktop order. */
export const FUEL_ORDER_DESKTOP: FuelType[] = ['electric', 'petrol', 'diesel', 'hybrid'];
export const FUEL_ORDER_MOBILE: FuelType[] = ['petrol', 'diesel', 'electric', 'hybrid'];

/** 1 lecție · 15 lecții · 20 de lecții */
export const lessonsLabel = (n: number) => pluralRo(n, 'lecție', 'lecții');
/** 35 lei/lecție */
export const rateLabel = (lei: number) => `${formatRon(lei)}/lecție`;
