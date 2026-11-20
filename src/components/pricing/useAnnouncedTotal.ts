import { useEffect, useState } from 'react';
import { PRICING_COPY } from '@/libs';

export function useAnnouncedTotal(totalFormatted: string | null): string {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!totalFormatted) return;
    const t = window.setTimeout(() => setText(PRICING_COPY.estimate.announce(totalFormatted)), 500);
    return () => window.clearTimeout(t);
  }, [totalFormatted]);
  return text;
}
