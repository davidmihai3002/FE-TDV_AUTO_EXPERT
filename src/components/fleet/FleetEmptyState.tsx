import { Button, Icon } from '@/components/ui';
import { FLEET_COPY } from './fleet-copy';

export interface FleetEmptyStateProps {
  variant: 'filtered' | 'none';
  onClear?: () => void;
}

export function FleetEmptyState({ variant, onClear }: FleetEmptyStateProps) {
  const copy = FLEET_COPY.empty[variant];
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center">
      <Icon name="directions_car" size={48} className="text-outline-variant" />
      <h2 className="text-headline-md text-on-surface">{copy.title}</h2>
      <p className="text-body-md text-on-surface-variant max-w-md">{copy.text}</p>
      {variant === 'filtered' && onClear && (
        <Button variant="outline" onClick={onClear}>
          {FLEET_COPY.filters.clear}
        </Button>
      )}
    </div>
  );
}
