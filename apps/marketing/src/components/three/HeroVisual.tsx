'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from '../../lib/motion';

/**
 * Fallback visual when WebGL is unavailable or reduced motion is preferred
 * Static gradient mesh background matching Linear aesthetic
 */
function FallbackVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08),transparent_50%)]" />
    </div>
  );
}

// Dynamically import HeroScene to avoid blocking LCP
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <FallbackVisual />,
});

/**
 * Detects if WebGL is available in the browser
 */
function useWebGLSupport(): boolean {
  const [webGLSupported, setWebGLSupported] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebGLSupported(!!gl);
  }, []);

  return webGLSupported;
}

/**
 * HeroVisual Component
 * Renders 3D scene if WebGL is available and motion is not reduced
 * Falls back to static gradient otherwise
 */
export default function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const webGLSupported = useWebGLSupport();
  const shouldRender3D = webGLSupported && !prefersReducedMotion;

  if (!shouldRender3D) {
    return <FallbackVisual />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Suspense fallback={<FallbackVisual />}>
        <HeroScene />
      </Suspense>
    </div>
  );
}

