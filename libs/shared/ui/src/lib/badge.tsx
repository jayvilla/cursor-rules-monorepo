'use client';

import { cn } from './utils';
import { ReactNode, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'info' | 'accent';
  size?: 'sm' | 'md';
}

// Based on Figma status tags with colored dots
const variantClasses = {
  default: 'bg-bg-card text-fg border-border',
  success: 'bg-bg-card text-semantic-success border-border',
  info: 'bg-bg-card text-semantic-info border-border',
  accent: 'bg-accent-10 text-accent border-border',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs leading-4', // 12px text
  md: 'px-2.5 py-1 text-xs leading-4', // 12px text
};

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'sm',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-normal',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
