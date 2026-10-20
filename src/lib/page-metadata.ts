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

  return {
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
    ...(page.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Fills {token} placeholders in the roundtable detail templates. */
export function fillTemplate(template: string, values: Record<string, string>) {
  return String(template || '').replace(/\{(\w+)\}/g, (match, key) =>
    values[key] !== undefined ? values[key] : match
  );
}
