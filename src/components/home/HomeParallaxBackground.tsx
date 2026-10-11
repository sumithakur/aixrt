'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export function HomeParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Continuous, butter-smooth zoom in / zoom out across entire homepage scrolling
  // Scales progressively from 1.0 up to 1.35, then gently settles
  const scale = 1 + Math.min(scrollY * 0.00018, 0.38);
  // Gentle parallax translateY gives cinematic depth without jarring shifts
  const translateY = Math.min(scrollY * 0.06, 220);
  // Opacity stays prominent in the hero (0.85) and remains softly visible as an atmospheric backdrop throughout
  const opacity = Math.max(0.85 - (scrollY / 2200) * 0.55, 0.28);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Parallax Skyline Container */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          opacity,
          transition: 'transform 0.08s ease-out, opacity 0.1s ease-out',
        }}
      >
        <Image
          src="/brand/skyline-qatar.png"
          alt="AIX Roundtable Doha Skyline Silhouette"
          fill
          priority
          className="object-cover object-bottom sm:object-right-bottom"
        />
      </div>

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 h-[550px] w-[750px] rounded-full bg-brand-neonFuchsia/15 blur-[160px]" />
      <div className="absolute top-2/3 right-1/4 h-[500px] w-[650px] rounded-full bg-brand-brightAqua/12 blur-[170px]" />
      <div className="absolute bottom-10 left-1/3 h-[400px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />

      {/* Deep gradient overlays for maximum text legibility throughout the whole page */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/85 to-transparent w-full md:w-4/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
      <div className="absolute inset-0 bg-bg-base/35" />
    </div>
  );
}
