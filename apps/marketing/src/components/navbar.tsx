'use client';

import { Button } from '@audit-log-and-activity-tracking-saas/ui';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '../lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-overlay backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-fg-on-accent"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-semibold text-fg">AuditLog</span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                href="/features"
                className="text-fg-muted hover:text-fg"
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                href="/docs"
                className="text-fg-muted hover:text-fg"
              >
                Docs
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                href="/security"
                className="text-fg-muted hover:text-fg"
              >
                Security
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                href="/pricing"
                className="text-fg-muted hover:text-fg"
              >
                Pricing
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              href={`${appUrl}/login`}
              className="hidden sm:inline-flex text-fg-muted hover:text-fg"
            >
              Sign in
            </Button>
            <Button 
              size="sm"
              variant="primary"
              href={`${appUrl}/login`}
            >
              Get started
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <Button 
              variant="ghost" 
              size="sm"
              href="/features"
              className="w-full justify-start text-fg-muted hover:text-fg"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              href="/docs"
              className="w-full justify-start text-fg-muted hover:text-fg"
              onClick={() => setIsOpen(false)}
            >
              Docs
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              href="/security"
              className="w-full justify-start text-fg-muted hover:text-fg"
              onClick={() => setIsOpen(false)}
            >
              Security
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              href="/pricing"
              className="w-full justify-start text-fg-muted hover:text-fg"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Button>
            <div className="pt-2 border-t border-border space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                href={`${appUrl}/login`}
                className="w-full justify-start text-fg-muted hover:text-fg"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Button>
              <Button 
                size="sm"
                variant="primary"
                href={`${appUrl}/login`}
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Get started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
