import { types, type Instance } from 'mobx-state-tree';
import { ROUTES } from '@/config';

export const BlogCategoryModel = types.model('BlogCategory', {
  id: types.identifier,
  slug: types.string,
  name: types.string,
  postCount: types.number,
});

export const BlogListItemModel = types
  .model('BlogListItem', {
    id: types.identifier,
    slug: types.string,
    title: types.string,
    excerpt: types.string,
    image: types.string,
    imageAlt: types.string,
    author: types.string,
    publishedAt: types.string,
    readTimeMinutes: types.number,
    isFeatured: types.boolean,
    category: types.frozen<{ slug: string; name: string }>(),
  })
  .views((self) => ({
    get href(): string {
      return ROUTES.blogArticle(self.slug);
    },
  }));

export type BlogCategoryInstance = Instance<typeof BlogCategoryModel>;
export type BlogListItemInstance = Instance<typeof BlogListItemModel>;
