const fs = require('fs');

let header = fs.readFileSync('src/components/layout/SiteHeader.tsx', 'utf8');

// I need to change back the desktop link that was accidentally turned into a button
header = header.replace(
  /<button type="button"\n\s*onMouseEnter=\{\(\) => setIsPartnersOpen\(true\)\}\n\s*onMouseLeave=\{\(\) => setIsPartnersOpen\(false\)\}/,
  `<Link href="/partners"
                onMouseEnter={() => setIsPartnersOpen(true)}
                onMouseLeave={() => setIsPartnersOpen(false)}`
);

fs.writeFileSync('src/components/layout/SiteHeader.tsx', header);
