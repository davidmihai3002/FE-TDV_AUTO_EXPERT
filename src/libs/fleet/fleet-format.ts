import { NBSP, formatNumber, formatPercent } from '../format';

export const formatHorsepower = (hp: number) => `${formatNumber(hp, 0)}${NBSP}CP`;
export const formatAcceleration = (s: number) => `${formatNumber(s, 1)}${NBSP}s`;
export const formatSuccessRate = (n: number) => formatPercent(n, 1);
export const formatGrade = (n: number) => `${formatNumber(n, 1)} / 10`;
