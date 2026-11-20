import { cn } from '@/libs';
import type { Stat } from '@/types';
import { statAccentDesktop, statAccentMobile } from './accent';

export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section
      aria-label="Rezultate"
      className="order-2 md:order-3 relative z-10 px-margin-mobile py-4 md:px-0 md:py-xl md:mt-md md:bg-surface-container md:border-y md:border-outline-variant/30"
    >
      <div className="max-w-7xl mx-auto md:px-margin-desktop">
        <dl className="grid grid-cols-2 gap-3 bg-surface-container p-4 rounded-xl shadow-lg text-center md:grid-cols-4 md:gap-gutter md:bg-transparent md:p-0 md:rounded-none md:shadow-none md:divide-x md:divide-surface-variant">
          {stats.map((s) => {
            const mobileSuffix = s.shortSuffix ?? s.suffix;
            return (
              <div
                key={s.id}
                className="flex flex-col-reverse items-center justify-center gap-1 p-3 rounded-lg bg-surface-container-high md:bg-transparent md:p-0 md:rounded-none md:gap-2"
              >
                <dt className="text-[11px] leading-4 font-medium uppercase tracking-wider text-on-surface-variant md:text-label-md md:text-balance">
                  <span className="md:hidden">{s.shortLabel ?? s.label}</span>
                  <span className="hidden md:inline">{s.label}</span>
                </dt>
                <dd
                  className={cn(
                    'flex items-baseline gap-0.5 font-headline text-headline-md md:text-headline-xl tabular-nums',
                    statAccentMobile[s.accentMobile ?? s.accent],
                    statAccentDesktop[s.accent],
                  )}
                >
                  {s.value}
                  {mobileSuffix && (
                    <span className={cn('md:hidden', /^[a-z]/i.test(mobileSuffix) && 'ml-1 text-body-lg font-medium')}>
                      {mobileSuffix}
                    </span>
                  )}
                  {s.suffix && <span className="hidden md:inline">{s.suffix}</span>}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
