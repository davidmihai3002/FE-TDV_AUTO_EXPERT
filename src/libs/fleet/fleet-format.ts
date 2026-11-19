import { NBSP, formatNumber, formatPercent } from '../format';

/** `602 → "602 CP"` */
export const formatHorsepower = (hp: number) => `${formatNumber(hp, 0)}${NBSP}CP`;
/** `3.2 → "3,2 s"` */
export const formatAcceleration = (s: number) => `${formatNumber(s, 1)}${NBSP}s`;
/** `94.2 → "94,2%"` */
export const formatSuccessRate = (n: number) => formatPercent(n, 1);
/** `9.1 → "9,1 / 10"` */
export const formatGrade = (n: number) => `${formatNumber(n, 1)} / 10`;
