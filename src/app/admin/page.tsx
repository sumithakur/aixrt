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
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Saved & live! (${file})`);
      } else {
        setStatus(`Error saving: ${data.error || 'Server error'}`);
      }
    } catch (e: any) {
      setStatus(`Network error saving ${file}`);
    }
    setTimeout(() => setStatus(''), 4000);
  };

  const downloadJson = (fileName: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border-subtle pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-primary">AIX Content Manager</h1>
            <p className="mt-2 text-text-secondary">Changes save and revalidate live pages immediately.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold rounded-md border border-border-subtle bg-bg-surface hover:bg-bg-raised text-text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <span>View Live Website ↗</span>
            </a>
            {status && <span className="text-brand-secondary font-medium bg-brand-secondary/10 px-4 py-2 rounded text-sm">{status}</span>}
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-border-subtle pb-4 overflow-x-auto">
          {['site', 'home', 'about', 'programme', 'roundtables', 'partners', 'showcase', 'venue', 'signals', 'contact', 'faq'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 rounded-md font-semibold transition-colors border ${activeTab === tab ? 'bg-brand-primary text-white border-brand-primary' : 'bg-bg-raised hover:bg-bg-surface border-border-subtle text-text-secondary'}`}
            >
              {tab === 'site' ? 'Global Settings' : tab === 'home' ? 'Home' : tab === 'about' ? 'About' : tab === 'programme' ? 'Programme' : tab === 'roundtables' ? 'Roundtables' : tab === 'partners' ? 'Sponsors' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                    <label className="block text-xs font-semibold text-text-muted">Eyebrow Badge</label>
                    <input
                      type="text"
                      value={homeData.hero?.eyebrow || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, eyebrow: e.target.value } })}
                      className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary"
                      placeholder="e.g. ACTIVE EDITION · 14 DECEMBER 2026"
                    />

                    <label className="block text-xs font-semibold text-text-muted">Title / Main Heading</label>
                    <input
                      type="text"
                      value={homeData.hero?.title || homeData.hero?.headline || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, title: e.target.value, headline: e.target.value } })}
                      className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary"
                      placeholder="e.g. JOIN THE ULTIMATE AIX ROUNDTABLE"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-muted">Location</label>
                        <input
                          type="text"
                          value={homeData.hero?.location || ''}
                          onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, location: e.target.value } })}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary"
                          placeholder="e.g. Doha, Qatar"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-muted">Date</label>
                        <input
                          type="text"
                          value={homeData.hero?.date || ''}
                          onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, date: e.target.value } })}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary"
                          placeholder="e.g. 14 December 2026"
                        />
                      </div>
                    </div>

                    <label className="block text-xs font-semibold text-text-muted">Description / Standfirst</label>
                    <textarea
                      value={homeData.hero?.description || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, description: e.target.value } })}
                      className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24"
                    />

                    <label className="block text-xs font-semibold text-text-muted">Quote Block</label>
                    <textarea
                      value={homeData.hero?.quote || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, quote: e.target.value } })}
                      className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24"
                    />
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

          {activeTab === 'programme' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Programme Content & Schedule</h2>

              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Hero Section</h3>
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input
                  type="text"
                  value={programmeData.hero?.title || ''}
                  onChange={(e) => setProgrammeData({ ...programmeData, hero: { ...programmeData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary"
                />
                <label className="block text-xs font-semibold text-text-muted">Description</label>
                <textarea
                  value={programmeData.hero?.description || ''}
                  onChange={(e) => setProgrammeData({ ...programmeData, hero: { ...programmeData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <h3 className="font-semibold text-brand-secondary">Schedule Items ({programmeData.items?.length || 0})</h3>
                  <button
                    onClick={() => {
                      const newItems = [
                        ...(programmeData.items || []),
                        { start: '18:30', end: '19:00', format: 'reception', title: 'New Schedule Item', description: 'Schedule description' }
                      ];
                      setProgrammeData({ ...programmeData, items: newItems });
                    }}
                    className="px-4 py-1.5 bg-brand-secondary/20 text-brand-secondary rounded text-xs font-bold hover:bg-brand-secondary/30 transition-colors"
                  >
                    + Add Schedule Item
                  </button>
                </div>

                <div className="space-y-4">
                  {programmeData.items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 bg-bg-base border border-border-subtle rounded-lg space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-text-muted uppercase">Item #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newItems = programmeData.items.filter((_: any, idx: number) => idx !== i);
                            setProgrammeData({ ...programmeData, items: newItems });
                          }}
                          className="px-2.5 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold hover:bg-brand-rose/30"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-text-muted mb-1">Start Time</label>
                          <input
                            type="text"
                            value={item.start}
                            onChange={(e) => {
                              const newItems = [...programmeData.items];
                              newItems[i].start = e.target.value;
                              setProgrammeData({ ...programmeData, items: newItems });
                            }}
                            className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-muted mb-1">End Time</label>
                          <input
                            type="text"
                            value={item.end}
                            onChange={(e) => {
                              const newItems = [...programmeData.items];
                              newItems[i].end = e.target.value;
                              setProgrammeData({ ...programmeData, items: newItems });
                            }}
                            className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-muted mb-1">Format</label>
                          <select
                            value={item.format}
                            onChange={(e) => {
                              const newItems = [...programmeData.items];
                              newItems[i].format = e.target.value;
                              setProgrammeData({ ...programmeData, items: newItems });
                            }}
                            className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                          >
                            <option value="arrival">arrival</option>
                            <option value="opening">opening</option>
                            <option value="keynote">keynote</option>
                            <option value="roundtables">roundtables</option>
                            <option value="connections">connections</option>
                            <option value="reception">reception</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...programmeData.items];
                            newItems[i].title = e.target.value;
                            setProgrammeData({ ...programmeData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-semibold text-text-primary text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...programmeData.items];
                            newItems[i].description = e.target.value;
                            setProgrammeData({ ...programmeData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-16"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => saveFile('programme.json', programmeData)}
                className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow"
              >
                Save Programme
              </button>
            </div>
          )}

          {activeTab === 'roundtables' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div>
                  <h2 className="text-xl font-bold">Roundtable Tracks & Topics</h2>
                  <p className="text-xs text-text-secondary mt-1">Manage themes, questions, participant profiles, and sessions.</p>
                </div>
                <button
                  onClick={() => {
                    const newItems = [
                      ...(roundtablesData.items || []),
                      {
                        slug: `roundtable-${Date.now()}`,
                        shortTitle: 'New Topic',
                        title: 'New Roundtable Title',
                        coreQuestion: 'What is the strategic question?',
                        lane: 'Strategic domain and scope.',
                        themes: ['Key Theme 1', 'Key Theme 2'],
                        participantProfile: ['Target Executive 1'],
                        accent: 'industrial',
                        order: (roundtablesData.items?.length || 0) + 1,
                        session: 1,
                        chair: { status: 'pending', proposed: 'TBD', organisation: 'TBD' }
                      }
                    ];
                    setRoundtablesData({ ...roundtablesData, items: newItems });
                  }}
                  className="px-4 py-2 bg-brand-secondary text-white rounded text-xs font-bold shadow-glow"
                >
                  + Add New Roundtable
                </button>
              </div>

              <div className="space-y-8">
                {roundtablesData.items?.map((rt: any, i: number) => (
                  <div key={i} className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary font-mono text-xs font-bold">
                          Table #{rt.order || i + 1}
                        </span>
                        <span className="text-xs font-semibold text-text-muted">
                          Session {rt.session || 1}
                        </span>
                        <h4 className="font-display font-bold text-base text-text-primary">{rt.shortTitle}</h4>
                      </div>
                      <button
                        onClick={() => {
                          const newItems = roundtablesData.items.filter((_: any, idx: number) => idx !== i);
                          setRoundtablesData({ ...roundtablesData, items: newItems });
                        }}
                        className="px-3 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold hover:bg-brand-rose/30"
                      >
                        Delete Roundtable
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">Short Title (Nav & Badges)</label>
                        <input
                          type="text"
                          value={rt.shortTitle || ''}
                          onChange={(e) => {
                            const newItems = [...roundtablesData.items];
                            newItems[i].shortTitle = e.target.value;
                            setRoundtablesData({ ...roundtablesData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={rt.slug || ''}
                          onChange={(e) => {
                            const newItems = [...roundtablesData.items];
                            newItems[i].slug = e.target.value;
                            setRoundtablesData({ ...roundtablesData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">Session</label>
                          <select
                            value={rt.session || 1}
                            onChange={(e) => {
                              const newItems = [...roundtablesData.items];
                              newItems[i].session = Number(e.target.value);
                              setRoundtablesData({ ...roundtablesData, items: newItems });
                            }}
                            className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                          >
                            <option value={1}>Session 1</option>
                            <option value={2}>Session 2</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-muted mb-1">Order</label>
                          <input
                            type="number"
                            value={rt.order || i + 1}
                            onChange={(e) => {
                              const newItems = [...roundtablesData.items];
                              newItems[i].order = Number(e.target.value);
                              setRoundtablesData({ ...roundtablesData, items: newItems });
                            }}
                            className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1">Full Title</label>
                      <input
                        type="text"
                        value={rt.title || ''}
                        onChange={(e) => {
                          const newItems = [...roundtablesData.items];
                          newItems[i].title = e.target.value;
                          setRoundtablesData({ ...roundtablesData, items: newItems });
                        }}
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1">Core Strategic Question</label>
                      <textarea
                        value={rt.coreQuestion || ''}
                        onChange={(e) => {
                          const newItems = [...roundtablesData.items];
                          newItems[i].coreQuestion = e.target.value;
                          setRoundtablesData({ ...roundtablesData, items: newItems });
                        }}
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-16"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1">Domain Scope & Lane</label>
                      <textarea
                        value={rt.lane || ''}
                        onChange={(e) => {
                          const newItems = [...roundtablesData.items];
                          newItems[i].lane = e.target.value;
                          setRoundtablesData({ ...roundtablesData, items: newItems });
                        }}
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-16"
                      />
                    </div>

                    {/* Themes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-text-muted">Discussion Themes</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...roundtablesData.items];
                            newItems[i].themes = [...(newItems[i].themes || []), 'New Theme'];
                            setRoundtablesData({ ...roundtablesData, items: newItems });
                          }}
                          className="text-xs text-brand-secondary hover:underline"
                        >
                          + Add Theme
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rt.themes?.map((th: string, thIdx: number) => (
                          <div key={thIdx} className="flex gap-1.5">
                            <input
                              type="text"
                              value={th}
                              onChange={(e) => {
                                const newItems = [...roundtablesData.items];
                                newItems[i].themes[thIdx] = e.target.value;
                                setRoundtablesData({ ...roundtablesData, items: newItems });
                              }}
                              className="flex-1 p-1.5 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...roundtablesData.items];
                                newItems[i].themes = newItems[i].themes.filter((_: any, idx: number) => idx !== thIdx);
                                setRoundtablesData({ ...roundtablesData, items: newItems });
                              }}
                              className="px-2 bg-brand-rose/20 text-brand-rose rounded text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Participant Profile */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-text-muted">Target Participant Profile</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...roundtablesData.items];
                            newItems[i].participantProfile = [...(newItems[i].participantProfile || []), 'Target Role / Company'];
                            setRoundtablesData({ ...roundtablesData, items: newItems });
                          }}
                          className="text-xs text-brand-secondary hover:underline"
                        >
                          + Add Participant Profile
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rt.participantProfile?.map((prof: string, profIdx: number) => (
                          <div key={profIdx} className="flex gap-1.5">
                            <input
                              type="text"
                              value={prof}
                              onChange={(e) => {
                                const newItems = [...roundtablesData.items];
                                newItems[i].participantProfile[profIdx] = e.target.value;
                                setRoundtablesData({ ...roundtablesData, items: newItems });
                              }}
                              className="flex-1 p-1.5 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...roundtablesData.items];
                                newItems[i].participantProfile = newItems[i].participantProfile.filter((_: any, idx: number) => idx !== profIdx);
                                setRoundtablesData({ ...roundtablesData, items: newItems });
                              }}
                              className="px-2 bg-brand-rose/20 text-brand-rose rounded text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => saveFile('roundtables.json', roundtablesData)}
                className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow"
              >
                Save All Roundtables
              </button>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Sponsors & Roundtable Chairs</h2>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-brand-secondary mb-3 border-b border-border-subtle pb-2">Hero Section</h3>
                <label className="block text-xs font-semibold text-text-muted">Title</label>
                <input
                  type="text"
                  value={partnersData.hero?.title || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, hero: { ...partnersData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-lg text-text-primary"
                />
                <label className="block text-xs font-semibold text-text-muted">Description</label>
                <textarea
                  value={partnersData.hero?.description || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, hero: { ...partnersData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-text-primary h-24"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <h3 className="font-semibold text-brand-secondary">Sponsors ({partnersData.items?.length || 0})</h3>
                  <button
                    onClick={() => {
                      const newItems = [
                        ...(partnersData.items || []),
                        { name: 'New Sponsor', logo: '/brand/WhiteLogo.png', status: 'confirmed' }
                      ];
                      setPartnersData({ ...partnersData, items: newItems });
                    }}
                    className="px-4 py-1.5 bg-brand-secondary/20 text-brand-secondary rounded text-xs font-bold hover:bg-brand-secondary/30 transition-colors"
                  >
                    + Add Sponsor
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partnersData.items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 bg-bg-base border border-border-subtle rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-muted uppercase">Sponsor #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newItems = partnersData.items.filter((_: any, idx: number) => idx !== i);
                            setPartnersData({ ...partnersData, items: newItems });
                          }}
                          className="px-2.5 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold hover:bg-brand-rose/30"
                        >
                          Remove
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Company / Sponsor Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...partnersData.items];
                            newItems[i].name = e.target.value;
                            setPartnersData({ ...partnersData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Status</label>
                        <select
                          value={item.status}
                          onChange={(e) => {
                            const newItems = [...partnersData.items];
                            newItems[i].status = e.target.value;
                            setPartnersData({ ...partnersData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                        >
                          <option value="confirmed">confirmed</option>
                          <option value="pending">pending</option>
                          <option value="target">target</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Logo URL</label>
                        <input
                          type="text"
                          value={item.logo}
                          onChange={(e) => {
                            const newItems = [...partnersData.items];
                            newItems[i].logo = e.target.value;
                            setPartnersData({ ...partnersData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => saveFile('partners.json', partnersData)}
                className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow"
              >
                Save Sponsors
              </button>
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
