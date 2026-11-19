import type { QuoteBreakdownVM } from '@/types';
import { PRICING_COPY } from '@/libs';

export function QuoteBreakdownRows({ breakdown }: { breakdown: QuoteBreakdownVM }) {
  const rows: [string, string][] = [
    [breakdown.vehicleLabel, breakdown.rateFormatted],
    [PRICING_COPY.estimate.lessons, breakdown.lessonsLabel],
  ];
  if (breakdown.feeFormatted) rows.push([breakdown.feeLabel, breakdown.feeFormatted]);
  return (
    <dl className="flex flex-col gap-sm text-body-md">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between items-center gap-4">
          <dt className="text-on-surface-variant">{label}</dt>
          <dd className="text-on-surface font-mono tabular-nums shrink-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
