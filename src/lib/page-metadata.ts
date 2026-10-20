import type { Metadata } from 'next';
import { getLiveMetadata } from '@/lib/server-content';

/**
 * Builds a page's Metadata from content/metadata.json (live, via Firestore).
 *
 * Every page's title, description, social preview text and indexing switch is
 * edited in the CMS under the SEO tab rather than written into the page file.
 * Anything left blank there falls back to the site-wide defaults, so an empty
 * field is never published as an empty tag.
 */
export async function buildPageMetadata(route: string): Promise<Metadata> {
  const data: any = (await getLiveMetadata()) || {};
  const site: any = data.site || {};
  const page: any = (data.pages || []).find((p: any) => p.route === route) || {};

  const title: string = page.title || site.defaultTitle || '';
  const description: string = page.description || site.defaultDescription || '';
  const ogTitle: string = page.ogTitle || site.ogTitle || title;
  const ogDescription: string = page.ogDescription || site.ogDescription || description;

  const keywords: string[] = (page.keywords?.length ? page.keywords : site.keywords) || [];
  const baseUrl = String(site.baseUrl || '').replace(/\/$/, '');
  const canonical: string = page.canonical || (baseUrl ? `${baseUrl}${route === '/' ? '' : route}` : route);

  return {
    ...buildRobots(site, page),
    ...(keywords.length ? { keywords } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    // An absolute title opts out of the site-wide "%s | AIX Roundtables 2026"
    // suffix, for pages whose title already names the event in full.
    title: page.absoluteTitle ? { absolute: title } : title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: site.siteName,
      locale: site.locale,
      type: 'website',
      ...(site.baseUrl ? { url: `${String(site.baseUrl).replace(/\/$/, '')}${route === '/' ? '' : route}` } : {}),
      ...(site.ogImage
        ? {
            images: [
              {
                url: site.ogImage,
                width: site.ogImageWidth || 1024,
                height: site.ogImageHeight || 537,
                alt: site.ogImageAlt || ogTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: site.twitterCard || 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(site.ogImage ? { images: [site.ogImage] } : {}),
    },
  };
}

/**
 * Crawler directives.
 *
 * A page marked "hide from search engines" is excluded outright. Everything else
 * carries the site's preview settings, which is what lets Google show a large
 * image and an untruncated snippet rather than deciding for itself.
 */
export function buildRobots(site: any, page: any): Pick<Metadata, 'robots'> {
  if (page?.noindex) {
    return { robots: { index: false, follow: false, nocache: true } };
  }

  const r = site?.robots || {};
  const previews = {
    'max-image-preview': (r.maxImagePreview || 'large') as 'none' | 'standard' | 'large',
    'max-snippet': typeof r.maxSnippet === 'number' ? r.maxSnippet : -1,
    'max-video-preview': typeof r.maxVideoPreview === 'number' ? r.maxVideoPreview : -1,
  };

  return {
    robots: {
      index: r.index !== false,
      follow: r.follow !== false,
      googleBot: { index: r.index !== false, follow: r.follow !== false, ...previews },
      ...previews,
    },
  };
}

/** Fills {token} placeholders in the roundtable detail templates. */
export function fillTemplate(template: string, values: Record<string, string>) {
  return String(template || '').replace(/\{(\w+)\}/g, (match, key) =>
    values[key] !== undefined ? values[key] : match
  );
}
