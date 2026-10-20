import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/page-metadata';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, Calendar, Users, ShieldCheck } from 'lucide-react';

// Rendered per request so SEO edits in the CMS appear without a redeploy.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/request-an-invitation/received');
}

export default function InvitationReceivedPage() {
  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="narrow">
        <div className="rounded-lg border border-border-prominent bg-bg-raised/80 p-8 sm:p-12 text-center backdrop-blur-md shadow-card">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Invitation Request Received
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-text-secondary">
            Thank you for applying to attend AIX Summit 2026. Your submission has been routed directly to the curatorial committee for review against table allocations.
          </p>

          <div className="my-8 rounded-md border border-border-subtle bg-bg-surface/50 p-6 text-left space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-brand-secondary">
              What Happens Next
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 shrink-0 text-brand-secondary mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-text-primary">Curatorial Review</p>
                  <p className="text-text-muted mt-1">
                    Every request is reviewed against seniority and roundtable lane balance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 shrink-0 text-brand-secondary mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-text-primary">Decision Window</p>
                  <p className="text-text-muted mt-1">
                    Allocations are communicated via email within three working days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand-secondary mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-text-primary">Chatham House</p>
                  <p className="text-text-muted mt-1">
                    Confirmed delegates receive briefing packs and pre-summit materials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/roundtables" variant="primary" size="md">
              <span>Explore the Six Roundtables</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/programme" variant="secondary" size="md">
              <span>View Programme Timeline</span>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
