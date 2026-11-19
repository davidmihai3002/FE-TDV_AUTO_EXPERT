import { types, type Instance } from 'mobx-state-tree';
import { BlogArticleStore, BlogsListStore } from './blogs';
import { BookingStore } from './booking';
import { FleetStore } from './fleet';
import { LandingStore } from './landing';
import { PricingStore } from './pricing';
import { SiteSettingsStore } from './site-settings-store';
import { UiStore } from './ui-store';

export const RootStore = types.model('RootStore', {
  siteSettings: types.optional(SiteSettingsStore, {}),
  ui: types.optional(UiStore, {}),
  fleet: types.optional(FleetStore, {}),
  booking: types.optional(BookingStore, {}),
  blogsList: types.optional(BlogsListStore, {}),
  blogArticle: types.optional(BlogArticleStore, {}),
  pricing: types.optional(PricingStore, {}),
  landing: types.optional(LandingStore, {}),
});

export type RootStoreInstance = Instance<typeof RootStore>;

export const rootStore = RootStore.create({});
