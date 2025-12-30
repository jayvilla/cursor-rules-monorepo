'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Subtle rotating torus knot with soft lighting
 * Low poly count, minimal performance impact
 */
function RotatingTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow, subtle rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <TorusKnot
      ref={meshRef}
      args={[0.5, 0.2, 64, 16]} // Low poly count: 64 segments, 16 radial segments
      position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color="#6366f1" // Indigo color matching Linear aesthetic
        emissive="#4f46e5"
        emissiveIntensity={0.2}
        metalness={0.3}
        roughness={0.7}
        transparent
        opacity={0.6}
      />
    </TorusKnot>
  );
}

/**
 * Ambient lighting setup for subtle, soft illumination
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} />
    </>
  );
}

/**
 * Hero 3D Scene Component
 * Optimized for performance with low poly count and minimal postprocessing
 */
export default function HeroScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Lower framerate threshold
        className="h-full w-full"
      >
        <Lighting />
        <RotatingTorusKnot />
      </Canvas>
    </div>
  );
}

