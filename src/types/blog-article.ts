import type { BlogCategoryRef } from './blogs';

/** Mirrors the BE zod schema (source of truth): BE-TDV src/types/blogs/blog-content-schema.ts */
export interface ParagraphBlockData { type: 'paragraph'; id: string; variant: 'lead' | 'body'; text: string }
export interface HeadingBlockData { type: 'heading'; id: string; level: 2 | 3; text: string; iconName?: string | null }
export interface ChecklistBlockData {
  type: 'checklist';
  id: string;
  title: string;
  watermarkIconName?: string | null;
  items: string[];
}
export interface CalloutBlockData {
  type: 'callout';
  id: string;
  variant: 'tip' | 'insight';
  title?: string | null;
  iconName?: string | null;
  text: string;
  quote?: boolean;
}
export interface ArticleImageRef { url: string; alt: string; width: number | null; height: number | null }
/** As returned by GET /blogs/:slug: the image is embedded (hydrated). */
export interface FigureBlockData {
  type: 'figure';
  id: string;
  imageKey: string;
  caption?: string | null;
  image: ArticleImageRef;
}
export interface StepsBlockData { type: 'steps'; id: string; items: { title: string; text: string }[] }

export type ContentBlock =
  | ParagraphBlockData
  | HeadingBlockData
  | ChecklistBlockData
  | CalloutBlockData
  | FigureBlockData
  | StepsBlockData;
export type ContentBlockType = ContentBlock['type'];

export interface BlogContentV2 { version: 2; blocks: ContentBlock[] }

export interface ArticleImage extends ArticleImageRef {
  key: string;
  caption: string | null;
  position: number;
}

export interface ArticleAuthor {
  slug: string;
  name: string;
  role: string | null;
  avatarUrl: string | null;
  avatarAlt: string;
  bio: string | null;
}

export interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  category: BlogCategoryRef | null;
  image: { url: string; alt: string };
  readTimeMinutes: number;
  publishedAt: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: BlogCategoryRef | null;
  tags: BlogCategoryRef[];
  author: ArticleAuthor;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  coverImage: ArticleImageRef;
  content: BlogContentV2;
  images: ArticleImage[];
  related: RelatedArticle[];
  seo: { title: string; description: string; ogImage: string };
}

export interface TocItem { id: string; text: string }
