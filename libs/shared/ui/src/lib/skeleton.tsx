'use client';

import React from 'react';
import { cn } from './utils';

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => {
    const variantClasses = {
      text: 'h-4 rounded-sm',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-bg-ui-30', // Using UI element background from Figma
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
