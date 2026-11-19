import { describe, expect, it } from 'vitest';
import type { ContentBlock } from '@/types';
import { buildToc, countWords, groupSections } from './article-content';

const blocks: ContentBlock[] = [
  { type: 'paragraph', id: 'intro', variant: 'lead', text: 'Să-ți spun ceva.' },
  { type: 'heading', id: 'unu', level: 2, text: 'Unu', iconName: 'speed' },
  { type: 'paragraph', id: 'unu-p1', variant: 'body', text: 'Primul paragraf' },
  { type: 'heading', id: 'unu-detalii', level: 3, text: 'Detalii' },
  { type: 'heading', id: 'doi', level: 2, text: 'Doi' },
  { type: 'steps', id: 'pasi', items: [{ title: 'Pas', text: 'unu doi' }] },
];

describe('article content helpers', () => {
  it('buildToc lists level-2 headings only', () => {
    expect(buildToc(blocks)).toEqual([
      { id: 'unu', text: 'Unu' },
      { id: 'doi', text: 'Doi' },
    ]);
  });

  it('groupSections splits intro and sections, keeping h3s inside their section', () => {
    const { intro, sections } = groupSections(blocks);
    expect(intro.map((b) => b.id)).toEqual(['intro']);
    expect(sections.map((s) => s.heading.id)).toEqual(['unu', 'doi']);
    expect(sections[0].blocks.map((b) => b.id)).toEqual(['unu-p1', 'unu-detalii']);
    expect(groupSections([]).sections).toEqual([]);
  });

  it('countWords counts text from every block type', () => {
    expect(countWords(blocks)).toBe(3 + 1 + 2 + 1 + 1 + 1 + 2);
  });
});
