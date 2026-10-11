const fs = require('fs');
let content = fs.readFileSync('src/app/partners/page.tsx', 'utf8');

const carouselCode = `
      {/* Previous Partners Section */}
      <Section variant="base" className="overflow-hidden">
        <Container size="default">
          <div className="mb-8 border-b border-border-subtle pb-4">
            <h3 className="font-display text-xl font-bold uppercase tracking-wider text-text-primary">
              Previous Partners
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Organisations that have supported the AIX executive mandate.
            </p>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: \`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
              display: flex;
              width: max-content;
            }
            .carousel-container:hover .animate-marquee {
              animation-play-state: paused;
            }
          \`}} />

          {(!rawData.items || rawData.items.length < 5) ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {(rawData.items || []).map((partner: any, idx: number) => (
                <div key={idx} className="flex h-28 w-48 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-surface p-4">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-text-primary text-center">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative flex overflow-hidden carousel-container w-full">
              <div className="animate-marquee space-x-6 pr-6">
                {[...(rawData.items || []), ...(rawData.items || [])].map((partner: any, idx: number) => (
                  <div key={idx} className="flex h-28 w-48 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-surface p-4">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-sm font-semibold text-text-primary text-center">{partner.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
`;

content = content.replace(/\{\/\* Previous Partners Section \*\/\}[\s\S]*?<\/Section>/, carouselCode);

fs.writeFileSync('src/app/partners/page.tsx', content);
