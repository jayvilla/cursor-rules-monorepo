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
          'flex h-10 w-full rounded-lg border bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--foreground))]',
          'placeholder:text-[hsl(var(--muted-foreground))]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent2))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          error
            ? 'border-[hsl(var(--accent2))] focus-visible:ring-[hsl(var(--accent2))]'
            : 'border-[hsl(var(--border))] hover:border-[hsl(var(--muted))]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

