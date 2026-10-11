const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

content = content.replace("const [programmeData, setProgrammeData] = useState<any>(null);", "const [programmeData, setProgrammeData] = useState<any>(null);\n  const [partnersData, setPartnersData] = useState<any>(null);");

content = content.replace("fetch('/api/admin?file=programme.json').then(r => r.json()).then(d => setProgrammeData(d.content));", "fetch('/api/admin?file=programme.json').then(r => r.json()).then(d => setProgrammeData(d.content));\n    fetch('/api/admin?file=partners.json').then(r => r.json()).then(d => setPartnersData(d.content));");

content = content.replace("if (!siteData || !homeData || !aboutData) return", "if (!siteData || !homeData || !aboutData || !partnersData) return");

content = content.replace("['site', 'home', 'about'].map(tab => (", "['site', 'home', 'about', 'programme_intro', 'roundtables_intro', 'partners_intro'].map(tab => (");

content = content.replace("{tab === 'site' ? 'Global Settings & Logo' : tab === 'home' ? 'Home Page' : 'About Page'}", "{tab === 'site' ? 'Global Settings & Logo' : tab === 'home' ? 'Home Page' : tab === 'about' ? 'About Page' : tab === 'programme_intro' ? 'Programme Intro' : tab === 'roundtables_intro' ? 'Roundtables Intro' : 'Partners Intro'}");

// Inject the new panels after the about tab content
const newTabs = `
          {activeTab === 'programme_intro' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Programme Page Intro</h2>
              <div className="space-y-4">
                <input type="text" value={programmeData.hero?.title || ''} onChange={e => setProgrammeData({...programmeData, hero: {...programmeData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <textarea value={programmeData.hero?.description || ''} onChange={e => setProgrammeData({...programmeData, hero: {...programmeData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
              </div>
              <button onClick={() => saveFile('programme.json', programmeData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Programme Intro</button>
            </div>
          )}

          {activeTab === 'roundtables_intro' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Roundtables Page Intro</h2>
              <div className="space-y-4">
                <input type="text" value={roundtablesData.hero?.title || ''} onChange={e => setRoundtablesData({...roundtablesData, hero: {...roundtablesData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <textarea value={roundtablesData.hero?.description || ''} onChange={e => setRoundtablesData({...roundtablesData, hero: {...roundtablesData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
              </div>
              <button onClick={() => saveFile('roundtables.json', roundtablesData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Roundtables Intro</button>
            </div>
          )}

          {activeTab === 'partners_intro' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Partners Page Intro</h2>
              <div className="space-y-4">
                <input type="text" value={partnersData.hero?.title || ''} onChange={e => setPartnersData({...partnersData, hero: {...partnersData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <textarea value={partnersData.hero?.description || ''} onChange={e => setPartnersData({...partnersData, hero: {...partnersData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
              </div>
              <button onClick={() => saveFile('partners.json', partnersData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Partners Intro</button>
            </div>
          )}
`;

content = content.replace("          {activeTab === 'home' && (", newTabs + "\n          {activeTab === 'home' && (");

fs.writeFileSync('src/app/admin/page.tsx', content);
