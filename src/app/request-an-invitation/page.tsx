import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/page-metadata';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { InvitationRequestForm } from '@/components/forms/InvitationRequestForm';
import { Info, ShieldAlert } from 'lucide-react';

// Rendered per request so SEO edits in the CMS appear without a redeploy.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/request-an-invitation');
}

export default function RequestInvitationPage() {
  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="narrow">
        <div className="mb-12 text-center">
          <Eyebrow accent="secondary" className="mb-3">
            Invitation-Led Executive Summit
          </Eyebrow>
          <Heading level={1} size="xl" className="mb-4">
            Register for AIX Summit 2026
          </Heading>
          <Standfirst className="mx-auto max-w-2xl text-center">
            AIX Summit 2026 is an invitation-led summit in Doha. The majority of seats are allocated directly from our curated list, and a limited number are available by registration.
          </Standfirst>

          {/* Honest odds card per Section 7.8 */}
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-md border border-border-subtle bg-bg-raised/60 p-4 text-left text-xs text-text-secondary">
            <Info className="h-5 w-5 shrink-0 text-brand-secondary mt-0.5" />
            <p className="leading-relaxed">
              <strong>Curatorial notice:</strong> With each roundtable strictly limited to 15 seats and around 110 participants on site, not all requests can be accommodated. Every submission is evaluated against domain seniority and balance. Applicants who cannot be seated for 2026 will receive priority briefings and research publications.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center rounded-lg border border-border-subtle bg-bg-raised/40">
              <span className="text-sm text-text-muted">Loading application form...</span>
            </div>
          }
        >
          <InvitationRequestForm />
        </Suspense>
      </Container>
    </Section>
  );
}
