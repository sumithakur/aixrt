const fs = require('fs');

const pagePath = 'src/app/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

content = content.replace(/<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-brightAqua">\s*75\s*<\/span>/, '<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-brightAqua">\n                {config.event.seats}\n              </span>');
content = content.replace(/<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-neonFuchsia">\s*5\s*<\/span>/, '<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-neonFuchsia">\n                {config.event.roundtablesCount}\n              </span>');
content = content.replace(/<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-mediumSlateBlue">\s*4–6\s*<\/span>/, '<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-mediumSlateBlue">\n                {config.event.showcaseCount}\n              </span>');

fs.writeFileSync(pagePath, content);
