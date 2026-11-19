import { Link } from 'react-router';
import { Button, Icon } from '@/components/ui';
import { ROUTES } from '@/config';
import { ARTICLE_COPY } from './copy';

/** Desktop CTA: booking → /flota (D3), pricing → /preturi. */
export function ArticleCtaCard() {
  const c = ARTICLE_COPY.cta.card;
  return (
    <div className="bg-gradient-to-br from-surface-container to-background border border-outline-variant/30 rounded-xl p-md shadow-2xl text-center">
      <span className="flex justify-center mb-4">
        <Icon name="sports_motorsports" size={36} className="text-primary-container" />
      </span>
      <h2 className="text-headline-md text-primary mb-2">{c.title}</h2>
      <p className="text-body-md text-on-surface-variant mb-md">{c.body}</p>
      <Button to={ROUTES.fleet} block radius="xs" className="py-3 rounded-lg shadow-lg">
        {c.button}
      </Button>
      <Link
        to={ROUTES.pricing}
        className="mt-4 inline-flex items-center gap-1 text-label-md text-primary-fixed hover:text-primary-container transition-colors"
      >
        {c.pricingLink}
        <Icon name="arrow_forward" size={16} />
      </Link>
    </div>
  );
}
