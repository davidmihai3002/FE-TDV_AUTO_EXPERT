import { Icon } from '@/components/ui';
import { formatGrade, formatSuccessRate } from '@/libs';
import { FLEET_COPY } from './fleet-copy';
import { FleetSpecRow } from './FleetSpecRow';

export interface FleetCardStatsProps {
  successRate: number | null;
  averageGrade: number | null;
  /** `rows`: extra spec rows inside the desktop `<dl>`; `inline`: extra mobile meta items. */
  layout: 'rows' | 'inline';
}

/** [NOT IN DESIGN] pass rate + average grade. */
export function FleetCardStats({ successRate, averageGrade, layout }: FleetCardStatsProps) {
  const items = [
    successRate != null && { icon: 'verified', label: FLEET_COPY.stats.successRate, value: formatSuccessRate(successRate) },
    averageGrade != null && { icon: 'grade', label: FLEET_COPY.stats.averageGrade, value: formatGrade(averageGrade) },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  if (layout === 'rows') return items.map((i) => <FleetSpecRow key={i.icon} {...i} />);
  return items.map((i) => (
    <div key={i.icon} className="flex items-center gap-2">
      <dt className="sr-only">{i.label}</dt>
      <Icon name={i.icon} size={16} className="text-secondary" />
      <dd>{i.value}</dd>
    </div>
  ));
}
