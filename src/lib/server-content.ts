import { getFirestoreDb } from '@/lib/firebase-admin';
import {
  getSiteConfig,
  getRoundtables,
  getProgramme,
  getHomeContent,
  getAboutContent,
  getPartners,
  getPartnersDataRaw,
  getAudienceData,
  getFAQs,
  getVenueData,
  getShowcaseData,
  getSignalsData,
  getContactData,
} from '@/lib/content';
import type { SiteConfig, Roundtable, ProgrammeItem, Partner, AudienceData, FAQCategory } from '@/types/content';

async function fetchFromFirestore<T = any>(filename: string): Promise<T | null> {
  try {
    const db = getFirestoreDb();
    if (!db) return null;
    const docId = filename.replace('.json', '');
    const docPromise = db.collection('content').doc(docId).get();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 2000)
    );
    const doc = await Promise.race([docPromise, timeoutPromise]) as any;
    if (doc && doc.exists) {
      const data = doc.data();
      if (data && data.payload) {
        if (typeof globalThis !== 'undefined') {
          globalThis.__CMS_CACHE__ = globalThis.__CMS_CACHE__ || {};
          globalThis.__CMS_CACHE__[filename] = data.payload;
        }
        return data.payload as T;
      }
    }
  } catch (err) {
    // fallback cleanly
  }
  return null;
}

export async function getLiveSiteConfig(): Promise<SiteConfig> {
  const firestoreData = await fetchFromFirestore<SiteConfig>('site.json');
  if (firestoreData) {
    if (firestoreData.venue?.status !== 'confirmed') {
      return {
        ...firestoreData,
        venue: {
          ...firestoreData.venue,
          name: 'Doha, Qatar',
          address: '',
          mapUrl: '',
        },
      };
    }
    return firestoreData;
  }
  return getSiteConfig();
}

export async function getLiveRoundtables(): Promise<Roundtable[]> {
  const firestoreData = await fetchFromFirestore<{ items: Roundtable[] }>('roundtables.json');
  const items = (firestoreData?.items || []) as Roundtable[];
  if (items.length > 0) {
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
  return getRoundtables();
}

export async function getLiveProgramme(): Promise<ProgrammeItem[]> {
  const config = await getLiveSiteConfig();
  const firestoreData = await fetchFromFirestore<{ items: ProgrammeItem[] }>('programme.json');
  const items = (firestoreData?.items || []) as ProgrammeItem[];
  if (items.length > 0) {
    if (!config.features?.showRecognition) {
      return items.filter((item) => item.conditional !== 'recognition');
    }
    return items;
  }
  return getProgramme();
}

export async function getLiveHomeContent() {
  const firestoreData = await fetchFromFirestore('home.json');
  if (firestoreData) return firestoreData;
  return getHomeContent();
}

export async function getLiveAboutContent() {
  const firestoreData = await fetchFromFirestore('about.json');
  if (firestoreData) return firestoreData;
  return getAboutContent();
}

export async function getLivePartners(): Promise<Partner[]> {
  const firestoreData = await fetchFromFirestore<{ items: Partner[] }>('partners.json');
  const items = (firestoreData?.items || []) as Partner[];
  if (items.length > 0) {
    return items.filter((p) => p.status === 'confirmed');
  }
  return getPartners();
}

export async function getLivePartnersDataRaw(): Promise<any> {
  const firestoreData = await fetchFromFirestore('partners.json');
  if (firestoreData) return firestoreData;
  return getPartnersDataRaw();
}

export async function getLiveVenueData(): Promise<any> {
  const firestoreData = await fetchFromFirestore('venue.json');
  if (firestoreData) return firestoreData;
  return getVenueData();
}

export async function getLiveShowcaseData(): Promise<any> {
  const firestoreData = await fetchFromFirestore('showcase.json');
  if (firestoreData) return firestoreData;
  return getShowcaseData();
}

export async function getLiveSignalsData(): Promise<any> {
  const firestoreData = await fetchFromFirestore('signals.json');
  if (firestoreData) return firestoreData;
  return getSignalsData();
}

export async function getLiveContactData(): Promise<any> {
  const firestoreData = await fetchFromFirestore('contact.json');
  if (firestoreData) return firestoreData;
  return getContactData();
}

export async function getLiveAudienceData(): Promise<AudienceData> {
  const firestoreData = await fetchFromFirestore<AudienceData>('audience.json');
  if (firestoreData) return firestoreData;
  return getAudienceData();
}

export async function getLiveFAQs(): Promise<FAQCategory[]> {
  const firestoreData = await fetchFromFirestore<{ items: FAQCategory[] }>('faq.json');
  const items = (firestoreData?.items || []) as FAQCategory[];
  if (items.length > 0) return items;
  return getFAQs();
}
