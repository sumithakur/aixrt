import type { Metadata } from 'next';
import { Ubuntu, Roboto } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getSiteConfig } from '@/lib/content';

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
    template: '%s | AIX Summit 2026',
    default: 'AIX Summit 2026 | Executive AI Summit, Doha, 14 December 2026',
  },
  description:
    'AIX Summit 2026 is an invitation-led executive summit in Doha, Qatar on Monday 14 December 2026. Convening 110 senior decision-makers across six sponsored roundtables to move AI from ambition to action.',
  metadataBase: new URL('https://www.aixsummit.com'),
  icons: {
    icon: '/brand/favicon.svg',
    shortcut: '/brand/favicon.svg',
    apple: '/brand/favicon.svg',
  },
  openGraph: {
    title: 'AIX Summit 2026 | Where AI moves from ambition to action',
    description:
      'A one-day executive summit in Doha. Six sponsored roundtables, working AI demonstrations, and Chatham House discussions for senior leaders.',
    url: 'https://www.aixsummit.com',
    siteName: 'AIX Summit 2026',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-bg-base text-text-primary antialiased overflow-x-hidden">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
