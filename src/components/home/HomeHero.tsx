'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/ui/FadeIn';
import { HeroNightSkyStars } from '@/components/effects/HeroNightSkyStars';
import type { SiteConfig } from '@/types/content';

interface HomeHeroProps {
  config: SiteConfig;
  homeData: {
    hero: {
      headline?: string;
      location?: string;
      date?: string;
      description?: string;
      quote?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export function HomeHero({ config, homeData }: HomeHeroProps) {
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

  // Parallax calculations requested by user:
  // "as we scroll down, this vector should decrease opacity and zoom in in parallax"
  const scale = 1 + Math.min(scrollY * 0.0006, 0.35); // zooms in
  const opacity = Math.max(1 - scrollY / 650, 0); // decreases opacity
  const translateY = scrollY * 0.18; // smooth parallax depth

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-bg-base pt-12 pb-24 sm:pt-16 sm:pb-32">
      {/* 1. Interactive Night Sky with Twinkling Stars responding to cursor movement */}
      <HeroNightSkyStars />

      {/* 2. Parallax Vector Skyline Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-transform"
        style={{
          transform: `scale(${scale}) translateY(${translateY}px)`,
          opacity: opacity,
          transition: 'transform 0.05s linear, opacity 0.05s linear',
        }}
        aria-hidden="true"
      >
        {/* Vector Image */}
        <div className="absolute inset-0">
          <Image
            src="/brand/hero-skyline.png"
            alt="AIX Summit Doha Skyline Visual"
            fill
            priority
            className="object-cover object-bottom sm:object-right-bottom opacity-85"
          />
        </div>

        {/* Ambient Radial Color Glows blending skyline with deep theme */}
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[700px] rounded-full bg-brand-neonFuchsia/15 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-[450px] w-[550px] rounded-full bg-brand-brightAqua/12 blur-[150px]" />

        {/* Gradient overlays to keep left-aligned typography legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/80 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent h-full" />
      </div>

      {/* 3. Hero Content — Strictly Left-Aligned as requested */}
      <Container size="default" className="relative z-20 text-left w-full">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow: Date and Location Pill */}
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-3 sm:gap-4 rounded-pill border border-purple-500/30 bg-bg-raised/90 px-5 py-2 sm:px-7 sm:py-3 backdrop-blur-xl shadow-card hover:border-brand-secondary/60 transition-all">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-brand-secondary shrink-0" />
              <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 font-display">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-text-primary">
                  {config.event.date}
                </span>
                <span className="text-text-muted/60">•</span>
                <span className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider text-brand-secondary">
                  {config.event.locationPublic}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* H1 Headline: Server-rendered verbatim tagline */}
          <FadeIn delay={250}>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.06]">
              Where AI moves from{' '}
              <span className="block bg-gradient-to-r from-text-primary via-brand-neonFuchsia to-brand-mediumSlateBlue bg-clip-text text-transparent">
                ambition to action.
              </span>
            </h1>
          </FadeIn>

          {/* Standfirst / Description */}
          <FadeIn delay={400}>
            <p className="max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-text-secondary">
              {homeData.hero.description}
            </p>
          </FadeIn>

          {/* Left-Aligned Action CTAs */}
          <FadeIn delay={550}>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button href="/request-an-invitation" variant="gradient" size="lg" className="shadow-glow font-bold">
                Register
              </Button>
              <Button href="/partners/become-a-partner" variant="secondary" size="lg" className="font-semibold">
                Become a Sponsor
              </Button>
              <Button href="/roundtables" variant="ghost" size="lg" className="text-brand-secondary hover:text-brand-secondary/80 font-semibold group">
                <span>See the 6 roundtables</span>
                <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </FadeIn>

          {/* Attribution & Format Note */}
          <FadeIn delay={700}>
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium tracking-wide text-text-muted">
              <span className="uppercase tracking-widest text-text-muted/90">
                Organised by {config.event.organiser}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-brand-secondary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>110 Leaders · 6 Closed-Door Roundtables · Live AI Showcases</span>
              </span>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
