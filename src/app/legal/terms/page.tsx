import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Terms of Attendance',
  description: 'AIX Summit 2026 Terms of Attendance and participation conditions.',
};

export default function TermsPage() {
  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="narrow">
        <div className="mb-12">
          <Eyebrow accent="secondary" className="mb-3">
            Legal & Compliance
          </Eyebrow>
          <Heading level={1} size="xl" className="mb-4">
            Terms of Attendance
          </Heading>
          <Standfirst>
            Participation agreement and credential regulations for AIX Summit 2026 delegates.
          </Standfirst>
          <p className="mt-2 text-xs text-text-muted">Last updated: 27 September 2026</p>
        </div>

        <div className="space-y-8 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10 text-sm leading-relaxed text-text-secondary">
          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-text-primary">1. Invitation Nature & Non-Transferability</h2>
            <p>
              AIX Summit 2026 is strictly an invitation-led, non-ticketed event. Invitations are personalized to named senior executives. Registrations may not be transferred or substituted without prior formal approval by the curatorial committee.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-text-primary">2. Chatham House Rule Adherence</h2>
            <p>
              By entering any executive roundtable suite, delegates unconditionally agree to comply with the Chatham House Rule as outlined in our{' '}
              <a href="/legal/confidentiality" className="text-brand-secondary underline hover:text-brand-secondary-hover">
                Confidentiality Protocol
              </a>. Violation of these terms will result in immediate credential revocation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-base font-bold text-text-primary">3. Program Adjustments</h2>
            <p>
              Risin Ventures reserves the right to amend roundtable titles, keynote speakers, or schedule timing in the interest of curatorial quality.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
