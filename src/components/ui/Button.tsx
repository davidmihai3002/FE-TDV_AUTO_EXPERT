import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Link, type LinkProps } from 'react-router';
import { buttonClasses, type ButtonRadius, type ButtonSize, type ButtonVariant } from './button-classes';
import { Icon } from './Icon';


interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Gold glow (primary only, hero CTA). */
  glow?: boolean;
  /** `responsive` = 8px on mobile, 2px from md up. */
  radius?: ButtonRadius;
  leadingIcon?: string;
  trailingIcon?: string;
  loading?: boolean;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = ButtonBaseProps & { to: string } & Omit<LinkProps, 'to' | 'className' | 'children'>;
type AnchorButtonProps = ButtonBaseProps & { href: string; external?: boolean } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'className' | 'children' | 'href'
  >;
type NativeButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { ref?: Ref<HTMLButtonElement> };

export type ButtonProps = LinkButtonProps | AnchorButtonProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    block,
    glow,
    radius,
    leadingIcon,
    trailingIcon,
    loading = false,
    className,
    children,
    ...rest
  } = props;
  const classes = buttonClasses({ variant, size, block, glow, radius, className });
  const content = (
    <>
      {loading ? (
        <Icon name="progress_activity" size={18} className="animate-spin" />
      ) : (
        leadingIcon && <Icon name={leadingIcon} size={18} />
      )}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={18} />}
    </>
  );

  if ('to' in rest) {
    return (
      <Link className={classes} aria-busy={loading || undefined} {...rest}>
        {content}
      </Link>
    );
  }
  if ('href' in rest) {
    const { external, ...anchor } = rest;
    return (
      <a
        className={classes}
        aria-busy={loading || undefined}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...anchor}
      >
        {content}
      </a>
    );
  }
  const native = rest as Omit<NativeButtonProps, keyof ButtonBaseProps>;
  return (
    <button
      type="button"
      className={classes}
      aria-busy={loading || undefined}
      {...native}
      disabled={native.disabled || loading}
    >
      {content}
    </button>
  );
}
