'use client';

import React from 'react';
import { cn } from './utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--foreground))]',
          'placeholder:text-[hsl(var(--muted-foreground))]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent2))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors resize-y',
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

Textarea.displayName = 'Textarea';

