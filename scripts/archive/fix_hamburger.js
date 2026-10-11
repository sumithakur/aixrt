const fs = require('fs');
let header = fs.readFileSync('src/components/layout/SiteHeader.tsx', 'utf8');

header = header.replace(/<button type="button"\n\s*onClick=\{\(\) => setIsMobileNavOpen\(true\)\}\n\s*className="flex h-10 w-10 items-center justify-center rounded-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary lg:hidden"\n\s*aria-label="Open mobile navigation menu"\n\s*>\n\s*<Menu className="h-6 w-6" \/>\n\s*<\/Link>/,
  `<button type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary lg:hidden"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>`
);

fs.writeFileSync('src/components/layout/SiteHeader.tsx', header);
