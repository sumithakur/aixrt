import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { FadeIn } from '@/components/ui/FadeIn';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { RoundtableCard } from '@/components/content/RoundtableCard';
import { CTABandLive } from '@/components/content/CTABandLive';
import { HomeHero } from '@/components/home/HomeHero';
import { getLiveSiteConfig, getLiveRoundtables, getLiveAudienceData, getLiveHomeContent, getLiveProgramme } from '@/lib/server-content';
import {
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'AIX Roundtables 2026 | Executive AI Summit, Doha, 14 December 2026',
  description:
    'Where AI moves from ambition to action. A one-day invitation-led executive summit in Doha, Qatar. Six sponsored roundtables, live working software demonstrations, and Chatham House peer dialogue.',
  openGraph: {
    title: 'AIX Roundtables 2026 | Where AI moves from ambition to action',
    description:
      'Where AI moves from ambition to action. A one-day invitation-led executive summit in Doha, Qatar. Six sponsored roundtables, live working software demonstrations, and Chatham House peer dialogue.',
    url: 'https://aixrt-sigma.vercel.app',
    siteName: 'AIX Roundtables 2026',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 537,
        alt: 'AIX Roundtables Doha 2026 - Where AI moves from ambition to action',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIX Roundtables 2026 | Where AI moves from ambition to action',
    description:
      'Where AI moves from ambition to action. A one-day invitation-led executive summit in Doha, Qatar. Six sponsored roundtables, live working software demonstrations, and Chatham House peer dialogue.',
    images: ['/og-image.png'],
  },
};

