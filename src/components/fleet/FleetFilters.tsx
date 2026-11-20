import { Chip } from '@/components/ui';
import {
  CATEGORIES,
  CATEGORY_FILTER_LABEL,
  FUELS,
  FUEL_LABEL,
  TRANSMISSIONS,
  TRANSMISSION_LABEL,
  cn,
} from '@/libs';
import type { FleetFacets, FleetFilters as Filters } from '@/types';
import { FLEET_COPY } from './fleet-copy';

export interface FleetFiltersProps {
  value: Filters;
  facets: FleetFacets | null;
  total: number;
  overallTotal: number;
  onChange: (next: Filters) => void;
  onClear: () => void;
  disabled?: boolean;
}

type GroupKey = keyof Filters;

const GROUPS: { key: GroupKey; options: readonly string[]; labels: Record<string, string> }[] = [
  { key: 'transmission', options: TRANSMISSIONS, labels: TRANSMISSION_LABEL },
  { key: 'fuel', options: FUELS, labels: FUEL_LABEL },
  { key: 'category', options: CATEGORIES, labels: CATEGORY_FILTER_LABEL },
];

const CHIP =
  'h-11 md:h-9 px-4 py-0 rounded-lg border-outline-variant text-label-md snap-start shrink-0 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

export function FleetFilters({ value, facets, total, overallTotal, onChange, onClear, disabled }: FleetFiltersProps) {
  const active = Object.values(value).some(Boolean);

  function select(key: GroupKey, option: string | undefined) {
    const next = { ...value } as Record<GroupKey, string | undefined>;
    if (option) next[key] = option;
    else delete next[key];
    onChange(next as Filters);
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 md:items-center text-left">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-6">
        {GROUPS.map((g) => (
          <fieldset key={g.key} className="min-w-0">
            <legend className="mb-2 text-label-sm uppercase text-on-surface-variant">
              {FLEET_COPY.filters.legend[g.key]}
            </legend>
            <div className="flex gap-2 overflow-x-auto snap-x -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip
                selected={!value[g.key]}
                disabled={disabled}
                onClick={() => select(g.key, undefined)}
                className={CHIP}
              >
                {FLEET_COPY.filters.all}
              </Chip>
              {g.options.map((opt) => {
                const count = facets ? (facets[g.key] as Record<string, number>)[opt] : undefined;
                const empty = count === 0 && value[g.key] !== opt;
                return (
                  <Chip
                    key={opt}
                    selected={value[g.key] === opt}
                    disabled={disabled || empty}
                    aria-disabled={disabled || empty || undefined}
                    onClick={() => select(g.key, opt)}
                    className={CHIP}
                  >
                    {g.labels[opt]}
                    {count !== undefined && <span className="hidden md:inline"> ({count})</span>}
                  </Chip>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 min-h-6">
        <p aria-live="polite" className="sr-only md:not-sr-only text-label-sm text-on-surface-variant">
          {!disabled && FLEET_COPY.filters.resultCount(total, overallTotal)}
        </p>
        {active && (
          <button
            type="button"
            onClick={onClear}
            className={cn('text-label-md text-secondary hover:underline')}
          >
            {FLEET_COPY.filters.clear}
          </button>
        )}
      </div>
    </div>
  );
}
