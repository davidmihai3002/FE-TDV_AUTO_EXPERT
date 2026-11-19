import type { StepsBlockData } from '@/types';

/** Numbers come from the index (not stored). Dots alternate blue / gold. */
export function StepsBlock({ block }: { block: StepsBlockData }) {
  return (
    <ol className="flex flex-col gap-4 my-md border-l border-surface-variant pl-4">
      {block.items.map((item, i) => (
        <li key={i} className="relative">
          <span
            aria-hidden
            className={`absolute -left-[21px] top-1 size-2.5 rounded-[9999px] ${i % 2 === 0 ? 'bg-secondary' : 'bg-primary-container'}`}
          />
          <strong className="block mb-1 text-[18px] leading-7 lg:text-body-md font-semibold text-on-surface">
            {i + 1}. {item.title}
          </strong>
          <span className="text-body-md text-on-surface-variant">{item.text}</span>
        </li>
      ))}
    </ol>
  );
}
