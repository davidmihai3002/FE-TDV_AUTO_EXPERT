import { Icon } from '@/components/ui';
import { A11Y_LABELS } from '@/config';

export interface FleetNoticeProps {
  message: string;
  onDismiss: () => void;
}

export function FleetNotice({ message, onDismiss }: FleetNoticeProps) {
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-surface-container border border-outline-variant text-body-md text-on-surface"
    >
      <Icon name="info" size={20} className="text-secondary mt-0.5" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={A11Y_LABELS.close}
        className="-m-1 p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high"
      >
        <Icon name="close" size={20} />
      </button>
    </div>
  );
}
