import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import {
  DockedQuoteBar,
  LiveEstimatePanel,
  PricingDesktopForm,
  PricingEmpty,
  PricingError,
  PricingIntro,
  PricingSkeleton,
  PricingWizard,
} from '@/components/pricing';
import { ROUTES } from '@/config';
import {
  PRICING_COPY,
  STEPS,
  parsePricingSearchParams,
  toPricingSearchParams,
  useMediaQuery,
} from '@/libs';
import { useStore } from '@/store';

const LG_UP = '(min-width: 1024px)';

/** Desktop (≥1024): one long form + sticky "Estimare live". Below: 5-step wizard + docked quote bar. */
const PricingPage = observer(function PricingPage() {
  const { pricing: store } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const isDesktop = useMediaQuery(LG_UP);
  const initialUrl = useRef(parsePricingSearchParams(searchParams));

  useEffect(() => {
    void store.fetchOptions(initialUrl.current);
    return () => store.dispose();
  }, [store]);

  // keep the selection in the URL (shareable, survives reload and Back from /flota)
  const urlSelection = store.urlSelection;
  const targetQuery = store.optionsStatus === 'ready' && urlSelection.vehicleSlug ? toPricingSearchParams(urlSelection).toString() : null;
  useEffect(() => {
    if (targetQuery !== null && targetQuery !== searchParams.toString()) {
      setSearchParams(new URLSearchParams(targetQuery), { replace: true });
    }
  }, [targetQuery, searchParams, setSearchParams]);

  // the docked bar must never cover the focused field (mobile)
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollPaddingBottom;
    html.style.scrollPaddingBottom = '180px';
    return () => {
      html.style.scrollPaddingBottom = previous;
    };
  }, []);

  const ready = store.optionsStatus === 'ready' && !store.isEmpty;
  const loading = store.optionsStatus === 'idle' || store.optionsStatus === 'loading';
  const bookAriaLabel = store.selectedVehicle
    ? PRICING_COPY.cta.bookAria(store.selectedVehicle.carName, store.selection.lessons)
    : undefined;
  const checkFailed = store.quoteStatus === 'error';
  const origin = window.location.origin;

  const meta = (
    <>
      <title>{PRICING_COPY.meta.title}</title>
      <meta name="description" content={PRICING_COPY.meta.description} />
      <link rel="canonical" href={`${origin}${ROUTES.pricing}`} />
      <meta property="og:title" content={PRICING_COPY.meta.title} />
      <meta property="og:description" content={PRICING_COPY.meta.description} />
    </>
  );

  const body = (variant: 'desktop' | 'mobile') =>
    store.optionsStatus === 'error' ? (
      <PricingError
        onRetry={() => {
          store.retry();
          void store.fetchOptions(initialUrl.current);
        }}
      />
    ) : loading ? (
      <PricingSkeleton variant={variant} />
    ) : store.isEmpty ? (
      <PricingEmpty />
    ) : variant === 'desktop' ? (
      <PricingDesktopForm store={store} />
    ) : (
      <PricingWizard store={store} />
    );

  const carGone = store.carGone && (
    <p role="status" className="p-4 rounded-lg bg-surface-container border border-outline-variant text-body-md text-on-surface">
      {PRICING_COPY.estimate.carGone}
    </p>
  );

  if (isDesktop) {
    return (
      <div className="max-w-7xl mx-auto w-full px-margin-desktop pt-8 pb-xl grid grid-cols-12 gap-gutter">
        {meta}
        <div className="col-span-8 flex flex-col gap-xl">
          <PricingIntro variant="desktop" />
          {carGone}
          {body('desktop')}
        </div>
        {store.optionsStatus !== 'error' && !store.isEmpty && (
          <div className="col-span-4 relative">
            <LiveEstimatePanel
              breakdown={store.breakdownVM}
              isRecalculating={store.quoteStatus === 'loading'}
              checkFailed={checkFailed}
              bookingHref={store.bookingHref}
              bookAriaLabel={bookAriaLabel}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-margin-mobile pt-7 pb-[200px] flex flex-col gap-lg">
      {meta}
      <PricingIntro variant="mobile" />
      {carGone}
      {body('mobile')}
      {ready && (
        <DockedQuoteBar
          breakdown={store.breakdownVM}
          checkFailed={checkFailed}
          isFirstStep={store.isFirstStep}
          isLastStep={store.isLastStep}
          canGoNext={store.isStepValid(STEPS[store.currentStep])}
          bookingHref={store.bookingHref}
          bookAriaLabel={bookAriaLabel}
          onBack={store.back}
          onNext={store.next}
          onReset={store.reset}
        />
      )}
    </div>
  );
});

export default PricingPage;
