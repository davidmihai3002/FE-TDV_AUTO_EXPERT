import { Button, Icon } from '@/components/ui';

export interface BookingFormAlertProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

export function BookingFormAlert({ message, action }: BookingFormAlertProps) {
  return (
    <div role="alert" className="flex flex-col gap-2 p-3 rounded-lg bg-error-container text-on-error-container text-label-md">
      <p className="flex items-start gap-2">
        <Icon name="error" size={18} className="mt-px" />
        {message}
      </p>
      {action && (
        <Button variant="ghost" size="sm" onClick={action.onClick} className="self-start text-on-error-container">
          {action.label}
        </Button>
      )}
    </div>
  );
}
