export const VALIDATION_MESSAGES = {
  required: 'Câmp obligatoriu',
  phone: 'Număr de telefon invalid. Exemplu: 0712 345 678',
  email: 'Adresă de email invalidă',
  dateMin: 'Alege o dată începând de mâine',
  dateInvalid: 'Dată invalidă',
  minLength: (n: number) => `Minimum ${n} caractere`,
  maxLength: (n: number) => `Maximum ${n} caractere`,
  numberRange: (min: number, max: number) => `Introdu un număr între ${min} și ${max}`,
  consent: 'Trebuie să accepți prelucrarea datelor personale',
  select: 'Alege o opțiune',
  formSummary: 'Verifică câmpurile marcate cu roșu.',
  generic: 'A apărut o eroare. Încearcă din nou.',
  invalid: 'Câmp invalid',
} as const;

export const REQUIRED_LEGEND = 'Câmpurile marcate cu * sunt obligatorii.';

export function isValidRoPhone(raw: string): boolean {
  return /^(\+40|0)7\d{8}$/.test(raw.replace(/[\s.-]/g, ''));
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}
