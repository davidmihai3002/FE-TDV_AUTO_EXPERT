/** Romanian URL paths (plan §9 D1). Page tickets must use these, never string literals. */
export const ROUTES = {
  home: '/',
  pricing: '/preturi',
  fleet: '/flota',
  blog: '/blog',
  blogArticle: (slug: string) => `/blog/${slug}`,
} as const;
