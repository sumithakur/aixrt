const fs = require('fs');

const tabsCode = `
          {activeTab === 'about' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">About Page Content</h2>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Hero Section</h3>
                <label className="block text-xs font-semibold text-text-muted">Eyebrow</label>
                <input type="text" value={aboutData.hero?.eyebrow || ''} onChange={e => setAboutData({...aboutData, hero: {...aboutData.hero, eyebrow: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary" />
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input type="text" value={aboutData.hero?.title || ''} onChange={e => setAboutData({...aboutData, hero: {...aboutData.hero, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <label className="block text-xs font-semibold text-text-muted">Description</label>
                <textarea value={aboutData.hero?.description || ''} onChange={e => setAboutData({...aboutData, hero: {...aboutData.hero, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Rationale</h3>
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input type="text" value={aboutData.rationale?.title || ''} onChange={e => setAboutData({...aboutData, rationale: {...aboutData.rationale, title: e.target.value}})} className="w-full p-2 mb-4 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary" />
                
                <label className="block text-xs font-semibold text-text-muted">Paragraphs</label>
                {aboutData.rationale?.paragraphs?.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const newP = [...aboutData.rationale.paragraphs];
                      newP[i] = e.target.value;
                      setAboutData({...aboutData, rationale: {...aboutData.rationale, paragraphs: newP}});
                    }} className="flex-1 p-2 bg-bg-base border border-border-subtle rounded text-text-primary h-20" />
                    <button onClick={() => {
                      const newP = aboutData.rationale.paragraphs.filter((_, idx) => idx !== i);
                      setAboutData({...aboutData, rationale: {...aboutData.rationale, paragraphs: newP}});
                    }} className="px-3 bg-brand-rose/20 text-brand-rose rounded font-bold">X</button>
                  </div>
                ))}
                <button onClick={() => {
                  const newP = [...(aboutData.rationale?.paragraphs || []), "New paragraph"];
                  setAboutData({...aboutData, rationale: {...aboutData.rationale, paragraphs: newP}});
                }} className="px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded text-sm">+ Add Paragraph</button>
              </div>

              <button onClick={() => saveFile('about.json', aboutData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save About Page</button>
            </div>
          )}

          {activeTab === 'showcase' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Showcase Page Content</h2>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Hero Section</h3>
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input type="text" value={showcaseData.hero?.title || ''} onChange={e => setShowcaseData({...showcaseData, hero: {...showcaseData.hero, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <label className="block text-xs font-semibold text-text-muted">Description</label>
                <textarea value={showcaseData.hero?.description || ''} onChange={e => setShowcaseData({...showcaseData, hero: {...showcaseData.hero, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Opportunity Section</h3>
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input type="text" value={showcaseData.opportunity?.title || ''} onChange={e => setShowcaseData({...showcaseData, opportunity: {...showcaseData.opportunity, title: e.target.value}})} className="w-full p-2 mb-4 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary" />
                
                <label className="block text-xs font-semibold text-text-muted">Paragraphs</label>
                {showcaseData.opportunity?.paragraphs?.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const newP = [...showcaseData.opportunity.paragraphs];
                      newP[i] = e.target.value;
                      setShowcaseData({...showcaseData, opportunity: {...showcaseData.opportunity, paragraphs: newP}});
                    }} className="flex-1 p-2 bg-bg-base border border-border-subtle rounded text-text-primary h-20" />
                    <button onClick={() => {
                      const newP = showcaseData.opportunity.paragraphs.filter((_, idx) => idx !== i);
                      setShowcaseData({...showcaseData, opportunity: {...showcaseData.opportunity, paragraphs: newP}});
                    }} className="px-3 bg-brand-rose/20 text-brand-rose rounded font-bold">X</button>
                  </div>
                ))}
                <button onClick={() => {
                  const newP = [...(showcaseData.opportunity?.paragraphs || []), "New paragraph"];
                  setShowcaseData({...showcaseData, opportunity: {...showcaseData.opportunity, paragraphs: newP}});
                }} className="px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded text-sm">+ Add Paragraph</button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Selection Criteria</h3>
                {showcaseData.criteria?.map((item, i) => (
                  <div key={i} className="p-4 bg-bg-base border border-border-subtle rounded flex gap-4">
                    <div className="flex-1 space-y-2">
                      <input type="text" value={item.title} onChange={e => {
                        const newC = [...showcaseData.criteria];
                        newC[i].title = e.target.value;
                        setShowcaseData({...showcaseData, criteria: newC});
                      }} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary" />
                      <textarea value={item.desc} onChange={e => {
                        const newC = [...showcaseData.criteria];
                        newC[i].desc = e.target.value;
                        setShowcaseData({...showcaseData, criteria: newC});
                      }} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-20" />
                    </div>
                    <button onClick={() => {
                      const newC = showcaseData.criteria.filter((_, idx) => idx !== i);
                      setShowcaseData({...showcaseData, criteria: newC});
                    }} className="px-3 bg-brand-rose/20 text-brand-rose rounded font-bold">X</button>
                  </div>
                ))}
                <button onClick={() => {
                  const newC = [...(showcaseData.criteria || []), { title: 'New Criteria', desc: 'Description' }];
                  setShowcaseData({...showcaseData, criteria: newC});
                }} className="px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded text-sm">+ Add Criteria</button>
              </div>

              <button onClick={() => saveFile('showcase.json', showcaseData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Showcase Page</button>
            </div>
          )}

          {activeTab === 'venue' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Venue Page Content</h2>
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input type="text" value={venueData.hero?.title || ''} onChange={e => setVenueData({...venueData, hero: {...venueData.hero, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <label className="block text-xs font-semibold text-text-muted">Description</label>
                <textarea value={venueData.hero?.description || ''} onChange={e => setVenueData({...venueData, hero: {...venueData.hero, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
                
                <h3 className="font-semibold text-brand-secondary mt-6 mb-3 border-b border-border-subtle pb-2">Logistics Paragraphs</h3>
                {venueData.logistics?.paragraphs?.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const newP = [...venueData.logistics.paragraphs];
                      newP[i] = e.target.value;
                      setVenueData({...venueData, logistics: {...venueData.logistics, paragraphs: newP}});
                    }} className="flex-1 p-2 bg-bg-base border border-border-subtle rounded text-text-primary h-20" />
                    <button onClick={() => {
                      const newP = venueData.logistics.paragraphs.filter((_, idx) => idx !== i);
                      setVenueData({...venueData, logistics: {...venueData.logistics, paragraphs: newP}});
                    }} className="px-3 bg-brand-rose/20 text-brand-rose rounded font-bold">X</button>
                  </div>
                ))}
                <button onClick={() => {
                  const newP = [...(venueData.logistics?.paragraphs || []), "New paragraph"];
                  setVenueData({...venueData, logistics: {...venueData.logistics, paragraphs: newP}});
                }} className="px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded text-sm">+ Add Paragraph</button>
              </div>
              <button onClick={() => saveFile('venue.json', venueData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Venue Page</button>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Signals Page Content</h2>
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-text-muted">Hero Title</label>
                <input type="text" value={signalsData.hero?.title || ''} onChange={e => setSignalsData({...signalsData, hero: {...signalsData.hero, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <label className="block text-xs font-semibold text-text-muted">Hero Description</label>
                <textarea value={signalsData.hero?.description || ''} onChange={e => setSignalsData({...signalsData, hero: {...signalsData.hero, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
                
                <h3 className="font-semibold text-brand-secondary mt-6 mb-3 border-b border-border-subtle pb-2">Report Info</h3>
                <label className="block text-xs font-semibold text-text-muted">Report Title</label>
                <input type="text" value={signalsData.report?.title || ''} onChange={e => setSignalsData({...signalsData, report: {...signalsData.report, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <label className="block text-xs font-semibold text-text-muted">Report Description</label>
                <textarea value={signalsData.report?.description || ''} onChange={e => setSignalsData({...signalsData, report: {...signalsData.report, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
              </div>
              <button onClick={() => saveFile('signals.json', signalsData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Signals Page</button>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Contact Page Content</h2>
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input type="text" value={contactData.hero?.title || ''} onChange={e => setContactData({...contactData, hero: {...contactData.hero, title: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <label className="block text-xs font-semibold text-text-muted">Description</label>
                <textarea value={contactData.hero?.description || ''} onChange={e => setContactData({...contactData, hero: {...contactData.hero, description: e.target.value}})} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
                
                <h3 className="font-semibold text-brand-secondary mt-6 mb-3 border-b border-border-subtle pb-2">Emails</h3>
                {contactData.emails?.map((item, i) => (
                  <div key={i} className="p-4 bg-bg-base border border-border-subtle rounded flex gap-4">
                    <div className="flex-1 space-y-2">
                      <input type="text" value={item.role} onChange={e => {
                        const newC = [...contactData.emails];
                        newC[i].role = e.target.value;
                        setContactData({...contactData, emails: newC});
                      }} className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary" placeholder="Role (e.g. Delegate Success)" />
                      <input type="text" value={item.address} onChange={e => {
                        const newC = [...contactData.emails];
                        newC[i].address = e.target.value;
                        setContactData({...contactData, emails: newC});
                      }} className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary" placeholder="Email Address" />
                    </div>
                    <button onClick={() => {
                      const newC = contactData.emails.filter((_, idx) => idx !== i);
                      setContactData({...contactData, emails: newC});
                    }} className="px-3 bg-brand-rose/20 text-brand-rose rounded font-bold">X</button>
                  </div>
                ))}
                <button onClick={() => {
                  const newC = [...(contactData.emails || []), { role: 'New Role', address: 'email@example.com' }];
                  setContactData({...contactData, emails: newC});
                }} className="px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded text-sm">+ Add Email</button>
              </div>
              <button onClick={() => saveFile('contact.json', contactData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Contact Page</button>
            </div>
          )}
`;

let page = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
const oldTabsRegex = /\{activeTab === 'about' && \([\s\S]*?\{activeTab === 'faq' && \(/;
page = page.replace(oldTabsRegex, tabsCode + "\n\n          {activeTab === 'faq' && (");

fs.writeFileSync('src/app/admin/page.tsx', page);
