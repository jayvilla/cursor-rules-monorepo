'use client';

import { HeroSection } from '../components/sections/hero-section';
import { HowItWorksSection } from '../components/sections/how-it-works-section';
import { FeaturesSection } from '../components/sections/features-section';
import { SecuritySection } from '../components/sections/security-section';
import { DeveloperSection } from '../components/sections/developer-section';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AuditLog',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Premium audit log and activity tracking solution for development teams. Track user activities, API usage, and system events with secure, immutable audit trails.',
      url: siteUrl,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SecuritySection />
      <DeveloperSection />
    </>
  );
}
