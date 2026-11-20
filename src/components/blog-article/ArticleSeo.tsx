import { ROUTES, SITE_TITLE_SUFFIX } from '@/config';
import { countWords } from '@/libs';
import type { BlogArticleInstance } from '@/store';
import { ARTICLE_COPY } from './copy';

const safeJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
const absolute = (origin: string, url: string) => new URL(url, origin).href;

export function ArticleSeo({ article }: { article: BlogArticleInstance }) {
  const origin = window.location.origin;
  const url = `${origin}${ROUTES.blogArticle(article.slug)}`;
  const ogImage = absolute(origin, article.seo.ogImage);
  const headline = article.title.length > 110 ? `${article.title.slice(0, 109)}…` : article.title;
  const title = `${article.seo.title} | ${SITE_TITLE_SUFFIX}`;

  const posting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    inLanguage: 'ro-RO',
    headline,
    description: article.seo.description,
    image: [ogImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.role ? { jobTitle: article.author.role } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE_SUFFIX,
      logo: { '@type': 'ImageObject', url: `${origin}/images/tdv-logo.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(article.category ? { articleSection: article.category.name } : {}),
    ...(article.tags.length ? { keywords: article.tags.map((t) => t.name).join(', ') } : {}),
    wordCount: countWords(article.content.blocks),
    timeRequired: `PT${article.readTimeMinutes}M`,
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ARTICLE_COPY.breadcrumb.home, item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: ARTICLE_COPY.breadcrumb.blog, item: `${origin}${ROUTES.blog}` },
      { '@type': 'ListItem', position: 3, name: article.title },
    ],
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={article.seo.description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.seo.title} />
      <meta property="og:description" content={article.seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_TITLE_SUFFIX} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={article.coverImage.alt} />
      <meta property="article:published_time" content={article.publishedAt} />
      <meta property="article:modified_time" content={article.updatedAt} />
      <meta property="article:author" content={article.author.name} />
      {article.category && <meta property="article:section" content={article.category.name} />}
      {article.tags.map((t) => (
        <meta key={t.slug} property="article:tag" content={t.name} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(posting) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbs) }} />
    </>
  );
}
