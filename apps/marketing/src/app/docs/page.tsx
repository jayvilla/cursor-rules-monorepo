'use client';

import { Container } from '../../components/ui/container';
import { Section } from '../../components/ui/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { MotionDiv, MotionH2, MotionP, fadeSlideUp, useReducedMotion } from '../../lib/motion';
import Link from 'next/link';

export default function DocsPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Section spacing="lg">
        <Container size="md">
          <MotionDiv
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-12">
              <h1 className="mb-4 text-4xl font-bold text-[hsl(var(--foreground))] sm:text-5xl">
                Getting Started
              </h1>
              <p className="text-lg text-[hsl(var(--muted-foreground))]">
                Learn how to authenticate, send audit events, and query your logs.
              </p>
            </div>
          </MotionDiv>

          {/* API Key Authentication */}
          <MotionDiv
            className="mb-12"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>API Key Authentication</CardTitle>
                <CardDescription>
                  All API requests require authentication using an API key. Create your API key from
                  the dashboard and include it in the request headers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Header Format
                    </h3>
                    <div className="bg-[hsl(var(--muted))]/30 px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] rounded-t-lg">
                      x-api-key
                    </div>
                    <pre className="overflow-x-auto bg-[hsl(var(--card))] p-4 text-sm text-[hsl(var(--foreground))] rounded-b-lg border border-t-0 border-[hsl(var(--border))]">
                      <code>{`x-api-key: your-api-key-here`}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Example Request
                    </h3>
                    <pre className="overflow-x-auto bg-[hsl(var(--card))] p-4 text-sm text-[hsl(var(--foreground))] rounded-lg border border-[hsl(var(--border))]">
                      <code>{`curl -X POST https://api.auditlog.com/v1/audit-events \\
  -H "x-api-key: your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "user.action",
    "actor": {
      "type": "user",
      "id": "user-123",
      "email": "john@example.com"
    },
    "resource": {
      "type": "document",
      "id": "doc-456"
    },
    "action": "create"
  }'`}</code>
                    </pre>
                  </div>
                  <div className="rounded-lg bg-[hsl(var(--muted))]/20 p-4 text-sm text-[hsl(var(--muted-foreground))]">
                    <strong className="text-[hsl(var(--foreground))]">Note:</strong> API keys are
                    scoped to your organization and provide full access to create audit events. Keep
                    them secure and rotate them regularly.
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Ingestion Payload */}
          <MotionDiv
            className="mb-12"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Ingestion Payload</CardTitle>
                <CardDescription>
                  The audit event payload structure for creating new events via the API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Required Fields
                    </h3>
                    <pre className="overflow-x-auto bg-[hsl(var(--card))] p-4 text-sm text-[hsl(var(--foreground))] rounded-lg border border-[hsl(var(--border))]">
                      <code>{`{
  "eventType": "string",        // Event type identifier
  "actor": {                    // Who performed the action
    "type": "user" | "api-key" | "system",
    "id": "string",
    "name": "string (optional)",
    "email": "string (optional)"
  },
  "resource": {                 // What was acted upon
    "type": "string",
    "id": "string",
    "name": "string (optional)"
  },
  "action": "string"            // Action performed
}`}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Optional Fields
                    </h3>
                    <pre className="overflow-x-auto bg-[hsl(var(--card))] p-4 text-sm text-[hsl(var(--foreground))] rounded-lg border border-[hsl(var(--border))]">
                      <code>{`{
  "metadata": {                 // Additional context
    "ip": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "custom_field": "value"
  },
  "ipAddress": "string",        // Override auto-detected IP
  "userAgent": "string",        // Override auto-detected user agent
  "timestamp": "ISO 8601"       // Override current time
}`}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Complete Example
                    </h3>
                    <pre className="overflow-x-auto bg-[hsl(var(--card))] p-4 text-sm text-[hsl(var(--foreground))] rounded-lg border border-[hsl(var(--border))]">
                      <code>{`{
  "eventType": "document.created",
  "actor": {
    "type": "user",
    "id": "user-123",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "resource": {
    "type": "document",
    "id": "doc-456",
    "name": "Project Proposal.pdf"
  },
  "action": "create",
  "metadata": {
    "ip": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "file_size": 1024000,
    "file_type": "application/pdf"
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Filtering Basics */}
          <MotionDiv
            className="mb-12"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Filtering Basics</CardTitle>
                <CardDescription>
                  Query audit events using query parameters. Requires session authentication (not API
                  key).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Available Filters
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          action
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Filter by action type (e.g., "create", "update", "delete")
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          actorType
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Filter by actor type: "user", "api-key", or "system"
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          resourceType
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Filter by resource type (e.g., "document", "user", "api-key")
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          resourceId
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Filter by specific resource ID
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          startDate
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Start date in ISO 8601 format (e.g., "2024-01-01T00:00:00Z")
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          endDate
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          End date in ISO 8601 format
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          metadataText
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Full-text search in metadata JSON
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          limit
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Page size (default: 50, max: 100)
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <code className="rounded bg-[hsl(var(--muted))] px-2 py-1 text-xs font-mono">
                          cursor
                        </code>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Pagination cursor (base64 encoded)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Example Query
                    </h3>
                    <pre className="overflow-x-auto bg-[hsl(var(--card))] p-4 text-sm text-[hsl(var(--foreground))] rounded-lg border border-[hsl(var(--border))]">
                      <code>{`GET /v1/audit-events?action=create&resourceType=document&startDate=2024-01-01T00:00:00Z&limit=50`}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-[hsl(var(--foreground))]">
                      Response Format
                    </h3>
                    <pre className="overflow-x-auto bg-[hsl(var(--card))] p-4 text-sm text-[hsl(var(--foreground))] rounded-lg border border-[hsl(var(--border))]">
                      <code>{`{
  "data": [
    {
      "id": "uuid",
      "eventType": "string",
      "actorType": "user",
      "actorId": "uuid",
      "action": "create",
      "resourceType": "document",
      "resourceId": "string",
      "metadata": {},
      "ipAddress": "string",
      "userAgent": "string",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pageInfo": {
    "nextCursor": "base64-encoded-cursor"
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Next Steps */}
          <MotionDiv
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>
                  Ready to integrate? Here's what to do next.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-semibold text-[hsl(var(--primary-foreground))]">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">
                        Create an API key
                      </p>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Navigate to your dashboard and generate a new API key for your organization.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-semibold text-[hsl(var(--primary-foreground))]">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">
                        Send your first event
                      </p>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Use the ingestion endpoint to log your first audit event.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-semibold text-[hsl(var(--primary-foreground))]">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">
                        Query your logs
                      </p>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Use the filtering API to retrieve and analyze your audit events.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </Container>
      </Section>
    </>
  );
}

