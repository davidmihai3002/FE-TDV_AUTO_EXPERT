import { ROUTES } from '@/config';

/** Romanian URL params on /blog (API params stay English). */
export const BLOGS_PARAM = { category: 'categorie', page: 'pagina', search: 'cauta' } as const;
export const BLOGS_MAX_PAGES = 20;

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface BlogsUrlState {
  category: string | null;
  search: string | null;
  /** pages of PAGE_SIZE loaded (from ?pagina=, default 1, clamped 1..20) */
  pages: number;
}

export function parseBlogsSearchParams(sp: URLSearchParams): BlogsUrlState {
  const rawCategory = sp.get(BLOGS_PARAM.category);
  // kept even when malformed: the page then shows the empty state (no request, no redirect)
  const category = rawCategory || null;
  const rawSearch = sp.get(BLOGS_PARAM.search)?.trim() ?? '';
  const search = rawSearch.length >= 2 ? rawSearch.slice(0, 100) : null;
  const rawPage = Number(sp.get(BLOGS_PARAM.page));
  const pages = Number.isInteger(rawPage) && rawPage >= 1 ? Math.min(rawPage, BLOGS_MAX_PAGES) : 1;
  return { category, search, pages };
}

/** Category chip target: keeps `cauta`, drops `pagina`. `null` = "Toate". */
export function buildCategoryHref(slug: string | null, current?: URLSearchParams): string {
  const sp = new URLSearchParams();
  if (slug) sp.set(BLOGS_PARAM.category, slug);
  const search = current?.get(BLOGS_PARAM.search);
  if (search) sp.set(BLOGS_PARAM.search, search);
  const qs = sp.toString();
  return qs ? `${ROUTES.blog}?${qs}` : ROUTES.blog;
}

/** URL after "load more": `pagina=N` (omitted for 1), other params kept. */
export function withPages(sp: URLSearchParams, pages: number): URLSearchParams {
  const next = new URLSearchParams(sp);
  if (pages <= 1) next.delete(BLOGS_PARAM.page);
  else next.set(BLOGS_PARAM.page, String(pages));
  return next;
}

export function isValidCategorySlug(slug: string): boolean {
  return slug.length <= 64 && SLUG_RE.test(slug);
}
