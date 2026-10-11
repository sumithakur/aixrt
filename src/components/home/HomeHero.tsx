'use client';

import React from 'react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
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
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-transparent pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Hero Content — Strictly Left-Aligned, Homogeneous with Edition Pages */}
      <Container size="default" className="relative z-20 text-left w-full">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow: Active Edition Pill */}
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-secondary" />
              <span>ACTIVE EDITION · {config.event.date}</span>
            </div>
          </FadeIn>

          {/* Huge Display Heading — Homogeneous Typography */}
          <FadeIn delay={250}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              JOIN THE ULTIMATE{' '}
              <span className="block bg-gradient-to-r from-[#FF007A] via-[#A855F7] to-[#00F2FE] bg-clip-text text-transparent">
                AIX ROUNDTABLE
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-text-secondary font-normal mt-2">
                {config.event.locationPublic}
              </span>
            </h1>
          </FadeIn>

          {/* Standfirst / Description */}
          <FadeIn delay={400}>
            <p className="max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-text-secondary">
              {homeData.hero.description ||
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
