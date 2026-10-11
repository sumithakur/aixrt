const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Replace hardcoded "Where AI moves from ambition to action." with homeData.hero.eyebrow and title
// In the hero h1:
const h1Regex = /<h1 className="[^"]+">[\s\S]*?<\/h1>/;
const newH1 = `<h1 className="mx-auto max-w-5xl font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl lg:text-7xl leading-[1.08]">
            {homeData.hero.eyebrow}{' '}
            <span className="bg-gradient-to-r from-text-primary via-brand-neonFuchsia to-brand-mediumSlateBlue bg-clip-text text-transparent">
              {homeData.hero.title}
            </span>
          </h1>`;
page = page.replace(h1Regex, newH1);

// 2. Roundtables section intro text
page = page.replace(/The Six Executive Roundtables/g, '{homeData.roundtablesIntro.title}');
// Add description under the title
const rtDescRegex = /<\/Heading>\s*<\/div>\s*<Link/;
const newRtDesc = `</Heading>
              <p className="mt-2 text-sm text-text-secondary max-w-2xl">{homeData.roundtablesIntro.description}</p>
            </div>
            <Link`;
page = page.replace(rtDescRegex, newRtDesc);

// 3. Showcase section intro text
page = page.replace(/Enterprise Startup Showcase/g, '{homeData.showcaseIntro.title}');
// Add description
const scDescRegex = /<\/Heading>\s*<\/div>\s*<Button href="\/showcase"/;
const newScDesc = `</Heading>
              <p className="mt-2 text-sm text-text-secondary max-w-2xl">{homeData.showcaseIntro.description}</p>
            </div>
            <Button href="/showcase"`;
page = page.replace(scDescRegex, newScDesc);

// 4. Inject Positioning Blocks right after the quote
const quoteSectionRegex = /<Section variant="surface">[\s\S]*?<\/Section>/;
const oldQuoteSection = page.match(quoteSectionRegex)[0];
const newQuoteSection = oldQuoteSection + `
      <Section variant="base">
        <Container size="default">
          <div className="mb-12 text-center">
            <Heading level={2} size="xl">{homeData.positioning.title}</Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeData.positioning.blocks.map((block: any, idx: number) => (
              <div key={idx} className="bg-bg-raised p-6 rounded-lg border border-border-subtle shadow-card">
                <h3 className="font-display font-bold text-brand-secondary mb-3">{block.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{block.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
`;
page = page.replace(quoteSectionRegex, newQuoteSection);


fs.writeFileSync('src/app/page.tsx', page);
