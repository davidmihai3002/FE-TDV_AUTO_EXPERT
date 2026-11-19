/** lei → integer bani; all arithmetic in integers (mirror of the BE's PricingService, display only). */
const toBani = (lei: number) => Math.round(lei * 100);

export interface LocalQuote {
  subtotal: number;
  processingFee: number;
  total: number;
}

/** price = rate × lessons + fee. The BE recomputes it (POST /pricing/quote) and is the source of truth. */
export function calculateQuote({ rate, lessons, fee }: { rate: number; lessons: number; fee: number }): LocalQuote {
  const lessonsBani = toBani(rate) * lessons;
  const feeBani = toBani(fee);
  return { subtotal: lessonsBani / 100, processingFee: feeBani / 100, total: (lessonsBani + feeBani) / 100 };
}

/** Snaps to the step grid starting at `min` and clamps to [min, max]. */
export function clampToStep(n: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(n)) return min;
  const snapped = min + Math.round((n - min) / step) * step;
  return Math.min(max - ((max - min) % step), Math.max(min, snapped));
}
