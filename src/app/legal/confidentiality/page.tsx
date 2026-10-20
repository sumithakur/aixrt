import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/page-metadata';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { ShieldCheck, Lock, FileText, Camera, AlertCircle } from 'lucide-react';

// Rendered per request so SEO edits in the CMS appear without a redeploy.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/legal/confidentiality');
}

export default function ConfidentialityPage() {
  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="narrow">
        <div className="mb-12">
          <Eyebrow accent="secondary" className="mb-3">
            Institutional Trust & Governance
          </Eyebrow>
          <Heading level={1} size="xl" className="mb-4">
            Chatham House Principles & Conduct
          </Heading>
          <Standfirst>
            Senior leaders and government participants require an ironclad trust environment. This protocol sets out how confidentiality is enforced at AIX Summit 2026.
          </Standfirst>
        </div>

        <div className="space-y-10 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10 text-text-secondary leading-relaxed text-sm sm:text-base backdrop-blur-sm">
          {/* Rule Statement */}
          <div className="rounded-md border border-brand-secondary/30 bg-bg-surface/80 p-6">
            <h2 className="font-display text-base font-bold text-brand-secondary uppercase tracking-wider mb-2">
              The Chatham House Rule
            </h2>
            <blockquote className="italic font-display text-base text-text-primary">
              &ldquo;When a meeting, or part thereof, is held under the Chatham House Rule, participants are free to use the information received, but neither the identity nor the affiliation of the speaker(s), nor that of any other participant, may be revealed.&rdquo;
            </blockquote>
          </div>

          {/* Section 1: Application at the Roundtables */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand-secondary" />
              <span>1. Application to Executive Roundtables</span>
            </h3>
            <p>
              The executive roundtables across both afternoon sessions (14:30–16:00 and 16:30–18:00) operate strictly under the Chatham House Rule. All remarks, case experiences, internal challenges, and risk observations shared during each 75-minute session are completely non-attributable.
            </p>
            <p>
              Participants are encouraged to speak openly regarding deployment bottlenecks, regulatory hurdles, technical failures, and audited ROI without concern that specific remarks will be cited outside the suite.
            </p>
          </div>

          {/* Section 2: Role of the Rapporteur & Signals Report */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-secondary" />
              <span>2. Rapporteurs & The AIX Roundtable Signals Publication</span>
            </h3>
            <p>
              Each roundtable suite includes an independent AIX rapporteur. The rapporteur is tasked with recording strategic arguments, cross-cutting themes, and structural industry bottlenecks — <strong>strictly without personal or organisational attribution</strong>.
            </p>
            <p>
              The resulting synthesis forms the basis of the published <em>AIX Roundtable Signals</em> research report in mid-January 2027. Any sponsor perspectives included in the report are explicitly demarcated as partner contributions.
            </p>
          </div>

          {/* Section 3: Sponsor and Chair Guardrails */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-secondary" />
              <span>3. Sponsor and Chair Guardrails</span>
            </h3>
            <p>
              Roundtable Chair partners lead discussions by presenting genuine operational problems and framing discussion vectors. The following rules are strictly enforced:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Sessions may not be used for direct commercial selling or product pitching.</li>
              <li>Sponsors may not record audio or video within the closed-door roundtable suites.</li>
              <li>Sponsor executives are bound by the same confidentiality standards as invited delegates.</li>
            </ul>
          </div>

          {/* Section 4: Photography & Media Policy */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
              <Camera className="h-5 w-5 text-brand-secondary" />
              <span>4. Photography & Media Access</span>
            </h3>
            <p>
              Accredited media are permitted only within the public AI Showcase area and designated foyer moments. <strong>Media representatives are strictly barred from entering the executive roundtables.</strong>
            </p>
            <p>
              Official summit photographers are prohibited from capturing identifiable discussion documents, laptop screens, or confidential participant notes during roundtable sessions.
            </p>
          </div>

          {/* Contact */}
          <div className="pt-6 border-t border-border-subtle text-xs text-text-muted">
            For specific governance questions, contact the secretariat at{' '}
            <a href="mailto:info@aixsummit.com" className="text-brand-secondary underline hover:text-brand-secondary-hover">
              info@aixsummit.com
            </a>
            .
          </div>
        </div>
      </Container>
    </Section>
  );
}
