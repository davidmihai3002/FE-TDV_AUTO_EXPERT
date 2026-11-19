import { useEffect } from 'react';

let lockCount = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

function lock() {
  if (lockCount === 0) {
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    saved = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = 'hidden';
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
  }
  lockCount += 1;
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && saved) {
    const root = document.documentElement;
    root.style.overflow = saved.overflow;
    root.style.paddingRight = saved.paddingRight;
    saved = null;
  }
}

/** Locks page scroll while `active`. Reference-counted, so nested locks (drawer + dialog) are safe. */
export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
