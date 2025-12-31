'use client';

import { Button } from '@audit-log-and-activity-tracking-saas/ui';
import { Card } from '@audit-log-and-activity-tracking-saas/ui';
import { ArrowRight, Play } from 'lucide-react';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AuditLog',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Premium audit log and activity tracking solution for development teams. Track user activities, API usage, and system events with secure, immutable audit trails.',
      url: siteUrl,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-gradient-from to-bg-gradient-to">
        <div className="absolute inset-0 bg-gradient-radial-purple" />
        <div className="absolute inset-0 bg-gradient-radial-blue" />
      </div>
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-fg-muted">Trusted by engineering teams at scale</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-fg sm:text-6xl">
            Audit logs you can trust.
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-fg-muted mb-10 leading-relaxed">
            Append-only audit events with powerful filtering, RBAC, webhooks, and exports.
            Built for engineering teams and regulated companies that need reliable activity tracking.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="primary" href={`${appUrl}/login`} className="gap-2 group">
              View Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button size="lg" variant="secondary" href="/docs" className="gap-2 border-border hover:bg-bg-card">
              <Play className="h-4 w-4" />
              Read Docs
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-xs text-fg-muted">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-semantic-success" />
              SOC 2 Type II
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-semantic-info" />
              GDPR Compliant
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-semantic-purple" />
              99.99% Uptime
            </div>
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="mt-20 mx-auto max-w-5xl">
          <Card variant="bordered" className="p-2 shadow-accent bg-bg-card/50 backdrop-blur-sm">
            <div className="aspect-[16/10] rounded-md bg-gradient-to-br from-bg-gradient-from to-bg-gradient-to overflow-hidden border border-border">
              <div className="p-6 space-y-4">
                {/* Mock header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="h-3 w-32 rounded-sm bg-bg-ui-50" />
                  <div className="flex gap-2">
                    <div className="h-3 w-20 rounded-sm bg-bg-ui-30" />
                    <div className="h-3 w-20 rounded-sm bg-accent-30" />
                  </div>
                </div>
                {/* Mock rows */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 opacity-70" style={{ opacity: 1 - i * 0.12 }}>
                    <div className="h-2 w-24 rounded-sm bg-bg-ui-40" />
                    <div className="h-2 flex-1 rounded-sm bg-bg-ui-30" />
                    <div className="h-2 w-16 rounded-sm bg-bg-ui-20" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

