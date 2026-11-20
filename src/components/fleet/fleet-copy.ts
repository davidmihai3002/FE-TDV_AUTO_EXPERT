import { pluralRo } from '@/libs';

export const FLEET_COPY = {
  meta: {
    title: 'Flota TDV și programare lecții | TDV Auto Expert',
    description:
      'Alege mașina de școală potrivită și programează o lecție de condus. Mașini moderne, dotate cu echipamente de siguranță, manuale și automate.',
  },
  hero: {
    titleDesktop: 'Flota TDV',
    titleMobile: 'Flota noastră',
    introDesktop:
      'Descoperă siguranța la volan în mașinile noastre de școală, pregătite cu grijă pentru fiecare lecție. De la hatchback-uri agile la mașini performante, flota noastră este întreținută riguros pentru a oferi cel mai bun mediu de învățare cursanților de toate nivelurile.',
    introMobile:
      'Învață în mașini moderne, dotate cu echipamente de siguranță, gândite pentru precizie în fiecare viraj.',
  },
  card: {
    ctaDesktop: 'Programează o lecție cu această mașină',
    ctaMobile: 'Programează',
    ctaAria: (carName: string) => `Programează o lecție cu ${carName}`,
  },
  spec: { transmission: 'Transmisie', horsepower: 'Putere', acceleration: '0–100 km/h' },
  stats: { successRate: 'Rată de promovare', averageGrade: 'Notă medie la examen' },
  instructor: {
    label: 'Instructor',
    callAria: (name: string, phone: string) => `Sună instructorul ${name} la ${phone}`,
  },
  filters: {
    legend: { transmission: 'Transmisie', fuel: 'Combustibil', category: 'Nivel' },
    all: 'Toate',
    clear: 'Șterge filtrele',
    resultCount: (shown: number, total: number) =>
      `Se afișează ${shown} din ${pluralRo(total, 'mașină', 'mașini')}`,
  },
  loadingSr: 'Se încarcă mașinile…',
  empty: {
    filtered: {
      title: 'Nicio mașină nu corespunde filtrelor',
      text: 'Încearcă altă transmisie, alt tip de combustibil sau alt nivel.',
    },
    none: {
      title: 'Flota noastră se actualizează',
      text: 'Revino în curând sau sună-ne pentru a programa o lecție.',
    },
  },
  error: {
    title: 'Nu am putut încărca flota',
    message: 'Ceva n-a mers bine. Te rugăm să încerci din nou.',
    retry: 'Încearcă din nou',
  },
  notice: {
    unknownCar: 'Mașina căutată nu mai este disponibilă. Alege una dintre mașinile de mai jos.',
    generic: 'Nu am putut deschide programarea pentru mașina căutată. Te rugăm să încerci din nou.',
  },
  imageFallbackAria: 'Imagine indisponibilă',
} as const;
