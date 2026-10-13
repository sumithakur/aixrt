'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Calendar, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/ui/FadeIn';
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

  // Smooth zoom-in on scroll down, smooth zoom-out on scroll up
  // Strictly confined to the hero section so it never obstructs or darkens subsequent content
  const scale = 1 + Math.min(scrollY * 0.0006, 0.35);
  const translateY = scrollY * 0.16;
  const opacity = Math.max(1 - scrollY / 650, 0);

  const eventDate = homeData.hero?.date || config.event.date;
  const eventLocation = homeData.hero?.location || config.event.locationPublic;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg-base pt-12 pb-24 sm:pt-16 sm:pb-32">
      {/* Parallax Vector Skyline Background — Contained strictly to Hero */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-transform"
        style={{
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          opacity,
          transition: 'transform 0.06s ease-out, opacity 0.06s ease-out',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0">
          <Image
            src="/brand/skyline-qatar.png"
            alt="AIX Roundtable Doha Skyline Silhouette"
            fill
            priority
            className="object-cover object-bottom sm:object-right-bottom opacity-85"
          />
        </div>

        {/* Ambient Radial Color Glows */}
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[700px] rounded-full bg-brand-neonFuchsia/15 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-[450px] w-[550px] rounded-full bg-brand-brightAqua/12 blur-[150px]" />

        {/* Left Gradient Overlay to keep left-aligned typography razor sharp */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/85 to-transparent w-full md:w-3/4" />
        {/* Bottom Fade smoothly into the next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent h-full" />
      </div>

      {/* Hero Content — Strictly Left-Aligned, Homogeneous with Edition Pages */}
      <Container size="default" className="relative z-20 text-left w-full">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow: Active Edition Pill */}
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-secondary/40 bg-brand-secondary/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary shadow-[0_0_20px_rgba(61,216,216,0.15)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary" />
              </span>
              <span className="text-brand-secondary font-extrabold tracking-wider">ACTIVE EDITION</span>
              <span className="text-white/30">•</span>
              <span className="text-white font-bold tracking-wider">{eventDate}</span>
            </div>
          </FadeIn>

          {/* Huge Display Heading — Homogeneous Typography & CMS Responsive */}
          <FadeIn delay={250}>
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                {homeData.hero?.title ? (
                  homeData.hero.title
                ) : (
                  <>
                    JOIN THE ULTIMATE{' '}
                    <span className="block bg-gradient-to-r from-[#FF007A] via-[#A855F7] to-[#00F2FE] bg-clip-text text-transparent">
                      AIX ROUNDTABLE
                    </span>
                  </>
                )}
              </h1>

              {/* Prominent Date & Location Highlight Strip */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-brand-primary/60 bg-gradient-to-r from-brand-primary/25 via-brand-amethystPurple/20 to-transparent px-4 py-2.5 text-white shadow-[0_0_30px_rgba(247,70,169,0.3)] backdrop-blur-md">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-brand-primary shrink-0" />
                  <span className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                    {eventDate}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-border-prominent bg-bg-surface/90 px-4 py-2.5 text-text-secondary backdrop-blur-md shadow-card">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-brand-secondary shrink-0" />
                  <span className="font-display text-lg sm:text-xl lg:text-2xl font-semibold text-text-primary">
                    {eventLocation}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Standfirst / Description */}
          <FadeIn delay={400}>
            <p className="max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-text-secondary">
              {homeData.hero?.description ||
                'Where AI moves from ambition to action. 110 leaders, 6 closed-door Chatham House roundtables, and live working AI software demonstrations.'}
            </p>
          </FadeIn>

          {/* Left-Aligned Action CTAs — Matching Edition Page Style */}
          <FadeIn delay={550}>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                href="/request-an-invitation"
                variant="primary"
                size="lg"
                className="rounded-full bg-gradient-to-r from-brand-primary to-brand-purple text-text-primary shadow-glow text-sm font-bold px-7 py-3.5 hover:opacity-95 transition-all"
              >
                Register
              </Button>
              <Button
                href="/partners/become-a-partner"
                variant="secondary"
                size="lg"
                className="rounded-full border-2 border-brand-primary text-text-primary hover:bg-brand-primary/10 hover:border-brand-secondary transition-all shadow-glow text-sm font-bold px-7 py-3.5"
              >
                Become a Sponsor
              </Button>
              <Button
                href="/roundtables"
                variant="ghost"
                size="lg"
                className="rounded-full border border-border-subtle bg-bg-raised/60 hover:bg-bg-raised text-brand-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2 transition-all group"
              >
                <span>See the 6 roundtables</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
