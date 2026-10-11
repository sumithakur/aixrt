cat << 'INNER' >> src/lib/content.ts

import showcaseData from '@/content/showcase.json';
import venueData from '@/content/venue.json';
import signalsData from '@/content/signals.json';
import contactData from '@/content/contact.json';

export function getShowcaseData() { return showcaseData; }
export function getVenueData() { return venueData; }
export function getSignalsData() { return signalsData; }
export function getContactData() { return contactData; }
INNER
