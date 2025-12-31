'use client';

import { cn } from './utils';
import { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
}

// Exact Figma values: bg-card, border, radius-xl (12px), padding 24px
export function Card({ children, className, variant = 'bordered', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-bg-card transition-colors', // radius-xl = 12px from Figma
        variant === 'bordered' && 'border border-border',
        'p-6', // 24px padding from Figma
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 space-y-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-base font-semibold leading-6 text-fg', // 16px text from Figma
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        'text-sm leading-[22.75px] text-fg-muted', // 14px text, exact line-height from Figma
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return <div className={cn('', className)} {...props}>{children}</div>;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div className={cn('mt-4 flex items-center border-t border-border pt-4', className)} {...props}>
      {children}
    </div>
  );
}
