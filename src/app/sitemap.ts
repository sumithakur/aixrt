import { MetadataRoute } from 'next';
import { getLiveSiteConfig, getLiveRoundtables, getLiveMetadata } from '@/lib/server-content';

export const dynamic = 'force-dynamic';

/** How often each kind of page changes, and how much it matters relative to the rest. */
const ROUTE_WEIGHTS: Record<string, { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = {
  '/': { changeFrequency: 'weekly', priority: 1.0 },
  '/roundtables': { changeFrequency: 'weekly', priority: 0.95 },
  '/partners/become-a-partner': { changeFrequency: 'weekly', priority: 0.95 },
  '/programme': { changeFrequency: 'weekly', priority: 0.9 },
  '/request-an-invitation': { changeFrequency: 'monthly', priority: 0.9 },
  '/about': { changeFrequency: 'monthly', priority: 0.8 },
  '/showcase': { changeFrequency: 'weekly', priority: 0.8 },
  '/signals': { changeFrequency: 'monthly', priority: 0.8 },
  '/showcase/apply': { changeFrequency: 'monthly', priority: 0.75 },
  '/partners': { changeFrequency: 'weekly', priority: 0.75 },
  '/venue': { changeFrequency: 'monthly', priority: 0.7 },
  '/faq': { changeFrequency: 'monthly', priority: 0.7 },
  '/contact': { changeFrequency: 'monthly', priority: 0.7 },
  '/legal/confidentiality': { changeFrequency: 'yearly', priority: 0.6 },
  '/legal/privacy': { changeFrequency: 'yearly', priority: 0.5 },
  '/legal/terms': { changeFrequency: 'yearly', priority: 0.5 },
};

/**
 * Built from the same CMS data as the pages themselves, so the sitemap cannot
 * drift from what the site actually publishes: a page switched to "hide from
 * search engines" in the SEO tab drops out of here too, and the address comes
 * from the site address set there rather than being written in twice.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo: any = (await getLiveMetadata()) || {};
  const site: any = seo.site || {};
  const baseUrl = String(site.baseUrl || 'https://aixrt-sigma.vercel.app').replace(/\/$/, '');
  const lastModified = new Date();

  const config = await getLiveSiteConfig();
  const roundtables = await getLiveRoundtables();

  const pages: any[] = seo.pages || [];
  const routes: MetadataRoute.Sitemap = pages
    .filter((page) => !page.noindex)
    .map((page) => {
      const weight = ROUTE_WEIGHTS[page.route] || { changeFrequency: 'monthly' as const, priority: 0.6 };
      return {
        url: `${baseUrl}${page.route === '/' ? '' : page.route}`,
        lastModified,
        changeFrequency: weight.changeFrequency,
        priority: weight.priority,
      };
    });

  roundtables.forEach((rt: any) => {
    routes.push({
      url: `${baseUrl}/roundtables/${rt.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // Pages that only exist once their feature is switched on.
  const flagged: [boolean, string, number][] = [
    [Boolean(config.features?.showSpeakers), '/speakers', 0.75],
    [Boolean(config.features?.showRecognition), '/recognition', 0.75],
  ];
  flagged.forEach(([enabled, route, priority]) => {
    if (enabled) {
      routes.push({ url: `${baseUrl}${route}`, lastModified, changeFrequency: 'weekly', priority });
    }
  });

  return routes;
}
