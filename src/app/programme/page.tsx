import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/page-metadata';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { REGISTER_URL } from '@/lib/links';
import { ProgrammeRow } from '@/components/content/ProgrammeRow';
import { CTABandLive } from '@/components/content/CTABandLive';
import {
  getLiveProgramme,
  getLiveSiteConfig,
  getLiveRoundtables,
} from '@/lib/server-content';
import { getProgrammeDataRaw } from '@/lib/content';
import { Calendar, Clock, Download, Layers, ShieldCheck, Sparkles, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/programme');
}

export default async function ProgrammePage() {
  const programme = await getLiveProgramme();
  const config = await getLiveSiteConfig();
  const roundtables = await getLiveRoundtables();
  const rawData = getProgrammeDataRaw();
  const architecturalReasoning = rawData.architecturalReasoning;

  

  // subEvent JSON-LD
  const subEventsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'AIX Summit 2026 Programme',
    startDate: `${config.event.dateIso}T14:00:00+03:00`,
    endDate: `${config.event.dateIso}T18:00:00+03:00`,
    subEvent: programme.map((item) => ({
      '@type': 'Event',
      name: item.title,
      description: item.description,
      startDate: `${config.event.dateIso}T${item.start}:00+03:00`,
      endDate: `${config.event.dateIso}T${item.end}:00+03:00`,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Doha, Qatar',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(subEventsJsonLd) }}
      />

      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <Eyebrow accent="secondary" className="mb-3">
                {config.event.date} · {config.event.locationPublic}
              </Eyebrow>
              <Heading level={1} size="xl" className="mb-4">
                The Programme
              </Heading>
              <Standfirst>
                {rawData.hero.description || 'One intensive day, 14:00 to 18:00, followed by a networking reception. Designed specifically to maximize high-density executive conversation.'}
              </Standfirst>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                href="/api/calendar.ics"
                variant="secondary"
                size="sm"
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                Add to Calendar (.ICS)
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Timeline Column */}
            <div className="space-y-4 lg:col-span-8">
              <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-3">
                <h2 className="font-display text-base font-bold uppercase tracking-wider text-text-primary">
                  Order of Proceedings
                </h2>
                <span className="text-xs text-text-muted">All times AST (UTC+3)</span>
              </div>

              <div className="space-y-4">
                {programme.map((item) => (
                  <ProgrammeRow key={item.title} item={item} />
                ))}
              </div>
            </div>

            {/* Sidebar Column: Program Architecture */}
            <div className="space-y-8 lg:col-span-4">
              {/* At A Glance Card */}
              <div className="rounded-lg border border-border-subtle bg-bg-surface/70 p-6 backdrop-blur-md space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                  Schedule Overview
                </h3>

                <ul className="space-y-3 text-xs text-text-secondary">
                  {programme.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-text-muted">{item.title}</span>
                      <span className="font-mono font-medium text-text-primary">{item.start} – {item.end}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-border-subtle">
                  <Button /* href="/request-an-invitation" */ href={REGISTER_URL} variant="primary" size="md" className="w-full">
                    Register
                  </Button>
                </div>
              </div>

              {/* Chatham House Reminder */}
              <div className="rounded-md border border-border-subtle bg-bg-raised/60 p-6 space-y-2">
                <div className="flex items-center gap-2 text-brand-secondary font-display text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Chatham House Governance</span>
                </div>
                <p className="text-xs leading-relaxed text-text-secondary">
                  The executive roundtables (14:30 – 18:00) operate strictly under Chatham House principles. Stage moments are open to accredited media; roundtables are strictly closed-door.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why the Day is Shaped This Way */}
      <Section variant="surface">
        <Container size="default">
          <div className="mb-12 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              Curatorial Rationale
            </Eyebrow>
            <Heading level={2} size="lg">
              Why the Day is Shaped This Way
            </Heading>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary">
              A programme designed with strategic intention rather than packed with speaker slots.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {architecturalReasoning.map((item: any, idx: number) => (
              <div
                key={item.title}
                className="rounded-md border border-border-subtle bg-bg-raised/70 p-6 transition-colors hover:border-border-prominent"
              >
                <span className="font-display text-xs font-bold text-brand-secondary">
                  0{idx + 1}
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-text-primary">
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

      <CTABandLive />
    </>
  );
}
