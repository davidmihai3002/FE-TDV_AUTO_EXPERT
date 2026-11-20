const TONE: Record<string, string> = {
  'protocoale-de-siguranta': 'text-primary-container',
  'siguranta-rutiera': 'text-primary-container',
  'mecanica-conducerii': 'text-secondary',
  'tehnologia-flotei': 'text-secondary',
  'maiestrie-tehnica': 'text-secondary',
  'condus-defensiv': 'text-primary-fixed-dim',
  'intretinerea-vehiculului': 'text-primary-fixed-dim',
  'perspectiva-instructorilor': 'text-primary-fixed-dim',
};

export const insightCategoryTone = (slug: string | undefined) => (slug && TONE[slug]) || 'text-primary-container';
