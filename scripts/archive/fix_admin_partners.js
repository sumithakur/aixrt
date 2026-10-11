const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// We need a helper to upload a partner logo specifically since the existing handleLogoUpload is bound to siteData.
// We can just add a generic upload helper.
const genericUpload = `
  const handleGenericUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Uploading image...');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      callback(data.url);
      setStatus('Image uploaded!');
    } else {
      setStatus('Failed to upload image.');
    }
    setTimeout(() => setStatus(''), 3000);
  };
`;

content = content.replace("const handleLogoUpload = async", genericUpload + "\n  const handleLogoUpload = async");

// Replace partners tab
const partnersTab = `
          {activeTab === 'partners' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Partners Page Intro & Logos</h2>
              <div className="space-y-4">
                <input type="text" value={partnersData.hero?.title || ''} onChange={e => setPartnersData({...partnersData, hero: {...partnersData.hero, title: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary" />
                <textarea value={partnersData.hero?.description || ''} onChange={e => setPartnersData({...partnersData, hero: {...partnersData.hero, description: e.target.value}})} className="w-full p-3 bg-bg-surface border border-border-subtle rounded text-text-primary h-24" />
              </div>
              
              <h3 className="font-semibold text-brand-secondary mt-8 mb-4">Partners List</h3>
              {partnersData.items?.map((item: any, i: number) => (
                <div key={i} className="p-6 border border-border-subtle bg-bg-surface rounded-lg relative">
                  <button onClick={() => {
                    const newItems = [...partnersData.items];
                    newItems.splice(i, 1);
                    setPartnersData({...partnersData, items: newItems});
                  }} className="absolute top-4 right-4 text-brand-rose text-sm font-semibold hover:underline">Remove Partner</button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Partner Name</label>
                      <input type="text" value={item.name || ''} onChange={e => {
                        const newItems = [...partnersData.items];
                        newItems[i].name = e.target.value;
                        setPartnersData({...partnersData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded font-bold text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Partner Logo</label>
                      <div className="flex gap-2 items-center">
                        {item.logo ? <img src={item.logo} alt="Logo" className="h-10 object-contain bg-bg-base p-1 border border-border-subtle rounded" /> : null}
                        <input type="file" accept="image/*" onChange={(e) => handleGenericUpload(e, (url) => {
                          const newItems = [...partnersData.items];
                          newItems[i].logo = url;
                          setPartnersData({...partnersData, items: newItems});
                        })} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <button onClick={() => setPartnersData({...partnersData, items: [...(partnersData.items || []), {name: '', logo: ''}]})} className="px-6 py-3 bg-bg-surface border border-brand-primary text-brand-primary rounded font-bold hover:bg-brand-primary/10">+ Add Partner</button>
                <button onClick={() => saveFile('partners.json', partnersData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow hover:opacity-90">Save Partners</button>
              </div>
            </div>
          )}
`;

// regex to replace the entire partners block
content = content.replace(/\{activeTab === 'partners' && \([\s\S]*?Save Partners Intro<\/button>\s*<\/div>\s*\)\}/, partnersTab);

fs.writeFileSync('src/app/admin/page.tsx', content);
