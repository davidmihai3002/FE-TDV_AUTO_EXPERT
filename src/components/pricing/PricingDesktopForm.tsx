import { observer } from 'mobx-react-lite';
import { PRICING_COPY, SECTION_ICONS } from '@/libs';
import type { PricingStoreInstance } from '@/store';
import type { FuelType, TransmissionType } from '@/types';
import { LessonsSlider } from './LessonsSlider';
import { OptionCardGroup } from './OptionCardGroup';
import { PricingSection } from './PricingSection';
import { COLUMNS, stepOptions } from './step-options';

/** All 5 sections stacked (80px apart). */
export const PricingDesktopForm = observer(function PricingDesktopForm({ store }: { store: PricingStoreInstance }) {
  const s = store.selection;
  const lessons = store.options!.lessons;
  return (
    <div className="flex flex-col gap-xl">
      <PricingSection icon={SECTION_ICONS.category} title={PRICING_COPY.section.category.desktop}>
        <OptionCardGroup
          name="pricing-category"
          value={s.categoryCode}
          options={stepOptions(store, 'category', 'detailed')}
          onChange={store.setCategory}
          columns={COLUMNS.detailed.category}
          density="detailed"
        />
      </PricingSection>
      <PricingSection icon={SECTION_ICONS.transmission} title={PRICING_COPY.section.transmission}>
        <OptionCardGroup
          name="pricing-transmission"
          value={s.transmission}
          options={stepOptions(store, 'transmission', 'detailed')}
          onChange={(v) => store.setTransmission(v as TransmissionType)}
          columns={COLUMNS.detailed.transmission}
          density="detailed"
        />
      </PricingSection>
      <PricingSection icon={SECTION_ICONS.fuel} title={PRICING_COPY.section.fuel}>
        <OptionCardGroup
          name="pricing-fuel"
          value={s.fuel}
          options={stepOptions(store, 'fuel', 'detailed')}
          onChange={(v) => store.setFuel(v as FuelType)}
          columns={COLUMNS.detailed.fuel}
          density="detailed"
        />
      </PricingSection>
      <PricingSection icon={SECTION_ICONS.vehicle} title={PRICING_COPY.section.vehicle}>
        <OptionCardGroup
          name="pricing-vehicle"
          value={s.vehicleId}
          options={stepOptions(store, 'vehicle', 'detailed')}
          onChange={store.setVehicle}
          columns={COLUMNS.detailed.vehicle}
          density="detailed"
        />
      </PricingSection>
      <PricingSection icon={SECTION_ICONS.lessons} title={PRICING_COPY.section.lessons}>
        <LessonsSlider
          value={s.lessons}
          min={lessons.min}
          max={lessons.max}
          step={lessons.step}
          onChange={store.setLessons}
          variant="desktop"
        />
      </PricingSection>
    </div>
  );
});
