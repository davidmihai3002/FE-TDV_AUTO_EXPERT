import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[]): string | undefined {
  const key = ids.join('|');
  const [state, setState] = useState<{ key: string; id: string } | null>(null);

  useEffect(() => {
    if (!key || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setState({ key, id: visible[visible.length - 1].target.id });
      },
      { rootMargin: '-20% 0px -80% 0px', threshold: 0 },
    );
    key.split('|').forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key]);

  return state?.key === key ? state.id : ids[0];
}
