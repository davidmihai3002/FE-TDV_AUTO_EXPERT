import { useSyncExternalStore } from 'react';

const THRESHOLD = 100;
let hidden = false;
let pinned = false;
let lastY = 0;
let frame = 0;
const listeners = new Set<() => void>();

function emit(next: boolean) {
  if (next === hidden) return;
  hidden = next;
  listeners.forEach((l) => l());
}

function onScroll() {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    const y = window.scrollY;
    if (pinned) emit(false);
    else if (y > THRESHOLD && y > lastY) emit(true);
    else if (y < lastY || y <= THRESHOLD) emit(false);
    lastY = y;
  });
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    lastY = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('scroll', onScroll);
      hidden = false;
    }
  };
}

export function setHideOnScrollPinned(value: boolean) {
  pinned = value;
  if (value) emit(false);
}

export function useHideOnScroll(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hidden,
    () => false,
  );
}
