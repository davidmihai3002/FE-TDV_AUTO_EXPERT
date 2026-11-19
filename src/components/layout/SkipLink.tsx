import { A11Y_LABELS } from '@/config';

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary-container focus:text-on-primary-container focus:px-4 focus:py-2 focus:rounded-xs focus:text-label-md"
    >
      {A11Y_LABELS.skipLink}
    </a>
  );
}
