import { Icon } from '@/components/ui';
import { BLOGS_COPY } from './blogs-copy';

export interface BlogsEmptyStateProps {
  onReset: () => void;
  hasFilter: boolean;
  searchTerm?: string | null;
}

export function BlogsEmptyState({ onReset, hasFilter, searchTerm }: BlogsEmptyStateProps) {
  return (
    <div className="p-lg flex flex-col items-center gap-4 text-center">
      <Icon name="article" size={48} className="text-outline-variant" />
      <h3 className="text-headline-md text-primary">
        {searchTerm ? BLOGS_COPY.empty.searchTitle(searchTerm) : BLOGS_COPY.empty.title}
      </h3>
      <p className="text-body-md text-on-surface-variant max-w-md">
        {searchTerm ? BLOGS_COPY.empty.searchBody : BLOGS_COPY.empty.body}
      </p>
      {hasFilter && (
        <button
          type="button"
          onClick={onReset}
          className="border border-surface-container-highest text-primary hover:border-primary-container hover:text-primary-container px-lg py-sm rounded-xs text-label-md uppercase tracking-wider transition-all"
        >
          {BLOGS_COPY.empty.reset}
        </button>
      )}
    </div>
  );
}
