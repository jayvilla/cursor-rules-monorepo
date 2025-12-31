'use client';

import { Card } from '@audit-log-and-activity-tracking-saas/ui';
import { Button } from '@audit-log-and-activity-tracking-saas/ui';
import { Input } from '@audit-log-and-activity-tracking-saas/ui';
import { Search } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="mb-4 text-4xl font-bold text-fg sm:text-5xl">Documentation</h1>
          <p className="text-lg text-fg-muted mb-8">
            Everything you need to integrate and use AuditLog
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted" />
            <Input
              placeholder="Search documentation..."
              className="pl-12 h-12 bg-bg-card border-border"
            />
          </div>
        </div>

        {/* Documentation sections */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Getting Started',
              description: 'Quick start guide to set up your first audit log',
              topics: ['Installation', 'Authentication', 'First Event']
            },
            {
              title: 'API Reference',
              description: 'Complete API documentation and examples',
              topics: ['Events API', 'Query API', 'Webhooks']
            },
            {
              title: 'SDKs & Libraries',
              description: 'Official client libraries and integrations',
              topics: ['Node.js', 'Python', 'Go']
            },
            {
              title: 'Event Model',
              description: 'Understanding actors, resources, and actions',
              topics: ['Schema', 'Best Practices', 'Examples']
            },
            {
              title: 'Security',
              description: 'Authentication, encryption, and compliance',
              topics: ['API Keys', 'RBAC', 'Compliance']
            },
            {
              title: 'Guides',
              description: 'Step-by-step tutorials and use cases',
              topics: ['Webhooks', 'Exports', 'Analytics']
            },
          ].map((section) => (
            <Card 
              key={section.title} 
              variant="bordered"
              className="p-6 border-border hover:bg-bg-card/80 transition-colors cursor-pointer group"
            >
              <h3 className="mb-2 text-base font-semibold text-fg group-hover:text-accent transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-fg-muted mb-4">
                {section.description}
              </p>
              <ul className="space-y-2">
                {section.topics.map((topic) => (
                  <li key={topic}>
                    <button className="text-sm text-fg-muted hover:text-fg transition-colors">
                      → {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Code example */}
        <Card variant="bordered" className="mt-12 p-8 border-border">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-fg">Quick Example</h3>
            <p className="text-sm text-fg-muted">
              Log your first audit event in seconds
            </p>
          </div>
          <pre className="bg-bg border border-border rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-fg-muted">{`import { AuditLog } from '@auditlog/node';

const client = new AuditLog({
  apiKey: process.env.AUDITLOG_API_KEY
});

await client.log({
  actor: { id: 'usr_123', name: 'John Doe' },
  action: 'document.updated',
  resource: { id: 'doc_456', type: 'document' },
  metadata: {
    changes: ['title', 'content'],
    ip: req.ip
  }
});`}</code>
          </pre>
        </Card>
      </div>
    </div>
  );
}

