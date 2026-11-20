import type { ComponentType } from 'react';
import type { ContentBlock } from '@/types';
import { CalloutBlock } from './CalloutBlock';
import { ChecklistBlock } from './ChecklistBlock';
import { FigureBlock } from './FigureBlock';
import { HeadingBlock } from './HeadingBlock';
import { ParagraphBlock } from './ParagraphBlock';
import { StepsBlock } from './StepsBlock';

type BlockMap = { [K in ContentBlock['type']]: ComponentType<{ block: Extract<ContentBlock, { type: K }> }> };

export const blockComponents = {
  paragraph: ParagraphBlock,
  heading: HeadingBlock,
  checklist: ChecklistBlock,
  callout: CalloutBlock,
  figure: FigureBlock,
  steps: StepsBlock,
} satisfies BlockMap;
