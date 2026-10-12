// Fallback static JSON imports
import siteFallback from '@/content/site.json';
import roundtablesFallback from '@/content/roundtables.json';
import programmeFallback from '@/content/programme.json';
import partnersFallback from '@/content/partners.json';
import showcaseFallback from '@/content/showcase.json';
import speakersFallback from '@/content/speakers.json';
import audienceFallback from '@/content/audience.json';
import faqFallback from '@/content/faq.json';
import homeFallback from '@/content/home.json';
import aboutFallback from '@/content/about.json';
import venueFallback from '@/content/venue.json';
import signalsFallback from '@/content/signals.json';
import contactFallback from '@/content/contact.json';

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

const FALLBACK_MAP: Record<string, any> = {
  'site.json': siteFallback,
  'roundtables.json': roundtablesFallback,
  'programme.json': programmeFallback,
  'partners.json': partnersFallback,
  'showcase.json': showcaseFallback,
  'speakers.json': speakersFallback,
  'audience.json': audienceFallback,
  'faq.json': faqFallback,
  'home.json': homeFallback,
  'about.json': aboutFallback,
  'venue.json': venueFallback,
  'signals.json': signalsFallback,
  'contact.json': contactFallback,
};

// Global in-memory cache shared across serverless function invocations
declare global {
  var __CMS_CACHE__: Record<string, any> | undefined;
}

function readServerFile(filename: string): any {
  // Never attempt to load Node fs/path in the browser client
  if (typeof window !== 'undefined') return null;

  try {
    // Dynamically require so client bundler does not bundle fs/path
    const fs = typeof require !== 'undefined' ? require('fs') : null;
    const path = typeof require !== 'undefined' ? require('path') : null;
    if (!fs || !path) return null;

    // 1. Check /tmp/content (writable on Vercel and serverless containers)
    const tmpPath = path.join('/tmp', 'content', filename);
    if (fs.existsSync(tmpPath)) {
      const parsed = JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
      if (parsed) return parsed;
    }

    // 2. Check local content directory on disk
    const localPath = path.join(process.cwd(), 'content', filename);
    if (fs.existsSync(localPath)) {
      const parsed = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      if (parsed) return parsed;
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export function loadContentFile<T = any>(filename: string): T {
  const fallback = FALLBACK_MAP[filename] as T;

  // 1. Check in-memory global cache first
  if (typeof globalThis !== 'undefined' && globalThis.__CMS_CACHE__ && globalThis.__CMS_CACHE__[filename]) {
    return globalThis.__CMS_CACHE__[filename] as T;
  }

  // 2. Check server-side filesystem (/tmp or content/)
  const serverData = readServerFile(filename);
  if (serverData) {
    return serverData as T;
  }

  return fallback;
}

/**
 * Enforce the confirmation gate at the data layer.
 * Any unconfirmed entity has its identifying names censored.
 */
export function getSiteConfig(): SiteConfig {
  const config = loadContentFile<SiteConfig>('site.json');
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
  const data = loadContentFile<{ items: Roundtable[] }>('roundtables.json');
  const items = (data?.items || []) as Roundtable[];
  return items.map((rt) => {
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
  const data = loadContentFile<{ items: ProgrammeItem[] }>('programme.json');
  const items = (data?.items || []) as ProgrammeItem[];
  if (!config.features?.showRecognition) {
    return items.filter((item) => item.conditional !== 'recognition');
  }
  return items;
}

export function getPartners(): Partner[] {
  const data = loadContentFile<{ items: Partner[] }>('partners.json');
  const items = (data?.items || []) as Partner[];
  return items.filter((p) => p.status === 'confirmed');
}

export function getShowcaseCompanies(): ShowcaseCompany[] {
  const data = loadContentFile<{ items: ShowcaseCompany[] }>('showcase.json');
  const items = (data?.items || []) as ShowcaseCompany[];
  return items.filter((c) => c.status === 'confirmed');
}

export function getSpeakers(): Speaker[] {
  const data = loadContentFile<{ items: Speaker[] }>('speakers.json');
  const items = (data?.items || []) as Speaker[];
  return items.filter((s) => s.status === 'confirmed');
}

export function getAudienceData(): AudienceData {
  return loadContentFile<AudienceData>('audience.json');
}

export function getFAQs(): FAQCategory[] {
  const data = loadContentFile<{ items: FAQCategory[] }>('faq.json');
  return (data?.items || []) as FAQCategory[];
}

export function getHomeContent() {
  return loadContentFile('home.json');
}

export function getAboutContent() {
  return loadContentFile('about.json');
}

export function getProgrammeDataRaw() {
  return loadContentFile('programme.json');
}

export function getRoundtablesDataRaw() {
  return loadContentFile('roundtables.json');
}

export function getPartnersDataRaw() {
  return loadContentFile('partners.json');
}

export function getShowcaseData() {
  return loadContentFile('showcase.json');
}

export function getVenueData() {
  return loadContentFile('venue.json');
}

export function getSignalsData() {
  return loadContentFile('signals.json');
}

export function getContactData() {
  return loadContentFile('contact.json');
}
