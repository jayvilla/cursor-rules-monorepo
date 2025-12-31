'use client';

import { Container } from '../../components/ui/container';
import { Section } from '../../components/ui/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MotionDiv, MotionH2, MotionP, fadeSlideUp, useReducedMotion } from '../../lib/motion';

export default function PricingPage() {
  const prefersReducedMotion = useReducedMotion();

  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: 'month',
      description: 'Perfect for small teams getting started',
      badge: null,
      features: [
        'Up to 10,000 events/month',
        '7-day data retention',
        'Basic filtering and search',
        'Email support',
        'API access',
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$99',
      period: 'month',
      description: 'For growing teams with advanced needs',
      badge: 'Popular',
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
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For organizations with specific requirements',
      badge: null,
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
      highlighted: false,
    },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container size="lg">
          <MotionDiv
            className="mx-auto max-w-3xl text-center"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="mb-4 text-4xl font-bold text-fg sm:text-5xl">
              Pricing
            </h1>
            <p className="mb-8 text-lg text-fg-muted">
              Choose the plan that fits your team's needs. All plans include our core audit logging
              features.
            </p>
            <div className="mb-12 rounded-lg bg-bg-ui-20 p-4 text-sm text-fg-muted">
              <strong className="text-fg">Note:</strong> This is an example
              pricing structure. Actual pricing may vary. Contact us for current pricing
              information.
            </div>
          </MotionDiv>

          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier, index) => (
              <MotionDiv
                key={tier.name}
                variants={prefersReducedMotion ? {} : fadeSlideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant={tier.highlighted ? 'elevated' : 'bordered'}
                  className={`relative h-full ${tier.highlighted ? 'border-accent' : ''}`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="default">{tier.badge}</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-fg">
                          {tier.price}
                        </span>
                        {tier.period && (
                          <span className="text-sm text-fg-muted">
                            /{tier.period}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="mt-2">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-6 space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-sm">
                          <svg
                            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-fg-muted">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={tier.highlighted ? 'primary' : 'secondary'}
                      className="w-full"
                      href="/signup"
                    >
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </div>

          <MotionDiv
            className="mt-16"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered" className="text-center">
              <CardHeader>
                <CardTitle>Questions about pricing?</CardTitle>
                <CardDescription>
                  Our team is here to help you choose the right plan for your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button variant="secondary" href="/contact">
                    Contact sales
                  </Button>
                  <Button variant="primary" href="/docs">
                    View documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </Container>
      </Section>
    </>
  );
}

