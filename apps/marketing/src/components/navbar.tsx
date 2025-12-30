'use client';

import { Button } from './ui/button';
import { Container } from './ui/container';
import { cn } from '../lib/utils';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--bg))]/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-lg font-semibold text-[hsl(var(--foreground))] transition-opacity hover:opacity-80"
          >
            <span>AuditLog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/features"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Docs
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" href="/login">
                Log in
              </Button>
              <Button variant="default" size="sm" href="/signup">
                Get started
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-[hsl(var(--foreground))]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 md:hidden',
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="mt-4 flex flex-col space-y-4">
            <Link
              href="/features"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
              onClick={() => setIsOpen(false)}
            >
              Docs
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                href="/login"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Button>
              <Button
                variant="default"
                size="sm"
                href="/signup"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}

