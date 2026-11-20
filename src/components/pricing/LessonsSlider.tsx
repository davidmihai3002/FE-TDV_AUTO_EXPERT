import { useId, type KeyboardEvent } from 'react';
import { PRICING_COPY, cn, lessonsLabel } from '@/libs';

export interface LessonsSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  variant: 'desktop' | 'mobile';
}

export function LessonsSlider({ value, min, max, step, onChange, variant }: LessonsSliderProps) {
  const id = useId();
  const desktop = variant === 'desktop';
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      onChange(value + (e.key === 'PageUp' ? 5 : -5) * step);
    }
  };
  return (
    <div
      className={cn(
        'flex flex-col gap-md border border-surface-variant p-md',
        desktop ? 'bg-surface-container rounded-lg' : 'bg-surface-container-high rounded-xl',
      )}
    >
      <div className="flex justify-between items-center gap-4">
        <label htmlFor={id} className={desktop ? 'text-body-md font-medium text-on-surface' : 'text-label-md text-on-surface-variant'}>
          {desktop ? PRICING_COPY.lessons.captionDesktop : PRICING_COPY.lessons.captionMobile(min)}
        </label>
        <span
          aria-hidden
          className={
            desktop
              ? 'font-mono tabular-nums text-headline-md text-primary-container'
              : 'text-headline-md text-primary-container tabular-nums'
          }
        >
          {desktop ? lessonsLabel(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={lessonsLabel(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={onKeyDown}
        className={cn('pricing-range w-full', !desktop && 'pricing-range--mobile')}
      />
      <div aria-hidden className="flex justify-between text-label-sm text-on-surface-variant">
        {desktop ? (
          PRICING_COPY.lessons.rangeDesktop(min, max).map((t) => <span key={t}>{t}</span>)
        ) : (
          <>
            <span>{min}</span>
            <span>{max}</span>
          </>
        )}
      </div>
      {desktop && <p className="text-[14px] leading-5 text-on-surface-variant">{PRICING_COPY.lessons.help(min)}</p>}
    </div>
  );
}
