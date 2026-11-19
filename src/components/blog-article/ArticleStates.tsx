import { Button, Icon } from '@/components/ui';
import { ROUTES } from '@/config';
import { ARTICLE_COPY } from './copy';

/** Local 404/error until ticket 07 ships shared components. The URL stays (no redirect). */
export function ArticleNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-margin-mobile pt-[120px] lg:pt-xl pb-xl flex flex-col items-center gap-4 text-center">
      <title>{ARTICLE_COPY.state.notFoundTitle}</title>
      <meta name="robots" content="noindex" />
      <Icon name="article" size={48} className="text-outline-variant" />
      <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">{ARTICLE_COPY.state.notFoundHeading}</h1>
      <p className="text-body-md text-on-surface-variant">{ARTICLE_COPY.state.notFoundBody}</p>
      <Button to={ROUTES.blog} leadingIcon="arrow_back">
        {ARTICLE_COPY.state.backToBlog}
      </Button>
    </div>
  );
}

export function ArticleError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="max-w-2xl mx-auto px-margin-mobile pt-[120px] lg:pt-xl pb-xl flex flex-col items-center gap-4 text-center">
      <Icon name="error" size={48} className="text-error" />
      <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">{ARTICLE_COPY.state.errorHeading}</h1>
      <p className="text-body-md text-on-surface-variant">{ARTICLE_COPY.state.errorBody}</p>
      <Button onClick={onRetry}>{ARTICLE_COPY.state.retry}</Button>
    </div>
  );
}
