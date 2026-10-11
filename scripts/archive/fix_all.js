const fs = require('fs');

let header = fs.readFileSync('src/components/layout/SiteHeader.tsx', 'utf8');

// Fix Desktop Partners Link
header = header.replace(
  /<Link href="\/partners"\n\s*className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-secondary \$\{/,
  `<Link href="/partners"
                className={\`flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-secondary \${`
);

// Fix Mobile Hamburger Button
header = header.replace(
  /<Link href="\/partners"\n\s*onClick=\{\(\) => setIsMobileNavOpen\(true\)\}/,
  `<button type="button"\n              onClick={() => setIsMobileNavOpen(true)}`
);

fs.writeFileSync('src/components/layout/SiteHeader.tsx', header);
