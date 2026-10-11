import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CTABand } from '@/components/content/CTABand';
import { getPartners, getRoundtables, getPartnersDataRaw } from '@/lib/content';
import { ShieldCheck, ArrowRight, CheckCircle2, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Partners & Roundtable Chairs',
  description:
    'Institutional and strategic partners powering AIX Summit 2026. Executive leadership across six dedicated roundtable discussion lanes in Doha, Qatar.',
};

export default function PartnersPage() {
  const partners = getPartners();
  const roundtables = getRoundtables();
  const rawData = getPartnersDataRaw();

  return (
    <>
      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              Strategic Collaboration
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              Partners & Roundtable Chairs
            </Heading>
            <Standfirst>
              Partnership at AIX Summit means substantive access to a curated executive room, not exposure to a crowd. Our partners lead the strategic agenda across sovereign AI deployment, critical infrastructure, and capital investment.
            </Standfirst>
          </div>
        </Container>
      </Section>

      {/* Flagship Opportunity Lead (When partners are pending confirmation per §7.10) */}
      <Section variant="raised">
        <Container size="default">
          <div className="rounded-lg border border-brand-primary/40 bg-gradient-to-br from-bg-raised to-bg-surface p-8 sm:p-12 shadow-card">
            <div className="max-w-3xl space-y-4">
              <span className="rounded-pill border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand-primary">
                2026 Partnership Opportunities
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                Six Roundtable Chair Partnerships are Open for 2026
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                Confirmed chairs and summit sponsors are announced in sequence as agreements are finalized. Each partner owns a strategic conversation, leads 15 curated peer executives, and co-authors the published AIX Roundtable Signals research report.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button href="/partners/become-a-partner" variant="primary" size="md">
                  <span>Explore Roundtable Chair Specifications</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Roundtable Chair Lane Status Cards */}
          <div className="mt-12 space-y-4">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
              Roundtable Chair Status Across the Six Lanes
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              {roundtables.map((rt) => (
                <div
                  key={rt.slug}
                  className="rounded-md border border-border-subtle bg-bg-raised/70 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-display font-bold text-brand-secondary">Table {rt.order}</span>
                      <span className="text-text-muted">Status: Open</span>
                    </div>
                    <h4 className="font-display text-base font-bold text-text-primary">
                      {rt.shortTitle}
                    </h4>
                    <p className="mt-2 text-xs text-text-secondary line-clamp-2">
                      &ldquo;{rt.coreQuestion}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle">
                    <Link
                      href={`/roundtables/${rt.slug}`}
                      className="text-xs font-semibold text-brand-secondary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Review Table Brief</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      
      
      
      {/* Previous Partners Section */}
      <Section variant="base" className="overflow-hidden">
        <Container size="default">
          <div className="mb-8 border-b border-border-subtle pb-4">
            <h3 className="font-display text-xl font-bold uppercase tracking-wider text-text-primary">
              Previous Partners
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Organisations that have supported the AIX executive mandate.
            </p>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
              display: flex;
              width: max-content;
            }
            .carousel-container:hover .animate-marquee {
              animation-play-state: paused;
            }
          `}} />

          {(() => {
            const confirmedPartners = (rawData.items || []).filter((p: any) => p.status === 'confirmed');
            if (confirmedPartners.length === 0) {
              return (
                <div className="rounded-md border border-dashed border-border-subtle p-8 text-center">
                  <p className="text-sm text-text-muted">Partnership announcements for the 2026 edition are currently under curatorial review.</p>
                </div>
              );
            }
            if (confirmedPartners.length < 5) {
              return (
                <div className="flex flex-wrap gap-6 justify-center">
                  {confirmedPartners.map((partner: any, idx: number) => (
                    <div key={idx} className="flex h-28 w-48 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-surface p-4">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-sm font-semibold text-text-primary text-center">{partner.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="relative flex overflow-hidden carousel-container w-full">
                <div className="animate-marquee space-x-6 pr-6">
                  {[...confirmedPartners, ...confirmedPartners].map((partner: any, idx: number) => (
                    <div key={idx} className="flex h-28 w-48 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-surface p-4">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-sm font-semibold text-text-primary text-center">{partner.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </Container>
      </Section>



      <CTABand />
    </>
  );
}
