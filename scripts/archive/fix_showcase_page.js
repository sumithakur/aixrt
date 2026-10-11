const fs = require('fs');

let page = fs.readFileSync('src/app/showcase/page.tsx', 'utf8');

// Replace selectionCriteria hardcoded array with data from getShowcaseData
page = page.replace(
  /const selectionCriteria = \[[\s\S]*?\];/,
  `const showcaseData = require('@/lib/content').getShowcaseData();
  const selectionCriteria = showcaseData.criteria || [];`
);

// Replace the Hero text
page = page.replace(
  /<Heading level=\{1\} size="xl" className="mb-4">\n\s*Enterprise Pitch Session\n\s*<\/Heading>\n\s*<Standfirst>\n\s*Twelve heavily-vetted Series A\+ enterprise AI startups present live, working software directly to the roundtable executives\.\n\s*<\/Standfirst>/,
  `<Heading level={1} size="xl" className="mb-4">
              {showcaseData.hero.title}
            </Heading>
            <Standfirst>
              {showcaseData.hero.description}
            </Standfirst>`
);

// Replace Opportunity text
page = page.replace(
  /<Heading level=\{2\} size="xl">\n\s*Six Minutes to Prove It Works\n\s*<\/Heading>\n\s*<div className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary">\n\s*<p>[\s\S]*?<\/p>\n\s*<\/div>/,
  `<Heading level={2} size="xl">
                {showcaseData.opportunity.title}
              </Heading>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary">
                {showcaseData.opportunity.paragraphs.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>`
);

fs.writeFileSync('src/app/showcase/page.tsx', page);
