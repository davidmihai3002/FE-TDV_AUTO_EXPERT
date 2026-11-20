export const ROUTES = {
  home: '/',
  pricing: '/preturi',
  fleet: '/flota',
  blog: '/blog',
  blogArticle: (slug: string) => `/blog/${slug}`,
} as const;
