'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminPage() {
  const [siteData, setSiteData] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const [aboutData, setAboutData] = useState<any>(null);
  const [programmeData, setProgrammeData] = useState<any>(null);
  const [roundtablesData, setRoundtablesData] = useState<any>(null);
  const [partnersData, setPartnersData] = useState<any>(null);
  const [showcaseData, setShowcaseData] = useState<any>(null);
  const [venueData, setVenueData] = useState<any>(null);
  const [signalsData, setSignalsData] = useState<any>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [faqData, setFaqData] = useState<any>(null);

  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('site');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin?file=site.json').then(r => r.json()).then(d => setSiteData(d.content));
    fetch('/api/admin?file=home.json').then(r => r.json()).then(d => setHomeData(d.content));
    fetch('/api/admin?file=about.json').then(r => r.json()).then(d => setAboutData(d.content));
    fetch('/api/admin?file=programme.json').then(r => r.json()).then(d => setProgrammeData(d.content));
    fetch('/api/admin?file=roundtables.json').then(r => r.json()).then(d => setRoundtablesData(d.content));
    fetch('/api/admin?file=partners.json').then(r => r.json()).then(d => setPartnersData(d.content));
    fetch('/api/admin?file=showcase.json').then(r => r.json()).then(d => setShowcaseData(d.content));
    fetch('/api/admin?file=venue.json').then(r => r.json()).then(d => setVenueData(d.content));
    fetch('/api/admin?file=signals.json').then(r => r.json()).then(d => setSignalsData(d.content));
    fetch('/api/admin?file=contact.json').then(r => r.json()).then(d => setContactData(d.content));
    fetch('/api/admin?file=faq.json').then(r => r.json()).then(d => setFaqData(d.content));

  }, []);

  const saveFile = async (file: string, content: any) => {
    setStatus(`Saving ${file}...`);
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, content }),
    });
    if (res.ok) setStatus(`Saved successfully!`);
    else setStatus(`Error saving`);
    setTimeout(() => setStatus(''), 3000);
  };

  
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Uploading logo...');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      const updatedSite = { ...siteData, brand: { logo: data.url } };
      setSiteData(updatedSite);
      await saveFile('site.json', updatedSite);
    } else {
      setStatus('Failed to upload logo.');
    }
  };

  if (!siteData || !homeData || !aboutData || !programmeData || !roundtablesData || !partnersData || !showcaseData || !venueData || !signalsData || !contactData || !faqData) return <div className="p-20 text-center text-text-primary">Loading Content Manager...</div>;

  return (
    <div className="min-h-screen bg-bg-base pt-16 pb-20 text-text-primary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 border-b border-border-subtle pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-primary">AIX Content Manager</h1>
            <p className="mt-2 text-text-secondary">Edit everything: Logos, Homepage, and About text.</p>
          </div>
          {status && <span className="text-brand-secondary font-medium bg-brand-secondary/10 px-4 py-2 rounded">{status}</span>}
        </div>

        <div className="flex gap-4 mb-8 border-b border-border-subtle pb-4 overflow-x-auto">
          {['site', 'home', 'about', 'programme', 'roundtables', 'partners', 'showcase', 'venue', 'signals', 'contact', 'faq'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 rounded-md font-semibold transition-colors border ${activeTab === tab ? 'bg-brand-primary text-white border-brand-primary' : 'bg-bg-raised hover:bg-bg-surface border-border-subtle text-text-secondary'}`}
            >
              {tab === 'site' ? 'Global Settings' : tab === 'home' ? 'Home' : tab === 'about' ? 'About' : tab === 'programme' ? 'Programme' : tab === 'roundtables' ? 'Roundtables' : tab === 'partners' ? 'Partners' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-bg-raised border border-border-subtle p-8 rounded-xl shadow-card">
          {activeTab === 'site' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Brand Logo</h2>
                <div className="flex items-end gap-6 bg-bg-surface p-6 rounded border border-border-subtle">
                  <div className="flex-1">
                    <div className="p-6 bg-bg-base rounded flex items-center justify-center border border-dashed border-border-subtle mb-4">
                      {siteData.brand?.logo ? <img src={siteData.brand.logo} alt="Current Logo" className="max-h-20 object-contain" /> : <span className="text-sm text-text-muted">No logo</span>}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-brand-secondary text-white rounded font-medium shadow-glow">Upload New Logo</button>
                  </div>
                </div>
              </div>
              <button onClick={() => saveFile('site.json', siteData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Settings</button>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Home Page Content</h2>
              <div className="space-y-4">
                <div className="space-y-8">
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
              </div>
              <button onClick={() => saveFile('home.json', homeData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Home Page</button>
            </div>
          )}

          
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
                {aboutData.rationale?.paragraphs?.map((p: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const newP = [...aboutData.rationale.paragraphs];
                      newP[i] = e.target.value;
                      setAboutData({...aboutData, rationale: {...aboutData.rationale, paragraphs: newP}});
                    }} className="flex-1 p-2 bg-bg-base border border-border-subtle rounded text-text-primary h-20" />
                    <button onClick={() => {
                      const newP = aboutData.rationale.paragraphs.filter((_: any, idx: number) => idx !== i);
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
                {showcaseData.opportunity?.paragraphs?.map((p: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const newP = [...showcaseData.opportunity.paragraphs];
                      newP[i] = e.target.value;
                      setShowcaseData({...showcaseData, opportunity: {...showcaseData.opportunity, paragraphs: newP}});
                    }} className="flex-1 p-2 bg-bg-base border border-border-subtle rounded text-text-primary h-20" />
                    <button onClick={() => {
                      const newP = showcaseData.opportunity.paragraphs.filter((_: any, idx: number) => idx !== i);
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
                {showcaseData.criteria?.map((item: any, i: number) => (
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
                      const newC = showcaseData.criteria.filter((_: any, idx: number) => idx !== i);
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
                {venueData.logistics?.paragraphs?.map((p: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const newP = [...venueData.logistics.paragraphs];
                      newP[i] = e.target.value;
                      setVenueData({...venueData, logistics: {...venueData.logistics, paragraphs: newP}});
                    }} className="flex-1 p-2 bg-bg-base border border-border-subtle rounded text-text-primary h-20" />
                    <button onClick={() => {
                      const newP = venueData.logistics.paragraphs.filter((_: any, idx: number) => idx !== i);
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
                {contactData.emails?.map((item: any, i: number) => (
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
                      const newC = contactData.emails.filter((_: any, idx: number) => idx !== i);
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

        </div>
      </div>
    </div>
  );
}
