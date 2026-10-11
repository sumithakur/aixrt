const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// add state for new files
content = content.replace("const [partnersData, setPartnersData] = useState<any>(null);", 
  "const [partnersData, setPartnersData] = useState<any>(null);\n" +
  "  const [showcaseData, setShowcaseData] = useState<any>(null);\n" +
  "  const [venueData, setVenueData] = useState<any>(null);\n" +
  "  const [signalsData, setSignalsData] = useState<any>(null);\n" +
  "  const [contactData, setContactData] = useState<any>(null);\n" +
  "  const [faqData, setFaqData] = useState<any>(null);\n"
);

// fetch data
content = content.replace("fetch('/api/admin?file=partners.json').then(r => r.json()).then(d => setPartnersData(d.content));",
  "fetch('/api/admin?file=partners.json').then(r => r.json()).then(d => setPartnersData(d.content));\n" +
  "    fetch('/api/admin?file=showcase.json').then(r => r.json()).then(d => setShowcaseData(d.content));\n" +
  "    fetch('/api/admin?file=venue.json').then(r => r.json()).then(d => setVenueData(d.content));\n" +
  "    fetch('/api/admin?file=signals.json').then(r => r.json()).then(d => setSignalsData(d.content));\n" +
  "    fetch('/api/admin?file=contact.json').then(r => r.json()).then(d => setContactData(d.content));\n" +
  "    fetch('/api/admin?file=faq.json').then(r => r.json()).then(d => setFaqData(d.content));\n"
);

// update condition
content = content.replace("if (!siteData || !homeData || !aboutData || !programmeData || !roundtablesData || !partnersData)", 
  "if (!siteData || !homeData || !aboutData || !programmeData || !roundtablesData || !partnersData || !showcaseData || !venueData || !signalsData || !contactData || !faqData)"
);

// update tabs
content = content.replace("['site', 'home', 'about', 'programme', 'roundtables', 'partners']", 
  "['site', 'home', 'about', 'programme', 'roundtables', 'partners', 'showcase', 'venue', 'signals', 'contact', 'faq']"
);

content = content.replace("{tab === 'site' ? 'Global Settings & Logo' : tab === 'home' ? 'Home Page' : tab === 'about' ? 'About Page' : tab === 'programme' ? 'Programme Page' : tab === 'roundtables' ? 'Roundtables Page' : 'Partners Page'}", 
  "{tab === 'site' ? 'Global Settings' : tab === 'home' ? 'Home' : tab === 'about' ? 'About' : tab === 'programme' ? 'Programme' : tab === 'roundtables' ? 'Roundtables' : tab === 'partners' ? 'Partners' : tab.charAt(0).toUpperCase() + tab.slice(1)}"
);

// Add the new panels
const newPanels = `
          {activeTab === 'showcase' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Showcase Page</h2>
              <div className="space-y-4">
                <input type="text" value={showcaseData.hero?.title || ''} onChange={e => setShowcaseData({...showcaseData, hero: {...showcaseData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold" />
                <textarea value={showcaseData.hero?.description || ''} onChange={e => setShowcaseData({...showcaseData, hero: {...showcaseData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded h-24" />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary">Content Paragraphs</h3>
                {showcaseData.opportunity.paragraphs.map((p: string, i: number) => (
                  <textarea key={i} value={p} onChange={e => {
                    const newP = [...showcaseData.opportunity.paragraphs];
                    newP[i] = e.target.value;
                    setShowcaseData({...showcaseData, opportunity: {...showcaseData.opportunity, paragraphs: newP}});
                  }} className="w-full p-3 bg-bg-surface border border-border-subtle rounded h-24" />
                ))}
              </div>
              <button onClick={() => saveFile('showcase.json', showcaseData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Showcase</button>
            </div>
          )}

          {activeTab === 'venue' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Venue Page</h2>
              <div className="space-y-4">
                <input type="text" value={venueData.hero?.title || ''} onChange={e => setVenueData({...venueData, hero: {...venueData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold" />
                <textarea value={venueData.hero?.description || ''} onChange={e => setVenueData({...venueData, hero: {...venueData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded h-24" />
              </div>
              <button onClick={() => saveFile('venue.json', venueData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Venue</button>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Signals Page</h2>
              <div className="space-y-4">
                <input type="text" value={signalsData.hero?.title || ''} onChange={e => setSignalsData({...signalsData, hero: {...signalsData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold" />
                <textarea value={signalsData.hero?.description || ''} onChange={e => setSignalsData({...signalsData, hero: {...signalsData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded h-24" />
              </div>
              <div className="space-y-4">
                {signalsData.content.paragraphs.map((p: string, i: number) => (
                  <textarea key={i} value={p} onChange={e => {
                    const newP = [...signalsData.content.paragraphs];
                    newP[i] = e.target.value;
                    setSignalsData({...signalsData, content: {...signalsData.content, paragraphs: newP}});
                  }} className="w-full p-3 bg-bg-surface border border-border-subtle rounded h-24" />
                ))}
              </div>
              <button onClick={() => saveFile('signals.json', signalsData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Signals</button>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Contact Page</h2>
              <div className="space-y-4">
                <input type="text" value={contactData.hero?.title || ''} onChange={e => setContactData({...contactData, hero: {...contactData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold" />
                <textarea value={contactData.hero?.description || ''} onChange={e => setContactData({...contactData, hero: {...contactData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded h-24" />
              </div>
              <div className="space-y-4">
                {contactData.emails.map((email: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <input type="text" value={email.name} onChange={e => {
                      const newE = [...contactData.emails];
                      newE[i].name = e.target.value;
                      setContactData({...contactData, emails: newE});
                    }} className="flex-1 p-3 bg-bg-surface border border-border-subtle rounded" />
                    <input type="text" value={email.address} onChange={e => {
                      const newE = [...contactData.emails];
                      newE[i].address = e.target.value;
                      setContactData({...contactData, emails: newE});
                    }} className="flex-1 p-3 bg-bg-surface border border-border-subtle rounded" />
                  </div>
                ))}
              </div>
              <button onClick={() => saveFile('contact.json', contactData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Contact</button>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">FAQ Content</h2>
              {faqData.items?.map((cat: any, i: number) => (
                <div key={i} className="p-6 border border-border-subtle bg-bg-surface rounded-lg mb-4">
                  <input type="text" value={cat.category} onChange={e => {
                    const newItems = [...faqData.items];
                    newItems[i].category = e.target.value;
                    setFaqData({...faqData, items: newItems});
                  }} className="w-full p-3 bg-bg-base border border-border-subtle rounded font-bold mb-4 text-brand-secondary" />
                  
                  {cat.items?.map((q: any, j: number) => (
                    <div key={j} className="pl-4 border-l-2 border-border-subtle mb-4">
                      <input type="text" value={q.question} onChange={e => {
                        const newItems = [...faqData.items];
                        newItems[i].items[j].question = e.target.value;
                        setFaqData({...faqData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded font-semibold mb-2" />
                      <textarea value={q.answer} onChange={e => {
                        const newItems = [...faqData.items];
                        newItems[i].items[j].answer = e.target.value;
                        setFaqData({...faqData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded h-20" />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={() => saveFile('faq.json', faqData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save FAQs</button>
            </div>
          )}
`;

content = content.replace("        </div>\n      </div>\n    </div>\n  );\n}", newPanels + "\n        </div>\n      </div>\n    </div>\n  );\n}");

fs.writeFileSync('src/app/admin/page.tsx', content);
