import siteData from '@/content/site.json';
import roundtablesData from '@/content/roundtables.json';
import programmeData from '@/content/programme.json';
import partnersData from '@/content/partners.json';
import showcaseData from '@/content/showcase.json';
import speakersData from '@/content/speakers.json';
import audienceData from '@/content/audience.json';
import faqData from '@/content/faq.json';
import type {
  SiteConfig,
  Roundtable,
  ProgrammeItem,
  Partner,
  ShowcaseCompany,
  Speaker,
  AudienceData,
  FAQCategory,
} from '@/types/content';

/**
 * Enforce the confirmation gate at the data layer.
 * Any unconfirmed entity has its identifying names censored.
 */
export function getSiteConfig(): SiteConfig {
  const config = siteData as SiteConfig;
  if (config.venue.status !== 'confirmed') {
    return {
      ...config,
      venue: {
        ...config.venue,
        name: 'Doha, Qatar',
        address: '',
        mapUrl: '',
      },
    };
  }
  return config;
}

export function getRoundtables(): Roundtable[] {
  return ((roundtablesData as any).items as Roundtable[]).map((rt) => {
    if (rt.chair && rt.chair.status !== 'confirmed') {
      return {
        ...rt,
        chair: {
          status: rt.chair.status,
          organisation: undefined,
          personName: undefined,
          personRole: undefined,
          logo: undefined,
        },
      };
    }
    return rt;
  });
}

export function getRoundtableBySlug(slug: string): Roundtable | undefined {
  const all = getRoundtables();
  return all.find((rt) => rt.slug === slug);
}

export function getProgramme(): ProgrammeItem[] {
  const config = getSiteConfig();
  const items = (programmeData as any).items as ProgrammeItem[];
  // If recognition feature flag is off, hide conditional recognition slot
  if (!config.features.showRecognition) {
    return items.filter((item) => item.conditional !== 'recognition');
  }
  return items;
}

export function getPartners(): Partner[] {
  return ((partnersData as any).items as Partner[]).filter((p) => p.status === 'confirmed');
}

export function getShowcaseCompanies(): ShowcaseCompany[] {
  return ((showcaseData as any).items as ShowcaseCompany[]).filter((c) => c.status === 'confirmed');
}

export function getSpeakers(): Speaker[] {
  return ((speakersData as any).items as Speaker[]).filter((s) => s.status === 'confirmed');
}

export function getAudienceData(): AudienceData {
  return audienceData as AudienceData;
}

export function getFAQs(): FAQCategory[] {
  return (faqData as any).items as FAQCategory[];
}

import homeData from '@/content/home.json';
import aboutData from '@/content/about.json';

export function getHomeContent() {
  return homeData;
}

export function getAboutContent() {
  return aboutData;
}

export function getProgrammeDataRaw() { return programmeData as any; }
export function getRoundtablesDataRaw() { return roundtablesData as any; }
export function getPartnersDataRaw() { return partnersData as any; }

import venueData from '@/content/venue.json';
import signalsData from '@/content/signals.json';
import contactData from '@/content/contact.json';

export function getShowcaseData() { return showcaseData; }
export function getVenueData() { return venueData; }
export function getSignalsData() { return signalsData; }
export function getContactData() { return contactData; }
