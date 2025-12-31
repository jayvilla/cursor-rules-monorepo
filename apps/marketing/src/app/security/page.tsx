'use client';

import { Card } from '@audit-log-and-activity-tracking-saas/ui';
import { Shield, Lock, FileCheck, Globe, Database, Key } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-10">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-fg sm:text-5xl">Security & Compliance</h1>
          <p className="text-lg text-fg-muted">
            Enterprise-grade security and compliance built into every layer of our platform
          </p>
        </div>

        {/* Security features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {[
            {
              icon: Lock,
              title: 'End-to-end Encryption',
              description: 'All data encrypted at rest with AES-256 and in transit with TLS 1.3'
            },
            {
              icon: Key,
              title: 'API Key Security',
              description: 'Scoped permissions, automatic rotation, and rate limiting'
            },
            {
              icon: Database,
              title: 'Immutable Storage',
              description: 'Append-only architecture prevents tampering and ensures data integrity'
            },
            {
              icon: Shield,
              title: 'DDoS Protection',
              description: 'Multi-layer defense against distributed denial of service attacks'
            },
            {
              icon: Globe,
              title: 'Global Redundancy',
              description: 'Multi-region replication with automatic failover'
            },
            {
              icon: FileCheck,
              title: 'Regular Audits',
              description: 'Third-party penetration testing and security assessments'
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                variant="bordered"
                className="p-6 border-border bg-bg-card/50"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-fg">{feature.title}</h3>
                <p className="text-sm text-fg-muted">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Compliance certifications */}
        <Card variant="bordered" className="p-8 border-border bg-bg-card/50 mb-16">
          <h2 className="mb-6 text-center text-2xl font-semibold text-fg">Compliance Certifications</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { name: 'SOC 2 Type II', status: 'Certified' },
              { name: 'GDPR', status: 'Compliant' },
              { name: 'HIPAA', status: 'Compliant' },
              { name: 'ISO 27001', status: 'In Progress' },
            ].map((cert) => (
              <div key={cert.name} className="text-center">
                <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-10">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <p className="font-medium mb-1 text-fg">{cert.name}</p>
                <p className="text-xs text-fg-muted">{cert.status}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Security practices */}
        <div className="space-y-8">
          <h2 className="text-center mb-8 text-2xl font-semibold text-fg">Our Security Practices</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card variant="bordered" className="p-6 border-border">
              <h3 className="mb-3 text-lg font-semibold text-fg">Data Retention</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                Audit logs are retained for a minimum of 7 years by default. 
                Custom retention policies available for enterprise customers. 
                All data can be exported at any time.
              </p>
            </Card>

            <Card variant="bordered" className="p-6 border-border">
              <h3 className="mb-3 text-lg font-semibold text-fg">Access Controls</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                Role-based access control (RBAC) with fine-grained permissions. 
                Support for SSO, SAML, and multi-factor authentication (MFA).
              </p>
            </Card>

            <Card variant="bordered" className="p-6 border-border">
              <h3 className="mb-3 text-lg font-semibold text-fg">Incident Response</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                24/7 security monitoring with automated threat detection. 
                Dedicated incident response team with {'<'} 1 hour response time.
              </p>
            </Card>

            <Card variant="bordered" className="p-6 border-border">
              <h3 className="mb-3 text-lg font-semibold text-fg">Data Privacy</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                We never sell or share your data. GDPR-compliant data processing 
                agreements available. Right to deletion and data portability.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact */}
        <Card variant="bordered" className="mt-16 p-8 text-center border-border bg-accent-10">
          <h3 className="mb-2 text-lg font-semibold text-fg">Questions about security?</h3>
          <p className="text-sm text-fg-muted mb-4">
            Our security team is here to help
          </p>
          <a 
            href="mailto:security@auditlog.com" 
            className="text-sm text-accent hover:underline"
          >
            security@auditlog.com
          </a>
        </Card>
      </div>
    </div>
  );
}

