const fs = require('fs');
let content = JSON.parse(fs.readFileSync('content/showcase.json', 'utf8'));
content.items = []; // Restore the items array
fs.writeFileSync('content/showcase.json', JSON.stringify(content, null, 2));

// Also fix content.ts double import
let contentTs = fs.readFileSync('src/lib/content.ts', 'utf8');
contentTs = contentTs.replace("import showcaseData from '@/content/showcase.json';\nimport venueData", "import venueData");
fs.writeFileSync('src/lib/content.ts', contentTs);
