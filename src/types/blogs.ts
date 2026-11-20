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

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  isFeatured: boolean;
  category: BlogCategoryRef;
}

export type BlogSort = 'newest' | 'oldest';

export interface BlogListQuery {
  page?: number;
  pageSize?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: BlogSort;
}
