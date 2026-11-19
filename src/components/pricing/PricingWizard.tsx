import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { PRICING_COPY, STEPS, STEP_TITLES } from '@/libs';
import type { PricingStoreInstance } from '@/store';
import type { FuelType, TransmissionType } from '@/types';
import { LessonsSlider } from './LessonsSlider';
import { OptionCardGroup } from './OptionCardGroup';
import { WizardProgress } from './WizardProgress';
import { COLUMNS, stepOptions } from './step-options';

const STEP_HEADINGS = {
  category: PRICING_COPY.section.category.mobile,
  transmission: PRICING_COPY.section.transmission,
  fuel: PRICING_COPY.section.fuel,
  vehicle: PRICING_COPY.section.vehicle,
  lessons: PRICING_COPY.section.lessons,
} as const;

/** One step at a time; focus moves to the step heading on change. */
export const PricingWizard = observer(function PricingWizard({ store }: { store: PricingStoreInstance }) {
  const step = STEPS[store.currentStep];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [store.currentStep]);

  const s = store.selection;
  const lessons = store.options!.lessons;
  const headingId = `pricing-step-${step}`;

  return (
    <div className="flex flex-col gap-lg">
      <WizardProgress current={store.currentStep + 1} total={STEPS.length} title={STEP_TITLES[step]} />
      <fieldset key={step} aria-labelledby={headingId} className="pricing-step-in flex flex-col gap-md min-w-0">
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className="text-headline-md text-on-surface focus:outline-none">
          {STEP_HEADINGS[step]}
        </h2>
        {step === 'lessons' ? (
          <LessonsSlider value={s.lessons} min={lessons.min} max={lessons.max} step={lessons.step} onChange={store.setLessons} variant="mobile" />
        ) : (
          <OptionCardGroup
            name={`pricing-${step}`}
            value={
              step === 'category' ? s.categoryCode : step === 'transmission' ? s.transmission : step === 'fuel' ? s.fuel : s.vehicleId
            }
            options={stepOptions(store, step, 'compact')}
            onChange={(v) => {
              if (step === 'category') store.setCategory(v);
              else if (step === 'transmission') store.setTransmission(v as TransmissionType);
              else if (step === 'fuel') store.setFuel(v as FuelType);
              else store.setVehicle(v);
            }}
            columns={COLUMNS.compact[step]}
            density="compact"
          />
        )}
      </fieldset>
    </div>
  );
});
