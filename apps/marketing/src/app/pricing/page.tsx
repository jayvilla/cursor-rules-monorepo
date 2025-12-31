'use client';

import { Check } from 'lucide-react';
import { Button } from '@audit-log-and-activity-tracking-saas/ui';

export default function PricingPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/month',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 10,000 events/month',
        '7-day data retention',
        'Basic filtering and search',
        'Email support',
        'API access',
      ],
      cta: 'Get started',
      ctaVariant: 'secondary' as const,
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'For growing teams with advanced needs',
      features: [
        'Up to 1,000,000 events/month',
        '90-day data retention',
        'Advanced filtering and search',
        'Webhook integrations',
        'Priority email support',
        'Custom metadata fields',
        'Export capabilities',
      ],
      cta: 'Start free trial',
      ctaVariant: 'primary' as const,
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For organizations with specific requirements',
      features: [
        'Unlimited events',
        'Custom retention periods',
        'Dedicated support',
        'SLA guarantees',
        'Custom integrations',
        'On-premise options',
        'Compliance assistance',
        'Custom contracts',
      ],
      cta: 'Contact sales',
      ctaVariant: 'secondary' as const,
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6 text-4xl font-bold text-fg sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="text-fg-muted text-lg">
              Choose the plan that fits your needs. All plans include our core
              audit logging features with no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border bg-bg-card p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-accent shadow-lg shadow-accent/5'
                  : 'border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs text-fg-on-accent">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-fg">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-semibold tracking-tight text-fg">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-fg-muted">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-fg-muted">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-fg-muted">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.ctaVariant}
                className="w-full"
                href={plan.highlighted ? `${appUrl}/login` : '#'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-24 pt-24 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center text-fg">
              Frequently asked questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold mb-2 text-fg">
                  What counts as an event?
                </h3>
                <p className="text-sm text-fg-muted">
                  An event is any action logged to your audit trail. This
                  includes user actions, system events, API calls, and any
                  custom events you track.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-fg">
                  Can I upgrade or downgrade at any time?
                </h3>
                <p className="text-sm text-fg-muted">
                  Yes. You can change your plan at any time. Upgrades take
                  effect immediately, while downgrades apply at the end of your
                  current billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-fg">
                  What happens if I exceed my event limit?
                </h3>
                <p className="text-sm text-fg-muted">
                  We'll notify you when you approach your limit. You can choose
                  to upgrade your plan or we'll continue logging events at a
                  reduced rate to ensure you never lose critical data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-fg">
                  Do you offer custom enterprise plans?
                </h3>
                <p className="text-sm text-fg-muted">
                  Absolutely. Our Enterprise plan is fully customizable to meet
                  your organization's specific compliance, security, and
                  integration requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

