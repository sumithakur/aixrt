const fs = require('fs');

let content = fs.readFileSync('src/components/layout/SiteFooter.tsx', 'utf8');

// Replace the {config.event.organiser} with hyperlinked version, increase font size from text-xs to text-sm or text-base for that whole line
content = content.replace(
  /<p className="text-xs text-text-muted">\s*Organised by\{' '\}\s*<span className="font-semibold text-text-secondary">\{config\.event\.organiser\}<\/span>\s*<\/p>/g,
  `<p className="text-sm text-text-muted mt-2">
              Organised by{' '}
              <a href="https://www.risin.ventures" target="_blank" rel="noopener noreferrer" className="font-bold text-base text-brand-primary hover:text-brand-secondary transition-colors underline">
                {config.event.organiser}
              </a>
            </p>`
);

// also the bottom one needs bigger font size? "we need to increase the font and hyperlink that as well"
content = content.replace(
  /<p>© 2026 AIX Summit. Organised by <a href="https:\/\/www.risin.ventures" target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors underline">Risin Ventures<\/a>. All rights reserved.<\/p>/,
  `<p className="text-sm">© 2026 AIX Summit. Organised by <a href="https://www.risin.ventures" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-primary hover:text-brand-secondary transition-colors underline">Risin Ventures</a>. All rights reserved.</p>`
);

fs.writeFileSync('src/components/layout/SiteFooter.tsx', content);
