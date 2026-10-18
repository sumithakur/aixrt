'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CTABand } from '@/components/content/CTABand';
import { getRoundtables, getSignalsData } from '@/lib/content';
import { FileText, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function SignalsPage() {
  const roundtables = getRoundtables();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const signalsDimensions = [
    {
      title: 'Current Production Reality',
      desc: 'Where enterprise AI is actively generating measurable business ROI today, versus experimental pilot claims.',
    },
    {
      title: 'Capital & Infrastructure Allocation',
      desc: 'Where sovereign funds, banks, and enterprises are directing hardware, cloud compute, and talent capital.',
    },
    {
      title: 'Structural Hurdles & Risk Debt',
      desc: 'Governance, agent identity, prompt injection vulnerabilities, and regulatory friction blocking autonomous scale.',
    },
    {
      title: '12–24 Month Strategic Outlook',
      desc: 'The architectural, operational, and organizational redesign required as copilots transition into autonomous agents.',
    },
    {
      title: 'Three Practical Executive Actions',
      desc: 'Concrete, immediate implementation priorities agreed upon across each table’s senior leadership cohort.',
    },
  ];

  const signalsData = getSignalsData();
  const hero = signalsData.hero || {
    eyebrow: 'Research & Executive Intelligence',
    title: 'AIX Roundtable Signals',
    description: "The conversations don't end at 16:30. Each roundtable produces a concise, anonymised strategic synthesis published in mid-January 2027 as an institutional reference document.",
  };

  const mandate = signalsData.publicationMandate || {
    eyebrow: 'The Publication Mandate',
    title: 'Synthesising Closed-Door Executive Consensus',
    paragraphs: [
      'Mass conferences produce fleeting soundbites. AIX Summit is structured to produce durable intellectual output. Throughout the six closed-door 75-minute roundtables, dedicated rapporteurs capture the debate across six core analytical dimensions.',
      'Crucially, points are recorded strictly without personal or institutional attribution under the Chatham House Rule. This methodological independence guarantees that the report reflects raw operational reality rather than polished public relations.',
    ],
  };

  const dimensions = signalsData.dimensions || signalsDimensions;

  return (
    <>
      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              {hero.eyebrow || 'Research & Executive Intelligence'}
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              {hero.title || 'AIX Roundtable Signals'}
            </Heading>
            <Standfirst>
              {hero.description ||
                "The conversations don't end at 16:30. Each roundtable produces a concise, anonymised strategic synthesis published in mid-January 2027 as an institutional reference document."}
            </Standfirst>
          </div>
        </Container>
      </Section>

      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Main Explainer Column */}
            <div className="space-y-10 lg:col-span-8">
              <div className="space-y-4">
                <Eyebrow accent="secondary">{mandate.eyebrow}</Eyebrow>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  {mandate.title}
                </h2>
                <div className="space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {(mandate.paragraphs || []).map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* The 5 Report Sections */}
              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold text-text-primary">
                  {signalsData.dimensionsTitle || 'What Each Table Section Contains'}
                </h3>

                <div className="space-y-3">
                  {dimensions.map((dim: any, idx: number) => (
                    <div
                      key={dim.title || idx}
                      className="rounded-md border border-border-subtle bg-bg-surface/50 p-4"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary">
                        <span>0{idx + 1}</span>
                        <h4 className="font-display text-sm font-bold text-text-primary">{dim.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-text-secondary leading-relaxed pl-6">
                        {dim.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transparency on Sponsor Perspective */}
              <div className="rounded-md border border-border-prominent bg-bg-surface/80 p-6 space-y-2">
                <div className="flex items-center gap-2 text-brand-secondary font-display text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Editorial Integrity</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                  While Roundtable Chair partners contribute an opening perspective and participate in the synthesis review, any sponsor viewpoint is clearly identified as partner commentary. Consensus market findings remain independently authored by AIX rapporteurs.
                </p>
              </div>
            </div>

            {/* Email Capture Aside */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 rounded-lg border border-border-subtle bg-bg-surface/70 p-6 sm:p-8 backdrop-blur-md shadow-card space-y-6">
                <FileText className="h-8 w-8 text-brand-secondary" />
                <div>
                  <h3 className="font-display text-base font-bold text-text-primary">
                    Get the 2026 Edition
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                    AIX Roundtable Signals publishes in mid-January 2027. Register to receive the complete web edition and executive executive summary PDF upon release.
                  </p>
                </div>

                {subscribed ? (
                  <div className="rounded-md bg-status-confirmed/10 p-4 border border-status-confirmed/30 text-xs text-status-confirmed flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>Your email has been registered for the January 2027 release.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your work email"
                      className="w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                    <Button type="submit" variant="primary" size="md" className="w-full">
                      Register for Publication
                    </Button>
                  </form>
                )}

                <div className="pt-4 border-t border-border-subtle text-[11px] text-text-muted">
                  No marketing spam. Only official AIX research briefings.
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
