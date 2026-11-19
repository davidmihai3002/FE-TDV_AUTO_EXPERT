import { Icon } from '@/components/ui';
import type { CalloutBlockData } from '@/types';
import { ARTICLE_COPY } from '../copy';

const DEFAULT_ICON = { tip: 'warning', insight: 'lightbulb' } as const;

export function CalloutBlock({ block }: { block: CalloutBlockData }) {
  const title = block.title ?? ARTICLE_COPY.callout[block.variant];
  const icon = block.iconName ?? DEFAULT_ICON[block.variant];
  const Body = block.quote ? 'blockquote' : 'p';

  if (block.variant === 'tip') {
    return (
      <aside
        aria-label={title}
        className="bg-surface-container border border-primary-container/30 rounded-xl p-4 lg:p-md shadow-[0_0_30px_rgba(255,215,0,0.05)] mb-md"
      >
        <p className="flex items-center gap-2 text-label-md text-primary-container uppercase tracking-widest mb-4">
          <Icon name={icon} size={24} />
          {title}
        </p>
        <Body className={`text-body-md text-on-surface italic ${block.quote ? 'article-quote' : ''}`}>{block.text}</Body>
      </aside>
    );
  }
  return (
    <aside
      aria-label={title}
      className="flex items-start gap-4 my-md bg-surface-container-low border border-surface-variant rounded-xl p-4 lg:p-md shadow-lg shadow-black/50"
    >
      <Icon name={icon} size={24} className="!text-[28px] !w-7 !h-7 text-secondary" />
      <div>
        <p className="text-label-md text-on-surface mb-1">{title}</p>
        <Body className={`text-body-md text-on-surface-variant ${block.quote ? 'article-quote' : ''}`}>{block.text}</Body>
      </div>
    </aside>
  );
}
