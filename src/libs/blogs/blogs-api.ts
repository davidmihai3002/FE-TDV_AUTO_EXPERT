import type { LandingResponse } from '@/types';
import type { BlogArticle, BlogCategory, BlogListItem, BlogListQuery, Paginated } from '@/types';
import { api } from '../api-client';

/** API caps pageSize at 24. */
export const BLOGS_MAX_PAGE_SIZE = 24;

export function getBlogs(query: BlogListQuery, signal?: AbortSignal): Promise<Paginated<BlogListItem>> {
  return api.get<Paginated<BlogListItem>>('/blogs', {
    query: {
      page: query.page,
      pageSize: query.pageSize,
      limit: query.limit,
      category: query.category,
      search: query.search,
      featured: query.featured === undefined ? undefined : String(query.featured),
      sort: query.sort,
    },
    signal,
  });
}

export function getBlogCategories(signal?: AbortSignal): Promise<{ items: BlogCategory[] }> {
  return api.get<{ items: BlogCategory[] }>('/blogs/categories', { signal });
}

export function getBlogArticle(slug: string, signal?: AbortSignal): Promise<BlogArticle> {
  return api.get<BlogArticle>(`/blogs/${encodeURIComponent(slug)}`, { signal });
}

/** Landing CMS content in one call (ticket 02). */
export function getLanding(signal?: AbortSignal): Promise<LandingResponse> {
  return api.get<LandingResponse>('/landing', { signal });
}
