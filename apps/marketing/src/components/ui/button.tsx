import { cn } from '../../lib/utils';
import { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

interface BaseButtonProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'accent2' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
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

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses = {
  default:
    'bg-[hsl(var(--foreground))] text-[hsl(var(--bg))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
  accent:
    'bg-[hsl(var(--accent2))] text-[hsl(var(--accent2-foreground))] hover:opacity-90',
  accent2:
    'bg-[hsl(var(--accent2))] text-[hsl(var(--accent2-foreground))] hover:opacity-90',
  outline:
    'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))]',
  ghost:
    'bg-transparent hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  className,
  variant = 'default',
  size = 'md',
  href,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent2))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))] disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    const { onClick, ...linkProps } = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={baseClasses} onClick={onClick} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

