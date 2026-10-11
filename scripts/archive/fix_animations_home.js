const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// Import FadeIn
page = page.replace(
  /import \{ Section \} from '@\/components\/ui\/Section';/,
  `import { Section } from '@/components/ui/Section';\nimport { FadeIn } from '@/components/ui/FadeIn';`
);

// Parallax background: add fixed positioning to the circuit-board hero image container
page = page.replace(
  /<div className="absolute inset-0 opacity-25 mix-blend-screen">/,
  `<div className="absolute inset-0 opacity-25 mix-blend-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/brand/circuit-board-hero.jpg')" }}>\n          </div>\n          {/* Original image hidden, replaced with bg-fixed for parallax */}\n          <div className="hidden">`
);

// Close the hidden div around the original Image
page = page.replace(
  /className="object-cover object-center"\n\s*\/>\n\s*<\/div>/,
  `className="object-cover object-center"\n            />\n          </div>\n        </div>`
);


// Wrap Hero content in FadeIn
page = page.replace(
  /<div className="mb-6 inline-flex items-center gap-2/,
  `<FadeIn delay={100}><div className="mb-6 inline-flex items-center gap-2`
);
// This will wrap the eyebrow. Wait, I should wrap each element individually to stagger them!

page = page.replace(
  /<h1 className="mx-auto max-w-5xl font-display text-4xl/,
  `<FadeIn delay={300}><h1 className="mx-auto max-w-5xl font-display text-4xl`
);
page = page.replace(
  /<\/span>\n\s*<\/h1>/,
  `</span>\n          </h1></FadeIn>`
);

page = page.replace(
  /<p className="mx-auto mt-6 max-w-3xl text-base/,
  `<FadeIn delay={500}><p className="mx-auto mt-6 max-w-3xl text-base`
);
page = page.replace(
  /\{homeData\.hero\.description\}\n\s*<\/p>/,
  `{homeData.hero.description}\n          </p></FadeIn>`
);

page = page.replace(
  /<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">/,
  `<FadeIn delay={700}><div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">`
);
page = page.replace(
  /See the six roundtables\n\s*<\/Button>\n\s*<\/div>/,
  `See the six roundtables\n            </Button>\n          </div></FadeIn>`
);

page = page.replace(
  /<p className="mt-12 text-xs font-medium uppercase tracking-widest text-text-muted">/,
  `<FadeIn delay={900}><p className="mt-12 text-xs font-medium uppercase tracking-widest text-text-muted">`
);
page = page.replace(
  /Organised by \{config\.event\.organiser\}\n\s*<\/p>/,
  `Organised by {config.event.organiser}\n          </p></FadeIn>`
);

// S2: The Proposition
page = page.replace(
  /<Container size="narrow" className="text-center">/,
  `<Container size="narrow" className="text-center">\n          <FadeIn>`
);
page = page.replace(
  /\{homeData\.hero\.quote\}\n\s*<\/blockquote>/,
  `{homeData.hero.quote}\n          </blockquote>\n          </FadeIn>`
);

// S3: The Summit in Numbers
page = page.replace(
  /<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">/,
  `<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">\n            <FadeIn delay={100}>`
);
page = page.replace(
  /roundtable seats\n\s*<\/p>\n\s*<\/div>/,
  `roundtable seats\n              </p>\n            </div>\n            </FadeIn>`
);

page = page.replace(
  /<div className="rounded-lg border border-border-subtle bg-bg-raised\/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">\n\s*<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-neonFuchsia">/,
  `<FadeIn delay={250}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">\n              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-neonFuchsia">`
);
page = page.replace(
  /sponsored executive roundtables\n\s*<\/p>\n\s*<\/div>/,
  `sponsored executive roundtables\n              </p>\n            </div></FadeIn>`
);

page = page.replace(
  /<div className="rounded-lg border border-border-subtle bg-bg-raised\/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">\n\s*<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-mediumSlateBlue">/,
  `<FadeIn delay={400}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">\n              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-mediumSlateBlue">`
);
page = page.replace(
  /AI Showcase companies\n\s*<\/p>\n\s*<\/div>/,
  `AI Showcase companies\n              </p>\n            </div></FadeIn>`
);

page = page.replace(
  /<div className="rounded-lg border border-border-subtle bg-bg-raised\/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">\n\s*<span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-electricLilac">/,
  `<FadeIn delay={550}><div className="rounded-lg border border-border-subtle bg-bg-raised/75 p-6 text-center sm:p-8 backdrop-blur-sm shadow-card">\n              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-electricLilac">`
);
page = page.replace(
  /intensive day\n\s*<\/p>\n\s*<\/div>/,
  `intensive day\n              </p>\n            </div></FadeIn>`
);

// Roundtables wrapper
page = page.replace(
  /<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">/,
  `<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">\n            <FadeIn className="contents">`
);

fs.writeFileSync('src/app/page.tsx', page);
