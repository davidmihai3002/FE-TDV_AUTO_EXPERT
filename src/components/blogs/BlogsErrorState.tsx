import { Button, Icon } from '@/components/ui';
import { BLOGS_COPY } from './blogs-copy';

/** Inline grid error (local until ticket 07 ships a shared ErrorState). */
export function BlogsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="p-lg flex flex-col items-center gap-4 text-center">
      <Icon name="error" size={48} className="text-error" />
      <h3 className="text-headline-md text-primary">{BLOGS_COPY.error.title}</h3>
      <p className="text-body-md text-on-surface-variant">{BLOGS_COPY.error.body}</p>
      <Button onClick={onRetry}>{BLOGS_COPY.error.retry}</Button>
    </div>
  );
}
