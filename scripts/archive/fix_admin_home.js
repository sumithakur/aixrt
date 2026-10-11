const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const oldHomeBlock = /<h3 className="font-semibold text-brand-secondary">Hero Section<\/h3>[\s\S]*?<button onClick={\(\) => saveFile\('home.json', homeData\)}/;

const newHomeBlock = `<div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Hero Section</h3>
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-text-muted">Eyebrow</label>
                    <input type="text" value={homeData.hero.eyebrow} onChange={e => setHomeData({...homeData, hero: {...homeData.hero, eyebrow: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary" />
                    
                    <label className="block text-xs font-semibold text-text-muted">Title</label>
                    <input type="text" value={homeData.hero.title} onChange={e => setHomeData({...homeData, hero: {...homeData.hero, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                    
                    <label className="block text-xs font-semibold text-text-muted">Description</label>
                    <textarea value={homeData.hero.description} onChange={e => setHomeData({...homeData, hero: {...homeData.hero, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
                    
                    <label className="block text-xs font-semibold text-text-muted">Quote block</label>
                    <textarea value={homeData.hero.quote} onChange={e => setHomeData({...homeData, hero: {...homeData.hero, quote: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Core Principles (Positioning)</h3>
                  <input type="text" value={homeData.positioning.title} onChange={e => setHomeData({...homeData, positioning: {...homeData.positioning, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary mb-4" />
                  <div className="grid grid-cols-1 gap-4">
                    {homeData.positioning.blocks.map((block: any, i: number) => (
                      <div key={i} className="p-4 border border-border-subtle bg-bg-base rounded">
                        <input type="text" value={block.title} onChange={e => {
                          const newBlocks = [...homeData.positioning.blocks];
                          newBlocks[i].title = e.target.value;
                          setHomeData({...homeData, positioning: {...homeData.positioning, blocks: newBlocks}});
                        }} className="w-full p-2 mb-2 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary" />
                        <textarea value={block.desc} onChange={e => {
                          const newBlocks = [...homeData.positioning.blocks];
                          newBlocks[i].desc = e.target.value;
                          setHomeData({...homeData, positioning: {...homeData.positioning, blocks: newBlocks}});
                        }} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-20" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Roundtables Section Intro</h3>
                    <input type="text" value={homeData.roundtablesIntro.title} onChange={e => setHomeData({...homeData, roundtablesIntro: {...homeData.roundtablesIntro, title: e.target.value}})} className="w-full p-2 mb-2 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary" />
                    <textarea value={homeData.roundtablesIntro.description} onChange={e => setHomeData({...homeData, roundtablesIntro: {...homeData.roundtablesIntro, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Showcase Section Intro</h3>
                    <input type="text" value={homeData.showcaseIntro.title} onChange={e => setHomeData({...homeData, showcaseIntro: {...homeData.showcaseIntro, title: e.target.value}})} className="w-full p-2 mb-2 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary" />
                    <textarea value={homeData.showcaseIntro.description} onChange={e => setHomeData({...homeData, showcaseIntro: {...homeData.showcaseIntro, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
                  </div>
                </div>
              </div>
              <button onClick={() => saveFile('home.json', homeData)}`;

content = content.replace(oldHomeBlock, newHomeBlock);

fs.writeFileSync('src/app/admin/page.tsx', content);
