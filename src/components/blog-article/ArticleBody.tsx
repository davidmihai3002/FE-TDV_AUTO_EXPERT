import { createElement } from 'react';
import { groupSections } from '@/libs';
import type { ContentBlock } from '@/types';
import { blockComponents } from './blocks/blockComponents';
import { HeadingBlock } from './blocks/HeadingBlock';

function renderBlock(block: ContentBlock) {
  const Component = (blockComponents as Record<string, React.ComponentType<{ block: ContentBlock }>>)[block.type];
  if (!Component) {
    if (import.meta.env.DEV) console.warn(`[blog-article] unknown block type "${(block as { type: string }).type}"`);
    return null;
  }
  return createElement(Component, { key: block.id, block });
}

export function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  const { intro, sections } = groupSections(blocks);
  return (
    <div className="flex flex-col gap-8 lg:gap-lg">
      {intro.length > 0 && <div>{intro.map(renderBlock)}</div>}
      {sections.map(({ heading, blocks: sectionBlocks }) => (
        <section
          key={heading.id}
          id={heading.id}
          aria-labelledby={`${heading.id}-h`}
          className="scroll-mt-32 lg:scroll-mt-[120px] [&>*:last-child]:mb-0"
        >
          <HeadingBlock block={heading} />
          {sectionBlocks.map(renderBlock)}
        </section>
      ))}
    </div>
  );
}
