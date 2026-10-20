import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/page-metadata';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';

// Rendered per request so SEO edits in the CMS appear without a redeploy.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/legal/privacy');
}

export default function PrivacyPage() {
  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="narrow">
        <div className="mb-12">
          <Eyebrow accent="secondary" className="mb-3">
            Legal & Compliance
          </Eyebrow>
          <Heading level={1} size="xl" className="mb-4">
            Privacy Policy
          </Heading>
          <Standfirst>
            How AIX Summit and Risin Ventures collect, process, and safeguard executive participant information.
          </Standfirst>
          <p className="mt-2 text-xs text-text-muted">Last updated: 27 September 2026</p>
        </div>

        <div className="space-y-8 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10 text-sm leading-relaxed text-text-secondary">
          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-text-primary">1. Information We Collect</h2>
            <p>
              When you submit a request for an invitation or contact the summit organizing team, we collect your full name, work email address, international telephone number, country of residence, organisation, job title, and professional seniority.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-text-primary">2. Purpose of Processing</h2>
            <p>
              We process delegate information exclusively for curatorial seat allocation, identity verification, table composition balancing, and logistical summit coordination in Doha.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-text-primary">3. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade executive delegate contact information. Participant lists for individual roundtables are shared with the designated table chair solely for seating preparation under strict non-disclosure obligations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-text-primary">4. Data Retention & Your Rights</h2>
            <p>
              Delegate records are retained for the duration necessary to deliver the summit and post-event research briefings. You may request data inspection or deletion by contacting{' '}
              <a href="mailto:info@aixsummit.com" className="text-brand-secondary underline hover:text-brand-secondary-hover">
                info@aixsummit.com
              </a>.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
