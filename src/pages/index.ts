// Eagerly loaded pages only. Route pages (landing, pricing, fleet, blogs, blog-article, ui-kit) are lazy-loaded by
// src/router.tsx through direct dynamic imports, so they must NOT be re-exported here (that would defeat code splitting).
export { default as NotFoundPage } from './not-found/NotFoundPage';
export { default as RouteErrorPage } from './error/RouteErrorPage';
