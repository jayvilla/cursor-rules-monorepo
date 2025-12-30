'use client';

import { Button } from '../ui/button';
import { Container } from '../ui/container';
import { Section } from '../ui/section';
import { MotionDiv, MotionH1, MotionP, fadeSlideUp, staggerContainer, useReducedMotion } from '../../lib/motion';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// Lazy-load 3D hero component - only loads when in viewport
const HeroVisual = dynamic(() => import('../three/HeroVisual'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
    </div>
  ),
});

/**
 * Fallback visual that matches the 3D hero's appearance
 * Prevents layout shift while 3D component loads
 */
function HeroVisualPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
    </div>
  );
}

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load 3D component when it's about to enter viewport
    // This prevents it from being in the initial bundle
    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad3D(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Start loading 100px before it's visible
    );

    if (visualRef.current) {
      observer.observe(visualRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <Section spacing="xl" className="relative overflow-hidden">
      <Container size="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Content */}
          <MotionDiv
            className="text-center lg:text-left"
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <MotionH1
              className="mb-6 text-5xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-6xl lg:text-7xl"
              variants={prefersReducedMotion ? {} : fadeSlideUp}
            >
              Audit logs you can trust.
            </MotionH1>
            <MotionP
              className="mb-8 text-xl text-[hsl(var(--muted-foreground))] sm:text-2xl"
              variants={prefersReducedMotion ? {} : fadeSlideUp}
            >
              Append-only logs with role-based access control, export capabilities, and webhook integrations.
            </MotionP>
            <MotionDiv
              className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
              variants={prefersReducedMotion ? {} : fadeSlideUp}
            >
              <Button size="lg" variant="default" href="/dashboard">
                View Dashboard
              </Button>
              <Button size="lg" variant="outline" href="/docs">
                Read Docs
              </Button>
            </MotionDiv>
          </MotionDiv>

          {/* Right: 3D Visual - Fixed dimensions prevent layout shift */}
          <div 
            ref={visualRef}
            className="relative h-[400px] w-full lg:h-[500px]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 pointer-events-none">
              {shouldLoad3D ? <HeroVisual /> : <HeroVisualPlaceholder />}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

