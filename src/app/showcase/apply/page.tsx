'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { getRoundtables } from '@/lib/content';
import { CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ShowcaseApplyPage() {
  const roundtables = getRoundtables();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    country: '',
    oneLiner: '',
    problemSolved: '',
    stage: 'live-production',
    deploymentsEvidence: '',
    demoDescription: '',
    hasVideoDemo: 'yes',
    roundtableFocus: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Section variant="hero" className="pt-16 pb-24">
      <Container size="narrow">
        <div className="mb-12 text-center">
          <Eyebrow accent="secondary" className="mb-2">
            AI Showcase Selection
          </Eyebrow>
          <Heading level={1} size="xl" className="mb-4">
            Showcase Demonstration Application
          </Heading>
          <Standfirst className="mx-auto max-w-2xl text-center">
            Apply to demonstrate live working software to an invited room of 110 senior enterprise decision-makers at AIX Summit 2026.
          </Standfirst>
        </div>

        {submitted ? (
          <div className="rounded-lg border border-border-prominent bg-bg-raised/80 p-8 sm:p-12 text-center backdrop-blur-md shadow-card">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h2 className="font-display text-2xl font-bold text-text-primary">
              Application Received for Review
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-text-secondary">
              Thank you for submitting {formData.companyName} for the AIX Summit 2026 Showcase. Our curatorial committee evaluates applications against production utility, enterprise security, and regional relevance.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Button href="/showcase" variant="primary" size="md">
                Back to Showcase Details
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10 backdrop-blur-sm shadow-card">
            {/* 1. Company Information */}
            <div>
              <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
                1. Company & Contact Details
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-text-primary">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Enterprise AI Corp"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Company Website *</label>
                  <input
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://company.ai"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Tariq Al-Mansoor"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactRole}
                    onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                    placeholder="e.g. Founder & CTO"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="tariq@company.ai"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Headquarters Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Qatar, UAE, United Kingdom"
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Product & Enterprise Utility */}
            <div className="pt-4">
              <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
                2. Enterprise Product & Demonstration Plan
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-text-primary">One-Line Product Summary *</label>
                  <input
                    type="text"
                    required
                    value={formData.oneLiner}
                    onChange={(e) => setFormData({ ...formData, oneLiner: e.target.value })}
                    placeholder="e.g. Autonomous agent platform for AML transaction triage across GCC banking networks."
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Enterprise Problem Solved *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.problemSolved}
                    onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                    placeholder="Describe the specific operational hurdle, risk exposure, or cost inefficiency your software eliminates."
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Evidence of Live Production Use *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.deploymentsEvidence}
                    onChange={(e) => setFormData({ ...formData, deploymentsEvidence: e.target.value })}
                    placeholder="Provide evidence of verified deployments: active enterprise clients, transaction volumes, or audited ROI metrics."
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Live Demonstration Concept (5 Minutes) *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.demoDescription}
                    onChange={(e) => setFormData({ ...formData, demoDescription: e.target.value })}
                    placeholder="How will your product be shown working live on stage? (Note: Slides are prohibited; demo must show live system execution)."
                    className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Can a pre-recorded demo video be supplied for technical review? *</label>
                    <select
                      value={formData.hasVideoDemo}
                      onChange={(e) => setFormData({ ...formData, hasVideoDemo: e.target.value })}
                      className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
                    >
                      <option value="yes">Yes — Available upon request</option>
                      <option value="ready">Yes — Link ready</option>
                      <option value="no">No — Live walkthrough only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Most Relevant Summit Roundtable Lane *</label>
                    <select
                      required
                      value={formData.roundtableFocus}
                      onChange={(e) => setFormData({ ...formData, roundtableFocus: e.target.value })}
                      className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
                    >
                      <option value="" disabled>Select associated roundtable</option>
                      {roundtables.map((rt) => (
                        <option key={rt.slug} value={rt.slug}>
                          Table {rt.order}: {rt.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                Submit Showcase Application
              </Button>
            </div>
          </form>
        )}
      </Container>
    </Section>
  );
}
