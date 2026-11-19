import { PRICING_COPY } from '@/libs';

export function WizardProgress({ current, total, title }: { current: number; total: number; title: string }) {
  const label = PRICING_COPY.progress(current, total);
  return (
    <div className="mt-sm flex flex-col gap-xs">
      <div aria-hidden className="flex justify-between text-label-sm text-secondary">
        <span>{label}</span>
        <span>{title}</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`${label}, ${title}`}
        className="h-1 bg-surface-variant rounded-pill overflow-hidden"
      >
        <div
          className="h-full bg-primary-container motion-safe:transition-all motion-safe:duration-300 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
