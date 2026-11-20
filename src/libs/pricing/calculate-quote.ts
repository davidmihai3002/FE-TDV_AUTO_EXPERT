const toBani = (lei: number) => Math.round(lei * 100);

export interface LocalQuote {
  subtotal: number;
  processingFee: number;
  total: number;
}

export function calculateQuote({ rate, lessons, fee }: { rate: number; lessons: number; fee: number }): LocalQuote {
  const lessonsBani = toBani(rate) * lessons;
  const feeBani = toBani(fee);
  return { subtotal: lessonsBani / 100, processingFee: feeBani / 100, total: (lessonsBani + feeBani) / 100 };
}

export function clampToStep(n: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(n)) return min;
  const snapped = min + Math.round((n - min) / step) * step;
  return Math.min(max - ((max - min) % step), Math.max(min, snapped));
}
