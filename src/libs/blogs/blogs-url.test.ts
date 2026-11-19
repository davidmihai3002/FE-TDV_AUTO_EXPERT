import { describe, expect, it } from 'vitest';
import { buildCategoryHref, isValidCategorySlug, parseBlogsSearchParams, withPages } from './blogs-url';

describe('blogs-url', () => {
  it('parses Romanian params with defaults', () => {
    expect(parseBlogsSearchParams(new URLSearchParams())).toEqual({ category: null, search: null, pages: 1 });
    expect(parseBlogsSearchParams(new URLSearchParams('categorie=condus-defensiv&pagina=3&cauta=%20scoala%20'))).toEqual({
      category: 'condus-defensiv',
      search: 'scoala',
      pages: 3,
    });
  });

  it('clamps pages and ignores too-short search', () => {
    expect(parseBlogsSearchParams(new URLSearchParams('pagina=99')).pages).toBe(20);
    expect(parseBlogsSearchParams(new URLSearchParams('pagina=0')).pages).toBe(1);
    expect(parseBlogsSearchParams(new URLSearchParams('pagina=abc')).pages).toBe(1);
    expect(parseBlogsSearchParams(new URLSearchParams('cauta=a')).search).toBeNull();
  });

  it('keeps malformed categories so the page can show the empty state', () => {
    const { category } = parseBlogsSearchParams(new URLSearchParams('categorie=Bad Slug'));
    expect(category).toBe('Bad Slug');
    expect(isValidCategorySlug(category!)).toBe(false);
  });

  it('builds chip hrefs: keeps cauta, drops pagina', () => {
    const current = new URLSearchParams('categorie=a&pagina=2&cauta=scoala');
    expect(buildCategoryHref('tehnologia-flotei', current)).toBe('/blog?categorie=tehnologia-flotei&cauta=scoala');
    expect(buildCategoryHref(null, current)).toBe('/blog?cauta=scoala');
    expect(buildCategoryHref(null)).toBe('/blog');
  });

  it('writes pagina only above 1', () => {
    expect(withPages(new URLSearchParams('categorie=a'), 2).toString()).toBe('categorie=a&pagina=2');
    expect(withPages(new URLSearchParams('categorie=a&pagina=2'), 1).toString()).toBe('categorie=a');
  });
});
