'use client';

import { Container } from '../../components/ui/container';
import { Section } from '../../components/ui/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { MotionDiv, MotionH2, MotionP, fadeSlideUp, useReducedMotion } from '../../lib/motion';
import Link from 'next/link';

export default function SecurityPage() {
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
              <h1 className="mb-4 text-4xl font-bold text-fg sm:text-5xl">
                Security
              </h1>
              <p className="text-lg text-fg-muted">
                Learn about our security practices, authentication mechanisms, and data protection
                policies.
              </p>
            </div>
          </MotionDiv>

          {/* Cookie Sessions */}
          <MotionDiv
            className="mb-12"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Cookie Sessions</CardTitle>
                <CardDescription>
                  Secure session management for web-based authentication and authorization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Session Storage
                    </h3>
                    <p className="text-fg-muted">
                      User sessions are stored server-side in a secure database. Session tokens are
                      stored in HTTP-only cookies to prevent JavaScript access, reducing the risk of
                      XSS attacks.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Cookie Configuration
                    </h3>
                    <ul className="list-disc space-y-2 pl-5 text-fg-muted">
                      <li>
                        <strong className="text-fg">HttpOnly:</strong> Cookies
                        are marked as HttpOnly to prevent client-side JavaScript access
                      </li>
                      <li>
                        <strong className="text-fg">Secure:</strong> In
                        production, cookies are only sent over HTTPS connections
                      </li>
                      <li>
                        <strong className="text-fg">SameSite:</strong> Set to
                        "lax" to provide CSRF protection while maintaining usability
                      </li>
                      <li>
                        <strong className="text-fg">Path:</strong> Cookies
                        are scoped to the API path to limit exposure
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Session Expiration
                    </h3>
                    <p className="text-fg-muted">
                      Sessions expire after a period of inactivity. Users must re-authenticate to
                      continue accessing protected resources. Session tokens are cryptographically
                      signed and validated on each request.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* CSRF Protection */}
          <MotionDiv
            className="mb-12"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>CSRF Protection</CardTitle>
                <CardDescription>
                  Cross-Site Request Forgery (CSRF) protection for state-changing operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      How It Works
                    </h3>
                    <p className="text-fg-muted">
                      CSRF protection is enforced for all mutating HTTP methods (POST, PUT, PATCH,
                      DELETE). The system uses a double-submit cookie pattern where:
                    </p>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-fg-muted">
                      <li>A CSRF secret is stored in a non-HttpOnly cookie</li>
                      <li>A CSRF token is generated from the secret and returned via API</li>
                      <li>Clients must include the token in the <code className="rounded bg-bg-ui-30 px-1.5 py-0.5 text-xs font-mono">x-csrf-token</code> header</li>
                      <li>The server validates the token against the cookie secret</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      API Key Exemption
                    </h3>
                    <p className="text-fg-muted">
                      Requests authenticated with API keys (via the <code className="rounded bg-bg-ui-30 px-1.5 py-0.5 text-xs font-mono">x-api-key</code> header) are
                      exempt from CSRF checks, as API keys provide their own authentication
                      mechanism.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Implementation
                    </h3>
                    <pre className="overflow-x-auto bg-bg-card p-4 text-sm text-fg rounded-lg border border-border">
                      <code>{`// 1. Get CSRF token
GET /auth/csrf
→ { token: "..." }

// 2. Include in mutating requests
POST /api/endpoint
Headers:
  x-csrf-token: <token>
  Cookie: csrf-secret=<secret>`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* CORS */}
          <MotionDiv
            className="mb-12"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>CORS Configuration</CardTitle>
                <CardDescription>
                  Cross-Origin Resource Sharing (CORS) settings for API access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Development
                    </h3>
                    <p className="text-fg-muted">
                      In development, CORS is configured to allow requests from common localhost
                      origins for easier testing and development.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Production
                    </h3>
                    <p className="text-fg-muted">
                      In production, CORS is restricted to explicitly allowed origins. Only requests
                      from your configured frontend domain are permitted. Credentials (cookies) are
                      enabled for authenticated requests.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Headers
                    </h3>
                    <p className="text-fg-muted">
                      The API exposes custom headers like <code className="rounded bg-bg-ui-30 px-1.5 py-0.5 text-xs font-mono">X-Total-Count</code> for pagination
                      metadata. These headers are included in the CORS exposed headers list.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Data Retention */}
          <MotionDiv
            className="mb-12"
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
                <CardDescription>
                  Policies and practices for audit log data retention and lifecycle management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Retention Periods
                    </h3>
                    <p className="text-fg-muted">
                      Audit logs are retained according to your subscription tier and compliance
                      requirements. Default retention periods vary by plan, with options for extended
                      retention available.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Data Deletion
                    </h3>
                    <p className="text-fg-muted">
                      When data reaches the end of its retention period, it is automatically
                      deleted from our systems. Deletion is permanent and cannot be undone. You
                      can export your data at any time before the retention period expires.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Compliance
                    </h3>
                    <p className="text-fg-muted">
                      Our data retention policies are designed to help you meet regulatory
                      requirements such as GDPR, SOC 2, and industry-specific compliance standards.
                      Contact support to discuss custom retention policies for your organization.
                    </p>
                  </div>
                  <div className="rounded-lg bg-bg-ui-20 p-4 text-sm text-fg-muted">
                    <strong className="text-fg">Note:</strong> Data retention
                    settings can be configured per organization. Check your organization settings or
                    contact support for details about your specific retention policy.
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Audit Integrity */}
          <MotionDiv
            variants={prefersReducedMotion ? {} : fadeSlideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Audit Integrity</CardTitle>
                <CardDescription>
                  Measures to ensure the immutability and integrity of audit log data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Immutability
                    </h3>
                    <p className="text-fg-muted">
                      Audit events are append-only. Once created, events cannot be modified or
                      deleted through the API. This ensures a complete and tamper-proof audit trail
                      of all activities.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Timestamp Integrity
                    </h3>
                    <p className="text-fg-muted">
                      All events are timestamped server-side at creation time. While clients can
                      provide a timestamp, the server validates and may override it to prevent
                      timestamp manipulation. Events are stored with microsecond precision.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Cryptographic Hashing
                    </h3>
                    <p className="text-fg-muted">
                      Event data is stored with integrity checks. Each event includes metadata
                      about its creation context (IP address, user agent, API key) to help detect
                      and investigate potential issues.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-fg">
                      Access Logging
                    </h3>
                    <p className="text-fg-muted">
                      All access to audit logs is itself logged. This includes who accessed which
                      events, when, and from where. This creates a complete chain of custody for
                      audit data.
                    </p>
                  </div>
                  <div className="rounded-lg bg-bg-ui-20 p-4 text-sm text-fg-muted">
                    <strong className="text-fg">Important:</strong> Audit
                    logs are designed for compliance and security purposes. The immutability
                    guarantee ensures that your audit trail can be trusted in legal and regulatory
                    contexts.
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

