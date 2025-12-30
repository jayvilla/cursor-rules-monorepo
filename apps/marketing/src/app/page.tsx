import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Container } from '../components/ui/container';
import { Section } from '../components/ui/section';
import { Badge } from '../components/ui/badge';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing="xl">
        <Container size="lg">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="accent2" className="mb-6">
              Enterprise-Grade Audit Logging
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-6xl lg:text-7xl">
              Track every action.
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--accent2))] to-[hsl(var(--accent2))]/70 bg-clip-text text-transparent">
                Trust nothing.
              </span>
            </h1>
            <p className="mb-8 text-xl text-[hsl(var(--muted-foreground))] sm:text-2xl">
              Immutable audit logs with real-time webhooks, role-based access control, and
              compliance-ready exports. Built for teams that need to know exactly what happened,
              when, and by whom.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="default" href="/signup">
                Get started free
              </Button>
              <Button size="lg" variant="outline" href="/docs">
                View documentation
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section spacing="lg">
        <Container size="lg">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[hsl(var(--foreground))] sm:text-4xl">
              Everything you need for complete audit visibility
            </h2>
            <p className="text-lg text-[hsl(var(--muted-foreground))]">
              Powerful features designed for security, compliance, and peace of mind
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="bordered">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--accent2))]/10">
                  <svg
                    className="h-6 w-6 text-[hsl(var(--accent2))]"
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
                </div>
                <CardTitle>Append-Only Logs</CardTitle>
                <CardDescription>
                  Immutable audit trail that can never be modified or deleted. Every event is
                  permanently recorded with cryptographic integrity.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--accent2))]/10">
                  <svg
                    className="h-6 w-6 text-[hsl(var(--accent2))]"
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
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Fine-grained permissions ensure only authorized users can view, filter, and export
                  audit logs. Perfect for compliance and security requirements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--accent2))]/10">
                  <svg
                    className="h-6 w-6 text-[hsl(var(--accent2))]"
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
                </div>
                <CardTitle>Real-Time Webhooks</CardTitle>
                <CardDescription>
                  Get instant notifications when critical events occur. Configure webhooks with
                  automatic retries and delivery status tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--accent2))]/10">
                  <svg
                    className="h-6 w-6 text-[hsl(var(--accent2))]"
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
                </div>
                <CardTitle>Advanced Filtering</CardTitle>
                <CardDescription>
                  Filter by event type, actor, resource, date range, and more. Full-text search
                  across metadata for quick incident investigation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--accent2))]/10">
                  <svg
                    className="h-6 w-6 text-[hsl(var(--accent2))]"
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
                </div>
                <CardTitle>Export & Compliance</CardTitle>
                <CardDescription>
                  Export audit logs in JSON or CSV format. Perfect for compliance audits, security
                  reviews, and data analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--accent2))]/10">
                  <svg
                    className="h-6 w-6 text-[hsl(var(--accent2))]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <CardTitle>API-First Design</CardTitle>
                <CardDescription>
                  Integrate seamlessly with your existing infrastructure. RESTful API with API key
                  authentication for programmatic access.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Benefits Section */}
      <Section spacing="lg" className="bg-[hsl(var(--muted))]/30">
        <Container size="lg">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="muted" className="mb-4">
                Why AuditLog?
              </Badge>
              <h2 className="mb-6 text-3xl font-bold text-[hsl(var(--foreground))] sm:text-4xl">
                Built for teams that can&apos;t afford to miss a thing
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent2))]/20">
                    <svg
                      className="h-4 w-4 text-[hsl(var(--accent2))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-[hsl(var(--foreground))]">
                      Complete Visibility
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))]">
                      Track user actions, API usage, and system events in one centralized,
                      searchable location. Never wonder what happened again.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent2))]/20">
                    <svg
                      className="h-4 w-4 text-[hsl(var(--accent2))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-[hsl(var(--foreground))]">
                      Compliance Ready
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))]">
                      Immutable logs with export capabilities meet SOC 2, GDPR, and HIPAA
                      requirements. Audit-ready from day one.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent2))]/20">
                    <svg
                      className="h-4 w-4 text-[hsl(var(--accent2))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-[hsl(var(--foreground))]">
                      Developer Friendly
                    </h3>
                    <p className="text-[hsl(var(--muted-foreground))]">
                      Simple REST API, comprehensive documentation, and webhook integrations. Get
                      started in minutes, not days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card variant="elevated" className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Event Type</p>
                      <p className="font-semibold text-[hsl(var(--foreground))]">
                        user.authentication
                      </p>
                    </div>
                    <Badge variant="accent2">New</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Actor</p>
                      <p className="text-sm text-[hsl(var(--foreground))]">
                        user:john.doe@example.com
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Action</p>
                      <p className="text-sm text-[hsl(var(--foreground))]">login</p>
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Timestamp</p>
                      <p className="text-sm text-[hsl(var(--foreground))]">
                        2024-01-15 14:32:18 UTC
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">IP Address</p>
                      <p className="text-sm text-[hsl(var(--foreground))]">192.168.1.100</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg">
        <Container size="md">
          <Card variant="elevated" className="border-[hsl(var(--accent2))]/20 bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--muted))]/20 p-12 text-center">
            <CardHeader>
              <CardTitle className="mb-4 text-3xl font-bold text-[hsl(var(--foreground))] sm:text-4xl">
                Ready to get started?
              </CardTitle>
              <CardDescription className="mx-auto max-w-2xl text-lg">
                Join teams that trust AuditLog for their critical audit logging needs. Start
                tracking events in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="default" href="/signup">
                  Start free trial
                </Button>
                <Button size="lg" variant="outline" href="/pricing">
                  View pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}
