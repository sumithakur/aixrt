import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CTABand } from '@/components/content/CTABand';
import { getShowcaseCompanies } from '@/lib/content';
import {
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Showcase & Enterprise Connections',
  description:
    'Live working software demonstrated to senior enterprise buyers. 4–6 selected enterprise AI companies presenting production outcomes, not pitch decks.',
};

export default function ShowcasePage() {
  const companies = getShowcaseCompanies();

  const showcaseData = require('@/lib/content').getShowcaseData();
  const selectionCriteria = showcaseData.criteria || [];

  return (
    <>
      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              Live Stage Demonstrations · 11:30 – 12:15
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              Working AI, demonstrated to the people who buy it.
            </Heading>
            <Standfirst>
              Four to six selected enterprise AI companies demonstrate working products to a room of senior buyers. Not a pitch competition — working software, verified outcomes, and pre-booked introductions.
            </Standfirst>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/showcase/apply" variant="primary" size="lg">
                Apply to Demonstrate
              </Button>
              <Button href="#connections" variant="secondary" size="lg">
                Enterprise Connections Details
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mechanics: The Demo Format */}
      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            <div className="space-y-6 lg:col-span-7">
              <Eyebrow accent="secondary">The Format</Eyebrow>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                A 45-Minute Dedicated Stage Slot
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                Each Showcase demonstration follows a rigorous three-part structure:
              </p>

              <div className="space-y-4 pt-2">
                <div className="rounded-md border border-border-subtle bg-bg-surface/50 p-4">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-secondary">
                    1. The Enterprise Problem (2 Mins)
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-text-secondary">
                    The specific friction point, risk constraint, or operational bottleneck in the enterprise.
                  </p>
                </div>

                <div className="rounded-md border border-border-subtle bg-bg-surface/50 p-4">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-primary">
                    2. Live Product Demonstration (5 Mins)
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-text-secondary">
                    Working software performing live execution in the production environment.
                  </p>
                </div>

                <div className="rounded-md border border-border-subtle bg-bg-surface/50 p-4">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cybersecurity">
                    3. Measurable Outcome & ROI (2 Mins)
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-text-secondary">
                    Audited results: cycle time compression, cost reduction, or risk mitigation evidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-lg border border-border-prominent bg-bg-surface/90 p-8 backdrop-blur-md shadow-card space-y-4">
                <Terminal className="h-8 w-8 text-brand-secondary" />
                <h3 className="font-display text-lg font-bold text-text-primary">
                  Foyer Demonstration Stations
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                  Showcase stations are active in the central summit foyer during arrival (14:00–14:30) and the networking break (16:00–16:30). Delegates can interact directly with the software and interrogate technical principals.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Enterprise Connections Feature */}
      <Section variant="surface" id="connections">
        <Container size="default">
          <div className="max-w-3xl space-y-4">
            <Eyebrow accent="primary">The Commercial Mechanism</Eyebrow>
            <Heading level={2} size="xl">
              Enterprise Connections: Pre-Booked 1-on-1 Introductions
            </Heading>
            <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
              The single most compelling value proposition for Showcase participants is guaranteed buyer access:
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-md border border-border-subtle bg-bg-raised/70 p-6">
              <span className="font-display text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Step 1: Selection During Lunch
              </span>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Executive attendees review Showcase stations and formally register which companies they want to meet.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-bg-raised/70 p-6">
              <span className="font-display text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Step 2: 15-Minute Briefings
              </span>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                AIX schedules dedicated 1-on-1 introduction sessions during the 15:00–15:30 afternoon break.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-bg-raised/70 p-6">
              <span className="font-display text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Step 3: Post-Summit Facilitation
              </span>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Any meetings that cannot fit into the 30-minute window are formally facilitated within six working days.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Selection Criteria */}
      <Section variant="base">
        <Container size="default">
          <div className="mb-10 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              Curatorial Standards
            </Eyebrow>
            <Heading level={2} size="lg">
              Showcase Selection Criteria
            </Heading>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-text-secondary">
              Strictly limited to 4–6 enterprise companies meeting rigorous benchmarks:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {selectionCriteria.map((item: any) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-md border border-border-subtle bg-bg-raised/60 p-6"
              >
                <CheckCircle2 className="h-5 w-5 text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-text-secondary">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/showcase/apply" variant="primary" size="lg">
              <span>Apply for Showcase Selection</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
