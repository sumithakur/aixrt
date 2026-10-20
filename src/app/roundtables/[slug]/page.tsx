import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst, PullQuote } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ChairSlot } from '@/components/content/ChairSlot';
import { CTABandLive } from '@/components/content/CTABandLive';
import { getRoundtables, getRoundtableBySlug } from '@/lib/content';
import {
  Users,
  Clock,
  ShieldCheck,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface RoundtablePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const roundtables = getRoundtables();
  return roundtables.map((rt) => ({ slug: rt.slug }));
}

export async function generateMetadata({ params }: RoundtablePageProps): Promise<Metadata> {
  const { slug } = await params;
  const rt = getRoundtableBySlug(slug);
  if (!rt) return { title: 'Roundtable Not Found' };

  return {
    title: `${rt.shortTitle} | Executive Roundtable`,
    description: `AIX Summit 2026 Executive Roundtable: "${rt.title}". Addressing: "${rt.coreQuestion}". 75 minutes, 15 participants, Chatham House Rule.`,
    openGraph: {
      title: `${rt.shortTitle} — AIX Summit 2026 Roundtable`,
      description: rt.coreQuestion,
    },
  };
}

export default async function RoundtableDetailPage({ params }: RoundtablePageProps) {
  const { slug } = await params;
  const rt = getRoundtableBySlug(slug);

  if (!rt) {
    notFound();
  }

  const allRoundtables = getRoundtables();
  const otherRoundtables = allRoundtables.filter((item) => item.slug !== rt.slug);

  const accentColors: Record<string, { bar: string; text: string; badge: string }> = {
    fintech: {
      bar: 'bg-accent-fintech',
      text: 'text-accent-fintech',
      badge: 'border-accent-fintech/30 bg-accent-fintech/10 text-accent-fintech',
    },
    industrial: {
      bar: 'bg-accent-industrial',
      text: 'text-accent-industrial',
      badge: 'border-accent-industrial/30 bg-accent-industrial/10 text-accent-industrial',
    },
    cybersecurity: {
      bar: 'bg-accent-cybersecurity',
      text: 'text-accent-cybersecurity',
      badge: 'border-accent-cybersecurity/30 bg-accent-cybersecurity/10 text-accent-cybersecurity',
    },
    state: {
      bar: 'bg-accent-state',
      text: 'text-accent-state',
      badge: 'border-accent-state/30 bg-accent-state/10 text-accent-state',
    },
    agentic: {
      bar: 'bg-accent-agentic',
      text: 'text-accent-agentic',
      badge: 'border-accent-agentic/30 bg-accent-agentic/10 text-accent-agentic',
    },
  };

  const currentAccent = accentColors[rt.accent] || {
    bar: 'bg-brand-primary',
    text: 'text-brand-primary',
    badge: 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary',
  };

  // Structured Data subEvent JSON-LD
  const subEventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${rt.shortTitle}: ${rt.title}`,
    description: rt.coreQuestion,
    startDate: rt.session === 2 ? '2026-12-14T16:30:00+03:00' : '2026-12-14T14:30:00+03:00',
    endDate: rt.session === 2 ? '2026-12-14T18:00:00+03:00' : '2026-12-14T16:00:00+03:00',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Doha, Qatar',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Doha',
        addressCountry: 'QA',
      },
    },
  };

  const sessionTiming = rt.session === 2 ? '16:30 – 18:00' : '14:30 – 16:00';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(subEventJsonLd) }}
      />

      {/* 1. Breadcrumbs & Hero Slab */}
      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/roundtables" className="hover:text-text-primary">
              Roundtables
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-text-secondary">{rt.shortTitle}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className={`rounded-pill border px-3 py-1 font-display text-xs font-bold uppercase tracking-wider ${currentAccent.badge}`}>
                Table {rt.order} · {rt.shortTitle} · Session {rt.session || 1}
              </span>
              <span className="text-xs text-text-muted">75 Minutes · 15 Seats</span>
            </div>

            <Heading level={1} size="hero" className="mb-6">
              {rt.title}
            </Heading>

            <PullQuote accent={rt.accent} className="mb-8">
              {rt.coreQuestion}
            </PullQuote>
          </div>

          {/* Chair Slot Component */}
          <div className="mt-8 max-w-xl">
            <ChairSlot
              status={rt.chair?.status}
              organisation={rt.chair?.organisation}
              personName={rt.chair?.personName}
              personRole={rt.chair?.personRole}
            />
          </div>

          {/* Equal Weight Dual Action CTAs */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              href={`/request-an-invitation?roundtable=${rt.slug}`}
              variant="primary"
              size="lg"
            >
              Request a seat at this table
            </Button>
            <Button
              href="/partners/become-a-partner"
              variant="secondary"
              size="lg"
            >
              Chair this roundtable
            </Button>
          </div>
        </Container>
      </Section>

      {/* 2. Main Narrative & Strategic Boundary */}
      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Context & Themes */}
            <div className="space-y-10 lg:col-span-8">
              {/* Contextual Narrative */}
              <div>
                <Eyebrow accent="secondary" className="mb-3">
                  Why This Conversation, Now
                </Eyebrow>
                <div className="space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                  <p>
                    AI has rapidly moved beyond speculative proof-of-concepts into boardroom-mandated operational deployments. Across {rt.shortTitle.toLowerCase()}, the decisive challenge is no longer technological awareness, but systemic integration: deciding where autonomy creates sustainable defensibility, how risk is managed across regulated boundaries, and how capital allocation translates into audited financial return.
                  </p>
                  <p>
                    This closed-door roundtable gathers fifteen peer leaders to dissect verifiable deployments, structural bottlenecks, and operational trade-offs without marketing posture or vendor slides.
                  </p>
                </div>
              </div>

              {/* The Lane Boundary Statement */}
              <div className="rounded-md border border-border-prominent bg-bg-surface p-6 sm:p-8">
                <Eyebrow accent="primary" className="mb-2">
                  Strategic Scope & Lane Boundary
                </Eyebrow>
                <h3 className="font-display text-lg font-bold text-text-primary">
                  What This Table Owns
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {rt.lane}
                </p>
                <p className="mt-3 text-xs text-text-muted italic border-t border-border-subtle pt-3">
                  Cross-table boundary: Cross-cutting autonomous agent operating models, workflow orchestration, and group workforce redesign belong to The Agentic Enterprise table.
                </p>
              </div>

              {/* Discussion Themes */}
              <div>
                <Eyebrow accent="secondary" className="mb-3">
                  Discussion Themes
                </Eyebrow>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {rt.themes.map((theme, i) => (
                    <div
                      key={theme}
                      className="flex items-start gap-3 rounded-sm border border-border-subtle bg-bg-raised/70 p-4 transition-colors hover:border-border-prominent"
                    >
                      <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${currentAccent.text}`} />
                      <span className="text-sm font-medium text-text-primary">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sanitised Participant Profile */}
              <div>
                <Eyebrow accent="secondary" className="mb-3">
                  Who Will Be in the Room
                </Eyebrow>
                <p className="mb-4 text-xs text-text-muted">
                  Strictly senior peer executives curated by Risin Ventures and the roundtable chair:
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {rt.participantProfile.map((profile) => (
                    <div
                      key={profile}
                      className="flex items-center gap-2.5 rounded-sm bg-bg-surface/50 p-3 text-xs text-text-secondary border border-border-subtle"
                    >
                      <Users className="h-4 w-4 text-brand-secondary shrink-0" />
                      <span>{profile}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Session Mechanics & Governance */}
            <div className="space-y-6 lg:col-span-4">
              <div className="sticky top-28 space-y-6 rounded-lg border border-border-subtle bg-bg-surface/60 p-6 backdrop-blur-md">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                  Session Specifications
                </h3>

                <ul className="space-y-4 text-xs text-text-secondary">
                  <li className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">75 Minutes Discussion</span>
                      <p className="text-text-muted mt-0.5">{sessionTiming} in dedicated suite.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Exactly 15 Seats</span>
                      <p className="text-text-muted mt-0.5">1 chair, up to 2 sponsor leaders, 12 invited guests.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Chatham House Rule</span>
                      <p className="text-text-muted mt-0.5">
                        Observations recorded without attribution by designated rapporteur.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary">Plenary & Signals Report</span>
                      <p className="text-text-muted mt-0.5">
                        Findings represented on synthesis stage and published in mid-January 2027.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="pt-4 border-t border-border-subtle space-y-3">
                  <Button
                    href={`/request-an-invitation?roundtable=${rt.slug}`}
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Request a Seat
                  </Button>
                  <Button
                    href="/partners/become-a-partner"
                    variant="secondary"
                    size="md"
                    className="w-full"
                  >
                    Chair this Table
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. The Other Five Roundtables */}
      <Section variant="surface">
        <Container size="default">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-text-primary">
              The Other Five Roundtables
            </h3>
            <Link
              href="/roundtables"
              className="flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline"
            >
              <span>View all roundtables</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherRoundtables.map((other) => (
              <Link
                key={other.slug}
                href={`/roundtables/${other.slug}`}
                className="group flex flex-col justify-between rounded-md border border-border-subtle bg-bg-raised/70 p-5 transition-all duration-base hover:-translate-y-1 hover:border-border-prominent hover:bg-bg-raised"
              >
                <div>
                  <span className="font-display text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                    Table {other.order}
                  </span>
                  <h4 className="mt-1 font-display text-base font-bold text-text-primary group-hover:text-text-primary">
                    {other.shortTitle}
                  </h4>
                  <p className="mt-2 line-clamp-3 text-xs italic text-text-secondary">
                    &ldquo;{other.coreQuestion}&rdquo;
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-secondary group-hover:underline">
                  <span>Explore Brief</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTABandLive />
    </>
  );
}
