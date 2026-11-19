import { Icon } from '@/components/ui';
import type { ChecklistBlockData } from '@/types';

export function ChecklistBlock({ block }: { block: ChecklistBlockData }) {
  return (
    <div className="relative overflow-hidden mb-md bg-surface-container border border-surface-variant rounded-xl p-4 lg:p-md shadow-lg">
      <div aria-hidden className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Icon name={block.watermarkIconName ?? 'analytics'} size={48} className="!text-[96px] !w-24 !h-24" />
      </div>
      <p className="text-label-md text-primary uppercase tracking-widest mb-4">{block.title}</p>
      <ul className="flex flex-col gap-4">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <Icon name="check_circle" size={20} className="text-secondary mt-0.5" />
            <span className="text-body-md text-on-surface">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
