import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst, PullQuote } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ChairSlot } from '@/components/content/ChairSlot';
import { RoundtableCard } from '@/components/content/RoundtableCard';
import { ProgrammeRow } from '@/components/content/ProgrammeRow';
import { getRoundtables, getProgramme } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Component Library Showcase (Dev Only)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevComponentsPage() {
  const roundtables = getRoundtables();
  const programme = getProgramme();

  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="default">
        <div className="mb-12 border-b border-border-subtle pb-6">
          <Eyebrow accent="secondary">Developer Environment (noindex)</Eyebrow>
          <Heading level={1} size="xl" className="mt-2">
            AIX Summit 2026 Component System
          </Heading>
          <p className="mt-2 text-sm text-text-secondary">
            Visual verification for all UI components, status-aware states, and typography tokens.
          </p>
        </div>

        {/* 1. Buttons */}
        <div className="mb-16 space-y-6">
          <h2 className="font-display text-lg font-bold text-text-primary border-b border-border-subtle pb-2">
            Buttons (Action States)
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="lg">Primary LG</Button>
            <Button variant="primary" size="md">Primary MD</Button>
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="secondary" size="md">Secondary MD</Button>
            <Button variant="ghost" size="md">Ghost MD</Button>
            <Button variant="link" size="md">Link MD</Button>
            <Button variant="primary" size="md" isLoading>Loading State</Button>
            <Button variant="primary" size="md" disabled>Disabled State</Button>
          </div>
        </div>

        {/* 2. Status-Aware ChairSlot Component */}
        <div className="mb-16 space-y-6">
          <h2 className="font-display text-lg font-bold text-text-primary border-b border-border-subtle pb-2">
            Status-Aware ChairSlot (Confirmation Gate)
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-text-muted mb-2 font-mono">State A: Unconfirmed (Default)</p>
              <ChairSlot status="pending" />
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2 font-mono">State B: Confirmed (Active)</p>
              <ChairSlot
                status="confirmed"
                organisation="Example Confirmed Partner"
                personName="Executive Name"
                personRole="Chief Technology Officer"
              />
            </div>
          </div>
        </div>

        {/* 3. Typography & Quotes */}
        <div className="mb-16 space-y-6">
          <h2 className="font-display text-lg font-bold text-text-primary border-b border-border-subtle pb-2">
            Typography Tokens
          </h2>
          <div className="space-y-4 max-w-2xl">
            <Eyebrow accent="primary">Primary Eyebrow</Eyebrow>
            <Eyebrow accent="secondary">Secondary Eyebrow</Eyebrow>
            <Heading level={2} size="lg">Heading Level 2 Large</Heading>
            <Standfirst>This is an executive standfirst summarizing the strategic proposition.</Standfirst>
            <PullQuote accent="fintech" citation="FinTech & Financial Services Roundtable">
              Where is AI creating real competitive advantage in financial services, and what is still hype?
            </PullQuote>
          </div>
        </div>

        {/* 4. Roundtable Card */}
        <div className="mb-16 space-y-6">
          <h2 className="font-display text-lg font-bold text-text-primary border-b border-border-subtle pb-2">
            Roundtable Cards
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {roundtables.slice(0, 2).map((rt) => (
              <RoundtableCard key={rt.slug} roundtable={rt} />
            ))}
          </div>
        </div>

        {/* 5. Programme Row */}
        <div className="space-y-6">
          <h2 className="font-display text-lg font-bold text-text-primary border-b border-border-subtle pb-2">
            Programme Rows
          </h2>
          <div className="space-y-4">
            <ProgrammeRow item={programme[2]} />
            <ProgrammeRow item={programme[6]} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
