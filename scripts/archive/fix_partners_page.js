const fs = require('fs');

let path = 'src/app/partners/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/Five Roundtable Chair Partnerships are Open for 2026/g, "Six Roundtable Chair Partnerships are Open for 2026");
content = content.replace(/Five Roundtable Chair/g, "Six Roundtable Chair");
content = content.replace(/Across the Five Lanes/g, "Across the Six Lanes");

const previousPartnersHTML = `
      {/* Previous Partners Section */}
      <Section variant="base">
        <Container size="default">
          <div className="mb-8 border-b border-border-subtle pb-4">
            <h3 className="font-display text-xl font-bold uppercase tracking-wider text-text-primary">
              Previous Partners
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Organisations that have supported the AIX executive mandate.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "Commercial Bank of Qatar (CBQ)",
              "MCIT",
              "QatarEnergy",
              "NCSA",
              "MEEZA / Ooredoo",
              "HMC"
            ].map((partner, idx) => (
              <div key={idx} className="flex h-24 items-center justify-center rounded-md border border-border-subtle bg-bg-surface p-4 text-center">
                <span className="text-sm font-semibold text-text-primary">{partner}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>
`;

content = content.replace(/<CTABand \/>/, previousPartnersHTML + '\n      <CTABand />');

fs.writeFileSync(path, content);
