/** Shared with ticket 05 (which may add BlogDetail). */
export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  postCount: number;
}

export interface BlogCategoryRef {
  slug: string;
  name: string;
}

/** Listing projection from GET /blogs (no `content`). */
export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  author: string;
  /** ISO */
  publishedAt: string;
  readTimeMinutes: number;
  isFeatured: boolean;
  category: BlogCategoryRef;
}

export type BlogSort = 'newest' | 'oldest';

/** English API params for GET /blogs. */
export interface BlogListQuery {
  page?: number;
  pageSize?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: BlogSort;
}
