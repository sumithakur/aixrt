const fs = require('fs');

let header = fs.readFileSync('src/components/layout/SiteHeader.tsx', 'utf8');

// Replace the Logo block in SiteHeader
const oldLogoBlockRegex = /<div className="flex shrink-0 items-center">\n\s*<Logo size="md" className="w-\[220px\] sm:w-\[320px\] lg:w-\[420px\] transition-all" \/>\n\s*<\/div>/;

const newLogoBlock = `<div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <Logo size="md" className="w-[130px] sm:w-[160px] lg:w-[190px] transition-all" />
            <div className="hidden sm:flex flex-col border-l border-text-muted/30 pl-4 sm:pl-6 justify-center mt-1">
              <span className="text-[10px] font-medium text-text-muted leading-tight mb-0.5">Powered by</span>
              <a href="https://risinventures.com" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-text-primary leading-tight underline hover:text-brand-secondary transition-colors">
                Risin Ventures
              </a>
            </div>
          </div>`;

header = header.replace(oldLogoBlockRegex, newLogoBlock);

fs.writeFileSync('src/components/layout/SiteHeader.tsx', header);
