const fs = require('fs');

let header = fs.readFileSync('src/components/layout/SiteHeader.tsx', 'utf8');

// The new wide logo requires much wider container boundaries to maintain legibility of the text
header = header.replace(
  /w-\[140px\] sm:w-\[200px\] lg:w-\[250px\] lg:scale-110 lg:origin-left transition-all/,
  'w-[220px] sm:w-[320px] lg:w-[420px] transition-all'
);

fs.writeFileSync('src/components/layout/SiteHeader.tsx', header);
