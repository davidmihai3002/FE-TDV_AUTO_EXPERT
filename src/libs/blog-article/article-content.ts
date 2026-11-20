import type { ContentBlock, HeadingBlockData, TocItem } from '@/types';

export function buildToc(blocks: ContentBlock[]): TocItem[] {
  return blocks
    .filter((b): b is HeadingBlockData => b.type === 'heading' && b.level === 2)
    .map((b) => ({ id: b.id, text: b.text }));
}

export interface ArticleSection {
  heading: HeadingBlockData;
  blocks: ContentBlock[];
}

export function groupSections(blocks: ContentBlock[]): { intro: ContentBlock[]; sections: ArticleSection[] } {
  const intro: ContentBlock[] = [];
  const sections: ArticleSection[] = [];
  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      sections.push({ heading: block, blocks: [] });
    } else if (sections.length) {
      sections[sections.length - 1].blocks.push(block);
    } else {
      intro.push(block);
    }
  }
  return { intro, sections };
}

export function extractBlockText(block: ContentBlock): string[] {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
      return [block.text];
    case 'checklist':
      return [block.title, ...block.items];
    case 'callout':
      return [block.title ?? '', block.text];
    case 'figure':
      return [block.caption ?? ''];
    case 'steps':
      return block.items.flatMap((i) => [i.title, i.text]);
    default:
      return [];
  }
}

export function countWords(blocks: ContentBlock[]): number {
  return blocks.flatMap(extractBlockText).join(' ').trim().split(/\s+/).filter(Boolean).length;
}
