const fs = require('fs');
let page = fs.readFileSync('src/app/venue/page.tsx', 'utf8');

page = page.replace(
  /const logistics = \[[\s\S]*?\];/,
  `const venueData = require('@/lib/content').getVenueData();
  const logistics = venueData.logistics?.paragraphs || [];`
);

// Map the string paragraphs to the UI (previously logistics was an array of objects)
// Wait, logistics was an array of objects? Let me check what it was.
