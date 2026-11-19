import { observer } from 'mobx-react-lite';
import type { FormEvent, RefObject } from 'react';
import { Checkbox, DateInput, Input, Select, Textarea } from '@/components/ui';
import {
  BOOKING_COPY,
  BOOKING_MAX_DAYS_AHEAD,
  FULL_NAME_MAX,
  MESSAGE_MAX,
  addDaysIso,
  bucharestTodayIso,
  pluralRo,
} from '@/libs';
import type { BookingStoreInstance } from '@/store';
import type { BookingField, BookingTimeSlot } from '@/types';
import { BookingEstimate } from './BookingEstimate';

export type FieldRefs = Partial<Record<BookingField, HTMLElement | null>>;

export interface BookingFormProps {
  store: BookingStoreInstance;
  privacyUrl: string | null;
  formId: string;
  fieldRefs: RefObject<FieldRefs>;
}

const C = BOOKING_COPY.fields;
const SLOT_OPTIONS = (Object.keys(BOOKING_COPY.slots) as BookingTimeSlot[]).map((v) => ({
  value: v,
  label: BOOKING_COPY.slots[v],
}));

export const BookingForm = observer(function BookingForm({ store, privacyUrl, formId, fieldRefs }: BookingFormProps) {
  const { draft, fieldErrors: errors } = store;
  const disabled = store.isSubmitting;
  const today = bucharestTodayIso();
  const reg = (key: BookingField) => (el: HTMLElement | null) => {
    fieldRefs.current[key] = el;
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void store.submit();
  }

  return (
    <form id={formId} noValidate onSubmit={onSubmit} className="flex flex-col gap-md">
      <Input
        ref={reg('fullName')}
        label={C.fullName.label}
        required
        autoComplete="name"
        maxLength={FULL_NAME_MAX}
        placeholder={C.fullName.placeholder}
        value={draft.fullName}
        readOnly={disabled}
        error={errors.fullName}
        onChange={(e) => store.setField('fullName', e.target.value)}
        onBlur={() => store.blurField('fullName')}
      />
      <Input
        ref={reg('phone')}
        label={C.phone.label}
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder={C.phone.placeholder}
        hint={C.phone.hint}
        value={draft.phone}
        readOnly={disabled}
        error={errors.phone}
        onChange={(e) => store.setField('phone', e.target.value)}
        onBlur={() => store.blurField('phone')}
      />
      <Input
        ref={reg('email')}
        label={C.email.label}
        type="email"
        autoComplete="email"
        placeholder={C.email.placeholder}
        value={draft.email}
        readOnly={disabled}
        error={errors.email}
        onChange={(e) => store.setField('email', e.target.value)}
        onBlur={() => store.blurField('email')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <DateInput
          ref={reg('preferredDate')}
          label={C.preferredDate.label}
          required
          min={addDaysIso(today, 1)}
          max={addDaysIso(today, BOOKING_MAX_DAYS_AHEAD)}
          value={draft.preferredDate}
          readOnly={disabled}
          error={errors.preferredDate}
          onChange={(e) => store.setField('preferredDate', e.target.value)}
          onBlur={() => store.blurField('preferredDate')}
        />
        <Select
          ref={reg('preferredTimeSlot')}
          label={C.preferredTimeSlot.label}
          required
          placeholder={C.preferredTimeSlot.placeholder}
          options={SLOT_OPTIONS}
          value={draft.preferredTimeSlot}
          disabled={disabled}
          error={errors.preferredTimeSlot}
          onChange={(e) => store.setField('preferredTimeSlot', e.target.value as BookingTimeSlot | '')}
          onBlur={() => store.blurField('preferredTimeSlot')}
        />
      </div>
      <div className="flex flex-col gap-sm">
        <Select
          ref={reg('lessonsCount')}
          label={C.lessonsCount.label}
          placeholder={C.lessonsCount.none}
          placeholderDisabled={false}
          hint={C.lessonsCount.hint}
          options={store.lessonOptions.map((n) => ({ value: String(n), label: pluralRo(n, 'lecție', 'lecții') }))}
          value={draft.lessonsCount == null ? '' : String(draft.lessonsCount)}
          disabled={disabled}
          error={errors.lessonsCount}
          onChange={(e) => store.setField('lessonsCount', e.target.value ? Number(e.target.value) : null)}
        />
        <BookingEstimate status={store.estimateStatus} estimate={store.estimate} />
      </div>
      <Textarea
        ref={reg('message')}
        label={C.message.label}
        maxLength={MESSAGE_MAX}
        placeholder={C.message.placeholder}
        value={draft.message}
        readOnly={disabled}
        error={errors.message}
        onChange={(e) => store.setField('message', e.target.value)}
        onBlur={() => store.blurField('message')}
      />
      <Checkbox
        ref={reg('gdprConsent')}
        required
        checked={draft.gdprConsent}
        disabled={disabled}
        error={errors.gdprConsent}
        onChange={(e) => store.setField('gdprConsent', e.target.checked)}
        label={
          <>
            {C.gdpr.before}
            {privacyUrl ? (
              <a
                href={privacyUrl}
                target="_blank"
                rel="noopener"
                className="text-secondary underline hover:text-secondary-container"
                onClick={(e) => e.stopPropagation()}
              >
                {C.gdpr.link}
                <span className="sr-only">{C.gdpr.newTab}</span>
              </a>
            ) : (
              C.gdpr.link
            )}
            {C.gdpr.after}
          </>
        }
      />
      {/* honeypot: hidden from users and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {C.website}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={draft.website}
            onChange={(e) => store.setField('website', e.target.value)}
          />
        </label>
      </div>
    </form>
  );
});
