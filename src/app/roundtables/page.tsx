import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { RoundtableCard } from '@/components/content/RoundtableCard';
import { CTABand } from '@/components/content/CTABand';
import { getRoundtables } from '@/lib/content';
import { Shield, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Six Executive Roundtables',
  description:
    'Six parallel 75-minute curated discussions of 15 senior leaders each, conducted under Chatham House principles across distinct strategic lanes.',
};

export default function RoundtablesHubPage() {
  const roundtables = getRoundtables();

  const runOfShowSteps = [
    {
      step: '01',
      title: 'Introductions & Context Setting',
      time: '10 Mins',
      desc: 'Table participants outline functional remits and current enterprise deployments.',
    },
    {
      step: '02',
      title: 'Chair Opening Perspective',
      time: '7 Mins',
      desc: 'Sponsor chair frames the core question and outlines live operational realities.',
    },
    {
      step: '03',
      title: 'Where AI is Working Now',
      time: '25 Mins',
      desc: 'Exchange on verified production deployments, ROI evidence, and initial wins.',
    },
    {
      step: '04',
      title: "What's Blocking Scale & Trust",
      time: '25 Mins',
      desc: 'Frank discussion on governance, security, data debt, integration, and risk.',
    },
    {
      step: '05',
      title: 'The Next 12–24 Months',
      time: '20 Mins',
      desc: 'Anticipated workflow shifts, autonomous agent integration, and investment priorities.',
    },
    {
      step: '06',
      title: 'Synthesis & Consensus Observations',
      time: '18 Mins',
      desc: 'Agreeing 3–5 anonymised strategic takeaways captured for the published AIX Roundtable Signals report.',
    },
  ];

  return (
    <>
      {/* Hero Header */}
      <Section variant="hero" className="pt-16 pb-20">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              The Summit Core · Two Sessions · 14:30 – 18:00
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              Six Executive Roundtables
            </Heading>
            <Standfirst>
              Two parallel sessions of three roundtables each, 75 minutes of discussion, fifteen seats per table. Each table owns a distinct strategic lane, ensuring focused depth without convergence into generic debate.
            </Standfirst>
          </div>

          {/* How a Roundtable Works */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border border-border-subtle bg-bg-raised/60 p-6">
              <Users className="mb-3 h-6 w-6 text-brand-secondary" />
              <h3 className="font-display text-sm font-bold text-text-primary">15 Participants Per Table</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                A chair, up to two sponsor executives, and twelve invited senior decision-makers.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-bg-raised/60 p-6">
              <Clock className="mb-3 h-6 w-6 text-brand-secondary" />
              <h3 className="font-display text-sm font-bold text-text-primary">75 Minutes of Focused Depth</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                Long enough for substantive interrogation; structured to avoid drifting into generic remarks.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-bg-raised/60 p-6">
              <Shield className="mb-3 h-6 w-6 text-brand-secondary" />
              <h3 className="font-display text-sm font-bold text-text-primary">Chatham House Rule</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                Full candour without attribution. An independent moderator and rapporteur guide every session.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-bg-raised/60 p-6">
              <CheckCircle2 className="mb-3 h-6 w-6 text-brand-secondary" />
              <h3 className="font-display text-sm font-bold text-text-primary">Signals Publication</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                Synthesised anonymised observations published in the mid-January AIX Roundtable Signals report.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* The Six Roundtables Grid */}
      <Section variant="surface">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow accent="secondary" className="mb-2">
                Parallel Tracks
              </Eyebrow>
              <Heading level={2} size="lg">
                Explore the Discussion Lanes
              </Heading>
            </div>
            <p className="max-w-md text-xs text-text-secondary">
              Roundtable chairs frame the question. Twelve curated peer executives deliberate actionable solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {roundtables.map((rt) => (
              <RoundtableCard key={rt.slug} roundtable={rt} />
            ))}

            {/* Commercial Flagship Opportunity Card */}
            <div className="flex flex-col justify-between rounded-lg border border-brand-primary/40 bg-gradient-to-br from-bg-raised to-bg-surface p-8 shadow-card">
              <div>
                <span className="rounded-pill border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Flagship Partnership
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold text-text-primary">
                  Chair an Executive Roundtable
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  A topic, a room, twelve curated senior guests, and an enduring thought-leadership outcome. Roundtable Chair partnerships provide direct strategic leadership of one of the six lanes.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0" />
                    <span>Senior sponsor executive chairs the 75-minute session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0" />
                    <span>Lead strategic findings in the published AIX Roundtable Signals research</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0" />
                    <span>Co-authorship in the published AIX Roundtable Signals research</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle">
                <Button href="/partners/become-a-partner" variant="primary" size="md" className="w-full sm:w-auto">
                  <span>Explore Chair Package</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Table Run-of-Show Stepped Diagram */}
      <Section variant="base">
        <Container size="default">
          <div className="mb-12 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              Rigorous Methodology
            </Eyebrow>
            <Heading level={2} size="lg">
              Roundtable Run-of-Show
            </Heading>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary">
              Every table follows an identical 6-phase cadence overseen by an independent AIX moderator and rapporteur.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {runOfShowSteps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-md border border-border-subtle bg-bg-raised/70 p-6 transition-colors hover:border-border-prominent"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-display font-extrabold text-brand-secondary">{step.step}</span>
                  <span className="rounded-pill bg-bg-surface px-2.5 py-0.5 font-mono text-[11px] text-text-muted">
                    {step.time}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Universal Closing CTA */}
      <CTABand />
    </>
  );
}
