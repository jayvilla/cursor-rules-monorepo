import './global.css';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | AuditLog',
    default: 'AuditLog - Activity Tracking SaaS',
  },
  description:
    'Premium audit log and activity tracking solution for development teams. Track user activities, API usage, and system events with secure, immutable audit trails.',
  keywords: [
    'audit log',
    'activity tracking',
    'compliance',
    'security',
    'audit trail',
    'event logging',
    'SaaS',
    'webhook',
  ],
  authors: [{ name: 'AuditLog Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'AuditLog',
    title: 'AuditLog - Activity Tracking SaaS',
    description:
      'Premium audit log and activity tracking solution for development teams. Track user activities, API usage, and system events with secure, immutable audit trails.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuditLog - Activity Tracking SaaS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuditLog - Activity Tracking SaaS',
    description:
      'Premium audit log and activity tracking solution for development teams.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
