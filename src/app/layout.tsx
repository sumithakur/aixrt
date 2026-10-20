import type { Metadata } from 'next';
import { Ubuntu, Roboto } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PublicChrome } from '@/components/layout/PublicChrome';
import { getSiteConfig } from '@/lib/content';
import { getLiveNavigation, getLiveGlobals, getLiveMetadata } from '@/lib/server-content';
import { StoreProvider } from '@/store/StoreProvider';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

/**
 * Site-wide defaults, edited in the CMS under the SEO tab. Individual pages
 * override these through buildPageMetadata(); anything a page leaves blank
 * falls back to what is set here.
 */
export async function generateMetadata(): Promise<Metadata> {
  const data: any = (await getLiveMetadata()) || {};
  const site: any = data.site || {};
  const baseUrl = String(site.baseUrl || 'https://aixrt-sigma.vercel.app').replace(/\/$/, '');

  return {
    title: {
      template: site.titleTemplate || '%s | AIX Roundtables 2026',
      default: site.defaultTitle || 'AIX Roundtables 2026',
    },
    description: site.defaultDescription,
    metadataBase: new URL(baseUrl),
    icons: {
      icon: '/brand/favicon.svg',
      shortcut: '/brand/favicon.svg',
      apple: '/brand/favicon.svg',
    },
    openGraph: {
      title: site.ogTitle || site.defaultTitle,
      description: site.ogDescription || site.defaultDescription,
      url: baseUrl,
      siteName: site.siteName,
      locale: site.locale || 'en_US',
      type: 'website',
      images: [
        {
          url: site.ogImage || '/og-image.png',
          width: site.ogImageWidth || 1024,
          height: site.ogImageHeight || 537,
          alt: site.ogImageAlt || site.siteName,
        },
      ],
    },
    twitter: {
      card: site.twitterCard || 'summary_large_image',
      title: site.ogTitle || site.defaultTitle,
      description: site.ogDescription || site.defaultDescription,
      images: [site.ogImage || '/og-image.png'],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const navigation = await getLiveNavigation();
  const globals = await getLiveGlobals();

  // Structured Data Event JSON-LD
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'AIX Summit 2026',
    description: 'A one-day invitation-led executive summit in Doha. Where AI moves from ambition to action.',
    startDate: `${config.event.dateIso}T${config.event.programmeStart}:00+03:00`,
    endDate: `${config.event.dateIso}T${config.event.receptionEnd}:00+03:00`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: config.venue.status === 'confirmed' ? config.venue.name : 'Doha, Qatar',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Doha',
        addressCountry: 'QA',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: config.event.organiser,
      url: 'https://www.aixsummit.com',
    },
  };

  return (
    <html lang="en" className={`${ubuntu.variable} ${roboto.variable}`}>
      <head>
        {/* Browser form-fill extensions (e.g. Edge autofill) inject `fdprocessedid` into inputs/buttons
            before React hydrates, causing hydration mismatch warnings. Strip it as soon as it appears. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var a='fdprocessedid';function s(n){n.removeAttribute&&n.hasAttribute&&n.hasAttribute(a)&&n.removeAttribute(a)}new MutationObserver(function(m){for(var i=0;i<m.length;i++){var r=m[i];if(r.type==='attributes'){s(r.target)}else{for(var j=0;j<r.addedNodes.length;j++){var n=r.addedNodes[j];if(n.nodeType===1){s(n);n.querySelectorAll&&n.querySelectorAll('['+a+']').forEach(s)}}}}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:[a]})})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-bg-base text-text-primary antialiased overflow-x-hidden">
        <StoreProvider>
          <PublicChrome>
            <SiteHeader navigation={navigation} registerUrl={globals?.registerUrl} />
          </PublicChrome>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <PublicChrome>
            <SiteFooter navigation={navigation} registerUrl={globals?.registerUrl} />
          </PublicChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
