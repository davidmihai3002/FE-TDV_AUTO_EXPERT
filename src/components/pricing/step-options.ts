import {
  DISABLED_REASON,
  FUEL_COPY,
  FUEL_ORDER_DESKTOP,
  FUEL_ORDER_MOBILE,
  PRICING_COPY,
  TRANSMISSION_COPY,
  TRANSMISSION_ORDER,
  formatPercent,
  rateLabel,
  type StepId,
} from '@/libs';
import type { PricingStoreInstance } from '@/store';
import type { OptionCardItem } from './OptionCard';

type Density = 'detailed' | 'compact';

export function stepOptions(store: PricingStoreInstance, step: Exclude<StepId, 'lessons'>, density: Density): OptionCardItem[] {
  const detailed = density === 'detailed';
  const s = store.selection;
  switch (step) {
    case 'category':
      return [...(store.options?.categories ?? [])]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((c) => ({
          value: c.code,
          icon: c.icon,
          title: detailed ? c.name : c.shortName,
          description: detailed ? c.description : undefined,
          badge: c.badgeLabel ?? undefined,
        }));
    case 'transmission':
      return TRANSMISSION_ORDER.filter((t) => store.vehiclesForCategory.some((v) => v.transmission === t)).map((t) => ({
        value: t,
        icon: detailed ? TRANSMISSION_COPY[t].iconDesktop : TRANSMISSION_COPY[t].iconMobile,
        title: TRANSMISSION_COPY[t].title,
        description: detailed ? TRANSMISSION_COPY[t].description : undefined,
        disabled: !store.availableTransmissions.has(t),
      }));
    case 'fuel': {
      const inCategory = new Set(store.vehiclesForCategory.map((v) => v.fuel));
      return (detailed ? FUEL_ORDER_DESKTOP : FUEL_ORDER_MOBILE)
        .filter((f) => inCategory.has(f))
        .map((f) => {
          const disabled = !store.availableFuels.has(f);
          return {
            value: f,
            icon: FUEL_COPY[f].icon,
            title: FUEL_COPY[f].title,
            description: detailed ? FUEL_COPY[f].description : undefined,
            disabled,
            disabledReason: disabled && s.transmission ? DISABLED_REASON[s.transmission] : undefined,
          };
        });
    }
    case 'vehicle':
      return store.availableVehicles.map((v) => {
        const price = v.pricesByCategory[s.categoryCode ?? ''] ?? v.lessonPrice;
        return {
          value: v.id,
          icon: 'directions_car',
          title: v.carName,
          description:
            detailed && v.instructorName
              ? PRICING_COPY.vehicle.description(
                  v.instructorName,
                  v.successRate == null ? null : formatPercent(v.successRate),
                )
              : undefined,
          meta: rateLabel(price),
        };
      });
  }
}

export const COLUMNS = {
  detailed: { category: { base: 1, md: 3 }, transmission: { base: 1, md: 2 }, fuel: { base: 1, md: 3 }, vehicle: { base: 1, md: 2 } },
  compact: { category: { base: 1 }, transmission: { base: 2 }, fuel: { base: 1 }, vehicle: { base: 1 } },
} as const;
