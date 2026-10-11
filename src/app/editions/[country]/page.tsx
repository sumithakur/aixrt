import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ArrowLeft, Sparkles, Shield, Users, Radio, CheckCircle2 } from 'lucide-react';

interface EditionConfig {
  name: string;
  country: string;
  city: string;
  tagline: string;
  description: string;
  venueStatus: string;
}

const EDITION_MAP: Record<string, EditionConfig> = {
  oman: {
    name: 'Oman',
    country: 'Sultanate of Oman',
    city: 'Muscat',
    tagline: 'Strategic AI for National Transformation & Enterprise Capability',
    description:
      'AIX Summit is expanding to Muscat. Convening government transformation ministers, sovereign investment leaders, and enterprise buyers for closed-door, Chatham House discussions and working software demonstrations.',
    venueStatus: 'Muscat · Venue & dates to be announced',
  },
  ksa: {
    name: 'KSA',
    country: 'Kingdom of Saudi Arabia',
    city: 'Riyadh',
    tagline: 'Sovereign Compute, Industrial Scale & Enterprise AI Deployment',
    description:
      'AIX Summit is bringing its high-density, Chatham House roundtable format to Riyadh. Designed specifically for Giga-project leadership, Saudi enterprise executives, and global AI infrastructure leaders.',
    venueStatus: 'Riyadh · Venue & dates to be announced',
  },
  uae: {
    name: 'UAE',
    country: 'United Arab Emirates',
    city: 'Dubai / Abu Dhabi',
    tagline: 'Global Capital, Frontier AI Models & Regional Scaling',
    description:
      'AIX Summit lands in the UAE to convene GCC sovereign wealth allocators, frontier enterprise AI startups, and regional conglomerate leadership.',
    venueStatus: 'Dubai / Abu Dhabi · Venue & dates to be announced',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const edition = EDITION_MAP[country.toLowerCase()];
  if (!edition) return { title: 'Edition Not Found | AIX Summit' };

  return {
    title: `AIX Summit ${edition.name} · Stay Tuned for the Next Edition`,
    description: `Stay tuned for the next edition of AIX Summit | AIXHACK in ${edition.country}. Closed-door executive roundtables and working AI showcase.`,
  };
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const edition = EDITION_MAP[country.toLowerCase()];

  if (!edition) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-bg-base overflow-hidden">
      {/* Background Ambience & Ray Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[650px] w-[650px] rounded-full bg-brand-primary/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-brand-secondary/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,40,200,0.22),rgba(15,10,30,0))]" />
      </div>

      {/* TOP SUB-BANNER: Back to current active Qatar edition */}
      <div className="relative z-10 border-b border-border-subtle/60 bg-bg-raised/40 backdrop-blur-md py-2.5">
        <Container size="wide">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-medium text-brand-secondary hover:text-brand-secondary/80 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Active Edition: Doha, Qatar (14 Dec 2026)</span>
            </Link>
            <span className="text-text-muted">
              You are viewing the upcoming <strong>{edition.country}</strong> edition page
            </span>
          </div>
        </Container>
      </div>

      {/* -------------------- HERO SECTION (LEFT ALIGNED) -------------------- */}
      <Section variant="hero" className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-32">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (Strictly Left Aligned per Design Request) */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
                <Sparkles className="h-3.5 w-3.5 text-brand-secondary" />
                <span>STAY TUNED FOR THE NEXT EDITION!</span>
              </div>

              {/* Huge Display Heading */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                JOIN THE ULTIMATE{' '}
                <span className="block bg-gradient-to-r from-[#FF007A] via-[#A855F7] to-[#00F2FE] bg-clip-text text-transparent">
                  AIXSUMMIT | AIXHACK
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-text-secondary font-normal mt-2">
                  {edition.city}, {edition.country}
                </span>
              </h1>

              {/* Subtitle / Description */}
              <p className="max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
                {edition.description}
              </p>

              {/* Action Buttons (Left-Aligned) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  href="/partners/become-a-partner"
                  variant="secondary"
                  size="lg"
                  className="rounded-full border-2 border-brand-primary text-text-primary hover:bg-brand-primary/10 hover:border-brand-secondary transition-all shadow-glow text-sm font-bold px-6 py-3"
                >
                  Become a Sponsor
                </Button>
                <Button
                  href="#notify-form"
                  variant="primary"
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-brand-primary to-brand-purple text-text-primary shadow-glow text-sm font-bold px-6 py-3"
                >
                  Register Interest
                </Button>
              </div>

              {/* Status Note */}
              <div className="pt-4 flex items-center gap-2 text-xs text-text-muted">
                <Radio className="h-4 w-4 text-brand-secondary animate-pulse" />
                <span>{edition.venueStatus}</span>
              </div>
            </div>

            {/* Right Graphic: Globe & Network Graphic */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
                {/* Glowing Aura Ring */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-secondary/20 blur-3xl animate-pulse" />

                {/* Network Globe Graphic */}
                <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                  <Image
                    src="/brand/globe.svg"
                    alt={`${edition.name} Network Globe`}
                    width={480}
                    height={480}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(168,85,247,0.45)]"
                    priority
                  />
                </div>

                {/* Floating Highlights Card */}
                <div className="absolute -bottom-4 -left-4 z-20 rounded-lg border border-border-subtle bg-bg-raised/90 p-4 shadow-card backdrop-blur-md max-w-[240px]">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Chatham House Format</span>
                  </div>
                  <p className="mt-1 text-[11px] text-text-secondary leading-snug">
                    Strictly 15 peer executives per table with working AI technology showcases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------- NOTIFY / REGISTER INTEREST SECTION -------------------- */}
      <Section id="notify-form" variant="surface" className="relative z-10 py-16 border-t border-border-subtle">
        <Container size="narrow">
          <div className="text-center space-y-4 mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              Be the First to Know About AIX Summit {edition.name}
            </h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto">
              Seats and roundtable chair sponsorships for {edition.country} are invitation-led and strictly limited. Register your interest below to receive early briefing documents and invitations.
            </p>
          </div>

          <form
            action="/api/invitation-request"
            method="POST"
            className="rounded-xl border border-border-subtle bg-bg-raised/80 p-6 sm:p-8 backdrop-blur-md shadow-card space-y-6"
          >
            <input type="hidden" name="editionInterest" value={edition.name} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Hassan"
                  className="w-full rounded-sm border border-border-subtle bg-bg-base px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Corporate Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organisation.com"
                  className="w-full rounded-sm border border-border-subtle bg-bg-base px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Organisation / Enterprise *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Holding / Tech Corp"
                  className="w-full rounded-sm border border-border-subtle bg-bg-base px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Job Title / Seniority *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Technology Officer / Partner"
                  className="w-full rounded-sm border border-border-subtle bg-bg-base px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Primary Interest in {edition.name} *
              </label>
              <select
                className="w-full rounded-sm border border-border-subtle bg-bg-base px-3.5 py-2.5 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
              >
                <option value="cxo">Executive Roundtable Delegate (CXO / Enterprise Leader)</option>
                <option value="sponsor">Roundtable Chair / Strategic Sponsor</option>
                <option value="startup">AI Vendor / Startup Showcase Demonstrator</option>
                <option value="press">Institutional / Strategic Ecosystem Partner</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
                Register for {edition.name} Updates
              </Button>
              <span className="text-[11px] text-text-muted">
                Curated by Risin Ventures. No spam, ever.
              </span>
            </div>
          </form>
        </Container>
      </Section>

      {/* -------------------- 3 PILLARS SUMMARY -------------------- */}
      <Section variant="base" className="relative z-10 py-16 border-t border-border-subtle/50">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-border-subtle bg-bg-surface/50 p-6 space-y-3">
              <div className="h-9 w-9 rounded-md bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-text-primary">Executive Density</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                No massive spectator crowds. Strictly 15 curated executives per table, with decision-makers who control real enterprise and technology budgets.
              </p>
            </div>

            <div className="rounded-lg border border-border-subtle bg-bg-surface/50 p-6 space-y-3">
              <div className="h-9 w-9 rounded-md bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-text-primary">Chatham House Rule</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Closed-door candour where leaders discuss real failures, governance bottlenecks, and ROI numbers without media attribution.
              </p>
            </div>

            <div className="rounded-lg border border-border-subtle bg-bg-surface/50 p-6 space-y-3">
              <div className="h-9 w-9 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Radio className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-text-primary">Working Software Only</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                No slide decks or pitch contests. Selected AI vendors demonstrate live working software solving the exact problems debated at each table.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
