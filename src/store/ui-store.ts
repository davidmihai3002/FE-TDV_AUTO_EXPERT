import { types } from 'mobx-state-tree';

export const UiStore = types
  .model('UiStore', { isMobileNavOpen: false })
  .actions((self) => ({
    openMobileNav() {
      self.isMobileNavOpen = true;
    },
    closeMobileNav() {
      self.isMobileNavOpen = false;
    },
    toggleMobileNav() {
      self.isMobileNavOpen = !self.isMobileNavOpen;
    },
  }));
