import type { Metadata } from 'next';
import { Ubuntu, Roboto } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getSiteConfig } from '@/lib/content';
import { getLiveNavigation, getLiveGlobals } from '@/lib/server-content';
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

export const metadata: Metadata = {
  title: {
    template: '%s | AIX Roundtables 2026',
    default: 'AIX Roundtables 2026 | Executive AI Summit, Doha, 14 December 2026',
  },
  description:
    'AIX Roundtables 2026 is an invitation-led executive summit in Doha, Qatar on Monday 14 December 2026. Convening 110 senior decision-makers across six sponsored roundtables to move AI from ambition to action.',
  metadataBase: new URL('https://aixrt-sigma.vercel.app'),
  icons: {
    icon: '/brand/favicon.svg',
    shortcut: '/brand/favicon.svg',
    apple: '/brand/favicon.svg',
  },
  openGraph: {
    title: 'AIX Roundtables 2026 | Where AI moves from ambition to action',
    description:
      'A one-day executive summit in Doha. Six sponsored roundtables, working AI demonstrations, and Chatham House discussions for senior leaders.',
    url: 'https://aixrt-sigma.vercel.app',
    siteName: 'AIX Roundtables 2026',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 537,
        alt: 'AIX Roundtables Doha 2026 - Where AI moves from ambition to action',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIX Roundtables 2026 | Where AI moves from ambition to action',
    description:
      'A one-day executive summit in Doha. Six sponsored roundtables, working AI demonstrations, and Chatham House discussions for senior leaders.',
    images: ['/og-image.png'],
  },
};

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
          <SiteHeader navigation={navigation} registerUrl={globals?.registerUrl} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter navigation={navigation} registerUrl={globals?.registerUrl} />
        </StoreProvider>
      </body>
    </html>
  );
}
