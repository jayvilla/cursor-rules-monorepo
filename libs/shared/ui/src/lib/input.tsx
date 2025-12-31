'use client';

import React from 'react';
import { cn } from './utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border bg-bg-card px-3 py-2 text-sm text-fg',
          'placeholder:text-fg-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          error
            ? 'border-accent focus-visible:ring-accent'
            : 'border-border hover:border-accent-30',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
