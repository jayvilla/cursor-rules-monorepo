import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Getting Started',
  description:
    'Learn how to authenticate with API keys, send audit events, and query your logs using the AuditLog API.',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

