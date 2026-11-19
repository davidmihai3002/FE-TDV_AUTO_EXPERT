import { cn } from '@/libs';
import { OptionCard, type OptionCardItem } from './OptionCard';

export interface OptionCardGroupProps {
  name: string;
  value: string | null;
  options: OptionCardItem[];
  onChange: (value: string) => void;
  columns: { base: 1 | 2; md?: 2 | 3 };
  density: 'detailed' | 'compact';
}

const BASE = { 1: 'grid-cols-1', 2: 'grid-cols-2' } as const;
const MD = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' } as const;

/** Single-select per group (the design script's cross-group clearing bug is not reproduced). */
export function OptionCardGroup({ name, value, options, onChange, columns, density }: OptionCardGroupProps) {
  return (
    <div className={cn('grid', density === 'detailed' ? 'gap-md' : 'gap-sm', BASE[columns.base], columns.md && MD[columns.md])}>
      {options.map((o) => (
        <OptionCard key={o.value} {...o} name={name} checked={o.value === value} density={density} onSelect={onChange} />
      ))}
    </div>
  );
}
