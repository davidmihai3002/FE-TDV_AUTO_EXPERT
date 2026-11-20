import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'headline-xl',
            'headline-lg',
            'headline-lg-mobile',
            'headline-md',
            'body-lg',
            'body-md',
            'label-md',
            'label-sm',
          ],
        },
      ],
      'font-family': [{ font: ['headline', 'body'] }],
      shadow: [{ shadow: ['deep', 'deep-mobile', 'glow', 'glow-strong', 'lift'] }],
      rounded: [{ rounded: ['pill'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
