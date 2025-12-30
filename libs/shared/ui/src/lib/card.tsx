import { cn } from './utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
}

const variantClasses = {
  default: 'bg-[hsl(var(--card))]',
  elevated:
    'bg-[hsl(var(--card))] shadow-lg shadow-black/20 border border-[hsl(var(--border))]',
  bordered: 'bg-[hsl(var(--card))] border border-[hsl(var(--border))]',
};

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 space-y-1.5', className)}>{children}</div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-xl font-semibold leading-none tracking-tight text-[hsl(var(--card-foreground))]',
        className
      )}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        'text-sm text-[hsl(var(--muted-foreground))]',
        className
      )}
    >
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 flex items-center', className)}>{children}</div>
  );
}

