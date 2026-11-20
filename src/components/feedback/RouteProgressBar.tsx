import { useDelayedFlag } from '@/libs';
import { A11Y_COPY } from './copy';

export interface RouteProgressBarProps {
  active: boolean;
  delayMs?: number;
  minVisibleMs?: number;
}

export function RouteProgressBar({ active, delayMs = 200, minVisibleMs = 400 }: RouteProgressBarProps) {
  const visible = useDelayedFlag(active, { delayMs, minVisibleMs });
  if (!visible) return null;
  return (
    <div
      role="progressbar"
      aria-label={A11Y_COPY.progressLabel}
      aria-valuetext={A11Y_COPY.progressValueText}
      className="motion-static animate-fade-in fixed top-0 inset-x-0 z-[90] h-[3px] overflow-hidden pointer-events-none"
    >
      <div className="h-full w-2/5 motion-reduce:w-full animate-route-progress bg-[linear-gradient(90deg,transparent,var(--color-primary-container),transparent)] motion-reduce:bg-primary-container shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
    </div>
  );
}
