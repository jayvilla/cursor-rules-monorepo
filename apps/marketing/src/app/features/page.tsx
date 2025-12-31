'use client';

import { Database, Shield, Search, Webhook, Download, Users } from 'lucide-react';
import { Card } from '@audit-log-and-activity-tracking-saas/ui';

const features = [
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
    description: 'Powerful query language with time-range filters, full-text search, and advanced field filtering for quick investigation.',
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
];

export default function FeaturesPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold text-fg sm:text-4xl">
            Everything you need for audit logging
          </h2>
          <p className="text-fg-muted text-lg">
            A complete platform designed for engineering teams who need reliable, 
            scalable audit trails.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                variant="bordered"
                className="group relative overflow-hidden bg-bg-card/50 backdrop-blur-sm p-6 hover:bg-bg-card/80 transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-fg">{feature.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Subtle hover effect */}
                <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/10 rounded-lg transition-colors duration-300" />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

