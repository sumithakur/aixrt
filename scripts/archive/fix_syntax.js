const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// I replaced <div className="mb-6 inline-flex... with <FadeIn delay={100}><div className="mb-6 inline-flex...
// but the closing tag was: </span>\n          </div>
page = page.replace(
  /\{config\.event\.locationPublic\}\n\s*<\/span>\n\s*<\/div>/,
  `{config.event.locationPublic}\n            </span>\n          </div></FadeIn>`
);

// I replaced <FadeIn delay={300}><h1 className="mx-auto max-w-5xl font-display text-4xl...
// wait, I also broke the section and fragment:
// src/app/page.tsx:104:11 - error TS17002: Expected corresponding JSX closing tag for 'section'.
page = page.replace(
  /className="object-cover object-center"\n\s*\/>\n\s*<\/div>\n\s*<\/div>/,
  `className="object-cover object-center"\n            />\n          </div>\n        </div>`
);

page = page.replace(
  /<FadeIn className="contents">\n\s*\{roundtables\.map\(\(rt\) => \(\n\s*<RoundtableCard key=\{rt\.slug\} roundtable=\{rt\} \/>\n\s*\)\)\}/,
  `<FadeIn className="contents">\n            {roundtables.map((rt) => (\n              <RoundtableCard key={rt.slug} roundtable={rt} />\n            ))}\n            </FadeIn>`
);

fs.writeFileSync('src/app/page.tsx', page);
