import { useState } from 'react';
import { cn } from '@/libs';
import type { ArticleAuthor } from '@/types';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export function ArticleAvatar({ author, size, decorative = false, className }: {
  author: ArticleAuthor;
  size: 32 | 48;
  decorative?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const box = cn(
    'shrink-0 overflow-hidden rounded-[9999px] border',
    size === 48 ? 'size-12 border-outline-variant/30' : 'size-8 border-outline-variant bg-surface-container-high',
    className,
  );
  if (!author.avatarUrl || failed) {
    return (
      <span aria-hidden className={cn(box, 'flex items-center justify-center bg-surface-container-high text-label-md text-primary-container')}>
        {initials(author.name)}
      </span>
    );
  }
  return (
    <img
      src={author.avatarUrl}
      alt={decorative ? '' : author.name}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={cn(box, 'object-cover')}
    />
  );
}
