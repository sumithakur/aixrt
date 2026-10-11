import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CTABand } from '@/components/content/CTABand';
import { getSiteConfig, getAudienceData, getAboutContent } from '@/lib/content';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About AIX Summit 2026',
  description:
    'About AIX Summit 2026: A one-day executive summit in Doha built for enterprise leaders responsible for deploying, governing, funding and scaling AI.',
};

export default function AboutPage() {
  const config = getSiteConfig();
  const aboutData = getAboutContent();
  const audience = getAudienceData();

  const positioningPrinciples = [
    {
      title: 'Curated rather than mass-market',
      desc: 'An invited room of around 110 participants. Curation ensures peer-level credibility, where every participant is actively grappling with live deployment challenges.',
    },
    {
      title: 'Executive conversation rather than session volume',
      desc: 'Six focused 75-minute roundtables replace dozens of superficial panel sessions. Depth, candour, and substantive exchange take priority over speaking slots.',
    },
    {
      title: 'Enterprise-first, with real deployments and ROI at the centre',
      desc: 'Focused on enterprise production, infrastructure investment, security posture, and verifiable business value rather than theoretical hype.',
    },
    {
      title: 'Qatar and GCC relevance with selected international voices',
      desc: 'Grounded in the regional economic landscape, regulatory reality, and sovereign AI priorities of Qatar and the wider Gulf region.',
    },
    {
      title: 'Practical innovation through demonstrations rather than startup pitching',
      desc: 'Live working enterprise software solving genuine operational bottlenecks, coupled with pre-scheduled 1-on-1 executive buyer briefings.',
    },
  ];

  return (
    <>
      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              Institutional Context & Purpose
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              About AIX Summit 2026
            </Heading>
            <Standfirst>
              Where AI moves from ambition to action. A one-day invitation-led summit in Doha for the leaders shaping enterprise adoption, regulation, risk, and capital allocation.
            </Standfirst>
          </div>
        </Container>
      </Section>

      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Main Content Spine */}
            <div className="space-y-12 lg:col-span-8">
              {/* The Premise */}
              <div className="space-y-4">
                <Eyebrow accent="secondary">The Premise</Eyebrow>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Moving from Experimentation to Institutional Action
                </h2>
                <div className="space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                  <p>
                    AI has moved decisively beyond laboratory experimentation and isolated proofs-of-concept. Over the past twenty-four months, enterprise organisations across Qatar and the GCC have piloted large language models, automated repetitive tasks, and established initial AI working groups.
                  </p>
                  <p>
                    The harder questions now concern execution: where to deploy autonomous agents, how to redesign core workflows, how to secure critical infrastructure against adversarial prompt injection, how to govern models across sovereign regulatory boundaries, and how to convert capital investment into audited, repeatable business value.
                  </p>
                  <p>
                    AIX Summit 2026 convenes the leaders carrying those responsibilities. Rather than staging a mass-audience conference, AIX brings around sixty senior decision-makers together in six focused roundtables, designed for strategic problem-solving.
                  </p>
                </div>
              </div>

              {/* Six Positioning Principles */}
              <div className="space-y-6">
                <Eyebrow accent="secondary">Our Operating Philosophy</Eyebrow>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Six Distinctive Principles
                </h2>
                <div className="space-y-4">
                  {positioningPrinciples.map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-md border border-border-subtle bg-bg-surface/60 p-6 transition-colors hover:border-border-prominent"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary">
                        <span>0{index + 1}</span>
                      </div>
                      <h3 className="mt-2 font-display text-base font-bold text-text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why the Format Works */}
              <div className="space-y-4">
                <Eyebrow accent="secondary">The Structure</Eyebrow>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  {aboutData.rationale?.title || ''}
                </h2>
                <div className="space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                  <p>
                    {aboutData.rationale.paragraphs[0]}
                  </p>
                  <p>
                    Rather than superficial stage read-outs, discussions flow directly into the published Chatham House <em>AIX Roundtable Signals</em> research, followed by an evening reception so executive relationships established at the tables can deepen in an informal environment.
                  </p>
                </div>
              </div>

              {/* Confidentiality Trust Callout */}
              <div className="rounded-lg border border-border-prominent bg-bg-surface/80 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-brand-secondary shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-text-primary">
                      Chatham House Rule & Absolute Confidentiality
                    </h3>
                    <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
                      All executive roundtables operate strictly under the Chatham House Rule. Participants are free to use the insights gained, but neither the identity nor the affiliation of any speaker or participant may be disclosed. This governance guarantees honest institutional sharing.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/legal/confidentiality"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline"
                      >
                        <span>Read Chatham House principles</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organiser */}
              <div className="space-y-3 border-t border-border-subtle pt-8">
                <Eyebrow accent="primary">The Organiser</Eyebrow>
                <h3 className="font-display text-lg font-bold text-text-primary">
                  <a
                    href="https://www.risin.ventures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-secondary transition-colors underline decoration-brand-secondary/40 underline-offset-4"
                  >
                    Risin Ventures
                  </a>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                  AIX Summit is designed, curated, and produced by{' '}
                  <a
                    href="https://www.risin.ventures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary underline hover:text-brand-secondary transition-colors"
                  >
                    Risin Ventures
                  </a>
                  , an innovation and enterprise venture studio active across the GCC ecosystem. Risin Ventures convenes senior institutional leadership to turn technological ambition into operational enterprise capability.
                </p>
              </div>
            </div>

            {/* Sticky Aside: Key Facts Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6 rounded-lg border border-border-subtle bg-bg-surface/70 p-6 backdrop-blur-md">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                  Summit At a Glance
                </h3>

                <ul className="space-y-4 text-xs text-text-secondary">
                  <li className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Date</span>
                      <p className="text-text-muted mt-0.5">{config.event.date}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Programme Hours</span>
                      <p className="text-text-muted mt-0.5">
                        {config.event.programmeStart} – {config.event.programmeEnd} (Reception to {config.event.receptionEnd})
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Location</span>
                      <p className="text-text-muted mt-0.5">{config.event.locationPublic}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Format & Scale</span>
                      <p className="text-text-muted mt-0.5">
                        Invitation-led room of ~110 · 90 roundtable seats across 6 tables
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Layers className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Roundtables</span>
                      <p className="text-text-muted mt-0.5">
                        Six sponsored parallel tracks (75 minutes each)
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="pt-4 border-t border-border-subtle">
                  <Button href="/request-an-invitation" variant="primary" size="md" className="w-full">
                    Request an Invitation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
