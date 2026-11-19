import type { BodyType, TransmissionType } from './fleet';

/** Mirrors the BE's landingResponseSchema (GET /landing). */
export type Accent = 'primary' | 'secondary' | 'tertiary';
export type LandingSectionKey = 'hero' | 'advantage' | 'fleet' | 'insights' | 'faq' | 'cta';

export interface LandingSection {
  key: LandingSectionKey;
  eyebrow: string | null;
  eyebrowIcon: string | null;
  title: string;
  titleHighlight: string | null;
  titleSuffix: string | null;
  subtitle: string | null;
  primaryCtaLabel: string | null;
  primaryCtaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  secondaryCtaIcon: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageAltMobile: string | null;
  extra: Record<string, unknown>;
  showOnDesktop: boolean;
  showOnMobile: boolean;
}

export interface Stat {
  id: string;
  value: string;
  suffix: string | null;
  shortSuffix: string | null;
  label: string;
  shortLabel: string | null;
  accent: Accent;
  accentMobile: Accent | null;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconMobile: string | null;
  accent: Accent;
  tags: string[];
}

export interface FleetHighlight {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bodyTypes: BodyType[];
  carCount: number;
  transmissions: TransmissionType[];
  badgeLabel: string;
  badgeVariantMobile: 'primary' | 'secondary';
  imageUrl: string;
  imageAlt: string;
  highlightIcon: string | null;
  highlightLabel: string | null;
  specs: { icon: string; label: string; accent: Accent }[];
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface LandingResponse {
  sections: Partial<Record<LandingSectionKey, LandingSection>>;
  stats: Stat[];
  features: Feature[];
  fleetHighlights: FleetHighlight[];
  faqs: Faq[];
}
