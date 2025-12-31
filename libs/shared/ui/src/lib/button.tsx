'use client';

import { cn } from './utils';
import { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

interface BaseButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

interface ButtonAsButtonProps
  extends BaseButtonProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface ButtonAsLinkProps
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

// Exact Figma values
const variantClasses = {
  primary:
    'bg-accent text-fg-on-accent hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-bg border border-border text-fg hover:bg-bg-card active:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-fg hover:bg-bg-card active:bg-bg-card disabled:opacity-50',
};

// Exact Figma values: md = 40px height, sm = 32px, lg = 48px
const sizeClasses = {
  sm: 'h-8 px-3 text-sm font-medium leading-5', // 32px height, 14px text
  md: 'h-10 px-4 text-sm font-medium leading-5', // 40px height, 14px text (Figma)
  lg: 'h-12 px-6 text-base font-medium leading-6', // 48px height, 16px text
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  href,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150', // rounded-md = 8px from Figma
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    const { onClick, ...linkProps } = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={baseClasses} onClick={onClick} {...linkProps}>
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
