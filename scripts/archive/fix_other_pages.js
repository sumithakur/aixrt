const fs = require('fs');

// Venue
let venue = fs.readFileSync('src/app/venue/page.tsx', 'utf8');
venue = venue.replace("import { getSiteConfig } from '@/lib/content';", "import { getSiteConfig, getVenueData } from '@/lib/content';");
venue = venue.replace("const config = getSiteConfig();", "const config = getSiteConfig();\n  const venueData = getVenueData();");
venue = venue.replace(/>Venue \& Logistics</g, ">{venueData.hero.title}<");
venue = venue.replace(/>AIX Summit 2026 takes place in Doha, Qatar. Due to the Chatham House Rule and the seniority of the room, the specific venue is strictly embargoed until delegate confirmation\.</g, ">{venueData.hero.description}<");
fs.writeFileSync('src/app/venue/page.tsx', venue);

// Signals
let signals = fs.readFileSync('src/app/signals/page.tsx', 'utf8');
signals = signals.replace("import { getSiteConfig } from '@/lib/content';", "import { getSiteConfig, getSignalsData } from '@/lib/content';");
signals = signals.replace("const config = getSiteConfig();", "const config = getSiteConfig();\n  const signalsData = getSignalsData();");
signals = signals.replace(/>AIX Roundtable Signals</g, ">{signalsData.hero.title}<");
signals = signals.replace(/>The official intelligence report from the AIX Summit\.</g, ">{signalsData.hero.description}<");
signals = signals.replace(/>Mass conferences produce soundbites. AIX Summit produces the Roundtable Signals report\.</g, ">{signalsData.content.paragraphs[0]}<");
signals = signals.replace(/>Under the Chatham House Rule, participants can share the information received, but neither the identity nor the affiliation of the speaker\(s\). This allows us to publish the most critical insights, bottlenecks, and strategies discussed across the six lanes\.</g, ">{signalsData.content.paragraphs[1]}<");
fs.writeFileSync('src/app/signals/page.tsx', signals);

// Contact
let contact = fs.readFileSync('src/app/contact/page.tsx', 'utf8');
contact = contact.replace("import { getSiteConfig } from '@/lib/content';", "import { getSiteConfig, getContactData } from '@/lib/content';");
contact = contact.replace("const config = getSiteConfig();", "const config = getSiteConfig();\n  const contactData = getContactData();");
contact = contact.replace(/>Contact the Organising Team</g, ">{contactData.hero.title}<");
contact = contact.replace(/>Direct lines to the team managing AIX Summit 2026\.</g, ">{contactData.hero.description}<");
fs.writeFileSync('src/app/contact/page.tsx', contact);
