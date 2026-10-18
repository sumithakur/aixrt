import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Standfirst } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { REGISTER_URL } from '@/lib/links';
import { CTABand } from '@/components/content/CTABand';
import { getLiveSiteConfig, getLiveVenueData } from '@/lib/server-content';
import {
  MapPin,
  Plane,
  FileCheck,
  SunMedium,
  Coins,
  Clock,
  Shirt,
  Wifi,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Venue, Travel & Doha Delegate Guide',
  description:
    'Venue coordinates, travel planning, visa requirements, and executive delegate guidance for AIX Summit 2026 in Doha, Qatar.',
};

export default async function VenuePage() {
  const config = await getLiveSiteConfig();
  const venueData = await getLiveVenueData();
  const isVenueConfirmed = config.venue.status === 'confirmed';

  const hero = venueData.hero || {
    eyebrow: 'Destination & Logistics',
    title: 'Venue & Doha Delegate Guide',
    description:
      'Essential travel logistics, international arrival coordinates, and hospitality guidance for executives attending AIX Summit 2026.',
  };

  const statusCard = venueData.statusCard || {
    title: 'Summit Location',
    embargoTitle: 'Embargoed Prior to Delegate Confirmation',
    embargoDesc:
      'Due to the Chatham House Rule and the seniority of confirmed participants, the exact summit coordinates and venue hotel in Doha are shared strictly with confirmed delegates, chairs, and accredited partners.',
    accessInfo:
      'All delegates will receive secure calendar invitations and access credentials 14 days prior to the summit date.',
  };

  const defaultTravelCards = [
    {
      title: 'Arrival via Hamad International Airport (DOH)',
      desc: 'Consistently ranked among the world’s leading airports. Direct flights connect Doha to over 170 international destinations via Qatar Airways and global carriers. The city centre is approximately 20 minutes by taxi or metro.',
    },
    {
      title: 'Entry Visas & Hayya Portal',
      desc: 'Citizens of over 95 countries are eligible for visa-free entry or visa-on-arrival in Qatar. All delegates should verify current entry requirements on the official Hayya or Ministry of Interior portals prior to travel.',
      linkText: 'Visit Official Qatar Visas Portal',
      linkUrl: 'https://visitqatar.com/intl-en/practical-info/visas',
    },
    {
      title: 'December Weather',
      desc: 'December represents the premier winter season in Doha, with pleasant daytime temperatures averaging 20°C to 25°C (68°F–77°F) and cool evenings. Peak travel season: early flight and hotel reservations are recommended.',
    },
    {
      title: 'Timezone & Connectivity',
      desc: 'Arabia Standard Time (AST), UTC+3, with no daylight saving shifts. High-speed 5G connectivity is ubiquitously available across central Doha through local networks (Ooredoo and Vodafone).',
    },
    {
      title: 'Currency & Payments',
      desc: 'Qatari Riyal (QAR), pegged to the US Dollar at approximately 1 USD = 3.64 QAR. Contactless digital payments and international credit cards are universally accepted across hotels, transit, and dining.',
    },
    {
      title: 'Executive Dress Code',
      desc: 'Business formal or traditional national dress (thobe / abaya) for all summit sessions, roundtables, and the evening reception.',
    },
  ];

  const travelCards = venueData.travelCards || defaultTravelCards;

  return (
    <>
      <Section variant="hero" className="pt-16 pb-16">
        <Container size="default">
          <div className="max-w-3xl">
            <Eyebrow accent="secondary" className="mb-3">
              {hero.eyebrow || 'Destination & Logistics'}
            </Eyebrow>
            <Heading level={1} size="xl" className="mb-4">
              {hero.title || 'Venue & Doha Delegate Guide'}
            </Heading>
            <Standfirst>
              {hero.description ||
                'Essential travel logistics, international arrival coordinates, and hospitality guidance for executives attending AIX Summit 2026.'}
            </Standfirst>
          </div>
        </Container>
      </Section>

      <Section variant="raised">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Main Travel Logistics Guide */}
            <div className="space-y-12 lg:col-span-8">
              {/* Venue Status Card */}
              <div className="rounded-lg border border-border-prominent bg-bg-surface/80 p-8 backdrop-blur-md shadow-card space-y-4">
                <div className="flex items-center gap-2 text-brand-secondary">
                  <MapPin className="h-5 w-5" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider">
                    {statusCard.title || 'Summit Location'}
                  </span>
                </div>

                {isVenueConfirmed ? (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-text-primary">
                      {config.venue.name}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">{config.venue.address}</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-text-primary">
                      {statusCard.embargoTitle || 'Doha, Qatar'}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-secondary">
                      {statusCard.embargoDesc ||
                        'AIX Summit 2026 convenes in central Doha on Monday 14 December 2026. Dedicated venue coordinates, security entry access, and exclusive delegate accommodation blocks will be distributed directly to confirmed attendees upon invitation confirmation.'}
                    </p>
                    {statusCard.accessInfo && (
                      <p className="mt-2 text-xs text-text-muted">
                        {statusCard.accessInfo}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Travel & Destination Essentials */}
              <div className="space-y-6">
                <Eyebrow accent="secondary">Delegate Logistics</Eyebrow>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {travelCards.map((card: any, idx: number) => {
                    return (
                      <div
                        key={card.title || idx}
                        className="rounded-md border border-border-subtle bg-bg-raised/70 p-6 transition-colors hover:border-border-prominent flex flex-col justify-between"
                      >
                        <div>
                          <MapPin className="h-6 w-6 text-brand-secondary mb-3" />
                          <h3 className="font-display text-base font-bold text-text-primary">
                            {card.title}
                          </h3>
                          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                            {card.desc}
                          </p>
                        </div>

                        {(card.linkUrl || card.link?.url) && (
                          <div className="mt-4 pt-3 border-t border-border-subtle">
                            <a
                              href={card.linkUrl || card.link?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline"
                            >
                              <span>{card.linkText || card.link?.text || 'Learn more'}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Summary Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6 rounded-lg border border-border-subtle bg-bg-surface/70 p-6 backdrop-blur-md">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                  Logistical Snapshot
                </h3>

                <ul className="space-y-4 text-xs text-text-secondary">
                  <li>
                    <span className="font-semibold text-text-primary">Event Date</span>
                    <p className="text-text-muted mt-0.5">{config.event.date}</p>
                  </li>
                  <li>
                    <span className="font-semibold text-text-primary">Operating Hours</span>
                    <p className="text-text-muted mt-0.5">
                      {config.event.programmeStart} – {config.event.programmeEnd} (Reception to {config.event.receptionEnd})
                    </p>
                  </li>
                  <li>
                    <span className="font-semibold text-text-primary">Confirmed Venue Release</span>
                    <p className="text-text-muted mt-0.5">Issued 14 days prior to confirmed delegates</p>
                  </li>
                  <li>
                    <span className="font-semibold text-text-primary">Governance</span>
                    <p className="text-text-muted mt-0.5">Chatham House Rule throughout</p>
                  </li>
                  <li>
                    <span className="font-semibold text-text-primary">Accreditation</span>
                    <p className="text-text-muted mt-0.5">Photo ID & invitation credential required</p>
                  </li>
                </ul>

                <div className="pt-4 border-t border-border-subtle">
                  <Button href={REGISTER_URL} variant="primary" size="md" className="w-full">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
