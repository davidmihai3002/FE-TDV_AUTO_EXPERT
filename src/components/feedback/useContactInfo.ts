import { FALLBACK_SITE_SETTINGS } from '@/config';
import { formatPhone } from '@/libs';
import { useOptionalStore } from '@/store';

// TODO: placeholder contact data (plan §9 D2) — bundled fallback used when the store or the API is unavailable
const SITE_CONTACT_FALLBACK = FALLBACK_SITE_SETTINGS.contact;

/** Contact phone/email for error pages: site settings when available, never an empty tel:/mailto:. */
export function useContactInfo(): { phone: { display: string; href: string } | null; email: string | null } {
  const store = useOptionalStore();
  const contact = store?.siteSettings.settings.contact ?? SITE_CONTACT_FALLBACK;
  const phoneRaw = contact.phone || SITE_CONTACT_FALLBACK.phone;
  return {
    phone: phoneRaw ? formatPhone(phoneRaw) : null,
    email: contact.email || SITE_CONTACT_FALLBACK.email,
  };
}
