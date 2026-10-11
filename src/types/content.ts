export type PublishStatus = 'confirmed' | 'pending' | 'target';

export type RoundtableAccent = 'fintech' | 'industrial' | 'cybersecurity' | 'state' | 'agentic';

export interface RoundtableChair {
  status: PublishStatus;
  organisation?: string;
  logo?: string;
  personName?: string;
  personRole?: string;
}

export interface Roundtable {
  slug: string;
  shortTitle: string;
  title: string;
  coreQuestion: string;
  lane: string;
  themes: string[];
  participantProfile: string[];
  chair?: RoundtableChair;
  accent: RoundtableAccent;
  order: number;
  session?: number;
}

export interface ProgrammeItem {
  start: string;
  end: string;
  format:
    | 'arrival'
    | 'opening'
    | 'keynote'
    | 'executive-conversation'
    | 'showcase'
    | 'lunch'
    | 'roundtables'
    | 'connections'
    | 'plenary'
    | 'recognition'
    | 'closing'
    | 'reception';
  title: string;
  description: string;
  speakerSlugs?: string[];
  emphasis?: boolean;
  conditional?: 'recognition';
}

export interface Speaker {
  slug: string;
  status: PublishStatus;
  name?: string;
  role?: string;
  organisation?: string;
  bio?: string;
  portrait?: string;
  hasProfile: boolean;
  moment: 'keynote' | 'executive-conversation' | 'synthesis-host' | 'chair';
  roundtableSlug?: string;
  socials?: {
    linkedin?: string;
    x?: string;
    website?: string;
  };
}

export interface Partner {
  status: PublishStatus;
  name?: string;
  logo?: string;
  logoMono?: string;
  url?: string;
  tier: 'strategic' | 'roundtable-chair' | 'knowledge' | 'showcase' | 'networking' | 'technology';
  roundtableSlug?: string;
  blurb?: string;
}

export interface ShowcaseCompany {
  status: PublishStatus;
  name?: string;
  logo?: string;
  url?: string;
  oneLiner?: string;
  sectors: string[];
  roundtableSlug?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export interface AudienceData {
  seniority: { label: string; percentage: number }[];
  sectors: { label: string; percentage: number }[];
  segments: { title: string; roles: string }[];
}

export interface SiteConfig {
  event: {
    name: string;
    edition: string;
    tagline: string;
    date: string;
    dateIso: string;
    programmeStart: string;
    programmeEnd: string;
    receptionEnd: string;
    timezone: string;
    locationPublic: string;
    organiser: string;
    seats: number;
    totalRoom: number;
    roundtablesCount: number;
    showcaseCount: number;
    linkedinPartnerId: string;
  };
  venue: {
    status: PublishStatus;
    name: string;
    address: string;
    mapUrl: string;
  };
  features: {
    showSpeakers: boolean;
    showRecognition: boolean;
    showShowcaseCompanies: boolean;
    showPartnerWall: boolean;
    showMedia: boolean;
    showSignalsEdition: boolean;
    invitationRequestsOpen: boolean;
  };
  contacts: {
    general: string;
    partnerships: string;
    showcase: string;
    press: string;
  };
  socials: {
    linkedin: string;
    x: string;
    instagram: string;
    youtube: string;
  };
  prospectus: {
    pdfUrl: string;
  };
}
