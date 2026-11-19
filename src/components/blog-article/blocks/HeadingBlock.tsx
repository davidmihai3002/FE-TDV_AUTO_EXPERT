import { Icon } from '@/components/ui';
import type { HeadingBlockData } from '@/types';

/** `tabIndex=-1` so a TOC jump can move focus here. h2: icon on desktop (bar fallback), gold bar on mobile. */
export function HeadingBlock({ block }: { block: HeadingBlockData }) {
  if (block.level === 3) {
    return (
      <h3 id={`${block.id}-h`} tabIndex={-1} className="text-[20px] leading-7 font-semibold text-primary mb-4 focus:outline-none">
        {block.text}
      </h3>
    );
  }
  return (
    <h2
      id={`${block.id}-h`}
      tabIndex={-1}
      className="flex items-center gap-3 text-headline-md text-on-background lg:text-primary mb-4 lg:mb-md focus:outline-none"
    >
      <span aria-hidden className={`w-1.5 h-6 shrink-0 rounded-pill bg-primary-container ${block.iconName ? 'lg:hidden' : ''}`} />
      {block.iconName && (
        <span className="hidden lg:inline-flex">
          <Icon name={block.iconName} size={30} className="text-primary-container" />
        </span>
      )}
      {block.text}
    </h2>
  );
}
