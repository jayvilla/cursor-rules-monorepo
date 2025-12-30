import { cn } from './utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'accent2' | 'muted';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default:
    'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]',
  accent:
    'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-[hsl(var(--border))]',
  accent2:
    'bg-[hsl(var(--accent2))] text-[hsl(var(--accent2-foreground))] border-[hsl(var(--border))]',
  muted:
    'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

