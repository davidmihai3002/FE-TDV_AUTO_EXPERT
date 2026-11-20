import { Icon } from '@/components/ui';
import { LOADER_COPY } from '../copy';

export function LoaderGauge() {
  return (
    <div aria-hidden className="relative w-48 h-48 mb-lg flex items-center justify-center animate-loader-glow motion-reduce:[filter:drop-shadow(0_0_16px_rgb(255_215_0/0.35))]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-loader-spin-slow text-surface-variant">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
      </svg>
      <svg viewBox="0 0 100 100" className="absolute inset-4 w-40 h-40 text-primary-container opacity-80 animate-loader-spin">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="50" />
      </svg>
      <Icon name="speed" filled size={48} className="!text-[60px] !w-[60px] !h-[60px] text-primary-container" />
    </div>
  );
}

export function LoaderPulseTile() {
  return (
    <div aria-hidden className="relative w-48 h-48 flex items-center justify-center mb-xl">
      <div className="absolute inset-0 rounded-pill border-2 border-primary-container opacity-20 animate-loader-ring" />
      <div className="absolute inset-4 rounded-pill border border-primary-container opacity-40 animate-loader-ring [animation-delay:-0.5s]" />
      <div className="absolute inset-8 z-10 rounded-pill bg-surface-container-high border border-outline-variant shadow-[0_0_40px_rgba(255,215,0,0.15)] flex items-center justify-center">
        <Icon name="settings_b_roll" filled size={48} className="!text-[64px] !w-16 !h-16 text-primary-container" />
      </div>
    </div>
  );
}

export function LoaderSweepTrack() {
  return (
    <div aria-hidden className="relative w-full h-1 bg-surface-container-highest rounded-pill overflow-hidden shadow-lg border border-surface-variant">
      <div className="absolute inset-0 opacity-80 motion-reduce:opacity-60 animate-loader-sweep bg-[linear-gradient(90deg,transparent,var(--color-primary-container),transparent)] bg-[length:200%_100%] motion-reduce:bg-[length:100%_100%]" />
    </div>
  );
}

export function LoaderFillBar() {
  return (
    <div aria-hidden className="w-[80%] max-w-[300px] h-1 bg-surface-container-high rounded-pill overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className="relative h-full w-full motion-reduce:w-2/5 bg-primary-container rounded-pill animate-loader-fill">
        <div className="absolute top-0 right-0 w-8 h-full bg-white opacity-50 blur-[2px]" />
      </div>
    </div>
  );
}

export function LoaderTelemetry() {
  return (
    <div aria-hidden className="mt-md font-mono text-[10px] text-secondary-fixed-dim opacity-50 text-center tracking-widest">
      {LOADER_COPY.telemetry.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

export function LoaderBackdrop() {
  return (
    <>
      <div aria-hidden className="hidden md:block absolute inset-0 opacity-70 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(28,42,65,0.8)_0%,rgba(4,19,41,1)_100%)]" />
      <div
        aria-hidden
        className="md:hidden absolute inset-0 z-0 [background-image:linear-gradient(rgba(4,19,41,.9),rgba(4,19,41,.9)),linear-gradient(90deg,rgba(39,53,76,.1)_1px,transparent_1px),linear-gradient(rgba(39,53,76,.1)_1px,transparent_1px)] [background-size:100%_100%,40px_40px,40px_40px]"
      />
      <div aria-hidden className="md:hidden absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container rounded-[9999px] mix-blend-screen blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-container rounded-[9999px] mix-blend-screen blur-[120px] animate-pulse [animation-delay:1s]" />
      </div>
    </>
  );
}
