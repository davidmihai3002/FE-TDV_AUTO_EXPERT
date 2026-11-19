import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { A11Y_LABELS } from '@/config';
import { cn, getFocusable, useFocusTrap, useLockBodyScroll } from '@/libs';
import { Icon } from './Icon';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  /** Desktop width; mobile is always a full-screen sheet. */
  size?: 'sm' | 'md' | 'lg';
  /** Esc, backdrop click and the close button. */
  dismissible?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  footer?: ReactNode;
  role?: 'dialog' | 'alertdialog';
  className?: string;
  children: ReactNode;
}

const SIZES = { sm: 'md:max-w-[400px]', md: 'md:max-w-[560px]', lg: 'md:max-w-[720px]' } as const;
const EXIT_MS = 150;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Controlled modal on top of the native `<dialog>` (top layer, inert background, Esc via `cancel`). */
export function Dialog(props: DialogProps) {
  // Nothing is mounted while closed, so form state resets on reopen unless the parent keeps it.
  if (!props.open) return null;
  return <DialogPanel {...props} />;
}

function DialogPanel({
  onClose,
  title,
  description,
  size = 'md',
  dismissible = true,
  initialFocusRef,
  footer,
  role = 'dialog',
  className,
  children,
}: DialogProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);

  useLockBodyScroll(true);
  useFocusTrap([dialogRef], true);

  const requestClose = useCallback(() => {
    if (!dismissible || closing) return;
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    setClosing(true);
    window.setTimeout(onClose, EXIT_MS);
  }, [dismissible, closing, onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();

    const target =
      initialFocusRef?.current ?? (bodyRef.current ? getFocusable(bodyRef.current)[0] : undefined) ?? closeRef.current;
    target?.focus();

    return () => {
      if (dialog.open) dialog.close();
      opener?.focus?.();
    };
    // run once per open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onCancel(e: React.SyntheticEvent<HTMLDialogElement>) {
    // Native Esc handling: always prevent so React state stays the source of truth
    e.preventDefault();
    requestClose();
  }

  function onBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target !== dialogRef.current) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return; // no visible backdrop on the mobile sheet
    const r = dialogRef.current.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) requestClose();
  }

  return (
    <dialog
      ref={dialogRef}
      role={role === 'alertdialog' ? 'alertdialog' : undefined}
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-desc` : undefined}
      onCancel={onCancel}
      onClick={onBackdropClick}
      className={cn(
        // reset native dialog styles
        'p-0 border-0 text-on-surface bg-surface-container-low overflow-hidden flex flex-col',
        // mobile: full-screen sheet
        'fixed inset-0 w-full h-dvh max-w-none max-h-none m-0 rounded-none',
        // desktop: centred panel
        'md:m-auto md:h-fit md:w-[calc(100%-2*var(--spacing-margin-desktop))] md:max-h-[min(90dvh,840px)]',
        'md:rounded-xl md:border md:border-outline-variant/30 md:shadow-deep',
        SIZES[size],
        // motion: enter via @starting-style, exit via `closing`
        'transition-[opacity,translate,scale] duration-200 ease-out',
        'starting:opacity-0 starting:translate-y-4 md:starting:translate-y-0 md:starting:scale-[0.98]',
        closing && 'opacity-0 translate-y-4 md:translate-y-0 md:scale-[0.98] duration-150',
        className,
      )}
    >
      <header className="sticky top-0 flex items-start justify-between gap-md px-margin-mobile py-4 md:px-md md:py-md border-b border-outline-variant/30 bg-surface-container-low">
        <div>
          <h2 id={`${id}-title`} className="text-headline-md text-primary">
            {title}
          </h2>
          {description && (
            <div id={`${id}-desc`} className="text-body-md text-on-surface-variant mt-1">
              {description}
            </div>
          )}
        </div>
        {dismissible && (
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label={A11Y_LABELS.close}
            className="shrink-0 p-2 -mr-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <Icon name="close" />
          </button>
        )}
      </header>
      <div ref={bodyRef} className="flex-1 overflow-y-auto px-margin-mobile py-md md:px-md">
        {children}
      </div>
      {footer && (
        <footer className="sticky bottom-0 flex flex-col-reverse md:flex-row md:justify-end gap-sm px-margin-mobile pt-4 pb-[max(16px,env(safe-area-inset-bottom))] md:px-md md:py-4 border-t border-outline-variant/30 bg-surface-container-low">
          {footer}
        </footer>
      )}
    </dialog>
  );
}
