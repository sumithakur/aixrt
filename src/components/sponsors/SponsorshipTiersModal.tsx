'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Mail, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface SponsorshipTier {
  id: string;
  tier: string;
  tagline: string;
  badge: string;
  overview: string;
  deliverables: string[];
  audienceReach: string;
  investmentNote: string;
}

export const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    id: 'strategic',
    tier: 'Strategic Partner',
    tagline: 'Summit-wide co-host positioning with highest brand authority.',
    badge: 'Flagship Co-Host',
    overview:
      'The premier commercial alignment at AIX Summit. Strategic Partners sit alongside Risin Ventures as summit co-conveners, establishing definitive authority across regional enterprise AI transformation.',
    deliverables: [
      'Summit-wide naming co-association across all physical, digital, and media assets',
      'VIP keynote or plenary executive conversation on the main summit stage',
      'Guaranteed Roundtable Chair ownership for a chosen strategic domain',
      'Up to 6 executive seats across roundtables and plenary sessions',
      'Lead co-authorship and brand recognition on the front cover of the AIX Roundtable Signals research publication',
      'Private executive green-room access and bilateral meeting facilitation',
    ],
    audienceReach: 'Complete summit delegation (110+ CXOs) & GCC media reach',
    investmentNote: 'Strictly limited to 2 non-competing organisations per edition',
  },
  {
    id: 'chair',
    tier: 'Roundtable Chair Sponsor',
    tagline: 'Strategic ownership of 1 of 6 closed-door executive rooms with 15 peer leaders.',
    badge: 'Core Commercial Asset',
    overview:
      'Direct, uninterrupted access to 15 qualified buyers and decision-makers in your domain. As the official Chair, your senior executive frames the debate, presents real production case studies, and steers the 75-minute closed-door dialogue.',
    deliverables: [
      'Official Chairmanship of a chosen roundtable lane (BFSI, Government, Investment in AI, etc.)',
      '5–7 minute opening strategic perspective delivered by your senior executive',
      '3 executive seats at the roundtable (Chair + 2 senior colleagues)',
      'Nomination of up to 6 priority enterprise clients/prospects for seat allocation',
      'Full brand association on roundtable signage, digital screens, and session summary documents',
      'Co-authorship of your domain chapter in the published AIX Roundtable Signals report',
    ],
    audienceReach: '15 curated senior executives per room + 110 at networking breaks',
    investmentNote: 'Strictly 1 Chair sponsor per roundtable track (6 total)',
  },
  {
    id: 'knowledge',
    tier: 'Knowledge Partner',
    tagline: 'Editorial and research co-authorship across the Roundtable Signals report.',
    badge: 'Thought Leadership',
    overview:
      'Position your firm as the foremost intellectual and strategic authority on enterprise AI adoption. Knowledge Partners co-produce the official post-summit Signals research report distributed to over 1,200 GCC institutional leaders.',
    deliverables: [
      'Editorial co-design of roundtable question frameworks and synthesis criteria',
      'Co-branded publication of the full AIX Roundtable Signals research report in Jan 2027',
      'Author executive summary foreword distributed to government and enterprise leadership',
      'Dedicated rapporteur presence across all 6 roundtable sessions',
      '2 delegate seats for senior analysts or advisory partners at the summit',
      'Prominent branding across stage backdrops and official digital channels',
    ],
    audienceReach: '1,200+ GCC executives via post-event research distribution',
    investmentNote: 'Exclusive to 1 management consultancy / research institution',
  },
  {
    id: 'networking',
    tier: 'Networking Partner',
    tagline: 'Exclusive association with the executive reception & connections lounge.',
    badge: 'Relationship Building',
    overview:
      'Connect with the entire summit delegation in a relaxed, high-trust executive atmosphere. Networking Partners host the opening coffee arrival, the inter-session connections break, and the closing networking reception.',
    deliverables: [
      'Exclusive branding across the Executive Lounge, Networking Break, and Closing Reception',
      'Opportunity to deliver a short welcoming toast during the closing networking cocktail',
      'Branded hospitality items, executive napkins, and premium digital screen presence',
      '3 full summit delegate passes with access to plenary sessions and networking',
      'Facilitated introductions to speakers, chairs, and enterprise delegates during breaks',
      'Logo and sponsorship acknowledgement in the printed participant directory',
    ],
    audienceReach: 'Full summit delegation (110 participants) during key networking moments',
    investmentNote: 'Strictly limited to 1 exclusive hospitality & networking sponsor',
  },
];

interface SponsorshipTiersModalProps {
  selectedTier: SponsorshipTier | null;
  onClose: () => void;
  onContactClick: (tier: SponsorshipTier) => void;
}

export function SponsorshipTiersModal({
  selectedTier,
  onClose,
  onContactClick,
}: SponsorshipTiersModalProps) {
  const [quickContactSent, setQuickContactSent] = useState(false);
  const [quickForm, setQuickForm] = useState({ name: '', email: '', org: '', message: '' });

  if (!selectedTier) return null;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickForm.name && quickForm.email) {
      setQuickContactSent(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-tier-title"
    >
      {/* Backdrop with depth effect */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container: Depth effect with purple glow ring, not covering entire screen */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#160c2b] via-[#100820] to-[#0a0515] p-6 sm:p-8 text-text-primary shadow-[0_25px_60px_-15px_rgba(168,85,247,0.35)] ring-1 ring-white/10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-text-muted hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{selectedTier.badge}</span>
          </div>

          <h3 id="modal-tier-title" className="font-display text-2xl sm:text-3xl font-bold text-white">
            {selectedTier.tier}
          </h3>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {selectedTier.tagline}
          </p>
        </div>

        {/* Overview */}
        <div className="mt-5 border-t border-border-subtle pt-4">
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {selectedTier.overview}
          </p>
        </div>

        {/* Deliverables */}
        <div className="mt-6 space-y-3">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-secondary">
            Key Deliverables & Specifications
          </h4>
          <ul className="space-y-2.5">
            {selectedTier.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-secondary mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Meta Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg border border-border-subtle bg-bg-base/70 p-4 text-xs">
          <div>
            <span className="block font-semibold text-text-muted">Target Audience Reach:</span>
            <span className="text-text-primary font-medium">{selectedTier.audienceReach}</span>
          </div>
          <div>
            <span className="block font-semibold text-text-muted">Allocation Limit:</span>
            <span className="text-brand-secondary font-medium">{selectedTier.investmentNote}</span>
          </div>
        </div>

        {/* Option to Contact Us */}
        <div className="mt-8 border-t border-border-subtle pt-6">
          {quickContactSent ? (
            <div className="rounded-lg border border-status-confirmed/40 bg-status-confirmed/10 p-4 text-center text-xs text-text-primary">
              <CheckCircle2 className="mx-auto h-6 w-6 text-status-confirmed mb-1.5" />
              <p className="font-semibold">Enquiry sent successfully!</p>
              <p className="text-text-secondary mt-1">
                Our commercial director will reach out within 24 hours regarding {selectedTier.tier}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={() => onContactClick(selectedTier)}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto shadow-glow font-bold text-xs"
                >
                  <Mail className="h-4 w-4 mr-1.5" />
                  <span>Enquire About {selectedTier.tier}</span>
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="md"
                  className="w-full sm:w-auto text-xs text-text-muted hover:text-white"
                >
                  Close
                </Button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-text-muted pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-secondary" />
                <span>Direct commercial briefing: partners@aixsummit.com</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
