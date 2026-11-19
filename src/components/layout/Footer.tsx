import { observer } from 'mobx-react-lite';
import { Link } from 'react-router';
import { Icon } from '@/components/ui';
import { A11Y_LABELS, FOOTER_EXPLORE, FOOTER_LEGAL, FOOTER_TITLES } from '@/config';
import { useStore } from '@/store';
import { Logo } from './Logo';
import { SOCIAL_LABELS } from './social-labels';
import { SocialIcon } from './SocialIcon';

const linkClass =
  'text-label-sm text-on-surface-variant transition-colors hover:text-secondary hover:underline decoration-secondary underline-offset-2';
const titleClass = 'text-label-md text-primary';

export const Footer = observer(function Footer() {
  const { siteSettings } = useStore();
  const s = siteSettings.settings;
  const phone = siteSettings.phone;
  const legal = FOOTER_LEGAL.filter((l) => s[l.settingsKey]);
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-surface-container-lowest border-t border-outline-variant/30 py-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-gutter max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="md:col-span-3 lg:col-span-2 flex flex-col gap-sm">
          <Logo size={32} wordmark={s.brandName} className="mb-2" />
          <p className="text-body-md text-on-surface-variant max-w-md">{s.footerDescription}</p>
          <small className="text-label-sm text-on-surface-variant mt-4 block">
            © {year} {s.copyrightText}
          </small>
        </div>

        <nav aria-label={A11Y_LABELS.footerNav} className="contents">
          <div className="flex flex-col gap-sm mt-6 md:mt-0">
            <h2 className={titleClass}>{FOOTER_TITLES.explore}</h2>
            <ul className="flex flex-col gap-sm">
              {FOOTER_EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {legal.length > 0 && (
            <div className="flex flex-col gap-sm mt-6 md:mt-0">
              <h2 className={titleClass}>{FOOTER_TITLES.resources}</h2>
              <ul className="flex flex-col gap-sm">
                {legal.map((l) => (
                  <li key={l.settingsKey}>
                    <a href={s[l.settingsKey] ?? undefined} className={linkClass}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        <div className="flex flex-col gap-sm mt-6 md:mt-0">
          <h2 className={titleClass}>{FOOTER_TITLES.contact}</h2>
          {siteSettings.supportHref && (
            <a href={siteSettings.supportHref} className={linkClass}>
              {A11Y_LABELS.contactSupport}
            </a>
          )}
          <ul className="flex flex-col gap-2">
            {phone && (
              <ContactLine icon="call" label={A11Y_LABELS.contactLabels.phone}>
                <a href={phone.href} className="hover:text-secondary transition-colors whitespace-nowrap">
                  {phone.display}
                </a>
              </ContactLine>
            )}
            {s.contact.email && (
              <ContactLine icon="mail" label={A11Y_LABELS.contactLabels.email}>
                <a href={`mailto:${s.contact.email}`} className="hover:text-secondary transition-colors break-all">
                  {s.contact.email}
                </a>
              </ContactLine>
            )}
            {s.contact.address && (
              <ContactLine icon="location_on" label={A11Y_LABELS.contactLabels.address}>
                {s.contact.address}
              </ContactLine>
            )}
            {s.contact.schedule && (
              <ContactLine icon="schedule" label={A11Y_LABELS.contactLabels.schedule}>
                {s.contact.schedule}
              </ContactLine>
            )}
          </ul>
          {s.socials.length > 0 && (
            <ul className="flex gap-2 mt-2">
              {s.socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[social.platform] ?? social.platform}
                    className="flex items-center justify-center size-9 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary-container transition-colors"
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
});

function ContactLine({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-label-sm text-on-surface-variant">
      <Icon name={icon} size={16} className="text-secondary mt-px" />
      <span>
        <span className="sr-only">{label} </span>
        {children}
      </span>
    </li>
  );
}
