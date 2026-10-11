const fs = require('fs');

// ABOUT PAGE
let about = fs.readFileSync('src/app/about/page.tsx', 'utf8');
about = about.replace(/A Different Kind of Summit/, "{aboutData.hero?.eyebrow || ''}");
about = about.replace(/Built for Executive Candour/, "{aboutData.hero?.title || ''}");
about = about.replace(/Mass conferences produce fleeting soundbites\. AIX Summit is structured to produce durable intellectual output by putting the right people in a closed room and focusing on the friction of actual deployment\./, "{aboutData.hero?.description || ''}");
about = about.replace(/Why One Day, Six Roundtables, and a Curated Room/, "{aboutData.rationale?.title || ''}");
// rationale is already mapped in about page? let's see.
// Actually, earlier it was mapped.
fs.writeFileSync('src/app/about/page.tsx', about);


// VENUE PAGE
let venue = fs.readFileSync('src/app/venue/page.tsx', 'utf8');
venue = venue.replace(/<Heading level=\{1\} size="xl" className="mb-4">\n\s*Location \& Logistics\n\s*<\/Heading>\n\s*<Standfirst>\n\s*Essential travel logistics, international arrival coordinates, and hospitality guidance for executives attending AIX Summit 2026\.\n\s*<\/Standfirst>/,
  `{(() => { const venueData = require('@/lib/content').getVenueData(); return (
    <>
      <Heading level={1} size="xl" className="mb-4">{venueData.hero?.title || 'Location & Logistics'}</Heading>
      <Standfirst>{venueData.hero?.description || 'Essential travel logistics, international arrival coordinates, and hospitality guidance for executives attending AIX Summit 2026.'}</Standfirst>
    </>
  ) })()}`
);
fs.writeFileSync('src/app/venue/page.tsx', venue);


// SIGNALS PAGE
let signals = fs.readFileSync('src/app/signals/page.tsx', 'utf8');
signals = signals.replace(/<Heading level=\{1\} size="xl" className="mb-4">\n\s*AIX Roundtable Signals\n\s*<\/Heading>\n\s*<Standfirst>\n\s*The conversations don&apos;t end at 16:30. Each roundtable produces a concise, anonymised strategic synthesis published in mid-January 2027 as an institutional reference document\.\n\s*<\/Standfirst>/,
  `{(() => { const signalsData = require('@/lib/content').getSignalsData(); return (
    <>
      <Heading level={1} size="xl" className="mb-4">{signalsData.hero?.title || 'AIX Roundtable Signals'}</Heading>
      <Standfirst>{signalsData.hero?.description || 'The conversations don\\'t end at 16:30. Each roundtable produces a concise, anonymised strategic synthesis published in mid-January 2027 as an institutional reference document.'}</Standfirst>
    </>
  ) })()}`
);
fs.writeFileSync('src/app/signals/page.tsx', signals);


// CONTACT PAGE
let contact = fs.readFileSync('src/app/contact/page.tsx', 'utf8');
contact = contact.replace(/<Heading level=\{1\} size="xl" className="mb-4">\n\s*Contact the Organisers\n\s*<\/Heading>\n\s*<Standfirst>\n\s*Whether you are requesting a delegate seat, inquiring about a Roundtable Chair partnership, or require press access, our team is available to assist\.\n\s*<\/Standfirst>/,
  `{(() => { const contactData = require('@/lib/content').getContactData(); return (
    <>
      <Heading level={1} size="xl" className="mb-4">{contactData.hero?.title || 'Contact the Organisers'}</Heading>
      <Standfirst>{contactData.hero?.description || 'Whether you are requesting a delegate seat, inquiring about a Roundtable Chair partnership, or require press access, our team is available to assist.'}</Standfirst>
    </>
  ) })()}`
);
fs.writeFileSync('src/app/contact/page.tsx', contact);

