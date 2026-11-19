import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import {
  CtaBanner,
  ExpertAdvantage,
  FaqSection,
  FleetTeaser,
  Hero,
  InsightsTeaser,
  LANDING_COPY,
  LandingSkeleton,
  StatsBand,
} from '@/components/landing';
import { ErrorPage } from '@/components/feedback';
import { ROUTES } from '@/config';
import { useStore } from '@/store';

/** Booking happens per car on /flota (plan §9 D3). */
const BOOKING_HREF = ROUTES.fleet;
const PRICING_HREF = ROUTES.pricing;

const safeJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/**
 * DOM order = mobile order (Hero → Stats → Advantage → Fleet → Insights → FAQ → CTA); flex `order` puts Stats after
 * Advantage on desktop. Each section hides itself when its data is missing.
 */
const LandingPage = observer(function LandingPage() {
  const { landing, siteSettings } = useStore();

  useEffect(() => {
    void landing.fetchLanding();
    void landing.fetchLatestPosts();
  }, [landing]);

  const origin = window.location.origin;
  const meta = (
    <>
      <title>{LANDING_COPY.seoTitle}</title>
      <meta name="description" content={LANDING_COPY.seoDescription} />
      <link rel="canonical" href={`${origin}/`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={LANDING_COPY.seoTitle} />
      <meta property="og:description" content={LANDING_COPY.seoDescription} />
      <meta property="og:url" content={`${origin}/`} />
      <meta property="og:image" content={`${origin}/images/landing/hero-fleet.webp`} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );

  const c = landing.content;
  if (!c) {
    if (landing.status === 'error') {
      return (
        <>
          {meta}
          <ErrorPage
            variant={landing.error?.variant === 'offline' ? 'offline' : 'server'}
            statusCode={landing.error?.statusCode}
            connectionError={landing.error?.variant === 'server' && landing.error.statusCode === undefined}
            requestId={landing.error?.requestId}
            onRetry={() => {
              landing.retryLanding();
              return landing.fetchLanding();
            }}
          />
        </>
      );
    }
    return (
      <>
        {meta}
        <LandingSkeleton />
      </>
    );
  }

  const s = c.sections;
  const settings = siteSettings.settings;
  // placeholder contact data until the real business details arrive (plan §9 D2)
  const school = {
    '@context': 'https://schema.org',
    '@type': 'DrivingSchool',
    name: settings.brandName,
    url: `${origin}/`,
    logo: `${origin}/images/tdv-logo.jpg`,
    inLanguage: 'ro-RO',
    ...(settings.contact.phone ? { telephone: settings.contact.phone } : {}),
    ...(settings.contact.address ? { address: settings.contact.address } : {}),
  };
  const faqPage = c.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: 'ro-RO',
        mainEntity: c.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <div className="relative flex flex-col md:gap-xl md:pb-xl">
      {meta}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(school) }} />
      {faqPage && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqPage) }} />}
      <div aria-hidden className="hidden md:block absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {s.hero && (
        <Hero hero={s.hero} bookingHref={s.hero.primaryCtaHref ?? BOOKING_HREF} pricingHref={s.hero.secondaryCtaHref ?? PRICING_HREF} />
      )}
      {c.stats.length > 0 && <StatsBand stats={c.stats} />}
      {s.advantage && c.features.length > 0 && <ExpertAdvantage section={s.advantage} features={c.features} />}
      {s.fleet && c.fleetHighlights.length > 0 && (
        <FleetTeaser section={s.fleet} highlights={c.fleetHighlights} href={s.fleet.primaryCtaHref ?? BOOKING_HREF} />
      )}
      {s.insights && (
        <InsightsTeaser
          section={s.insights}
          posts={landing.latestPosts}
          status={landing.latestStatus}
          error={landing.latestError}
          onRetry={() => {
            landing.retryLatest();
            return landing.fetchLatestPosts();
          }}
        />
      )}
      {s.faq && c.faqs.length > 0 && <FaqSection section={s.faq} faqs={c.faqs} />}
      {s.cta && <CtaBanner section={s.cta} href={s.cta.primaryCtaHref ?? BOOKING_HREF} />}
    </div>
  );
});

export default LandingPage;
