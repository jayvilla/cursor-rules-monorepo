import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Complete audit visibility with append-only events, RBAC, filtering, exports, webhooks, and more. Everything you need for security and compliance.',
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

