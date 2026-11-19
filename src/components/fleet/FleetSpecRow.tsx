import { Icon } from '@/components/ui';

export interface FleetSpecRowProps {
  icon: string;
  label: string;
  value: string;
}

/** One row of the desktop spec table; parent is a `<dl>`. */
export function FleetSpecRow({ icon, label, value }: FleetSpecRowProps) {
  return (
    <div className="flex justify-between items-center gap-3 border-b border-outline-variant pb-1">
      <dt className="flex items-center gap-1 text-label-md text-on-surface-variant">
        <Icon name={icon} size={18} />
        {label}
      </dt>
      <dd className="text-body-md text-on-surface text-right">{value}</dd>
    </div>
  );
}
