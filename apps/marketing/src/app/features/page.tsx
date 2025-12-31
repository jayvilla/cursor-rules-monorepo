'use client';

import { Container } from '../../components/ui/container';
import { Section } from '../../components/ui/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui';
import { MotionDiv, MotionH2, MotionP, fadeSlideUp, cardHover, staggerContainer, useReducedMotion } from '../../lib/motion';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, details, icon }: FeatureCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionDiv
      variants={prefersReducedMotion ? {} : cardHover}
      initial="rest"
      whileHover="hover"
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
    >
      <Card variant="bordered" className="h-full">
        <CardHeader>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-10">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-fg-muted">{details}</p>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}

export default function FeaturesPage() {
  const prefersReducedMotion = useReducedMotion();

  const features = [
    {
      title: 'Append-only events',
      description: 'Immutable audit trail that can never be modified or deleted.',
      details:
        'Every audit event is permanently recorded with cryptographic integrity. Once created, events cannot be modified or deleted, ensuring a complete and tamper-proof audit trail. This immutability guarantee is essential for compliance, security investigations, and legal requirements.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: 'Actor / Resource / Action model',
      description: 'Structured event model that captures who did what to which resource.',
      details:
        'Our consistent event model uses three core components: Actor (who performed the action), Resource (what was acted upon), and Action (what happened). This structure makes events easy to query, filter, and understand. Actors can be users, API keys, or system processes, while resources can be any entity in your system.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: 'Fast filtering & search',
      description: 'Filter by event type, actor, resource, date range, and more.',
      details:
        'Powerful filtering capabilities let you quickly find the events you need. Filter by action type, actor type, resource type, date ranges, and use full-text search across metadata. All queries are optimized with database indexes for fast performance, even with millions of events. Pagination with cursor-based navigation ensures efficient data retrieval.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      ),
    },
    {
      title: 'RBAC & org isolation',
      description: 'Fine-grained permissions ensure only authorized users can access audit logs.',
      details:
        'Role-based access control (RBAC) with three permission levels: Viewer, Member, and Admin. Each organization is completely isolated, ensuring data privacy and security. Viewers can read and export logs, Members can manage API keys and webhooks, and Admins have full organizational control. Perfect for compliance requirements and multi-tenant scenarios.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      title: 'CSV/JSON exports',
      description: 'Export audit logs in JSON or CSV format for compliance and analysis.',
      details:
        'Export your audit logs in industry-standard formats for compliance audits, security reviews, and data analysis. Choose between JSON for programmatic processing or CSV for spreadsheet analysis. Exports include all event data with full metadata, timestamps, and context. Perfect for regulatory reporting and forensic investigations.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Webhooks with retries',
      description: 'Get instant notifications when critical events occur.',
      details:
        'Configure webhooks to receive real-time notifications when specific events happen. Automatic retry logic ensures reliable delivery even during temporary network issues. Track delivery status, retry attempts, and failure reasons. Perfect for integrating with incident response systems, Slack notifications, or custom automation workflows.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: 'API key authentication',
      description: 'Secure programmatic access with scoped API keys.',
      details:
        'Create and manage API keys for programmatic access to your audit logs. Keys are scoped to your organization and can be rotated or revoked at any time. API keys use the x-api-key header for authentication and provide full access to create audit events. Perfect for server-side integrations and automated logging.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
    },
    {
      title: 'Session-based authentication',
      description: 'Secure cookie-based sessions for web applications.',
      details:
        'Web-based authentication uses secure HTTP-only cookies with CSRF protection. Sessions are stored server-side and automatically expire after inactivity. Supports SameSite cookie policies for enhanced security. Perfect for web dashboards and user-facing applications where users need to log in and manage their audit logs.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      title: 'Metadata & context',
      description: 'Capture rich context with flexible metadata fields.',
      details:
        'Every audit event can include custom metadata as JSON, allowing you to capture any additional context needed for your use case. Common examples include IP addresses, user agents, file sizes, request IDs, and custom business logic data. Metadata is fully searchable and can be used in filtering and exports.',
      icon: (
        <svg
          className="h-5 w-5 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container size="lg">
          <MotionDiv
            className="mb-16 text-center"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="mb-4 text-base font-normal text-fg sm:text-base">
              Everything you need for audit logging
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-fg-muted">
              A complete platform designed for engineering teams who need reliable, scalable audit trails.
            </p>
          </MotionDiv>

          <MotionDiv
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </MotionDiv>

          <MotionDiv
            className="mt-16"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered" className="text-center">
              <CardHeader>
                <CardTitle>Ready to get started?</CardTitle>
                <CardDescription>
                  Start tracking your audit events in minutes with our simple API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button variant="secondary" href="/docs">
                    View documentation
                  </Button>
                  <Button variant="primary" href="/pricing">
                    See pricing
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

