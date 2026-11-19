import { observer } from 'mobx-react-lite';
import { getSnapshot } from 'mobx-state-tree';
import { useEffect, useId, useMemo, useRef, type RefObject } from 'react';
import { Button, Dialog } from '@/components/ui';
import { BOOKING_COPY, REQUIRED_LEGEND } from '@/libs';
import { useStore } from '@/store';
import type { BookingDraft } from '@/types';
import { BookingCarSummary } from './BookingCarSummary';
import { BookingForm, type FieldRefs } from './BookingForm';
import { BookingFormAlert } from './BookingFormAlert';
import { BookingSuccess } from './BookingSuccess';

export interface BookingDialogProps {
  onClose: () => void;
}

/** 01 Dialog: centred 560px modal from md, full-screen sheet below. Reads `booking` from the store. */
export const BookingDialog = observer(function BookingDialog({ onClose }: BookingDialogProps) {
  const { booking, siteSettings } = useStore();
  const formId = useId();
  const nameId = useId();
  const fieldRefs = useRef<FieldRefs>({});
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const car = booking.car;
  const success = booking.status === 'success';

  // Dialog wants a RefObject for initial focus; the form registers fields by name after render, so read lazily.
  const firstFieldRef = useMemo<RefObject<HTMLElement | null>>(
    () => ({
      get current() {
        return fieldRefs.current.fullName ?? null;
      },
    }),
    [],
  );

  // After a failed submit attempt, move focus to the first invalid field.
  const { status, firstInvalidField } = booking;
  useEffect(() => {
    if (status === 'error' && firstInvalidField) fieldRefs.current[firstInvalidField]?.focus();
    // only when a submit settles, not on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (success) successHeadingRef.current?.focus();
  }, [success]);

  if (!car) return null;

  const errorMessage = booking.submitError ? BOOKING_COPY.errors[booking.submitError] : null;

  const footer = success ? (
    <Button onClick={onClose} block className="md:w-auto">
      {BOOKING_COPY.success.close}
    </Button>
  ) : (
    <>
      <p className="md:hidden text-label-sm text-on-surface-variant text-center">{BOOKING_COPY.footerNote}</p>
      <Button
        type="submit"
        form={formId}
        size="lg"
        block
        loading={booking.isSubmitting}
        className="md:w-auto md:px-8 md:py-3"
      >
        {booking.isSubmitting ? BOOKING_COPY.submitting : BOOKING_COPY.submit}
      </Button>
      <Button variant="ghost" onClick={onClose} disabled={booking.isSubmitting} className="hidden md:inline-flex md:order-first">
        {BOOKING_COPY.cancel}
      </Button>
    </>
  );

  return (
    <Dialog
      open={booking.isOpen}
      onClose={onClose}
      title={BOOKING_COPY.title}
      description={
        <>
          {BOOKING_COPY.description}
          <span className="sr-only"> {car.carName}</span>
        </>
      }
      size="md"
      dismissible={!booking.isSubmitting}
      initialFocusRef={firstFieldRef}
      footer={footer}
    >
      {success ? (
        <BookingSuccess
          car={car}
          draft={getSnapshot(booking.draft) as BookingDraft}
          estimate={booking.estimate}
          headingRef={successHeadingRef}
        />
      ) : (
        <div className="relative flex flex-col gap-md">
          {booking.showValidationSummary && <BookingFormAlert message={BOOKING_COPY.errors.summary} />}
          {errorMessage && (
            <BookingFormAlert
              message={errorMessage}
              action={
                booking.submitError === 'carUnavailable'
                  ? { label: BOOKING_COPY.errors.carUnavailableAction, onClick: onClose }
                  : undefined
              }
            />
          )}
          <BookingCarSummary car={car} licenseCategory={booking.licenseCategory} nameId={nameId} />
          <p className="text-label-sm text-on-surface-variant">{REQUIRED_LEGEND}</p>
          <BookingForm
            store={booking}
            privacyUrl={siteSettings.settings.privacyUrl}
            formId={formId}
            fieldRefs={fieldRefs}
          />
        </div>
      )}
    </Dialog>
  );
});
