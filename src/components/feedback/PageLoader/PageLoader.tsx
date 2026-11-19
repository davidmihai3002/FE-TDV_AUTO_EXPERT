import { cn, useDelayedFlag } from '@/libs';
import { LOADER_COPY } from '../copy';
import {
  LoaderBackdrop,
  LoaderFillBar,
  LoaderGauge,
  LoaderPulseTile,
  LoaderSweepTrack,
  LoaderTelemetry,
} from './LoaderParts';

export interface PageLoaderProps {
  /** fullscreen = fixed overlay with brand block (boot / hydration); inline = inside the layout (lazy routes). */
  variant?: 'fullscreen' | 'inline';
  /** nothing renders for this long (no flash on fast loads) */
  delayMs?: number;
  title?: string;
  subtitle?: string;
  srLabel?: string;
}

/**
 * Code/route loading only — section data uses Skeleton. Desktop and mobile compositions swap with CSS (no JS media
 * query, no flicker on resize). Visible/title texts are <p>, not headings.
 */
export function PageLoader({
  variant = 'inline',
  delayMs = 200,
  title = LOADER_COPY.title,
  subtitle = LOADER_COPY.subtitle,
  srLabel = LOADER_COPY.srLabel,
}: PageLoaderProps) {
  const visible = useDelayedFlag(true, { delayMs });
  const fullscreen = variant === 'fullscreen';
  if (!visible) return <span className="sr-only" role="status">{srLabel}</span>;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'motion-static animate-fade-in flex flex-col items-center overflow-hidden bg-background',
        fullscreen ? 'fixed inset-0 z-[100] justify-between md:justify-center' : 'relative justify-center min-h-[60vh]',
      )}
    >
      <span className="sr-only">{srLabel}</span>
      <LoaderBackdrop />
      {fullscreen && <div aria-hidden className="md:hidden w-full h-24" />}

      <div className="z-10 flex flex-col items-center justify-center flex-grow w-full max-w-md px-margin-mobile md:px-0">
        <div className="hidden md:flex">
          <LoaderGauge />
        </div>
        <div className="md:hidden">
          <LoaderPulseTile />
        </div>
        <div className="text-center mb-lg md:mb-0">
          <p className="text-headline-md font-headline mb-sm text-primary tracking-wide [text-shadow:0_0_10px_rgba(255,215,0,.5)] md:text-on-background md:tracking-normal md:[text-shadow:none]">
            {title}
          </p>
          <p className="text-body-md text-on-surface-variant md:mb-xl">{subtitle}</p>
        </div>
        <div className="hidden md:block w-full">
          <LoaderSweepTrack />
        </div>
        <LoaderFillBarMobile />
        <div className="md:hidden">
          <LoaderTelemetry />
        </div>
      </div>

      {fullscreen && (
        <>
          <div className="hidden md:flex z-10 pb-md flex-col items-center opacity-80">
            <p className="font-headline text-headline-md font-bold text-primary mb-xs tracking-wide">{LOADER_COPY.brand}</p>
            <p className="text-label-md text-on-surface-variant uppercase tracking-widest">{LOADER_COPY.tagline}</p>
          </div>
          <div className="md:hidden w-full py-md text-center z-10">
            <p className="font-headline text-label-md text-on-surface-variant opacity-70 tracking-[0.2em] uppercase">{LOADER_COPY.brand}</p>
          </div>
        </>
      )}
    </div>
  );
}

function LoaderFillBarMobile() {
  return (
    <div className="md:hidden w-full flex justify-center">
      <LoaderFillBar />
    </div>
  );
}
