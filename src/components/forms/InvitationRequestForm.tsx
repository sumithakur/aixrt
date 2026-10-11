'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getRoundtables } from '@/lib/content';
import {
  cxoInvitationSchema,
  startupInvitationSchema,
  type CxoInvitationData,
  type StartupInvitationData,
} from '@/lib/schemas/invitation';
import { ShieldCheck, Info, UserCheck, Rocket, CheckCircle2 } from 'lucide-react';

export function InvitationRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roundtables = getRoundtables();

  const [applicantType, setApplicantType] = useState<'cxo' | 'startup'>('cxo');

  // CXO Form State
  const [cxoData, setCxoData] = useState<Partial<CxoInvitationData>>({
    applicantType: 'cxo',
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

  // Startup Form State
  const [startupData, setStartupData] = useState<Partial<StartupInvitationData>>({
    applicantType: 'startup',
    companyName: '',
    website: '',
    fullName: '',
    jobTitle: '',
    workEmail: '',
    mobile: '+974 ',
    country: 'Qatar',
    stage: 'Series A',
    oneLiner: '',
    problemSolved: '',
    deploymentsEvidence: '',
    demoDescription: '',
    hasVideoDemo: 'yes',
    roundtableFocus: '',
    confidentialityAccepted: false as unknown as true,
    marketingConsent: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from query param and load from sessionStorage
  useEffect(() => {
    const prefilledRoundtable = searchParams.get('roundtable');
    const prefilledType = searchParams.get('type');
    if (prefilledType === 'startup' || prefilledType === 'showcase') {
      setApplicantType('startup');
    }

    const savedCxo = sessionStorage.getItem('aix_invitation_draft_cxo');
    if (savedCxo) {
      try {
        const parsed = JSON.parse(savedCxo);
        setCxoData((prev) => ({
          ...prev,
          ...parsed,
          priority1Roundtable: prefilledRoundtable || parsed.priority1Roundtable || '',
          priority2Roundtable: parsed.priority2Roundtable || '',
        }));
      } catch (e) {}
    } else if (prefilledRoundtable) {
      setCxoData((prev) => ({ ...prev, priority1Roundtable: prefilledRoundtable }));
    }

    const savedStartup = sessionStorage.getItem('aix_invitation_draft_startup');
    if (savedStartup) {
      try {
        const parsed = JSON.parse(savedStartup);
        setStartupData((prev) => ({
          ...prev,
          ...parsed,
          roundtableFocus: prefilledRoundtable || parsed.roundtableFocus || '',
        }));
      } catch (e) {}
    } else if (prefilledRoundtable) {
      setStartupData((prev) => ({ ...prev, roundtableFocus: prefilledRoundtable }));
    }
  }, [searchParams]);

  const updateCxoField = (field: keyof CxoInvitationData, value: any) => {
    setCxoData((prev) => {
      const next = { ...prev, [field]: value };
      sessionStorage.setItem('aix_invitation_draft_cxo', JSON.stringify(next));
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

  const updateStartupField = (field: keyof StartupInvitationData, value: any) => {
    setStartupData((prev) => {
      const next = { ...prev, [field]: value };
      sessionStorage.setItem('aix_invitation_draft_startup', JSON.stringify(next));
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

  const selectedFirstChoice = roundtables.find((rt) => rt.slug === cxoData.priority1Roundtable);
  const selectedFirstSession = selectedFirstChoice ? selectedFirstChoice.session : null;
  const availableSecondChoices = selectedFirstSession
    ? roundtables.filter((rt) => rt.session !== selectedFirstSession)
    : roundtables;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = applicantType === 'cxo' ? cxoData : startupData;
    const schema = applicantType === 'cxo' ? cxoInvitationSchema : startupInvitationSchema;

    const result = schema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);

      const firstErrorField = Object.keys(fieldErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const res = await fetch('/api/invitation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Submission failed');
      }

      sessionStorage.removeItem(
        applicantType === 'cxo' ? 'aix_invitation_draft_cxo' : 'aix_invitation_draft_startup'
      );
      router.push('/request-an-invitation/received');
    } catch (err: any) {
      setErrors({ form: err.message || 'Something went wrong. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 2-Option Selector Toggle */}
      <div className="rounded-xl border border-border-prominent bg-bg-surface/90 p-3 sm:p-4 backdrop-blur-md shadow-card">
        <label className="block text-center font-display text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
          Select Your Application Track
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setApplicantType('cxo');
              setErrors({});
            }}
            className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
              applicantType === 'cxo'
                ? 'border-brand-primary bg-bg-raised text-text-primary shadow-glow ring-1 ring-brand-primary'
                : 'border-border-subtle bg-bg-base/70 text-text-secondary hover:border-border-prominent hover:text-text-primary'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                applicantType === 'cxo'
                  ? 'border-brand-primary bg-brand-primary/20 text-brand-primary'
                  : 'border-border-subtle bg-bg-surface text-text-muted'
              }`}
            >
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-text-primary flex items-center gap-2">
                Enterprise Leader / CXO
                {applicantType === 'cxo' && <CheckCircle2 className="h-4 w-4 text-brand-primary" />}
              </div>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                For C-Suite, Managing Directors, state leaders, and institutional decision-makers requesting a roundtable seat.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setApplicantType('startup');
              setErrors({});
            }}
            className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
              applicantType === 'startup'
                ? 'border-brand-secondary bg-bg-raised text-text-primary shadow-glow ring-1 ring-brand-secondary'
                : 'border-border-subtle bg-bg-base/70 text-text-secondary hover:border-border-prominent hover:text-text-primary'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                applicantType === 'startup'
                  ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary'
                  : 'border-border-subtle bg-bg-surface text-text-muted'
              }`}
            >
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-text-primary flex items-center gap-2">
                AI Vendor / Startup
                {applicantType === 'startup' && <CheckCircle2 className="h-4 w-4 text-brand-secondary" />}
              </div>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                For founders, AI vendors, and enterprise startups applying to demonstrate live working software to the executive room.
              </p>
            </div>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-8 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10 backdrop-blur-sm shadow-card"
      >
        {errors.form && (
          <div className="rounded border border-brand-rose/40 bg-brand-rose/10 p-4 text-sm text-brand-rose">
            {errors.form}
          </div>
        )}

        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">Leave blank</label>
          <input
            id="honeypot"
            type="text"
            value={applicantType === 'cxo' ? cxoData.honeypot || '' : startupData.honeypot || ''}
            onChange={(e) =>
              applicantType === 'cxo'
                ? updateCxoField('honeypot', e.target.value)
                : updateStartupField('honeypot', e.target.value)
            }
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* -------------------- CXO TRACK FORM -------------------- */}
        {applicantType === 'cxo' && (
          <>
            {/* Section 1: Delegate Information */}
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
                    value={cxoData.fullName || ''}
                    onChange={(e) => updateCxoField('fullName', e.target.value)}
                    placeholder="e.g. Dr. Sarah Al-Kuwari"
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.fullName ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.fullName && <p id="fullName-error" className="mt-1 text-xs text-brand-rose">{errors.fullName}</p>}
                </div>

                <div id="field-workEmail">
                  <label htmlFor="workEmail" className="block text-xs font-semibold text-text-primary">
                    Work Email *
                  </label>
                  <input
                    id="workEmail"
                    type="email"
                    required
                    value={cxoData.workEmail || ''}
                    onChange={(e) => updateCxoField('workEmail', e.target.value)}
                    placeholder="name@organisation.com"
                    aria-describedby={errors.workEmail ? 'workEmail-error' : undefined}
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.workEmail ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.workEmail && <p id="workEmail-error" className="mt-1 text-xs text-brand-rose">{errors.workEmail}</p>}
                </div>

                <div id="field-mobile">
                  <label htmlFor="mobile" className="block text-xs font-semibold text-text-primary">
                    Mobile Phone (International format) *
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    value={cxoData.mobile || ''}
                    onChange={(e) => updateCxoField('mobile', e.target.value)}
                    placeholder="+974 5500 0000"
                    aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.mobile ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.mobile && <p id="mobile-error" className="mt-1 text-xs text-brand-rose">{errors.mobile}</p>}
                </div>

                <div id="field-country">
                  <label htmlFor="country" className="block text-xs font-semibold text-text-primary">
                    Country of Residence *
                  </label>
                  <input
                    id="country"
                    type="text"
                    required
                    value={cxoData.country || ''}
                    onChange={(e) => updateCxoField('country', e.target.value)}
                    placeholder="e.g. Qatar, UAE, Saudi Arabia"
                    aria-describedby={errors.country ? 'country-error' : undefined}
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.country ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.country && <p id="country-error" className="mt-1 text-xs text-brand-rose">{errors.country}</p>}
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
                    value={cxoData.organisation || ''}
                    onChange={(e) => updateCxoField('organisation', e.target.value)}
                    placeholder="e.g. Qatari Financial Institution"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.organisation ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.organisation && <p className="mt-1 text-xs text-brand-rose">{errors.organisation}</p>}
                </div>

                <div id="field-jobTitle">
                  <label htmlFor="jobTitle" className="block text-xs font-semibold text-text-primary">
                    Job Title *
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    required
                    value={cxoData.jobTitle || ''}
                    onChange={(e) => updateCxoField('jobTitle', e.target.value)}
                    placeholder="e.g. Chief Information Officer"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.jobTitle ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.jobTitle && <p className="mt-1 text-xs text-brand-rose">{errors.jobTitle}</p>}
                </div>

                <div id="field-seniority">
                  <label htmlFor="seniority" className="block text-xs font-semibold text-text-primary">
                    Seniority Level *
                  </label>
                  <select
                    id="seniority"
                    required
                    value={cxoData.seniority || ''}
                    onChange={(e) => updateCxoField('seniority', e.target.value as any)}
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
                  {errors.seniority && <p className="mt-1 text-xs text-brand-rose">{errors.seniority}</p>}
                </div>

                <div id="field-orgSize">
                  <label htmlFor="orgSize" className="block text-xs font-semibold text-text-primary">
                    Organisation Headcount *
                  </label>
                  <select
                    id="orgSize"
                    required
                    value={cxoData.orgSize || ''}
                    onChange={(e) => updateCxoField('orgSize', e.target.value as any)}
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
                  {errors.orgSize && <p className="mt-1 text-xs text-brand-rose">{errors.orgSize}</p>}
                </div>

                <div id="field-industry" className="sm:col-span-2">
                  <label htmlFor="industry" className="block text-xs font-semibold text-text-primary">
                    Industry Sector *
                  </label>
                  <input
                    id="industry"
                    type="text"
                    required
                    value={cxoData.industry || ''}
                    onChange={(e) => updateCxoField('industry', e.target.value)}
                    placeholder="e.g. Banking & Capital Markets, Sovereign AI, Energy, Logistics, Healthcare"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.industry ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.industry && <p className="mt-1 text-xs text-brand-rose">{errors.industry}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Roundtable Selection */}
            <div className="pt-4">
              <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
                3. Roundtable Preferences & Curatorial Perspective
              </h3>

              <div className="mt-6 space-y-6">
                <div id="field-priority1Roundtable">
                  <label htmlFor="priority1Roundtable" className="block text-xs font-semibold text-text-primary">
                    Session 1 Roundtable Choice (14:30 – 16:00) *
                  </label>
                  <select
                    id="priority1Roundtable"
                    required
                    value={cxoData.priority1Roundtable || ''}
                    onChange={(e) => {
                      updateCxoField('priority1Roundtable', e.target.value);
                      updateCxoField('priority2Roundtable', '');
                    }}
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none ${
                      errors.priority1Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  >
                    <option value="" disabled>Select your Session 1 roundtable</option>
                    {roundtables.map((rt) => (
                      <option key={rt.slug} value={rt.slug}>
                        Session {rt.session || 1} - Table {rt.order}: {rt.shortTitle}
                      </option>
                    ))}
                    <option value="not-sure">Not sure / Open to curatorial allocation</option>
                  </select>
                  {errors.priority1Roundtable && <p className="mt-1 text-xs text-brand-rose">{errors.priority1Roundtable}</p>}
                </div>

                <div id="field-priority2Roundtable">
                  <label htmlFor="priority2Roundtable" className="block text-xs font-semibold text-text-primary">
                    Session 2 Roundtable Choice (16:30 – 18:00) *
                  </label>
                  <select
                    id="priority2Roundtable"
                    required
                    value={cxoData.priority2Roundtable || ''}
                    onChange={(e) => updateCxoField('priority2Roundtable', e.target.value)}
                    disabled={!cxoData.priority1Roundtable || cxoData.priority1Roundtable === 'not-sure'}
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none disabled:opacity-50 ${
                      errors.priority2Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  >
                    <option value="" disabled>
                      {!cxoData.priority1Roundtable || cxoData.priority1Roundtable === 'not-sure'
                        ? 'Select first choice first'
                        : 'Select your Session 2 roundtable choice'}
                    </option>
                    {availableSecondChoices.map((rt) => (
                      <option key={rt.slug} value={rt.slug}>
                        Session {rt.session || 1} - Table {rt.order}: {rt.shortTitle}
                      </option>
                    ))}
                    <option value="not-sure">Not sure / Open to curatorial allocation</option>
                  </select>
                  {errors.priority2Roundtable && <p className="mt-1 text-xs text-brand-rose">{errors.priority2Roundtable}</p>}
                  <p className="mt-1.5 text-[11px] text-text-muted">
                    Participants join one table per 75-minute session.
                  </p>
                </div>

                <div id="field-contribution">
                  <div className="flex items-center justify-between">
                    <label htmlFor="contribution" className="block text-xs font-semibold text-text-primary">
                      What practical deployment challenge or governance perspective will you share? *
                    </label>
                    <span className="text-xs text-text-muted">{(cxoData.contribution || '').length} / 400</span>
                  </div>
                  <textarea
                    id="contribution"
                    required
                    rows={3}
                    maxLength={400}
                    value={cxoData.contribution || ''}
                    onChange={(e) => updateCxoField('contribution', e.target.value)}
                    placeholder="Briefly describe an AI initiative you are deploying, governing, or evaluating (min 20 characters)."
                    className={`mt-2 w-full rounded-sm border bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.contribution ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.contribution && <p className="mt-1 text-xs text-brand-rose">{errors.contribution}</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {/* -------------------- STARTUP TRACK FORM -------------------- */}
        {applicantType === 'startup' && (
          <>
            <div>
              <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
                1. AI Vendor / Startup Details
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div id="field-companyName">
                  <label htmlFor="companyName" className="block text-xs font-semibold text-text-primary">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={startupData.companyName || ''}
                    onChange={(e) => updateStartupField('companyName', e.target.value)}
                    placeholder="e.g. Cognitive Systems AI"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.companyName ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-brand-rose">{errors.companyName}</p>}
                </div>

                <div id="field-website">
                  <label htmlFor="website" className="block text-xs font-semibold text-text-primary">
                    Company Website *
                  </label>
                  <input
                    id="website"
                    type="url"
                    required
                    value={startupData.website || ''}
                    onChange={(e) => updateStartupField('website', e.target.value)}
                    placeholder="https://company.ai"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.website ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.website && <p className="mt-1 text-xs text-brand-rose">{errors.website}</p>}
                </div>

                <div id="field-fullName">
                  <label htmlFor="startup-fullName" className="block text-xs font-semibold text-text-primary">
                    Founder / Contact Name *
                  </label>
                  <input
                    id="startup-fullName"
                    type="text"
                    required
                    value={startupData.fullName || ''}
                    onChange={(e) => updateStartupField('fullName', e.target.value)}
                    placeholder="e.g. Tariq Al-Mansoor"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.fullName ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-brand-rose">{errors.fullName}</p>}
                </div>

                <div id="field-jobTitle">
                  <label htmlFor="startup-jobTitle" className="block text-xs font-semibold text-text-primary">
                    Role / Title *
                  </label>
                  <input
                    id="startup-jobTitle"
                    type="text"
                    required
                    value={startupData.jobTitle || ''}
                    onChange={(e) => updateStartupField('jobTitle', e.target.value)}
                    placeholder="e.g. Co-Founder & CEO"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.jobTitle ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.jobTitle && <p className="mt-1 text-xs text-brand-rose">{errors.jobTitle}</p>}
                </div>

                <div id="field-workEmail">
                  <label htmlFor="startup-workEmail" className="block text-xs font-semibold text-text-primary">
                    Work Email *
                  </label>
                  <input
                    id="startup-workEmail"
                    type="email"
                    required
                    value={startupData.workEmail || ''}
                    onChange={(e) => updateStartupField('workEmail', e.target.value)}
                    placeholder="tariq@company.ai"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.workEmail ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.workEmail && <p className="mt-1 text-xs text-brand-rose">{errors.workEmail}</p>}
                </div>

                <div id="field-mobile">
                  <label htmlFor="startup-mobile" className="block text-xs font-semibold text-text-primary">
                    Mobile Phone (International format) *
                  </label>
                  <input
                    id="startup-mobile"
                    type="tel"
                    required
                    value={startupData.mobile || ''}
                    onChange={(e) => updateStartupField('mobile', e.target.value)}
                    placeholder="+974 5500 0000"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.mobile ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.mobile && <p className="mt-1 text-xs text-brand-rose">{errors.mobile}</p>}
                </div>

                <div id="field-country">
                  <label htmlFor="startup-country" className="block text-xs font-semibold text-text-primary">
                    Headquarters Country *
                  </label>
                  <input
                    id="startup-country"
                    type="text"
                    required
                    value={startupData.country || ''}
                    onChange={(e) => updateStartupField('country', e.target.value)}
                    placeholder="e.g. Qatar, UAE, Saudi Arabia, UK"
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.country ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.country && <p className="mt-1 text-xs text-brand-rose">{errors.country}</p>}
                </div>

                <div id="field-stage">
                  <label htmlFor="startup-stage" className="block text-xs font-semibold text-text-primary">
                    Funding / Company Stage *
                  </label>
                  <select
                    id="startup-stage"
                    required
                    value={startupData.stage || ''}
                    onChange={(e) => updateStartupField('stage', e.target.value)}
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none ${
                      errors.stage ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  >
                    <option value="Seed / Pre-Series A">Seed / Pre-Series A</option>
                    <option value="Series A">Series A (Verified enterprise deployments)</option>
                    <option value="Series B+">Series B+ (Scaling commercially)</option>
                    <option value="Bootstrapped / Profitable">Bootstrapped / Profitable Enterprise</option>
                  </select>
                  {errors.stage && <p className="mt-1 text-xs text-brand-rose">{errors.stage}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Product & Showcase Utility */}
            <div className="pt-4">
              <h3 className="border-b border-border-subtle pb-3 font-display text-base font-bold uppercase tracking-wider text-brand-secondary">
                2. Enterprise Product & Demonstration Plan
              </h3>

              <div className="mt-6 space-y-6">
                <div id="field-oneLiner">
                  <label htmlFor="oneLiner" className="block text-xs font-semibold text-text-primary">
                    One-Line Product Summary *
                  </label>
                  <input
                    id="oneLiner"
                    type="text"
                    required
                    value={startupData.oneLiner || ''}
                    onChange={(e) => updateStartupField('oneLiner', e.target.value)}
                    placeholder="e.g. Autonomous agent platform for AML transaction triage across GCC banking networks."
                    className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.oneLiner ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.oneLiner && <p className="mt-1 text-xs text-brand-rose">{errors.oneLiner}</p>}
                </div>

                <div id="field-problemSolved">
                  <label htmlFor="problemSolved" className="block text-xs font-semibold text-text-primary">
                    Enterprise Problem Solved *
                  </label>
                  <textarea
                    id="problemSolved"
                    rows={3}
                    required
                    value={startupData.problemSolved || ''}
                    onChange={(e) => updateStartupField('problemSolved', e.target.value)}
                    placeholder="Describe the specific operational hurdle, risk exposure, or cost inefficiency your software eliminates."
                    className={`mt-2 w-full rounded-sm border bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.problemSolved ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.problemSolved && <p className="mt-1 text-xs text-brand-rose">{errors.problemSolved}</p>}
                </div>

                <div id="field-deploymentsEvidence">
                  <label htmlFor="deploymentsEvidence" className="block text-xs font-semibold text-text-primary">
                    Evidence of Live Production Use *
                  </label>
                  <textarea
                    id="deploymentsEvidence"
                    rows={3}
                    required
                    value={startupData.deploymentsEvidence || ''}
                    onChange={(e) => updateStartupField('deploymentsEvidence', e.target.value)}
                    placeholder="Provide evidence of verified deployments: active enterprise clients, transaction volumes, or audited ROI metrics."
                    className={`mt-2 w-full rounded-sm border bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.deploymentsEvidence ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.deploymentsEvidence && <p className="mt-1 text-xs text-brand-rose">{errors.deploymentsEvidence}</p>}
                </div>

                <div id="field-demoDescription">
                  <label htmlFor="demoDescription" className="block text-xs font-semibold text-text-primary">
                    Live Demonstration Concept (Slides strictly prohibited) *
                  </label>
                  <textarea
                    id="demoDescription"
                    rows={3}
                    required
                    value={startupData.demoDescription || ''}
                    onChange={(e) => updateStartupField('demoDescription', e.target.value)}
                    placeholder="How will your product be shown working live? (Demonstration must show actual system execution directly to executives)."
                    className={`mt-2 w-full rounded-sm border bg-bg-base p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                      errors.demoDescription ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                    }`}
                  />
                  {errors.demoDescription && <p className="mt-1 text-xs text-brand-rose">{errors.demoDescription}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div id="field-hasVideoDemo">
                    <label htmlFor="startup-video-demo" className="block text-xs font-semibold text-text-primary">
                      Can a pre-recorded demo video be supplied for technical review? *
                    </label>
                    <select
                      id="startup-video-demo"
                      value={startupData.hasVideoDemo || 'yes'}
                      onChange={(e) => updateStartupField('hasVideoDemo', e.target.value)}
                      className="mt-2 w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
                    >
                      <option value="yes">Yes — Available upon request</option>
                      <option value="ready">Yes — Link ready</option>
                      <option value="no">No — Live walkthrough only</option>
                    </select>
                  </div>

                  <div id="field-roundtableFocus">
                    <label htmlFor="startup-roundtableFocus" className="block text-xs font-semibold text-text-primary">
                      Most Relevant Roundtable Lane *
                    </label>
                    <select
                      id="startup-roundtableFocus"
                      required
                      value={startupData.roundtableFocus || ''}
                      onChange={(e) => updateStartupField('roundtableFocus', e.target.value)}
                      className={`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none ${
                        errors.roundtableFocus ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
                      }`}
                    >
                      <option value="" disabled>Select associated roundtable</option>
                      {roundtables.map((rt) => (
                        <option key={rt.slug} value={rt.slug}>
                          Table {rt.order}: {rt.shortTitle}
                        </option>
                      ))}
                    </select>
                    {errors.roundtableFocus && <p className="mt-1 text-xs text-brand-rose">{errors.roundtableFocus}</p>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Section 4: Governance & Submission */}
        <div className="pt-4 border-t border-border-subtle space-y-6">
          <div id="field-confidentialityAccepted" className="flex items-start gap-3">
            <input
              id="confidentialityAccepted"
              type="checkbox"
              required
              checked={
                applicantType === 'cxo'
                  ? !!cxoData.confidentialityAccepted
                  : !!startupData.confidentialityAccepted
              }
              onChange={(e) =>
                applicantType === 'cxo'
                  ? updateCxoField('confidentialityAccepted', e.target.checked)
                  : updateStartupField('confidentialityAccepted', e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-border-subtle bg-bg-base text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="confidentialityAccepted" className="text-xs leading-relaxed text-text-secondary">
              I acknowledge that AIX Summit 2026 operates under the{' '}
              <Link href="/legal/confidentiality" className="text-brand-secondary underline hover:text-brand-secondary-hover" target="_blank">
                Chatham House Rule
              </Link>{' '}
              and that all invitations and showcase slots are subject to strict curatorial committee review. *
            </label>
          </div>
          {errors.confidentialityAccepted && (
            <p className="text-xs text-brand-rose">{errors.confidentialityAccepted}</p>
          )}

          <div id="field-marketingConsent" className="flex items-start gap-3">
            <input
              id="marketingConsent"
              type="checkbox"
              checked={
                applicantType === 'cxo'
                  ? !!cxoData.marketingConsent
                  : !!startupData.marketingConsent
              }
              onChange={(e) =>
                applicantType === 'cxo'
                  ? updateCxoField('marketingConsent', e.target.checked)
                  : updateStartupField('marketingConsent', e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-border-subtle bg-bg-base text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="marketingConsent" className="text-xs leading-relaxed text-text-secondary">
              I agree to receive the post-event <em>AIX Roundtable Signals</em> research publication and official summit briefings from Risin Ventures.
            </label>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {applicantType === 'cxo' ? 'Register for Executive Seat' : 'Register AI Vendor / Startup'}
            </Button>
            <span className="text-[11px] text-text-muted">
              Evaluated strictly against domain seniority and balance.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
