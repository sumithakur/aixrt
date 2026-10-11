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
import { CTABand } from '@/components/content/CTABand';
import { getSiteConfig, getRoundtables, getAudienceData, getHomeContent } from '@/lib/content';
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

export const metadata: Metadata = {
  title: 'AIX Summit 2026 | Executive AI Summit, Doha, 14 December 2026',
  description:
    'Where AI moves from ambition to action. A one-day invitation-led executive summit in Doha, Qatar. Six sponsored roundtables, live working software demonstrations, and Chatham House peer dialogue.',
};

export default function HomePage() {
  const config = getSiteConfig();
  const roundtables = getRoundtables();
  const audience = getAudienceData();
  const homeData = getHomeContent();

  const condensedProgramme = [
    {
      time: '14:00 – 14:30',
      title: 'Arrival',
      desc: 'Registration, networking coffee; startup booths open; host welcome.',
    },
    {
      time: '14:30 – 16:00',
      title: 'Roundtable Session 1',
      desc: 'Three tables in parallel: 75 minutes of discussion, then 15 minutes of startup showcase.',
      highlight: true,
    },
    {
      time: '16:00 – 16:30',
      title: 'Networking Break',
      desc: 'Attendees of both sessions network with each other and meet the startups at their booths.',
    },
    {
      time: '16:30 – 18:00',
      title: 'Roundtable Session 2',
      desc: 'Three tables in parallel: 75 minutes of discussion, then 15 minutes of startup showcase.',
      highlight: true,
    },
    {
      time: '18:00 – 18:30',
      title: 'Networking & Booths',
      desc: 'Optional close: booth visits and informal networking.',
    },
    
  ];

  return (
    <>
      {/* S1: Hero Section with Official Circuit Board & Ray Visuals */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-bg-base pt-16 pb-20">
        {/* Visual asset layers from official brand guidelines */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Circuit board neon visual layer */}
          <div className="absolute inset-0 opacity-25 mix-blend-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/brand/circuit-board-hero.jpg')" }}>
          </div>
          {/* Original image hidden, replaced with bg-fixed for parallax */}
          <div className="hidden">
            <Image
              src="/brand/circuit-board-hero.jpg"
              alt=""
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Ray beam overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-35 mix-blend-color-dodge">
            <Image
              src="/brand/ray-overlay.avif"
              alt=""
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Radial ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-brand-neonFuchsia/15 blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 h-[400px] w-[500px] rounded-full bg-brand-brightAqua/12 blur-[140px]" />
          
          {/* Gradient mask to seamlessly blend into bg-base */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/60 to-bg-base" />
        </div>

        <Container size="default" className="relative z-10 text-center">
          {/* Eyebrow: Date and public location in prominent pill container */}
          <FadeIn delay={100}>
            <div className="mb-8 inline-flex items-center gap-3 sm:gap-4 rounded-pill border border-border-subtle/80 bg-bg-raised/90 px-6 py-2.5 sm:px-8 sm:py-3.5 backdrop-blur-xl shadow-raised hover:border-brand-secondary/60 transition-all">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-brand-secondary shrink-0" />
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display">
                <span className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-text-primary">
                  {config.event.date}
                </span>
                <span className="hidden sm:inline text-text-muted/60">•</span>
                <span className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider text-brand-secondary">
                  {config.event.locationPublic}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* H1: Server-rendered verbatim tagline */}
          <FadeIn delay={300}><h1 className="mx-auto max-w-5xl font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl lg:text-7xl leading-[1.08]">
            Where AI moves from{' '}
            <span className="bg-gradient-to-r from-text-primary via-brand-neonFuchsia to-brand-mediumSlateBlue bg-clip-text text-transparent">
              ambition to action.
            </span>
          </h1></FadeIn>

          {/* Standfirst */}
          <FadeIn delay={500}><p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg lg:text-xl">
            {homeData.hero.description}
          </p></FadeIn>

          {/* Dual CTAs in Pill Style */}
          <FadeIn delay={700}><div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/request-an-invitation" variant="gradient" size="lg">
              Request an invitation
            </Button>
            <Button href="/roundtables" variant="secondary" size="lg">
              See the six roundtables
            </Button>
          </div></FadeIn>

          {/* Attribution line */}
          <FadeIn delay={900}><p className="mt-12 text-xs font-medium uppercase tracking-widest text-text-muted">
            Organised by {config.event.organiser}
          </p></FadeIn>
        </Container>
      </section>

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
              <div key={idx} className="bg-bg-raised p-6 rounded-lg border border-border-subtle shadow-card">
                <h3 className="font-display font-bold text-brand-secondary mb-3">{block.title}</h3>
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
                roundtable seats
              </p>
            </div>
            </FadeIn>

            <FadeIn delay={250}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-neonFuchsia">
                {config.event.roundtablesCount}
              </span>
              <p className="mt-2 text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider">
                sponsored executive roundtables
              </p>
            </div></FadeIn>

            <FadeIn delay={400}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-mediumSlateBlue">
                {config.event.showcaseCount}
              </span>
              <p className="mt-2 text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider">
                AI Showcase companies
              </p>
            </div></FadeIn>

            <FadeIn delay={550}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-electricLilac">
                1
              </span>
              <p className="mt-2 text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider">
                intensive day
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
                Two Parallel Sessions · 14:30 – 18:00
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
              <span>Explore all table briefs</span>
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
                  Flagship Commercial Asset
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold text-text-primary">
                  Chair a Roundtable
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  A dedicated room, 12 invited senior leaders, and strategic ownership of a key enterprise AI domain. Roundtable Chair partnerships are the primary commercial product for 2026.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle">
                <Button href="/partners/become-a-partner" variant="primary" size="md">
                  <span>Explore Partnership Opportunities</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-pill border border-border-subtle bg-bg-base/70 p-4 text-center text-xs text-text-muted">
            Each roundtable seats 15 — a chair, up to two sponsor executives, and twelve invited guests. Conducted under Chatham House principles.
          </div>
        </Container>
      </Section>

      {/* S5: The Day (Condensed Programme) */}
      <Section variant="base">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow accent="secondary" className="mb-2">
                One-Day Timeline
              </Eyebrow>
              <Heading level={2} size="xl">
                The Day at a Glance
              </Heading>
            </div>
            <Link
              href="/programme"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:underline"
            >
              <span>Full timeline</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {condensedProgramme.map((item) => (
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
                Practical Innovation
              </Eyebrow>
              <Heading level={2} size="xl">
                Working AI, demonstrated to the people who buy it.
              </Heading>
              <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                Four to six enterprise AI companies demonstrate working products to a room of buyers. Not a pitch competition — working software, real outcomes, and pre-booked introductions to the executives who want to see more.
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                During lunch, delegates select which companies they wish to interrogate further. AIX coordinates 15-minute 1-on-1 Enterprise Connections during the afternoon break, with follow-on briefings scheduled post-event.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row pt-4">
                <Button href="/showcase" variant="secondary" size="md">
                  About the Showcase
                </Button>
                <Button href="/showcase/apply" variant="gradient" size="md">
                  Apply to Demonstrate
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-lg border border-border-prominent bg-bg-surface/90 p-8 backdrop-blur-md shadow-card space-y-4">
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                  Demonstration Criteria
                </h3>
                <ul className="space-y-3 text-xs text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>Working software:</strong> Live product in production, zero mockups.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>Documented outcomes:</strong> Measurable operational return on investment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>Enterprise scale:</strong> Security, data privacy, and architecture readiness.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>Executive Connections:</strong> Dedicated 1-on-1 buyer meetings.</span>
                  </li>
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
              Curated Participation
            </Eyebrow>
            <Heading level={2} size="xl">
              Who is in the Room
            </Heading>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary">
              An invited room of around 110 participants across six key stakeholder groups.
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
            Sponsorship & Engagement
          </Eyebrow>
          <Heading level={2} size="lg" className="mb-4">
            Six Roundtable Chair Partnerships Available
          </Heading>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-text-secondary">
            {homeData.roundtablesIntro.description}
          </p>

          <div className="mt-8 flex justify-center">
            <Button href="/partners/become-a-partner" variant="gradient" size="lg">
              Explore Partnership Opportunities
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
                  Post-Event Research Output
                </Eyebrow>
                <Heading level={2} size="lg" className="text-text-primary">
                  AIX Roundtable Signals
                </Heading>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  The conversations don&apos;t end at 16:30. Each table produces an anonymised synthesis — what executives are seeing, where they&apos;re investing, and what&apos;s preventing scale — published in mid-January 2027 as an institutional research report.
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Button href="/signals" variant="secondary" size="md">
                  <span>Learn about Signals</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* S10: Closing Universal CTA */}
      <CTABand />
    </>
  );
}