export default async function HomePage() {
  const config = await getLiveSiteConfig();
  const roundtables = await getLiveRoundtables();
  const audience = await getLiveAudienceData();
  const homeData = await getLiveHomeContent();

  // Single source of truth: the Programme tab. No second copy to keep in sync.
  const programmeItems = await getLiveProgramme();
  const condensedProgramme = (programmeItems as any[])
    .filter((item) => item.showOnHome !== false)
    .map((item) => ({
      time: `${item.start} – ${item.end}`,
      title: item.title,
      desc: item.description,
      highlight: item.emphasis === true,
    }));

  return (
    <div className="min-h-screen bg-bg-base text-text-primary selection:bg-brand-secondary/30">
      {/* S1: Hero Section — Left Aligned with smooth Parallax Skyline contained strictly to Hero */}
      <HomeHero config={config} homeData={homeData} />

      {/* S2: The Proposition */}
      <Section variant="surface">
        <Container size="narrow" className="text-center">
          <FadeIn>
          <Eyebrow accent="secondary" className="mb-3">
            The Executive Mandate
          </Eyebrow>
          <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-medium leading-snug text-text-primary">
            {homeData.hero.quote}
          </blockquote>
          </FadeIn>
        </Container>
      </Section>
      <Section variant="base">
        <Container size="default">
          <div className="mb-12 text-center">
            <Heading level={2} size="xl">{homeData.positioning.title}</Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeData.positioning.blocks.map((block: any, idx: number) => (
              <div
                key={idx}
                className="bg-bg-raised p-6 rounded-lg border border-border-subtle shadow-card hover:border-brand-primary/40 transition-all"
              >
                <h3 className="font-display font-bold text-white text-base mb-3">{block.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{block.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>


      {/* S3: The Summit in Numbers */}
      <Section variant="base">
        <Container size="default">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <FadeIn delay={100}>
            <div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-brightAqua">
                {config.event.seats}
              </span>
              <p className="mt-2 text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider">
                {homeData.stats?.items?.[0]?.label ?? 'roundtable seats'}
              </p>
            </div>
            </FadeIn>

            <FadeIn delay={250}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-neonFuchsia">
                {config.event.roundtablesCount}
              </span>
              <p className="mt-2 text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider">
                {homeData.stats?.items?.[1]?.label ?? 'sponsored executive roundtables'}
              </p>
            </div></FadeIn>

            <FadeIn delay={400}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-mediumSlateBlue">
                {config.event.showcaseCount}
              </span>
              <p className="mt-2 text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider">
                {homeData.stats?.items?.[2]?.label ?? 'AI Showcase companies'}
              </p>
            </div></FadeIn>

            <FadeIn delay={550}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-electricLilac">
                {homeData.stats?.items?.[3]?.value ?? '1'}
              </span>
              <p className="mt-2 text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider">
                {homeData.stats?.items?.[3]?.label ?? 'intensive day'}
              </p>
            </div></FadeIn>
          </div>
        </Container>
      </Section>

      {/* S4: The Six Roundtables */}
      <Section variant="raised" id="roundtables">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow accent="secondary" className="mb-2">
                {homeData.roundtablesSection?.eyebrow ?? 'Two Parallel Sessions · 14:30 – 18:00'}
              </Eyebrow>
              <Heading level={2} size="xl">
                {homeData.roundtablesIntro.title}
              </Heading>
              <p className="mt-2 text-sm text-text-secondary max-w-2xl">{homeData.roundtablesIntro.description}</p>
            </div>
            <Link
              href="/roundtables"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:underline"
            >
              <span>{homeData.roundtablesSection?.linkLabel ?? 'Explore all table briefs'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FadeIn className="contents">
            {roundtables.map((rt) => (
              <RoundtableCard key={rt.slug} roundtable={rt} />
            ))}
            </FadeIn>

            {/* Flagship Chair Invitation Card */}
            <div className="flex flex-col justify-between rounded-lg border border-brand-primary/40 bg-gradient-to-br from-bg-raised to-bg-surface p-8 shadow-card">
              <div>
                <span className="rounded-pill border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand-primary">
                  {homeData.roundtablesSection?.chairCard?.badge ?? 'Flagship Commercial Asset'}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold text-text-primary">
                  {homeData.roundtablesSection?.chairCard?.title ?? 'Chair a Roundtable'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {homeData.roundtablesSection?.chairCard?.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle">
                <Button href="/partners/become-a-partner" variant="primary" size="md">
                  <span>{homeData.roundtablesSection?.chairCard?.buttonLabel ?? 'Explore Sponsorship Opportunities'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-pill border border-border-subtle bg-bg-base/70 p-4 text-center text-xs text-text-muted">
            {homeData.roundtablesSection?.footnote}
          </div>
        </Container>
      </Section>

      {/* S5: The Day (Condensed Programme) */}
      <Section variant="base">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow accent="secondary" className="mb-2">
                {homeData.programmeSection?.eyebrow ?? 'One-Day Timeline'}
              </Eyebrow>
              <Heading level={2} size="xl">
                {homeData.programmeSection?.title ?? 'The Day at a Glance'}
              </Heading>
            </div>
            <Link
              href="/programme"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:underline"
            >
              <span>{homeData.programmeSection?.linkLabel ?? 'Full timeline'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {condensedProgramme.map((item: any) => (
              <div
                key={item.title}
                className={`rounded-lg border p-6 transition-all duration-base ${
                  item.highlight
                    ? 'border-brand-primary/50 bg-bg-surface shadow-raised'
                    : 'border-border-subtle bg-bg-raised/60 hover:border-border-prominent'
                }`}
              >
                <span className="font-mono text-xs font-semibold text-brand-secondary">
                  {item.time}
                </span>
                <h3 className="mt-2 font-display text-base font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* S6: AI Showcase & Enterprise Connections */}
      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <Eyebrow accent="secondary">
                {homeData.showcaseSection?.eyebrow ?? 'Practical Innovation'}
              </Eyebrow>
              <Heading level={2} size="xl">
                {homeData.showcaseIntro?.title || 'Working AI, demonstrated to the people who buy it.'}
              </Heading>
              <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                {homeData.showcaseIntro?.description ||
                  'Four to six enterprise AI companies demonstrate working products to a room of buyers. Not a pitch competition — working software, real outcomes, and pre-booked introductions to the executives who want to see more.'}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row pt-4">
                <Button href="/showcase" variant="secondary" size="md">
                  {homeData.showcaseSection?.primaryButtonLabel ?? 'About the Showcase'}
                </Button>
                <Button href="/showcase/apply" variant="gradient" size="md">
                  {homeData.showcaseSection?.secondaryButtonLabel ?? 'Apply to Demonstrate'}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-lg border border-border-prominent bg-bg-surface/90 p-8 backdrop-blur-md shadow-card space-y-4">
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                  {homeData.showcaseSection?.criteriaTitle ?? 'Demonstration Criteria'}
                </h3>
                <ul className="space-y-3 text-xs text-text-secondary">
                  {(homeData.showcaseSection?.criteria ?? []).map((c: any) => (
                    <li key={c.term} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                      <span><strong>{c.term}:</strong> {c.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* S7: Who's in the Room */}
      <Section variant="base">
        <Container size="default">
          <div className="mb-12 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              {homeData.audienceSection?.eyebrow ?? 'Curated Participation'}
            </Eyebrow>
            <Heading level={2} size="xl">
              {homeData.audienceSection?.title ?? 'Who is in the Room'}
            </Heading>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary">
              {homeData.audienceSection?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {audience.segments.map((seg, idx) => (
              <div
                key={seg.title}
                className="rounded-lg border border-border-subtle bg-bg-raised/70 p-6 transition-colors hover:border-border-prominent shadow-card"
              >
                <span className="font-display text-xs font-bold text-brand-secondary">
                  0{idx + 1}
                </span>
                <h3 className="mt-2 font-display text-base font-bold text-text-primary">
                  {seg.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {seg.roles}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* S8: Partners Section */}
      <Section variant="surface">
        <Container size="narrow" className="text-center">
          <Eyebrow accent="primary" className="mb-3">
            {homeData.partnersSection?.eyebrow ?? 'Sponsorship & Engagement'}
          </Eyebrow>
          <Heading level={2} size="lg" className="mb-4">
            {homeData.partnersSection?.title ?? 'Six Roundtable Chair Partnerships Available'}
          </Heading>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-text-secondary">
            {homeData.roundtablesIntro.description}
          </p>

          <div className="mt-8 flex justify-center">
            <Button href="/partners/become-a-partner" variant="gradient" size="lg">
              {homeData.partnersSection?.buttonLabel ?? 'Explore Partnership Opportunities'}
            </Button>
          </div>
        </Container>
      </Section>

      {/* S9: Roundtable Signals Preview */}
      <Section variant="base">
        <Container size="default">
          <div className="rounded-lg border border-border-subtle bg-bg-raised/80 p-8 sm:p-12 shadow-card">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Eyebrow accent="secondary" className="mb-2">
                  {homeData.signalsSection?.eyebrow ?? 'Post-Event Research Output'}
                </Eyebrow>
                <Heading level={2} size="lg" className="text-text-primary">
                  {homeData.signalsSection?.title ?? 'AIX Roundtable Signals'}
                </Heading>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {homeData.signalsSection?.description}
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Button href="/signals" variant="secondary" size="md">
                  <span>{homeData.signalsSection?.buttonLabel ?? 'Learn about Signals'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* S10: Closing Universal CTA */}
      <CTABandLive />
    </div>
  );
}
