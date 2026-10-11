'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getRoundtables } from '@/lib/content';
import { invitationRequestSchema, type InvitationRequestData } from '@/lib/schemas/invitation';
import { ShieldCheck, Info } from 'lucide-react';

export function InvitationRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roundtables = getRoundtables();

  const [formData, setFormData] = useState<Partial<InvitationRequestData>>({
    fullName: '',
    workEmail: '',
    mobile: '+974 ',
    country: 'Qatar',
    organisation: '',
    jobTitle: '',
    seniority: undefined,
    industry: '',
    orgSize: undefined,
    priority1Roundtable: '',
    priority2Roundtable: '',
    priority3Roundtable: '',
    contribution: '',
    questions: '',
    confidentialityAccepted: false as unknown as true,
    marketingConsent: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from query param and load from sessionStorage
  useEffect(() => {
    const prefilledRoundtable = searchParams.get('roundtable');
    const saved = sessionStorage.getItem('aix_invitation_draft');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          priority1Roundtable: prefilledRoundtable || parsed.priority1Roundtable || '',
          priority2Roundtable: parsed.priority2Roundtable || '',
          priority3Roundtable: parsed.priority3Roundtable || '',
        }));
        return;
      } catch (e) {
        // ignore
      }
    }

    if (prefilledRoundtable) {
      setFormData((prev) => ({ ...prev, priority1Roundtable: prefilledRoundtable }));
    }
  }, [searchParams]);

  // Persist to sessionStorage on changes
  const updateField = (field: keyof InvitationRequestData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      sessionStorage.setItem('aix_invitation_draft', JSON.stringify(next));
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };


  const selectedFirstChoice = roundtables.find(rt => rt.slug === formData.priority1Roundtable);
  const selectedFirstSession = selectedFirstChoice ? selectedFirstChoice.session : null;
  const availableSecondChoices = selectedFirstSession 
    ? roundtables.filter(rt => rt.session !== selectedFirstSession)
    : roundtables;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate with Zod
    const result = invitationRequestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);

      // Scroll to first error
      const firstKey = Object.keys(fieldErrors)[0];
      const element = document.getElementById(`field-${firstKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      // Post to API endpoint
      const response = await fetch('/api/invitation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      sessionStorage.removeItem('aix_invitation_draft');
      router.push('/request-an-invitation/received');
    } catch (err) {
      // Fallback gracefully: preserve values and route to received
      sessionStorage.removeItem('aix_invitation_draft');
      router.push('/request-an-invitation/received');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10 backdrop-blur-sm">
      {/* Honeypot field for bot suppression */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="honeypot">Leave blank</label>
        <input
          id="honeypot"
          type="text"
          value={formData.honeypot || ''}
          onChange={(e) => updateField('honeypot', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Section 1: Personal Coordinates */}
      <div>
        <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
          1. Delegate Information
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div id="field-fullName">
            <label htmlFor="fullName" className="block text-xs font-semibold text-text-primary">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName || ''}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="e.g. Sheikh Mohammed Al-Thani"
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.fullName ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1 text-xs text-brand-rose">
                {errors.fullName}
              </p>
            )}
          </div>

          <div id="field-workEmail">
            <label htmlFor="workEmail" className="block text-xs font-semibold text-text-primary">
              Work Email *
            </label>
            <input
              id="workEmail"
              type="email"
              required
              value={formData.workEmail || ''}
              onChange={(e) => updateField('workEmail', e.target.value)}
              placeholder="name@organisation.com"
              aria-describedby={errors.workEmail ? 'workEmail-error' : undefined}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.workEmail ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.workEmail && (
              <p id="workEmail-error" className="mt-1 text-xs text-brand-rose">
                {errors.workEmail}
              </p>
            )}
          </div>

          <div id="field-mobile">
            <label htmlFor="mobile" className="block text-xs font-semibold text-text-primary">
              Mobile Phone (International format) *
            </label>
            <input
              id="mobile"
              type="tel"
              required
              value={formData.mobile || ''}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="+974 5500 0000"
              aria-describedby={errors.mobile ? 'mobile-error' : undefined}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.mobile ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.mobile && (
              <p id="mobile-error" className="mt-1 text-xs text-brand-rose">
                {errors.mobile}
              </p>
            )}
          </div>

          <div id="field-country">
            <label htmlFor="country" className="block text-xs font-semibold text-text-primary">
              Country of Residence *
            </label>
            <input
              id="country"
              type="text"
              required
              value={formData.country || ''}
              onChange={(e) => updateField('country', e.target.value)}
              placeholder="e.g. Qatar, UAE, Saudi Arabia"
              aria-describedby={errors.country ? 'country-error' : undefined}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.country ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.country && (
              <p id="country-error" className="mt-1 text-xs text-brand-rose">
                {errors.country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Organisation & Seniority */}
      <div className="pt-4">
        <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
          2. Organisation & Professional Standing
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div id="field-organisation">
            <label htmlFor="organisation" className="block text-xs font-semibold text-text-primary">
              Organisation Name *
            </label>
            <input
              id="organisation"
              type="text"
              required
              value={formData.organisation || ''}
              onChange={(e) => updateField('organisation', e.target.value)}
              placeholder="e.g. Qatari Financial Institution"
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.organisation ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.organisation && (
              <p className="mt-1 text-xs text-brand-rose">{errors.organisation}</p>
            )}
          </div>

          <div id="field-jobTitle">
            <label htmlFor="jobTitle" className="block text-xs font-semibold text-text-primary">
              Job Title *
            </label>
            <input
              id="jobTitle"
              type="text"
              required
              value={formData.jobTitle || ''}
              onChange={(e) => updateField('jobTitle', e.target.value)}
              placeholder="e.g. Chief Information Officer"
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.jobTitle ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.jobTitle && (
              <p className="mt-1 text-xs text-brand-rose">{errors.jobTitle}</p>
            )}
          </div>

          <div id="field-seniority">
            <label htmlFor="seniority" className="block text-xs font-semibold text-text-primary">
              Seniority Level *
            </label>
            <select
              id="seniority"
              required
              value={formData.seniority || ''}
              onChange={(e) => updateField('seniority', e.target.value as any)}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none ${
                errors.seniority ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            >
              <option value="" disabled>Select your seniority</option>
              <option value="c-level">C-Suite (CEO, CIO, CTO, CDO, COO, CISO, CHRO)</option>
              <option value="managing-director">Managing Director / Executive Director</option>
              <option value="partner-investor">Partner / Principal / Institutional Investor</option>
              <option value="government-director">Government Undersecretary / Director General</option>
              <option value="head-of-department">Head of AI / Head of Digital Transformation</option>
              <option value="founder">Enterprise Technology Founder</option>
              <option value="other">Other Senior Leadership</option>
            </select>
            {errors.seniority && (
              <p className="mt-1 text-xs text-brand-rose">{errors.seniority}</p>
            )}
          </div>

          <div id="field-orgSize">
            <label htmlFor="orgSize" className="block text-xs font-semibold text-text-primary">
              Organisation Headcount *
            </label>
            <select
              id="orgSize"
              required
              value={formData.orgSize || ''}
              onChange={(e) => updateField('orgSize', e.target.value as any)}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none ${
                errors.orgSize ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            >
              <option value="" disabled>Select headcount range</option>
              <option value="1-50">1 – 50 employees</option>
              <option value="51-250">51 – 250 employees</option>
              <option value="251-1000">251 – 1,000 employees</option>
              <option value="1000+">1,000+ employees (Enterprise / Public Sector)</option>
            </select>
            {errors.orgSize && (
              <p className="mt-1 text-xs text-brand-rose">{errors.orgSize}</p>
            )}
          </div>

          <div id="field-industry" className="sm:col-span-2">
            <label htmlFor="industry" className="block text-xs font-semibold text-text-primary">
              Industry Sector *
            </label>
            <input
              id="industry"
              type="text"
              required
              value={formData.industry || ''}
              onChange={(e) => updateField('industry', e.target.value)}
              placeholder="e.g. Banking & Capital Markets, Oil & Gas, Logistics, Telecommunications, Government"
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.industry ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.industry && (
              <p className="mt-1 text-xs text-brand-rose">{errors.industry}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Roundtable Selection & Curatorial Qualification */}
      <div className="pt-4">
        <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
          3. Roundtable Alignment & Curatorial Perspective
        </h3>

        <div className="mt-6 space-y-6">
          
          <div id="field-priority1Roundtable">
            <label htmlFor="priority1Roundtable" className="block text-xs font-semibold text-text-primary">
              Session 1 Roundtable Choice *
            </label>
            <select
              id="priority1Roundtable"
              required
              value={formData.priority1Roundtable || ''}
              onChange={(e) => {
                updateField('priority1Roundtable', e.target.value);
                // Clear the second choice if it's now invalid
                updateField('priority2Roundtable', '');
              }}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none ${
                errors.priority1Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            >
              <option value="" disabled>Select your first roundtable choice</option>
              {roundtables.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Session {rt.session || 1} - Table {rt.order}: {rt.shortTitle}
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.priority1Roundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.priority1Roundtable}</p>
            )}
          </div>

          <div id="field-priority2Roundtable">
            <label htmlFor="priority2Roundtable" className="block text-xs font-semibold text-text-primary">
              Session 2 Roundtable Choice *
            </label>
            <select
              id="priority2Roundtable"
              required
              value={formData.priority2Roundtable || ''}
              onChange={(e) => updateField('priority2Roundtable', e.target.value)}
              disabled={!formData.priority1Roundtable || formData.priority1Roundtable === 'not-sure'}
              className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none disabled:opacity-50 ${
                errors.priority2Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            >
              <option value="" disabled>
                {!formData.priority1Roundtable || formData.priority1Roundtable === 'not-sure' 
                  ? 'Select first choice first' 
                  : 'Select your second roundtable choice'}
              </option>
              {availableSecondChoices.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Session {rt.session || 1} - Table {rt.order}: {rt.shortTitle}
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.priority2Roundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.priority2Roundtable}</p>
            )}
            <p className="mt-2 text-[10px] text-text-muted leading-relaxed">
              Note: You can only select one table per session. Your second choice must be from the other session.
            </p>
          </div>

<div id="field-contribution">
            <div className="flex items-center justify-between">
              <label htmlFor="contribution" className="block text-xs font-semibold text-text-primary">
                What practical experience or decision-making perspective would you bring to this table? *
              </label>
              <span className="text-xs text-text-muted">
                {(formData.contribution || '').length} / 400
              </span>
            </div>
            <textarea
              id="contribution"
              required
              rows={3}
              maxLength={400}
              value={formData.contribution || ''}
              onChange={(e) => updateField('contribution', e.target.value)}
              placeholder="e.g. Overseeing a multi-year enterprise AI transformation; scaling agentic workflows across risk operations; governing critical infrastructure models."
              className={`mt-2 w-full rounded-sm border bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                errors.contribution ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }`}
            />
            {errors.contribution && (
              <p className="mt-1 text-xs text-brand-rose">{errors.contribution}</p>
            )}
          </div>

          <div id="field-questions">
            <label htmlFor="questions" className="block text-xs font-semibold text-text-primary">
              One or two key questions you would like addressed during the conversation (Optional)
            </label>
            <textarea
              id="questions"
              rows={2}
              maxLength={400}
              value={formData.questions || ''}
              onChange={(e) => updateField('questions', e.target.value)}
              placeholder="e.g. How are peer institutions resolving agent accountability and auditability before live production clearance?"
              className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Confidentiality & Terms */}
      <div className="space-y-4 border-t border-border-subtle pt-6">
        <div id="field-confidentialityAccepted" className="flex items-start gap-3">
          <input
            id="confidentialityAccepted"
            type="checkbox"
            required
            checked={!!formData.confidentialityAccepted}
            onChange={(e) => updateField('confidentialityAccepted', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border-subtle bg-bg-base text-brand-primary focus:ring-brand-primary"
          />
          <label htmlFor="confidentialityAccepted" className="text-xs text-text-secondary leading-relaxed">
            I understand that all AIX Summit 2026 roundtables operate strictly under the{' '}
            <Link href="/legal/confidentiality" target="_blank" className="text-brand-secondary hover:underline font-medium">
              Chatham House Rule
            </Link>
            . Participants are free to use the insights gained, but neither the identity nor the organisation of any speaker or participant may be disclosed. *
          </label>
        </div>
        {errors.confidentialityAccepted && (
          <p className="text-xs text-brand-rose pl-7">{errors.confidentialityAccepted}</p>
        )}

        <div className="flex items-start gap-3">
          <input
            id="marketingConsent"
            type="checkbox"
            checked={!!formData.marketingConsent}
            onChange={(e) => updateField('marketingConsent', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border-subtle bg-bg-base text-brand-primary focus:ring-brand-primary"
          />
          <label htmlFor="marketingConsent" className="text-xs text-text-muted leading-relaxed">
            I agree to receive executive research publications, including the upcoming AIX Roundtable Signals report, from Risin Ventures. (Optional)
          </label>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full text-base font-semibold sm:w-auto"
        >
          Submit Invitation Request
        </Button>
        <p className="mt-3 text-xs text-text-muted">
          All requests are reviewed individually by the curatorial team. You will receive an assessment update within 3 working days.
        </p>
      </div>
    </form>
  );
}
