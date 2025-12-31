'use client';

import { Button, Card } from '@audit-log-and-activity-tracking-saas/ui';
import { ArrowRight, Play, Database, Users, Search, Webhook, Download, Shield } from 'lucide-react';
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
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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
            {/* Badge - Exact Figma: rounded-pill, bg-bg-card/50, border, 12px text */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-pill border border-border bg-bg-card/50 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-fg-muted">Trusted by engineering teams at scale</span>
            </div>

            {/* Headline - Exact Figma: 16px, regular weight, centered */}
            <h1 className="mb-6 text-base font-regular text-fg">
              Audit logs you can trust.
            </h1>

            {/* Subheadline - Exact Figma: 18px, line-height 29.25px, muted */}
            <p className="text-lg-alt text-fg-muted mb-10">
              Append-only audit events with powerful filtering, RBAC, webhooks, and exports. Built for engineering teams and regulated companies that need reliable activity tracking.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="md" variant="primary" href={`${appUrl}/login`} className="gap-2 group">
                View Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="md" variant="secondary" href="/docs" className="gap-2">
                <Play className="h-4 w-4" />
                Read Docs
              </Button>
            </div>

            {/* Social proof - Exact Figma: 12px text, 8px dots */}
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

          {/* Dashboard preview mockup - Exact Figma dimensions */}
          <div className="mt-20 mx-auto max-w-[1024px]">
            <Card variant="bordered" className="p-[9px] shadow-accent bg-bg-card/50 backdrop-blur-sm">
              <div className="bg-gradient-to-b from-bg-gradient-from to-bg-gradient-to border border-border rounded-lg p-6 h-[628.75px] flex flex-col">
                {/* Mock header */}
                <div className="flex items-center justify-between pb-1 border-b border-border mb-4">
                  <div className="h-3 w-32 rounded-sm bg-bg-ui-50" />
                  <div className="flex gap-2">
                    <div className="h-3 w-20 rounded-sm bg-bg-ui-30" />
                    <div className="h-3 flex-1 rounded-sm bg-accent-30" />
                  </div>
                </div>
                {/* Mock rows - Exact Figma opacity values */}
                {[...Array(6)].map((_, i) => {
                  const opacity = i === 0 ? 1 : i === 1 ? 0.88 : i === 2 ? 0.76 : i === 3 ? 0.64 : i === 4 ? 0.52 : 0.4;
                  return (
                    <div key={i} className="flex gap-4 mb-4" style={{ opacity }}>
                      <div className="h-2 w-24 rounded-sm bg-bg-ui-40" />
                      <div className="h-2 flex-1 rounded-sm bg-bg-ui-30" />
                      <div className="h-2 w-16 rounded-sm bg-bg-ui-20" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-bg">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            {/* Heading - Exact Figma: 16px, regular weight, centered */}
            <h2 className="mb-4 text-base font-regular text-fg">
              Everything you need for audit logging
            </h2>
            {/* Description - Exact Figma: 18px, line-height 28px, muted */}
            <p className="text-lg text-fg-muted">
              A complete platform designed for engineering teams who need reliable, scalable audit trails.
            </p>
          </div>

          {/* Feature Cards Grid - Exact Figma: 3 columns, gap-4 */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Database,
                title: 'Append-only audit events',
                description: 'Immutable event stream ensures data integrity. Events can never be modified or deleted once written.',
              },
              {
                icon: Users,
                title: 'Actor / Resource / Action model',
                description: 'Structured event model captures who did what to which resource, with full context and metadata.',
              },
              {
                icon: Search,
                title: 'Filtering and search',
                description: 'Powerful query language with time-range filters, full-text search, and advanced field filtering.',
              },
              {
                icon: Webhook,
                title: 'Webhooks',
                description: 'Real-time event streaming to your endpoints. Configure filters and retry policies.',
              },
              {
                icon: Download,
                title: 'Exports',
                description: 'Export audit logs in JSON, CSV, or structured formats. Schedule automated exports to S3.',
              },
              {
                icon: Shield,
                title: 'Compliance readiness',
                description: 'Built-in support for SOC 2, GDPR, HIPAA, and other compliance frameworks.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border border-border bg-bg-card/50 backdrop-blur-sm p-6 hover:bg-bg-card/80 hover:border-accent/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
                >
                  {/* Icon - Exact Figma: 40px container, 20px icon, bg-accent-10 */}
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-10 text-accent group-hover:bg-accent-30 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  {/* Title - Exact Figma: 16px, regular weight */}
                  <h3 className="mb-2 text-base font-regular text-fg group-hover:text-fg transition-colors duration-300">{feature.title}</h3>
                  {/* Description - Exact Figma: 14px, line-height 22.75px, muted */}
                  <p className="text-sm leading-[22.75px] text-fg-muted">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
