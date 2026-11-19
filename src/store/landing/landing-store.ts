import { flow, types, type Instance } from 'mobx-state-tree';
import { getBlogs, getLanding } from '@/libs';
import type { BlogListItem, LandingResponse, LandingSection, Paginated } from '@/types';

const Status = types.enumeration('LandingStatus', ['idle', 'loading', 'success', 'error']);

/** Landing content (one request) + the 3 latest posts (04's GET /blogs, separate status so it can't blank the page). */
export const LandingStore = types
  .model('LandingStore', {
    // read-only render data
    content: types.maybeNull(types.frozen<LandingResponse>()),
    status: types.optional(Status, 'idle'),
    latestPosts: types.optional(types.frozen<BlogListItem[]>(), []),
    latestStatus: types.optional(Status, 'idle'),
  })
  .views((self) => ({
    section(key: keyof LandingResponse['sections']): LandingSection | undefined {
      return self.content?.sections[key];
    },
  }))
  .actions((self) => ({
    fetchLanding: flow(function* fetchLanding() {
      if (self.status === 'loading' || self.status === 'success') return;
      self.status = 'loading';
      try {
        self.content = yield getLanding();
        self.status = 'success';
      } catch (e) {
        self.status = 'error';
        if (import.meta.env.DEV) console.warn('[landing] fetch failed', e);
      }
    }),
    fetchLatestPosts: flow(function* fetchLatestPosts() {
      if (self.latestStatus === 'loading' || self.latestStatus === 'success') return;
      self.latestStatus = 'loading';
      try {
        const res: Paginated<BlogListItem> = yield getBlogs({ limit: 3 });
        self.latestPosts = res.items;
        self.latestStatus = 'success';
      } catch (e) {
        self.latestStatus = 'error';
        if (import.meta.env.DEV) console.warn('[landing] latest posts failed', e);
      }
    }),
    retryLanding() {
      self.status = 'idle';
    },
    retryLatest() {
      self.latestStatus = 'idle';
    },
  }));

export type LandingStoreInstance = Instance<typeof LandingStore>;
