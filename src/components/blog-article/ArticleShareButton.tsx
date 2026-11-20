import { useState } from 'react';
import { Icon } from '@/components/ui';
import { ARTICLE_COPY } from './copy';

export function ArticleShareButton({ className }: { className?: string }) {
  const [message, setMessage] = useState('');

  async function share() {
    const url = window.location.href.split('#')[0];
    const title = document.title;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMessage(ARTICLE_COPY.share.copied);
      window.setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      if (import.meta.env.DEV) console.warn('[share] failed', e);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void share()}
        aria-label={ARTICLE_COPY.header.share}
        className={`p-2.5 -m-2.5 text-on-surface-variant hover:text-primary rounded-full ${className ?? ''}`}
      >
        <Icon name="share" size={24} />
      </button>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </>
  );
}
