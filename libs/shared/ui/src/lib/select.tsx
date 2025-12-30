'use client';

import React from 'react';
import { cn } from './utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-lg border bg-[hsl(var(--card))] px-3 py-2 pr-10 text-sm text-[hsl(var(--foreground))]',
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
        >
          {children}
        </select>
        <div
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]',
            error && 'text-[hsl(var(--accent2))]'
          )}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

