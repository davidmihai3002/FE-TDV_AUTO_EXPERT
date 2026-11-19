export interface BlogsPageHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

/** The page's only h1: visible on mobile, sr-only from md (the desktop hero title is an h2). */
export function BlogsPageHeader({ title, subtitle, className }: BlogsPageHeaderProps) {
  return (
    <header className={`px-margin-mobile pt-lg text-center md:p-0 ${className ?? ''}`}>
      <h1 className="text-headline-lg-mobile text-primary-container mb-xs md:sr-only">{title}</h1>
      <p className="text-body-md text-on-surface-variant md:hidden">{subtitle}</p>
    </header>
  );
}
