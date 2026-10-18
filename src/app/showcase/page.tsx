import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CTABand } from '@/components/content/CTABand';
import { getShowcaseCompanies } from '@/lib/content';
import { getLiveShowcaseData } from '@/lib/server-content';
import {
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'AI Showcase & Enterprise Connections',
  description:
    'Live working software demonstrated to senior enterprise buyers. 4–6 selected enterprise AI companies presenting production outcomes, not pitch decks.',
};

export default async function ShowcasePage() {
  const companies = getShowcaseCompanies();
  const showcaseData = await getLiveShowcaseData();

  const hero = showcaseData.hero || {
    eyebrow: 'Live Stage Demonstrations · 11:30 – 12:15',
    title: 'Working AI, demonstrated to the people who buy it.',
    description:
      'Four to six selected enterprise AI companies demonstrate working products to a room of senior buyers. Not a pitch competition — working software, verified outcomes, and pre-booked introductions.',
    primaryButtonText: 'Apply to Demonstrate',
    primaryButtonUrl: '/showcase/apply',
    secondaryButtonText: 'Enterprise Connections Details',
    secondaryButtonUrl: '#connections',
  };

  const format = showcaseData.format || {
    eyebrow: 'The Format',
    title: 'A 45-Minute Dedicated Stage Slot',
    description: 'Each Showcase demonstration follows a rigorous three-part structure:',
    steps: [
      {
        title: '1. The Enterprise Problem (2 Mins)',
        desc: 'The specific friction point, risk constraint, or operational bottleneck in the enterprise.',
      },
      {
        title: '2. Live Product Demonstration (5 Mins)',
        desc: 'Working software performing live execution in the production environment.',
      },
      {
        title: '3. Measurable Outcome & ROI (2 Mins)',
        desc: 'Audited results: cycle time compression, cost reduction, or risk mitigation evidence.',
      },
    ],
  };

  const connections = showcaseData.connections || {
    eyebrow: 'Curated Introductions',
    title: '1-on-1 Enterprise Connections',
    description:
      'Beyond the stage demonstrations, AIX facilitates pre-scheduled 15-minute briefings during the afternoon break, connecting showcase founders directly with enterprise buyers who requested further interrogation.',
  };

  const selectionCriteria = showcaseData.criteria || [];

  return (
    <>
      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              {hero.eyebrow}
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              {hero.title}
            </Heading>
            <Standfirst>
              {hero.description}
            </Standfirst>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href={hero.primaryButtonUrl || '/showcase/apply'} variant="primary" size="lg">
                {hero.primaryButtonText || 'Apply to Demonstrate'}
              </Button>
              <Button href={hero.secondaryButtonUrl || '#connections'} variant="secondary" size="lg">
                {hero.secondaryButtonText || 'Enterprise Connections Details'}
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
              <Eyebrow accent="secondary">{format.eyebrow}</Eyebrow>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                {format.title}
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                {format.description}
              </p>

              <div className="space-y-4 pt-2">
                {(format.steps || []).map((step: any, idx: number) => (
                  <div key={idx} className="rounded-md border border-border-subtle bg-bg-surface/50 p-4">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-secondary">
                      {step.title}
                    </span>
                    <p className="mt-1 text-xs sm:text-sm text-text-secondary">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-lg border border-border-prominent bg-bg-surface/90 p-8 backdrop-blur-md shadow-card space-y-6">
                <div className="flex items-center gap-2 text-brand-secondary">
                  <Terminal className="h-5 w-5" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider">
                    Demonstration Standard
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  Working Software Only
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                  To preserve the executive credibility of the summit, mockups, conceptual video renders, and marketing slides are strictly excluded from the demonstration stage.
                </p>
                <div className="pt-2 border-t border-border-subtle">
                  <span className="text-xs font-semibold text-text-muted">Selection Cap</span>
                  <p className="text-sm font-bold text-text-primary mt-0.5">Strictly 4–6 Enterprise Companies</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Enterprise Connections */}
      <Section variant="base" id="connections">
        <Container size="default">
          <div className="mb-12 max-w-2xl">
            <Eyebrow accent="secondary" className="mb-2">
              {connections.eyebrow || 'Curated Introductions'}
            </Eyebrow>
            <Heading level={2} size="xl">
              {connections.title || '1-on-1 Enterprise Connections'}
            </Heading>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {connections.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-md border border-border-subtle bg-bg-raised/70 p-6">
              <Users className="h-6 w-6 text-brand-secondary mb-3" />
              <h3 className="font-display text-sm font-bold text-text-primary">Pre-Scheduled Matches</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                Meetings arranged prior to summit morning based on enterprise delegate technology priorities.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-bg-raised/70 p-6">
              <Clock className="h-6 w-6 text-brand-secondary mb-3" />
              <h3 className="font-display text-sm font-bold text-text-primary">15-Minute Dedicated Briefings</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                Focused technical discussion without conference floor distractions.
              </p>
            </div>

            <div className="rounded-md border border-border-subtle bg-bg-raised/70 p-6">
              <ShieldCheck className="h-6 w-6 text-brand-secondary mb-3" />
              <h3 className="font-display text-sm font-bold text-text-primary">Qualified Buyer Presence</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                Access exclusively to decision-makers holding enterprise deployment authority.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Selection Criteria */}
      <Section variant="surface">
        <Container size="default">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <Eyebrow accent="primary" className="mb-2">
              Selection Rigour
            </Eyebrow>
            <Heading level={2} size="xl">
              Criteria for Demonstration Companies
            </Heading>
            <p className="mt-3 text-sm text-text-secondary">
              Demonstrators are selected through technical evaluation against three non-negotiable criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {selectionCriteria.map((crit: any) => (
              <div
                key={crit.title}
                className="rounded-lg border border-border-subtle bg-bg-raised/80 p-8 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {crit.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {crit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/showcase/apply" variant="gradient" size="lg">
              <span>Submit Enterprise Application</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
