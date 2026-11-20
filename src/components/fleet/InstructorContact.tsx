import { Icon } from '@/components/ui';
import { formatPhone } from '@/libs';
import type { Instructor } from '@/types';
import { FLEET_COPY } from './fleet-copy';

export interface InstructorContactProps {
  instructor: Instructor;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export function InstructorContact({ instructor }: InstructorContactProps) {
  const phone = formatPhone(instructor.phoneNumber);
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-3 pt-3 mb-4 border-t border-outline-variant">
      {instructor.photoUrl ? (
        <img
          src={instructor.photoUrl}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          className="size-8 rounded-[9999px] object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="size-8 shrink-0 rounded-[9999px] bg-surface-container-high flex items-center justify-center text-label-sm font-bold text-primary-container"
        >
          {initials(instructor.fullName)}
        </span>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-body-md text-on-surface truncate">{instructor.fullName}</span>
        <span className="text-label-sm text-on-surface-variant">{FLEET_COPY.instructor.label}</span>
      </div>
      {phone && (
        <a
          href={phone.href}
          aria-label={FLEET_COPY.instructor.callAria(instructor.fullName, phone.display)}
          className="basis-full md:basis-auto md:ml-auto inline-flex items-center gap-1 text-label-md text-secondary hover:text-secondary-container hover:underline whitespace-nowrap"
        >
          <Icon name="call" size={18} />
          {phone.display}
        </a>
      )}
    </div>
  );
}
