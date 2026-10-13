'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CTABand } from '@/components/content/CTABand';
import { getRoundtables, getAudienceData } from '@/lib/content';
import {
  CheckCircle2,
  Download,
  Shield,
  ArrowRight,
  Users,
  Award,
  Sparkles,
  FileCheck,
  ChevronDown,
  Clock,
} from 'lucide-react';
import {
  SponsorshipTiersModal,
  SPONSORSHIP_TIERS,
  type SponsorshipTier,
} from '@/components/sponsors/SponsorshipTiersModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createDirectInquiry,
  createProspectusDownload,
  fetchPartnershipInterests,
  fetchRoundtableLanes,
} from '@/store/partnership/partnershipActions';
import { resetDirectInquiry, resetProspectusDownload } from '@/store/partnership/partnershipSlice';
import { downloadFile } from '@/lib/download';

const PROSPECTUS_FILE_NAME = 'AIX-Summit-2026-Partnership-Prospectus.pdf';
// Served from public/pdf/AIX Brochure CXO 2.pdf
const PROSPECTUS_FILE_URL = '/pdf/AIX%20Brochure%20CXO%202.pdf';

export default function BecomeAPartnerPage() {
  const roundtables = getRoundtables();
  const audience = getAudienceData();

  // Tier modal state
  const [selectedTier, setSelectedTier] = useState<SponsorshipTier | null>(null);

  const dispatch = useAppDispatch();
  const { interests, roundtableLanes, prospectusDownload, directInquiry } = useAppSelector(
    (state) => state.partnership
  );

  // Prospectus form state
  const [prospectusForm, setProspectusForm] = useState({
    name: '',
    workEmail: '',
    organisation: '',
    role: '',
  });
  const prospectusSubmitted = prospectusDownload.status === 'succeeded';

  // Enquiry form state (interestId / roundtableId hold option ids from the API)
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    organisation: '',
    role: '',
    interestId: '',
    roundtableId: '',
    message: '',
  });
  const enquirySubmitted = directInquiry.status === 'succeeded';

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Load dropdown options
  useEffect(() => {
    if (interests.status === 'idle') dispatch(fetchPartnershipInterests());
    if (roundtableLanes.status === 'idle') dispatch(fetchRoundtableLanes());
  }, [dispatch, interests.status, roundtableLanes.status]);

  // Default the interest to the first option once loaded
  useEffect(() => {
    if (!enquiryForm.interestId && interests.data.length > 0) {
      setEnquiryForm((prev) => ({ ...prev, interestId: String(interests.data[0].id) }));
    }
  }, [interests.data, enquiryForm.interestId]);

  // Reset submission state when leaving the page
  useEffect(() => {
    return () => {
      dispatch(resetProspectusDownload());
      dispatch(resetDirectInquiry());
    };
  }, [dispatch]);

  const selectRoundtableBySlug = (slug: string) => {
    const lane = roundtableLanes.data.find((l) => l.value === slug);
    if (lane) setEnquiryForm((prev) => ({ ...prev, roundtableId: String(lane.id) }));
  };

  const selectInterestByTier = (tierName: string) => {
    const interest = interests.data.find(
      (i) => tierName.startsWith(i.name.split(' (')[0]) || i.name.startsWith(tierName)
    );
    if (interest) setEnquiryForm((prev) => ({ ...prev, interestId: String(interest.id) }));
  };

  const handleProspectusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      createProspectusDownload({
        full_name: prospectusForm.name,
        work_email: prospectusForm.workEmail,
        organisation: prospectusForm.organisation,
        role_title: prospectusForm.role,
      })
    );
    if (createProspectusDownload.fulfilled.match(result)) {
      downloadFile(PROSPECTUS_FILE_URL, PROSPECTUS_FILE_NAME);
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createDirectInquiry({
        full_name: enquiryForm.name,
        work_email: enquiryForm.email,
        organisation: enquiryForm.organisation,
        job_title: enquiryForm.role,
        partnership_interest_id: Number(enquiryForm.interestId),
        preferred_roundtable_lane_id: enquiryForm.roundtableId ? Number(enquiryForm.roundtableId) : null,
        strategic_focus_objectives: enquiryForm.message,
      })
    );
  };

  const chairBenefits = [
    'Named association with the roundtable across website, programme, and stage',
    'A senior sponsor executive leads the discussion as official Roundtable Chair',
    'A 5–7 minute opening perspective or production case study',
    'Up to two additional sponsor executives seated at the table',
    'Direct input into the core question and discussion framing',
    'Nomination of up to six senior enterprise guests for AIX curatorial consideration',
    'Curated, closed-door access to twelve senior enterprise decision-makers',
    'Opening perspective and thought-leadership positioning across summit communications',
    'Co-authorship and brand recognition in the published AIX Roundtable Signals research',
    'Priority 1-on-1 Enterprise Connections with relevant AI Showcase companies',
  ];

  const partnerFaqs = [
    {
      q: 'How are Roundtable Chair partnerships allocated?',
      a: 'Each of the six strategic roundtables has a single Chair partnership. Allocations are confirmed strictly on strategic alignment, regional presence, and domain capability.',
    },
    {
      q: 'Can a chair bring client guests to the table?',
      a: 'Yes. Chairs may nominate up to six qualified enterprise clients or prospective buyers for inclusion on the table seat plan, subject to standard curatorial seniority review by AIX.',
    },
    {
      q: 'Are commercial sales presentations permitted at the table?',
      a: 'No. Strict guardrails ensure roundtables remain substantive peer discussions. While chairs deliver an opening 5–7 minute strategic perspective, sessions are moderated independently and cannot be used for product sales.',
    },
    {
      q: 'What is the AIX Roundtable Signals publication?',
      a: 'Signals is our post-event institutional research report, published in mid-January 2027. Each table rapporteur records high-level anonymised findings, which are synthesised and co-attributed with the table chair for ongoing distribution.',
    },
    {
      q: 'Where can we review sponsorship investment tiers?',
      a: 'Detailed partnership investment tiers and asset specifications are contained within the AIX Summit 2026 Partnership Prospectus, available via the form below.',
    },
  ];

  const otherAssets = [
    {
      tier: 'Strategic Partner',
      headline: 'Summit-wide co-host positioning with highest brand authority.',
    },
    {
      tier: 'Knowledge Partner',
      headline: 'Editorial and research co-authorship across the Roundtable Signals report.',
    },
    {
      tier: 'AI Showcase Partner',
      headline: 'Sponsorship of the live working demonstration stages and showcase lounge.',
    },
    {
      tier: 'Networking Partner',
      headline: 'Exclusive association with the evening executive reception (16:30–18:00).',
    },
    {
      tier: 'Technology Partner',
      headline: 'Supporting sovereign compute, cloud, and digital infrastructure capabilities.',
    },
  ];

  return (
    <>
      {/* 1. Commercial Hero */}
      <Section variant="hero" className="pt-16 pb-20">
        <Container size="default">
          <div className="max-w-4xl">
            <Eyebrow accent="secondary" className="mb-3">
              Sponsorship & Executive Leadership
            </Eyebrow>
            <Heading level={1} size="hero" className="mb-6">
              Chair the conversation.
            </Heading>
            <Standfirst className="max-w-3xl">
              A topic, a room, twelve senior enterprise guests, and an enduring thought-leadership outcome that continues after the day. Roundtable Chair sponsorships represent the flagship commercial asset for AIX Summit 2026.
            </Standfirst>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="#chair-package" variant="primary" size="lg">
                View Chair Specifications
              </Button>
              <Button href="#prospectus" variant="secondary" size="lg">
                Download Prospectus
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Flagship Package: The Roundtable Chair */}
      <Section variant="raised" id="chair-package">
        <Container size="default">
          <div className="mb-12">
            <Eyebrow accent="primary" className="mb-2">
              Commercial Flagship
            </Eyebrow>
            <Heading level={2} size="xl">
              The Roundtable Chair Package
            </Heading>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Direct strategic association with one of the summit&apos;s six core discussion domains.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Benefits List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                Included Deliverables & Privileges
              </h3>

              <div className="space-y-3 pt-2">
                {chairBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-sm bg-bg-surface/50 p-3.5 border border-border-subtle">
                    <CheckCircle2 className="h-5 w-5 text-brand-secondary shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-text-primary leading-relaxed font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AIX Guarantees & Guardrails */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-lg border border-border-prominent bg-bg-surface/90 p-8 backdrop-blur-md shadow-card space-y-6">
                <div className="flex items-center gap-3 text-brand-primary">
                  <Shield className="h-6 w-6" />
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-text-primary">
                    AIX Quality Guarantees
                  </h3>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-text-secondary">
                  Our guardrails protect both the sponsor and the invited delegates, ensuring the room remains substantive and peer-level:
                </p>

                <ul className="space-y-3 text-xs text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>Strict Curatorial Control:</strong> AIX retains final approval on table composition to preserve peer seniority.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>Independent Moderation:</strong> Every table has an AIX moderator and rapporteur to drive focused interrogation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>No Sales Pitches:</strong> Chairs frame the business problem; tables do not become one-way vendor pitches.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0 mt-0.5" />
                    <span><strong>Chatham House Protection:</strong> Uncompromising confidentiality enables unreserved executive dialogue.</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-border-subtle">
                  <Button href="#enquiry" variant="primary" size="md" className="w-full">
                    Enquire to Chair a Table
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. The Six Roundtables Availability */}
      <Section variant="surface">
        <Container size="default">
          <div className="mb-10 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              Six Domain Opportunities
            </Eyebrow>
            <Heading level={2} size="lg">
              Available Roundtable Lanes
            </Heading>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-text-secondary">
              Six exclusive chair positions for 2026. Available on a first-confirmed basis:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roundtables.map((rt) => (
              <div
                key={rt.slug}
                className="flex flex-col justify-between rounded-lg border border-border-subtle bg-bg-raised/70 p-6 transition-all hover:border-border-prominent"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-xs font-bold text-brand-secondary uppercase tracking-wider">
                      Table {rt.order}
                    </span>
                    <span className="rounded-pill bg-bg-surface px-2.5 py-0.5 text-[10px] font-semibold text-brand-primary border border-border-subtle">
                      Chair Available
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-text-primary">
                    {rt.shortTitle}
                  </h3>
                  <p className="mt-2 text-xs italic text-text-secondary line-clamp-2">
                    &ldquo;{rt.coreQuestion}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
                  <Link
                    href={`/roundtables/${rt.slug}`}
                    className="text-xs font-semibold text-brand-secondary hover:underline"
                  >
                    View Brief →
                  </Link>
                  <Button
                    onClick={() => {
                      selectRoundtableBySlug(rt.slug);
                      document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-text-primary"
                  >
                    Select this table
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Audience Composition */}
      <Section variant="base">
        <Container size="default">
          <div className="mb-12 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              Audience Composition
            </Eyebrow>
            <Heading level={2} size="lg">
              Who Your Organisation Reaches
            </Heading>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-text-secondary">
              Seniority and industry breakdown for AIX Summit 2026 participants.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Seniority Mix */}
            <div className="rounded-lg border border-border-subtle bg-bg-raised/60 p-6 sm:p-8">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary mb-6">
                Seniority Breakdown
              </h3>
              <div className="space-y-4">
                {audience.seniority.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-text-primary">{item.label}</span>
                      <span className="font-mono text-brand-secondary">{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-pill bg-bg-surface overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-pill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Mix */}
            <div className="rounded-lg border border-border-subtle bg-bg-raised/60 p-6 sm:p-8">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary mb-6">
                Industry Sector Distribution
              </h3>
              <div className="space-y-4">
                {audience.sectors.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-text-primary">{item.label}</span>
                      <span className="font-mono text-brand-secondary">{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-pill bg-bg-surface overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-industrial to-brand-primary rounded-pill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Additional Sponsorship Tiers */}
      <Section variant="surface">
        <Container size="default">
          <div className="mb-10 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              Additional Assets
            </Eyebrow>
            <Heading level={2} size="lg">
              Complementary Sponsorship Tiers
            </Heading>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
              Select any tier below to inspect detailed deliverables, audience reach, and direct contact options.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SPONSORSHIP_TIERS.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedTier(asset)}
                className="group relative flex flex-col justify-between rounded-xl border border-purple-500/25 bg-bg-raised/70 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-brand-secondary hover:shadow-[0_15px_35px_-10px_rgba(168,85,247,0.35)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    <Sparkles className="h-3 w-3" />
                    <span>{asset.badge}</span>
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-text-primary group-hover:text-brand-secondary transition-colors">
                    {asset.tier}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {asset.tagline}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border-subtle/70 pt-4 text-[11px] font-semibold text-brand-secondary">
                  <span>View Details & Enquire</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Prospectus Download Form (Frictionless, no phone field) */}
      <Section variant="base" id="prospectus">
        <Container size="narrow">
          <div className="rounded-lg border border-border-prominent bg-bg-raised/80 p-8 sm:p-12 backdrop-blur-md shadow-card text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
              <Download className="h-6 w-6" />
            </div>
            <Heading level={2} size="md">
              Download the Partnership Prospectus
            </Heading>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary">
              Review full investment specifications, deliverables, and commercial asset breakdowns.
            </p>

            {prospectusSubmitted ? (
              <div className="mt-8 rounded-md bg-status-confirmed/10 p-6 border border-status-confirmed/30 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-status-confirmed mb-2" />
                <p className="text-sm font-semibold text-text-primary">
                  Your prospectus download has started.
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Download didn&apos;t start?{' '}
                  <a
                    href={PROSPECTUS_FILE_URL}
                    download={PROSPECTUS_FILE_NAME}
                    className="font-semibold text-brand-secondary hover:underline"
                  >
                    Click here to download
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleProspectusSubmit} className="mt-8 space-y-4 text-left">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={prospectusForm.name}
                      onChange={(e) => setProspectusForm({ ...prospectusForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={prospectusForm.workEmail}
                      onChange={(e) => setProspectusForm({ ...prospectusForm, workEmail: e.target.value })}
                      placeholder="name@company.com"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Organisation *</label>
                    <input
                      type="text"
                      required
                      value={prospectusForm.organisation}
                      onChange={(e) => setProspectusForm({ ...prospectusForm, organisation: e.target.value })}
                      placeholder="e.g. Technology Firm"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Role / Title *</label>
                    <input
                      type="text"
                      required
                      value={prospectusForm.role}
                      onChange={(e) => setProspectusForm({ ...prospectusForm, role: e.target.value })}
                      placeholder="e.g. VP Marketing & Alliances"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                </div>

                {prospectusDownload.error && (
                  <p role="alert" className="rounded border border-brand-rose/40 bg-brand-rose/10 p-3 text-xs text-brand-rose">
                    {prospectusDownload.error}
                  </p>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={prospectusDownload.status === 'loading'}
                  >
                    <span>Request Prospectus (PDF)</span>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Container>
      </Section>

      {/* 7. Direct Partnership Enquiry Form */}
      <Section variant="raised" id="enquiry">
        <Container size="narrow">
          <div className="rounded-lg border border-border-subtle bg-bg-surface/80 p-8 sm:p-12 shadow-card">
            <Eyebrow accent="secondary" className="mb-2 text-center">
              Direct Inquiries
            </Eyebrow>
            <Heading level={2} size="md" className="text-center">
              Partnership & Roundtable Chair Enquiry
            </Heading>
            <p className="mx-auto mt-2 text-center text-xs sm:text-sm text-text-secondary">
              Connect directly with the AIX Summit partnership leadership.
            </p>

            {enquirySubmitted ? (
              <div className="mt-8 rounded-md bg-status-confirmed/10 p-6 border border-status-confirmed/30 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-status-confirmed mb-2" />
                <p className="text-sm font-semibold text-text-primary">
                  Thank you for your partnership enquiry.
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Our partnerships director will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="mt-8 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Jane Smith"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Organisation *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.organisation}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, organisation: e.target.value })}
                      placeholder="e.g. Enterprise Solutions Corp"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.role}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, role: e.target.value })}
                      placeholder="e.g. Chief Commercial Officer"
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="partner-interest" className="block text-xs font-semibold text-text-primary">Partnership Interest *</label>
                    <select
                      id="partner-interest"
                      required
                      value={enquiryForm.interestId}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, interestId: e.target.value })}
                      disabled={interests.status === 'loading'}
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
                    >
                      {interests.data.length === 0 && (
                        <option value="">
                          {interests.status === 'loading' ? 'Loading…' : 'No options available'}
                        </option>
                      )}
                      {interests.data.map((interest) => (
                        <option key={interest.id} value={interest.id}>
                          {interest.name}
                        </option>
                      ))}
                    </select>
                    {interests.error && (
                      <p className="mt-1 text-xs text-brand-rose">{interests.error}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="partner-roundtable-lane" className="block text-xs font-semibold text-text-primary">Preferred Roundtable Lane</label>
                    <select
                      id="partner-roundtable-lane"
                      value={enquiryForm.roundtableId}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, roundtableId: e.target.value })}
                      disabled={roundtableLanes.status === 'loading'}
                      className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none"
                    >
                      <option value="">
                        {roundtableLanes.status === 'loading' ? 'Loading…' : 'Select a roundtable lane'}
                      </option>
                      {roundtableLanes.data.map((lane) => (
                        <option key={lane.id} value={lane.id}>
                          {lane.name}
                        </option>
                      ))}
                    </select>
                    {roundtableLanes.error && (
                      <p className="mt-1 text-xs text-brand-rose">{roundtableLanes.error}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary">Strategic Focus or Objectives</label>
                  <textarea
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="Briefly state your strategic objectives or questions regarding the partnership."
                    className="mt-1 w-full rounded-sm border border-border-subtle bg-bg-base p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                  />
                </div>

                {directInquiry.error && (
                  <p role="alert" className="rounded border border-brand-rose/40 bg-brand-rose/10 p-3 text-xs text-brand-rose">
                    {directInquiry.error}
                  </p>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={directInquiry.status === 'loading'}
                    disabled={!enquiryForm.interestId}
                  >
                    Submit Partnership Enquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Container>
      </Section>

      {/* 8. Partner FAQ Accordion */}
      <Section variant="surface">
        <Container size="narrow">
          <div className="mb-10 text-center">
            <Eyebrow accent="secondary" className="mb-2">
              Questions & Answers
            </Eyebrow>
            <Heading level={2} size="md">
              Partner FAQ
            </Heading>
          </div>

          <div className="space-y-3">
            {partnerFaqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-md border border-border-subtle bg-bg-raised/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left font-display text-sm font-bold text-text-primary hover:text-brand-secondary"
                  aria-expanded={activeFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-text-muted transition-transform duration-fast ${
                      activeFaq === idx ? 'rotate-180 text-brand-secondary' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-text-secondary border-t border-border-subtle">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTABand />

      {/* Interactive Sponsorship Tiers Depth Modal */}
      <SponsorshipTiersModal
        selectedTier={selectedTier}
        onClose={() => setSelectedTier(null)}
        onContactClick={(tier) => {
          setSelectedTier(null);
          selectInterestByTier(tier.tier);
          document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </>
  );
}
