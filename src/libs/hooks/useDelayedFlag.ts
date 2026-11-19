import { useEffect, useState } from 'react';

/**
 * Pure timing core of useDelayedFlag (unit-tested with fake timers): `visible` turns on only after `active` has
 * been true for delayMs, and once on stays on for at least minVisibleMs.
 */
export function createDelayedFlag(onChange: (visible: boolean) => void, { delayMs = 200, minVisibleMs = 400 } = {}) {
  let visible = false;
  let shownAt = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const set = (v: boolean) => {
    if (v === visible) return;
    visible = v;
    if (v) shownAt = Date.now();
    onChange(v);
  };
  return {
    update(active: boolean) {
      clearTimeout(timer);
      if (active) {
        if (!visible) timer = setTimeout(() => set(true), delayMs);
      } else if (visible) {
        const left = minVisibleMs - (Date.now() - shownAt);
        if (left > 0) timer = setTimeout(() => set(false), left);
        else set(false);
      }
    },
    dispose() {
      clearTimeout(timer);
    },
  };
}

/** No flash for fast loads (< delayMs); no flicker once shown (≥ minVisibleMs). */
export function useDelayedFlag(active: boolean, opts?: { delayMs?: number; minVisibleMs?: number }): boolean {
  const [visible, setVisible] = useState(false);
  const [flag] = useState(() => createDelayedFlag(setVisible, opts));
  useEffect(() => {
    flag.update(active);
  }, [active, flag]);
  useEffect(() => () => flag.dispose(), [flag]);
  return visible;
}
