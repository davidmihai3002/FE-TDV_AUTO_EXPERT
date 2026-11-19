import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Button, Icon } from '@/components/ui';
import { A11Y_LABELS, CTA, PRIMARY_NAV, ROUTES } from '@/config';
import { MD_UP, cn, getFocusable, useFocusTrap, useLockBodyScroll, useMediaQuery } from '@/libs';
import { useStore } from '@/store';
import { ArticleHeaderBar } from './ArticleHeaderBar';
import { Logo } from './Logo';

const MOBILE_NAV_ID = 'mobile-nav';

/** `variant="article"`: below lg the article header bar replaces this header (route handle, ticket 05). */
export const Header = observer(function Header({ variant = 'default' }: { variant?: 'default' | 'article' }) {
  const { ui, siteSettings } = useStore();
  const open = ui.isMobileNavOpen;
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery(MD_UP);

  useLockBodyScroll(open);
  useFocusTrap([headerRef, drawerRef], open);

  // Close on route change and when growing past the md breakpoint.
  useEffect(() => ui.closeMobileNav(), [pathname, ui]);
  useEffect(() => {
    if (isDesktop) ui.closeMobileNav();
  }, [isDesktop, ui]);

  // Focus management: first link on open, back to the toggle on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      const first = drawerRef.current ? getFocusable(drawerRef.current)[0] : undefined;
      first?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ui.closeMobileNav();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, ui]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-lg',
          variant === 'article' && 'hidden lg:block',
        )}
      >
        <div className="flex items-center justify-between gap-md w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-4">
          <Link to={ROUTES.home} aria-label={A11Y_LABELS.home} className="shrink-0">
            <Logo wordmark={siteSettings.settings.brandName} wordmarkClassName="md:max-lg:sr-only" />
          </Link>

          <nav aria-label={A11Y_LABELS.primaryNav} className="hidden md:flex items-center gap-gutter">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'text-label-md pb-1 border-b-2 transition-colors duration-200',
                    isActive
                      ? 'text-primary border-primary-container'
                      : 'text-on-surface-variant border-transparent hover:text-primary-fixed',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Button to={CTA.book.to} size="sm" className="hidden md:inline-flex">
            {CTA.book.label}
          </Button>

          <button
            ref={toggleRef}
            type="button"
            onClick={ui.toggleMobileNav}
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-label={open ? A11Y_LABELS.closeMenu : A11Y_LABELS.openMenu}
            className="md:hidden p-2 -mr-2 text-on-surface rounded-full hover:bg-surface-container-high transition-colors"
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </header>

      {variant === 'article' ? <ArticleHeaderBar /> : <MobileNav ref={drawerRef} open={open} />}
    </>
  );
});

function MobileNav({ open, ref }: { open: boolean; ref: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      id={MOBILE_NAV_ID}
      inert={!open}
      className={cn(
        'md:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 bg-surface-container-low flex flex-col',
        'px-margin-mobile pt-2 pb-[max(24px,env(safe-area-inset-bottom))] overflow-y-auto',
        // visibility flips instantly on open (so links are focusable right away) and only after the fade on close
        'ease-out',
        open
          ? 'opacity-100 translate-y-0 visible transition-[opacity,translate] duration-200'
          : 'opacity-0 -translate-y-2 invisible transition-[opacity,translate,visibility] duration-150',
      )}
    >
      <nav aria-label={A11Y_LABELS.primaryNav}>
        <ul>
          {PRIMARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between h-14 border-b border-outline-variant/30 text-body-lg font-headline font-semibold',
                    isActive ? 'text-primary-container' : 'text-on-surface',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <Icon
                      name="chevron_right"
                      size={20}
                      className={isActive ? 'text-primary-container' : 'text-on-surface-variant'}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto flex flex-col gap-sm pt-md">
        <Button to={CTA.book.to} size="lg" block trailingIcon="arrow_forward">
          {CTA.book.label}
        </Button>
        <Button to={CTA.calculate.to} variant="tonal" size="lg" block leadingIcon="calculate">
          {CTA.calculate.label}
        </Button>
      </div>
    </div>
  );
}
