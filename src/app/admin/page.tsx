'use client';

import { useState, useEffect, useRef } from 'react';
import defaultSite from '@/content/site.json';
import defaultHome from '@/content/home.json';
import defaultAbout from '@/content/about.json';
import defaultProgramme from '@/content/programme.json';
import defaultRoundtables from '@/content/roundtables.json';
import defaultPartners from '@/content/partners.json';
import defaultShowcase from '@/content/showcase.json';
import defaultVenue from '@/content/venue.json';
import defaultSignals from '@/content/signals.json';
import defaultContact from '@/content/contact.json';
import defaultFaq from '@/content/faq.json';
import defaultNavigation from '@/content/navigation.json';
import defaultGlobals from '@/content/globals.json';
import defaultMetadata from '@/content/metadata.json';
import { NavigationEditor } from '@/components/admin/NavigationEditor';
import { GlobalsEditor } from '@/components/admin/GlobalsEditor';
import { MetadataEditor } from '@/components/admin/MetadataEditor';
import { FirebaseStatus } from '@/components/admin/FirebaseStatus';
import { RoundtableDefaultsEditor, StringListEditor } from '@/components/admin/RoundtableDefaultsEditor';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LogOut, Save, Download, Upload, RefreshCw, Plus, Trash2, ArrowUpRight } from 'lucide-react';

/** Turns a roundtable's short title into the URL slug used for its page address. */
function slugify(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPage() {
  const [siteData, setSiteData] = useState<any>(defaultSite);
  const [homeData, setHomeData] = useState<any>(defaultHome);
  const [aboutData, setAboutData] = useState<any>(defaultAbout);
  const [programmeData, setProgrammeData] = useState<any>(defaultProgramme);
  const [roundtablesData, setRoundtablesData] = useState<any>(defaultRoundtables);
  const [partnersData, setPartnersData] = useState<any>(defaultPartners);
  const [showcaseData, setShowcaseData] = useState<any>(defaultShowcase);
  const [venueData, setVenueData] = useState<any>(defaultVenue);
  const [signalsData, setSignalsData] = useState<any>(defaultSignals);
  const [contactData, setContactData] = useState<any>(defaultContact);
  const [faqData, setFaqData] = useState<any>(defaultFaq);
  const [navigationData, setNavigationData] = useState<any>(defaultNavigation);
  const [globalsData, setGlobalsData] = useState<any>(defaultGlobals);
  const [metadataData, setMetadataData] = useState<any>(defaultMetadata);

  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('partners');

  // Kept current on every render so the Ctrl/Cmd+S handler always saves the open tab.
  const saveCurrentRef = useRef<() => void>(() => {});
  const currentTabRef = useRef<{ file: string; label: string }>({ file: 'partners.json', label: 'Sponsors & Partners' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveCurrentRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const fetchSafe = (file: string, setter: (d: any) => void) => {
      fetch(`/api/admin?file=${file}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.content && typeof d.content === 'object' && Object.keys(d.content).length > 0) {
            setter(d.content);
          }
        })
        .catch((err) => {
          console.warn(`Could not refresh ${file} from server:`, err);
        });
    };

    fetchSafe('site.json', setSiteData);
    fetchSafe('home.json', setHomeData);
    fetchSafe('about.json', setAboutData);
    fetchSafe('programme.json', setProgrammeData);
    fetchSafe('roundtables.json', setRoundtablesData);
    fetchSafe('partners.json', setPartnersData);
    fetchSafe('showcase.json', setShowcaseData);
    fetchSafe('venue.json', setVenueData);
    fetchSafe('signals.json', setSignalsData);
    fetchSafe('contact.json', setContactData);
    fetchSafe('faq.json', setFaqData);
    fetchSafe('navigation.json', setNavigationData);
    fetchSafe('globals.json', setGlobalsData);
    fetchSafe('metadata.json', setMetadataData);
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
        if (data.firestoreSaved) {
          setStatus(`Saved to Firebase — ${file} is live on the site.`);
        } else {
          // A save that never reached Firebase only exists on this server and is
          // discarded on the next deployment, so it is reported as a failure.
          setStatus(
            `NOT SAVED TO FIREBASE — ${file} was written to this server only and will be lost on the next deployment. ${
              data.firestoreError || ''
            }`
          );
        }
      } else {
        setStatus(`Error saving: ${data.error || 'Server error'}`);
      }
    } catch (e: any) {
      setStatus(`Network error saving ${file}`);
    }
    setTimeout(() => setStatus(''), 7000);
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

  /**
   * Loads a .json backup back into the open tab.
   *
   * The counterpart to the download button: a content change made elsewhere —
   * or a restore from a backup — becomes one file selection rather than
   * retyping every field. It only fills the form; nothing is stored until Save.
   */
  const importJson = (file: File) => {
    const setters: Record<string, (d: any) => void> = {
      'site.json': setSiteData,
      'home.json': setHomeData,
      'about.json': setAboutData,
      'programme.json': setProgrammeData,
      'roundtables.json': setRoundtablesData,
      'partners.json': setPartnersData,
      'showcase.json': setShowcaseData,
      'venue.json': setVenueData,
      'signals.json': setSignalsData,
      'contact.json': setContactData,
      'faq.json': setFaqData,
      'navigation.json': setNavigationData,
      'globals.json': setGlobalsData,
      'metadata.json': setMetadataData,
    };
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          setStatus('That file is not a content file. Expected a JSON object.');
          return;
        }
        const setter = setters[currentTabRef.current.file];
        if (!setter) {
          setStatus(`No importer for ${currentTabRef.current.file}`);
          return;
        }
        setter(parsed);
        setStatus(
          `Loaded ${file.name} into ${currentTabRef.current.label}. Check it, then press Save to publish.`
        );
      } catch (err: any) {
        setStatus(`Could not read that file: ${err?.message || 'invalid JSON'}`);
      }
    };
    reader.onerror = () => setStatus('Could not read that file.');
    reader.readAsText(file);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = '/admin/login';
    }
  };

  const isReady = !!(
    siteData &&
    homeData &&
    aboutData &&
    programmeData &&
    roundtablesData &&
    partnersData &&
    showcaseData &&
    venueData &&
    signalsData &&
    contactData &&
    faqData
  );

  if (!isReady) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-20 text-center text-text-primary">
        <h2 className="text-xl font-bold mb-2">Loading CMS...</h2>
        <p className="text-text-muted text-sm">Synchronizing configurations and content files.</p>
      </div>
    );
  }

  // Each tab knows the file it writes to, so one Save button serves all of them.
  const TABS = [
    { id: 'partners', label: 'Sponsors & Partners', file: 'partners.json', data: partnersData },
    { id: 'home', label: 'Home Page', file: 'home.json', data: homeData },
    { id: 'about', label: 'About Page', file: 'about.json', data: aboutData },
    { id: 'programme', label: 'Programme', file: 'programme.json', data: programmeData },
    { id: 'roundtables', label: 'Roundtables', file: 'roundtables.json', data: roundtablesData },
    { id: 'showcase', label: 'AI Showcase', file: 'showcase.json', data: showcaseData },
    { id: 'venue', label: 'Venue & Travel', file: 'venue.json', data: venueData },
    { id: 'signals', label: 'Signals Report', file: 'signals.json', data: signalsData },
    { id: 'contact', label: 'Contact', file: 'contact.json', data: contactData },
    { id: 'faq', label: 'FAQ', file: 'faq.json', data: faqData },
    { id: 'navigation', label: 'Navigation & Footer', file: 'navigation.json', data: navigationData },
    { id: 'globals', label: 'Global CTAs', file: 'globals.json', data: globalsData },
    { id: 'metadata', label: 'SEO & Metadata', file: 'metadata.json', data: metadataData },
    { id: 'site', label: 'Global / Header', file: 'site.json', data: siteData },
  ];

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];
  saveCurrentRef.current = () => saveFile(currentTab.file, currentTab.data);
  currentTabRef.current = { file: currentTab.file, label: currentTab.label };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AIX CMS Management Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              Live Content Engine
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1">
            Configure texts, upload company logos directly, and update all pages across the website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-border-subtle bg-bg-surface hover:bg-bg-raised text-text-secondary hover:text-text-primary rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <FirebaseStatus onStatus={setStatus} />

      {/* Tabs + Save — stays on screen while editing, so Save is always one click away */}
      <div className="sticky top-0 z-50 -mx-6 md:-mx-10 mb-8 border-b border-border-subtle bg-bg-base/95 px-6 md:px-10 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-thin py-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all border ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white border-brand-primary shadow-glow'
                    : 'bg-bg-raised hover:bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 border-l border-border-subtle pl-3">
            <button
              onClick={() => saveFile(currentTab.file, currentTab.data)}
              title={`Save ${currentTab.label} (${currentTab.file}) — Ctrl/Cmd + S`}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-brand-primary text-white rounded-lg font-bold text-xs md:text-sm shadow-glow hover:opacity-95 transition-all"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={() => downloadJson(currentTab.file, currentTab.data)}
              title={`Download a backup of ${currentTab.file}`}
              aria-label={`Download a backup of ${currentTab.file}`}
              className="flex items-center justify-center h-[42px] w-[42px] bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary rounded-lg"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title={`Load a ${currentTab.file} file into this tab`}
              aria-label={`Load a ${currentTab.file} file into this tab`}
              className="flex items-center justify-center h-[42px] w-[42px] bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary rounded-lg"
            >
              <Upload className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importJson(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>

        {status && (
          <p
            className={`mt-2 text-xs font-medium ${
              /NOT SAVED|Error|error|Could not|Failed|failed/.test(status)
                ? 'text-brand-primary'
                : 'text-brand-secondary'
            }`}
            role="status"
          >
            {status}
          </p>
        )}
      </div>

      <div className="bg-bg-raised border border-border-subtle p-6 md:p-8 rounded-2xl shadow-card">
        {/* ===================== TAB: SPONSORS & PARTNERS ===================== */}
        {activeTab === 'partners' && (
          <div className="space-y-8">
            <div className="border-b border-border-subtle pb-4">
              <h2 className="text-xl font-bold">Sponsors & Roundtable Chairs Page</h2>
              <p className="text-xs text-text-secondary mt-1">
                Manage hero text, 2026 sponsorship opportunities callout, lane status header, previous partner logos, and active sponsors.
              </p>
            </div>

            {/* S1: Hero Section */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={partnersData.hero?.eyebrow || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, hero: { ...partnersData.hero, eyebrow: e.target.value } })}
                  placeholder="e.g. Strategic Collaboration"
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={partnersData.hero?.title || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, hero: { ...partnersData.hero, title: e.target.value } })}
                  placeholder="e.g. Sponsors & Roundtable Chairs"
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description / Standfirst</label>
                <textarea
                  value={partnersData.hero?.description || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, hero: { ...partnersData.hero, description: e.target.value } })}
                  placeholder="e.g. Sponsorship at AIX Summit means substantive access to a curated executive room..."
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            {/* S2: 2026 Sponsorship Opportunities Lead Card */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">2026 Sponsorship Opportunities Card</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Badge</label>
                  <input
                    type="text"
                    value={partnersData.flagship?.badge || ''}
                    onChange={(e) => setPartnersData({ ...partnersData, flagship: { ...partnersData.flagship, badge: e.target.value } })}
                    placeholder="e.g. 2026 Sponsorship Opportunities"
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Button Text</label>
                  <input
                    type="text"
                    value={partnersData.flagship?.buttonText || ''}
                    onChange={(e) => setPartnersData({ ...partnersData, flagship: { ...partnersData.flagship, buttonText: e.target.value } })}
                    placeholder="e.g. Explore Roundtable Chair Specifications"
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Card Heading</label>
                <input
                  type="text"
                  value={partnersData.flagship?.title || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, flagship: { ...partnersData.flagship, title: e.target.value } })}
                  placeholder="e.g. Six Roundtable Chair Sponsorships are Open for 2026"
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Card Description</label>
                <textarea
                  value={partnersData.flagship?.description || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, flagship: { ...partnersData.flagship, description: e.target.value } })}
                  placeholder="Confirmed chairs and summit sponsors are announced in sequence..."
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            {/* S3: Section Headers */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Roundtable Chair Status Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Section Title</label>
                <input
                  type="text"
                  value={partnersData.statusSection?.title || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, statusSection: { ...partnersData.statusSection, title: e.target.value } })}
                  placeholder="e.g. Roundtable Chair Status Across the Six Lanes"
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
            </div>

            {/* S4: Previous Partners Section Header & Subtitle */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Previous Partners Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Section Heading</label>
                <input
                  type="text"
                  value={partnersData.previousPartners?.title || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, previousPartners: { ...partnersData.previousPartners, title: e.target.value } })}
                  placeholder="e.g. Previous Partners"
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm font-bold text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Section Subtitle / Description</label>
                <input
                  type="text"
                  value={partnersData.previousPartners?.description || ''}
                  onChange={(e) => setPartnersData({ ...partnersData, previousPartners: { ...partnersData.previousPartners, description: e.target.value } })}
                  placeholder="e.g. Organisations that have supported the AIX executive mandate."
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
            </div>

            {/* S5: Sponsors & Partner Logos List with File Upload */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div>
                  <h3 className="font-semibold text-brand-secondary">Partners & Sponsor Logos ({partnersData.items?.length || 0})</h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Upload PNG, JPG, or JPEG logo files directly from your computer. Confirmed partners are displayed on the page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [
                      ...(partnersData.items || []),
                      { name: 'New Partner', logo: '', status: 'confirmed' },
                    ];
                    setPartnersData({ ...partnersData, items: newItems });
                  }}
                  className="px-4 py-2 bg-brand-secondary text-white rounded-lg text-xs font-bold hover:bg-brand-secondary/90 transition-colors shadow-glow flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Partner Logo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(partnersData.items || []).map((item: any, i: number) => (
                  <div key={i} className="p-5 bg-bg-surface border border-border-subtle rounded-xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                      <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                        Partner Logo #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = partnersData.items.filter((_: any, idx: number) => idx !== i);
                          setPartnersData({ ...partnersData, items: newItems });
                        }}
                        className="px-2.5 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold hover:bg-brand-rose/30 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-text-muted mb-1">Company / Sponsor Name *</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...partnersData.items];
                          newItems[i].name = e.target.value;
                          setPartnersData({ ...partnersData, items: newItems });
                        }}
                        placeholder="e.g. Hyperthink Technologies"
                        className="w-full p-2 bg-bg-base border border-border-subtle rounded text-sm text-text-primary font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-text-muted mb-1">Publication Status</label>
                      <select
                        value={item.status}
                        onChange={(e) => {
                          const newItems = [...partnersData.items];
                          newItems[i].status = e.target.value;
                          setPartnersData({ ...partnersData, items: newItems });
                        }}
                        className="w-full p-2 bg-bg-base border border-border-subtle rounded text-sm text-text-primary"
                      >
                        <option value="confirmed">confirmed (Visible on website)</option>
                        <option value="pending">pending (Curatorial review)</option>
                        <option value="target">target (Internal only)</option>
                      </select>
                    </div>

                    {/* Logo File Upload Component */}
                    <ImageUpload
                      label="Upload Logo File (PNG, JPG, JPEG)"
                      value={item.logo}
                      onChange={(url) => {
                        const newItems = [...partnersData.items];
                        newItems[i].logo = url;
                        setPartnersData({ ...partnersData, items: newItems });
                      }}
                      onStatusChange={setStatus}
                      recommendedSize="Upload transparent PNG, JPG or JPEG"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('partners.json', partnersData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save All Sponsors & Partners</span>
              </button>
              <button
                onClick={() => downloadJson('partners.json', partnersData)}
                className="px-4 py-3 bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Backup JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: HOME PAGE ===================== */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Home Page Content</h2>
            <div className="space-y-6">
              <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow Badge</label>
                  <input
                    type="text"
                    value={homeData.hero?.eyebrow || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, eyebrow: e.target.value } })}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                    placeholder="e.g. ACTIVE EDITION · 14 DECEMBER 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Headline</label>
                  <input
                    type="text"
                    value={homeData.hero?.headline || homeData.hero?.title || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, headline: e.target.value, title: e.target.value } })}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">Location</label>
                    <input
                      type="text"
                      value={homeData.hero?.location || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, location: e.target.value } })}
                      className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">Date</label>
                    <input
                      type="text"
                      value={homeData.hero?.date || ''}
                      onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, date: e.target.value } })}
                      className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Hero Description</label>
                  <textarea
                    value={homeData.hero?.description || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, description: e.target.value } })}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Executive Mandate Quote Block</label>
                  <textarea
                    value={homeData.hero?.quote || ''}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, quote: e.target.value } })}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                  />
                </div>
              </div>

              {/* Core Principles */}
              <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Core Principles (Positioning)</h3>
                <input
                  type="text"
                  value={homeData.positioning?.title || ''}
                  onChange={(e) => setHomeData({ ...homeData, positioning: { ...homeData.positioning, title: e.target.value } })}
                  className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded font-bold text-text-primary"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(homeData.positioning?.blocks || []).map((block: any, i: number) => (
                    <div key={i} className="p-4 border border-border-subtle bg-bg-surface rounded-lg space-y-2">
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => {
                          const newBlocks = [...homeData.positioning.blocks];
                          newBlocks[i].title = e.target.value;
                          setHomeData({ ...homeData, positioning: { ...homeData.positioning, blocks: newBlocks } });
                        }}
                        className="w-full p-2 bg-bg-base border border-border-subtle rounded font-bold text-sm text-text-primary"
                      />
                      <textarea
                        value={block.desc}
                        onChange={(e) => {
                          const newBlocks = [...homeData.positioning.blocks];
                          newBlocks[i].desc = e.target.value;
                          setHomeData({ ...homeData, positioning: { ...homeData.positioning, blocks: newBlocks } });
                        }}
                        className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs text-text-primary h-20"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Intros */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-3">
                  <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Roundtables Section</h3>
                  <input
                    type="text"
                    value={homeData.roundtablesIntro?.title || ''}
                    onChange={(e) => setHomeData({ ...homeData, roundtablesIntro: { ...homeData.roundtablesIntro, title: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-sm text-text-primary"
                  />
                  <textarea
                    value={homeData.roundtablesIntro?.description || ''}
                    onChange={(e) => setHomeData({ ...homeData, roundtablesIntro: { ...homeData.roundtablesIntro, description: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary h-24"
                  />
                </div>
                <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-3">
                  <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Showcase Section</h3>
                  <input
                    type="text"
                    value={homeData.showcaseIntro?.title || ''}
                    onChange={(e) => setHomeData({ ...homeData, showcaseIntro: { ...homeData.showcaseIntro, title: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-sm text-text-primary"
                  />
                  <textarea
                    value={homeData.showcaseIntro?.description || ''}
                    onChange={(e) => setHomeData({ ...homeData, showcaseIntro: { ...homeData.showcaseIntro, description: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary h-24"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('home.json', homeData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Home Page</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: ABOUT PAGE ===================== */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">About Page Content</h2>
            <div className="space-y-6">
              {/* Hero */}
              <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={aboutData.hero?.eyebrow || ''}
                    onChange={(e) => setAboutData({ ...aboutData, hero: { ...aboutData.hero, eyebrow: e.target.value } })}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutData.hero?.title || ''}
                    onChange={(e) => setAboutData({ ...aboutData, hero: { ...aboutData.hero, title: e.target.value } })}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Description / Standfirst</label>
                  <textarea
                    value={aboutData.hero?.description || ''}
                    onChange={(e) => setAboutData({ ...aboutData, hero: { ...aboutData.hero, description: e.target.value } })}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                  />
                </div>
              </div>

              {/* Premise */}
              <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">The Premise</h3>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={aboutData.premise?.eyebrow || ''}
                    onChange={(e) => setAboutData({ ...aboutData, premise: { ...aboutData.premise, eyebrow: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutData.premise?.title || ''}
                    onChange={(e) => setAboutData({ ...aboutData, premise: { ...aboutData.premise, title: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-sm text-text-primary"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-text-muted">Paragraphs</label>
                  {(aboutData.premise?.paragraphs || []).map((p: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <textarea
                        value={p}
                        onChange={(e) => {
                          const newP = [...aboutData.premise.paragraphs];
                          newP[i] = e.target.value;
                          setAboutData({ ...aboutData, premise: { ...aboutData.premise, paragraphs: newP } });
                        }}
                        className="flex-1 p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary h-20"
                      />
                      <button
                        onClick={() => {
                          const newP = aboutData.premise.paragraphs.filter((_: any, idx: number) => idx !== i);
                          setAboutData({ ...aboutData, premise: { ...aboutData.premise, paragraphs: newP } });
                        }}
                        className="px-3 bg-brand-rose/20 text-brand-rose rounded font-bold text-xs"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newP = [...(aboutData.premise?.paragraphs || []), 'New paragraph'];
                      setAboutData({ ...aboutData, premise: { ...aboutData.premise, paragraphs: newP } });
                    }}
                    className="px-3 py-1.5 bg-bg-surface border border-border-subtle text-text-primary rounded text-xs"
                  >
                    + Add Paragraph
                  </button>
                </div>
              </div>

              {/* Operating Philosophy Principles */}
              <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Operating Philosophy</h3>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={aboutData.philosophy?.eyebrow || ''}
                    onChange={(e) => setAboutData({ ...aboutData, philosophy: { ...aboutData.philosophy, eyebrow: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutData.philosophy?.title || ''}
                    onChange={(e) => setAboutData({ ...aboutData, philosophy: { ...aboutData.philosophy, title: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-sm text-text-primary"
                  />
                </div>
                <div className="space-y-4">
                  {(aboutData.philosophy?.principles || []).map((principle: any, i: number) => (
                    <div key={i} className="p-4 bg-bg-surface border border-border-subtle rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-secondary">Principle #{i + 1}</span>
                        <button
                          onClick={() => {
                            const newP = aboutData.philosophy.principles.filter((_: any, idx: number) => idx !== i);
                            setAboutData({ ...aboutData, philosophy: { ...aboutData.philosophy, principles: newP } });
                          }}
                          className="px-2 py-0.5 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={principle.title}
                        onChange={(e) => {
                          const newP = [...aboutData.philosophy.principles];
                          newP[i].title = e.target.value;
                          setAboutData({ ...aboutData, philosophy: { ...aboutData.philosophy, principles: newP } });
                        }}
                        className="w-full p-2 bg-bg-base border border-border-subtle rounded text-sm font-semibold text-text-primary"
                      />
                      <textarea
                        value={principle.desc}
                        onChange={(e) => {
                          const newP = [...aboutData.philosophy.principles];
                          newP[i].desc = e.target.value;
                          setAboutData({ ...aboutData, philosophy: { ...aboutData.philosophy, principles: newP } });
                        }}
                        className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs text-text-primary h-16"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newP = [...(aboutData.philosophy?.principles || []), { title: 'New Principle', desc: 'Description' }];
                      setAboutData({ ...aboutData, philosophy: { ...aboutData.philosophy, principles: newP } });
                    }}
                    className="px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded text-xs"
                  >
                    + Add Principle
                  </button>
                </div>
              </div>

              {/* Structure / Rationale */}
              <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">The Structure & Rationale</h3>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutData.rationale?.title || ''}
                    onChange={(e) => setAboutData({ ...aboutData, rationale: { ...aboutData.rationale, title: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-sm text-text-primary"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-text-muted">Paragraphs</label>
                  {(aboutData.rationale?.paragraphs || []).map((p: any, i: number) => (
                    <div key={i} className="flex gap-2">
                      <textarea
                        value={p}
                        onChange={(e) => {
                          const newP = [...aboutData.rationale.paragraphs];
                          newP[i] = e.target.value;
                          setAboutData({ ...aboutData, rationale: { ...aboutData.rationale, paragraphs: newP } });
                        }}
                        className="flex-1 p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary h-20"
                      />
                      <button
                        onClick={() => {
                          const newP = aboutData.rationale.paragraphs.filter((_: any, idx: number) => idx !== i);
                          setAboutData({ ...aboutData, rationale: { ...aboutData.rationale, paragraphs: newP } });
                        }}
                        className="px-3 bg-brand-rose/20 text-brand-rose rounded font-bold text-xs"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newP = [...(aboutData.rationale?.paragraphs || []), 'New paragraph'];
                      setAboutData({ ...aboutData, rationale: { ...aboutData.rationale, paragraphs: newP } });
                    }}
                    className="px-3 py-1.5 bg-bg-surface border border-border-subtle text-text-primary rounded text-xs"
                  >
                    + Add Paragraph
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('about.json', aboutData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save About Page</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: PROGRAMME ===================== */}
        {activeTab === 'programme' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Programme Content & Schedule</h2>
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={programmeData.hero?.title || ''}
                  onChange={(e) => setProgrammeData({ ...programmeData, hero: { ...programmeData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description</label>
                <textarea
                  value={programmeData.hero?.description || ''}
                  onChange={(e) => setProgrammeData({ ...programmeData, hero: { ...programmeData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <h3 className="font-semibold text-brand-secondary">Schedule Items ({programmeData.items?.length || 0})</h3>
                <button
                  onClick={() => {
                    const newItems = [
                      ...(programmeData.items || []),
                      {
                        title: 'New Session',
                        start: '14:00',
                        end: '15:00',
                        description: 'Session description',
                        type: 'Keynote',
                      },
                    ];
                    setProgrammeData({ ...programmeData, items: newItems });
                  }}
                  className="px-4 py-2 bg-brand-secondary text-white rounded text-xs font-bold"
                >
                  + Add Session
                </button>
              </div>

              <div className="space-y-4">
                {(programmeData.items || []).map((item: any, i: number) => (
                  <div key={i} className="p-4 bg-bg-base border border-border-subtle rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-muted">Session #{i + 1}</span>
                      <button
                        onClick={() => {
                          const newItems = programmeData.items.filter((_: any, idx: number) => idx !== i);
                          setProgrammeData({ ...programmeData, items: newItems });
                        }}
                        className="px-2 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...programmeData.items];
                          newItems[i].title = e.target.value;
                          setProgrammeData({ ...programmeData, items: newItems });
                        }}
                        placeholder="Session Title"
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm font-semibold text-text-primary"
                      />
                      <input
                        type="text"
                        value={item.start}
                        onChange={(e) => {
                          const newItems = [...programmeData.items];
                          newItems[i].start = e.target.value;
                          setProgrammeData({ ...programmeData, items: newItems });
                        }}
                        placeholder="Start Time (e.g. 14:00)"
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary font-mono"
                      />
                      <input
                        type="text"
                        value={item.end}
                        onChange={(e) => {
                          const newItems = [...programmeData.items];
                          newItems[i].end = e.target.value;
                          setProgrammeData({ ...programmeData, items: newItems });
                        }}
                        placeholder="End Time (e.g. 15:00)"
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary font-mono"
                      />
                    </div>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...programmeData.items];
                        newItems[i].description = e.target.value;
                        setProgrammeData({ ...programmeData, items: newItems });
                      }}
                      placeholder="Session Description"
                      className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary h-16"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('programme.json', programmeData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Programme</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: ROUNDTABLES ===================== */}
        {activeTab === 'roundtables' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Roundtables Hub & Tracks</h2>
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={roundtablesData.hero?.eyebrow || ''}
                  onChange={(e) => setRoundtablesData({ ...roundtablesData, hero: { ...roundtablesData.hero, eyebrow: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={roundtablesData.hero?.title || ''}
                  onChange={(e) => setRoundtablesData({ ...roundtablesData, hero: { ...roundtablesData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description</label>
                <textarea
                  value={roundtablesData.hero?.description || ''}
                  onChange={(e) => setRoundtablesData({ ...roundtablesData, hero: { ...roundtablesData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            <div className="space-y-4">
              <RoundtableDefaultsEditor data={roundtablesData} setData={setRoundtablesData} />

              <h3 className="font-semibold text-brand-secondary">
                Per-table content ({roundtablesData.items?.length || 0})
              </h3>
              <p className="text-xs text-text-secondary -mt-2">
                Only what differs between tables. Timings, seat counts, the specifications panel and
                button labels live in the shared settings above.
              </p>
              <div className="space-y-6">
                {(roundtablesData.items || []).map((rt: any, i: number) => (
                  <div key={rt.slug || i} className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                      <span className="text-xs font-bold text-brand-secondary uppercase">
                        Table {rt.order}: {rt.shortTitle}
                      </span>
                      <span className="text-xs text-text-muted font-mono">{rt.slug}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Short Title</label>
                        <input
                          type="text"
                          value={rt.shortTitle}
                          onChange={(e) => {
                            const nextTitle = e.target.value;
                            // The slug follows the title unless it has been edited by hand.
                            const slugWasAuto = !rt.slug || rt.slug === slugify(rt.shortTitle);
                            const newItems = [...roundtablesData.items];
                            newItems[i] = {
                              ...rt,
                              shortTitle: nextTitle,
                              slug: slugWasAuto ? slugify(nextTitle) : rt.slug,
                            };
                            setRoundtablesData({ ...roundtablesData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm font-semibold text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Full Title</label>
                        <input
                          type="text"
                          value={rt.title}
                          onChange={(e) => {
                            const newItems = [...roundtablesData.items];
                            newItems[i].title = e.target.value;
                            setRoundtablesData({ ...roundtablesData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm font-semibold text-text-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-text-muted mb-1">Core Question</label>
                      <textarea
                        value={rt.coreQuestion}
                        onChange={(e) => {
                          const newItems = [...roundtablesData.items];
                          newItems[i].coreQuestion = e.target.value;
                          setRoundtablesData({ ...roundtablesData, items: newItems });
                        }}
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary h-16"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-text-muted mb-1">Lane Focus</label>
                      <textarea
                        value={rt.lane}
                        onChange={(e) => {
                          const newItems = [...roundtablesData.items];
                          newItems[i].lane = e.target.value;
                          setRoundtablesData({ ...roundtablesData, items: newItems });
                        }}
                        className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary h-16"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">Session</label>
                        <select
                          value={rt.session || 1}
                          onChange={(e) => {
                            const newItems = [...roundtablesData.items];
                            newItems[i] = { ...rt, session: Number(e.target.value) };
                            setRoundtablesData({ ...roundtablesData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                        >
                          <option value={1}>Session 1</option>
                          <option value={2}>Session 2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-muted mb-1">
                          Page address (follows the short title)
                        </label>
                        <div className="flex items-center gap-1 rounded border border-border-subtle bg-bg-surface px-2">
                          <span className="text-xs text-text-muted font-mono shrink-0">/roundtables/</span>
                          <input
                            type="text"
                            value={rt.slug || ''}
                            onChange={(e) => {
                              const newItems = [...roundtablesData.items];
                              newItems[i] = { ...rt, slug: slugify(e.target.value) };
                              setRoundtablesData({ ...roundtablesData, items: newItems });
                            }}
                            className="w-full bg-transparent py-2 text-sm font-mono text-text-primary outline-none"
                          />
                        </div>
                        {rt.slug !== slugify(rt.shortTitle) ? (
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...roundtablesData.items];
                              newItems[i] = { ...rt, slug: slugify(rt.shortTitle) };
                              setRoundtablesData({ ...roundtablesData, items: newItems });
                            }}
                            className="text-[10px] text-brand-secondary hover:underline mt-1"
                          >
                            Edited by hand — click to match the short title again
                          </button>
                        ) : (
                          <p className="text-[10px] text-text-secondary mt-1">
                            Editing this changes the page address and breaks existing links to it.
                          </p>
                        )}
                      </div>
                    </div>

                    <StringListEditor
                      title="Discussion Themes"
                      items={rt.themes || []}
                      placeholder="e.g. Fraud and financial crime"
                      onChange={(next) => {
                        const newItems = [...roundtablesData.items];
                        newItems[i] = { ...rt, themes: next };
                        setRoundtablesData({ ...roundtablesData, items: newItems });
                      }}
                    />

                    <StringListEditor
                      title="Who Will Be In The Room"
                      hint="One seat per line, as shown on the roundtable page."
                      items={rt.participantProfile || []}
                      placeholder="e.g. Qatar Central Bank / regulatory voice"
                      onChange={(next) => {
                        const newItems = [...roundtablesData.items];
                        newItems[i] = { ...rt, participantProfile: next };
                        setRoundtablesData({ ...roundtablesData, items: newItems });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('roundtables.json', roundtablesData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Roundtables</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: AI SHOWCASE ===================== */}
        {activeTab === 'showcase' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">AI Showcase Page</h2>
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={showcaseData.hero?.eyebrow || ''}
                  onChange={(e) => setShowcaseData({ ...showcaseData, hero: { ...showcaseData.hero, eyebrow: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={showcaseData.hero?.title || ''}
                  onChange={(e) => setShowcaseData({ ...showcaseData, hero: { ...showcaseData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description</label>
                <textarea
                  value={showcaseData.hero?.description || ''}
                  onChange={(e) => setShowcaseData({ ...showcaseData, hero: { ...showcaseData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={showcaseData.hero?.primaryButtonText || ''}
                    onChange={(e) => setShowcaseData({ ...showcaseData, hero: { ...showcaseData.hero, primaryButtonText: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={showcaseData.hero?.secondaryButtonText || ''}
                    onChange={(e) => setShowcaseData({ ...showcaseData, hero: { ...showcaseData.hero, secondaryButtonText: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-xs text-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Selection Criteria */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Selection Criteria</h3>
              <div className="space-y-4">
                {(showcaseData.criteria || []).map((crit: any, i: number) => (
                  <div key={i} className="p-4 bg-bg-surface border border-border-subtle rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={crit.title}
                        onChange={(e) => {
                          const newC = [...showcaseData.criteria];
                          newC[i].title = e.target.value;
                          setShowcaseData({ ...showcaseData, criteria: newC });
                        }}
                        className="w-full p-2 bg-bg-base border border-border-subtle rounded font-bold text-sm text-text-primary mr-3"
                      />
                      <button
                        onClick={() => {
                          const newC = showcaseData.criteria.filter((_: any, idx: number) => idx !== i);
                          setShowcaseData({ ...showcaseData, criteria: newC });
                        }}
                        className="px-2.5 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold"
                      >
                        X
                      </button>
                    </div>
                    <textarea
                      value={crit.desc}
                      onChange={(e) => {
                        const newC = [...showcaseData.criteria];
                        newC[i].desc = e.target.value;
                        setShowcaseData({ ...showcaseData, criteria: newC });
                      }}
                      className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs text-text-primary h-16"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newC = [...(showcaseData.criteria || []), { title: 'New Criteria', desc: 'Description' }];
                    setShowcaseData({ ...showcaseData, criteria: newC });
                  }}
                  className="px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded text-xs font-semibold"
                >
                  + Add Criteria
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('showcase.json', showcaseData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Showcase Page</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: VENUE & TRAVEL ===================== */}
        {activeTab === 'venue' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Venue & Travel Logistics</h2>
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={venueData.hero?.eyebrow || ''}
                  onChange={(e) => setVenueData({ ...venueData, hero: { ...venueData.hero, eyebrow: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={venueData.hero?.title || ''}
                  onChange={(e) => setVenueData({ ...venueData, hero: { ...venueData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description</label>
                <textarea
                  value={venueData.hero?.description || ''}
                  onChange={(e) => setVenueData({ ...venueData, hero: { ...venueData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            {/* Travel Cards */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <h3 className="font-semibold text-brand-secondary">Delegate Travel Cards ({venueData.travelCards?.length || 0})</h3>
                <button
                  onClick={() => {
                    const newCards = [
                      ...(venueData.travelCards || []),
                      { title: 'New Travel Card', desc: 'Guidance text here', linkText: '', linkUrl: '' },
                    ];
                    setVenueData({ ...venueData, travelCards: newCards });
                  }}
                  className="px-3 py-1.5 bg-brand-secondary text-white rounded text-xs font-bold"
                >
                  + Add Travel Card
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(venueData.travelCards || []).map((card: any, i: number) => (
                  <div key={i} className="p-4 bg-bg-surface border border-border-subtle rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-secondary">Card #{i + 1}</span>
                      <button
                        onClick={() => {
                          const newCards = venueData.travelCards.filter((_: any, idx: number) => idx !== i);
                          setVenueData({ ...venueData, travelCards: newCards });
                        }}
                        className="px-2 py-0.5 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const newCards = [...venueData.travelCards];
                        newCards[i].title = e.target.value;
                        setVenueData({ ...venueData, travelCards: newCards });
                      }}
                      className="w-full p-2 bg-bg-base border border-border-subtle rounded text-sm font-semibold text-text-primary"
                    />
                    <textarea
                      value={card.desc}
                      onChange={(e) => {
                        const newCards = [...venueData.travelCards];
                        newCards[i].desc = e.target.value;
                        setVenueData({ ...venueData, travelCards: newCards });
                      }}
                      className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs text-text-primary h-20"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('venue.json', venueData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Venue Page</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: SIGNALS ===================== */}
        {activeTab === 'signals' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Signals Research Report Page</h2>
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={signalsData.hero?.eyebrow || ''}
                  onChange={(e) => setSignalsData({ ...signalsData, hero: { ...signalsData.hero, eyebrow: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={signalsData.hero?.title || ''}
                  onChange={(e) => setSignalsData({ ...signalsData, hero: { ...signalsData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description</label>
                <textarea
                  value={signalsData.hero?.description || ''}
                  onChange={(e) => setSignalsData({ ...signalsData, hero: { ...signalsData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            {/* Report Dimensions */}
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Report Dimensions</h3>
              <div className="space-y-3">
                {(signalsData.dimensions || []).map((dim: any, i: number) => (
                  <div key={i} className="p-4 bg-bg-surface border border-border-subtle rounded-lg space-y-2">
                    <input
                      type="text"
                      value={dim.title}
                      onChange={(e) => {
                        const newD = [...signalsData.dimensions];
                        newD[i].title = e.target.value;
                        setSignalsData({ ...signalsData, dimensions: newD });
                      }}
                      className="w-full p-2 bg-bg-base border border-border-subtle rounded text-sm font-semibold text-text-primary"
                    />
                    <textarea
                      value={dim.desc}
                      onChange={(e) => {
                        const newD = [...signalsData.dimensions];
                        newD[i].desc = e.target.value;
                        setSignalsData({ ...signalsData, dimensions: newD });
                      }}
                      className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs text-text-primary h-16"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('signals.json', signalsData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Signals Page</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: CONTACT ===================== */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Contact Page Content</h2>
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={contactData.hero?.eyebrow || ''}
                  onChange={(e) => setContactData({ ...contactData, hero: { ...contactData.hero, eyebrow: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={contactData.hero?.title || ''}
                  onChange={(e) => setContactData({ ...contactData, hero: { ...contactData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description</label>
                <textarea
                  value={contactData.hero?.description || ''}
                  onChange={(e) => setContactData({ ...contactData, hero: { ...contactData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('contact.json', contactData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Contact Page</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: FAQ ===================== */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">FAQ Content & Questions</h2>
            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Hero Section</h3>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={faqData.hero?.eyebrow || ''}
                  onChange={(e) => setFaqData({ ...faqData, hero: { ...faqData.hero, eyebrow: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={faqData.hero?.title || ''}
                  onChange={(e) => setFaqData({ ...faqData, hero: { ...faqData.hero, title: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded font-bold text-base text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Description</label>
                <textarea
                  value={faqData.hero?.description || ''}
                  onChange={(e) => setFaqData({ ...faqData, hero: { ...faqData.hero, description: e.target.value } })}
                  className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary h-24"
                />
              </div>
            </div>

            <div className="space-y-6">
              {(faqData.items || []).map((cat: any, i: number) => (
                <div key={i} className="p-6 border border-border-subtle bg-bg-base rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase">Category #{i + 1}</span>
                    <button
                      onClick={() => {
                        const newItems = faqData.items.filter((_: any, idx: number) => idx !== i);
                        setFaqData({ ...faqData, items: newItems });
                      }}
                      className="px-2.5 py-1 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold"
                    >
                      Remove Category
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => {
                      const newItems = [...faqData.items];
                      newItems[i].category = e.target.value;
                      setFaqData({ ...faqData, items: newItems });
                    }}
                    className="w-full p-2.5 bg-bg-surface border border-border-subtle rounded font-bold text-sm text-brand-secondary"
                  />

                  <div className="space-y-4 pl-4 border-l-2 border-border-subtle">
                    {(cat.items || []).map((q: any, j: number) => (
                      <div key={j} className="p-4 bg-bg-surface border border-border-subtle rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-text-muted">Question #{j + 1}</span>
                          <button
                            onClick={() => {
                              const newItems = [...faqData.items];
                              newItems[i].items = newItems[i].items.filter((_: any, idx: number) => idx !== j);
                              setFaqData({ ...faqData, items: newItems });
                            }}
                            className="px-2 py-0.5 bg-brand-rose/20 text-brand-rose rounded text-xs font-bold"
                          >
                            X
                          </button>
                        </div>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => {
                            const newItems = [...faqData.items];
                            newItems[i].items[j].question = e.target.value;
                            setFaqData({ ...faqData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs font-semibold text-text-primary"
                        />
                        <textarea
                          value={q.answer}
                          onChange={(e) => {
                            const newItems = [...faqData.items];
                            newItems[i].items[j].answer = e.target.value;
                            setFaqData({ ...faqData, items: newItems });
                          }}
                          className="w-full p-2 bg-bg-base border border-border-subtle rounded text-xs text-text-primary h-20"
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newItems = [...faqData.items];
                        newItems[i].items = [
                          ...(newItems[i].items || []),
                          { id: `q-${Date.now()}`, question: 'New Question', answer: 'Answer text' },
                        ];
                        setFaqData({ ...faqData, items: newItems });
                      }}
                      className="px-3 py-1.5 bg-bg-surface border border-border-subtle text-text-primary rounded text-xs"
                    >
                      + Add Question
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('faq.json', faqData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save FAQ Content</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: GLOBAL SETTINGS & LOGO ===================== */}
        {activeTab === 'navigation' && (
          <div className="space-y-8">
            <NavigationEditor data={navigationData} setData={setNavigationData} />
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('navigation.json', navigationData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Navigation &amp; Footer</span>
              </button>
              <button
                onClick={() => downloadJson('navigation.json', navigationData)}
                className="px-5 py-3 border border-border-subtle rounded-lg text-sm flex items-center gap-2 hover:border-border-prominent"
              >
                <Download className="h-4 w-4" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'globals' && (
          <div className="space-y-8">
            <GlobalsEditor data={globalsData} setData={setGlobalsData} />
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('globals.json', globalsData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Global CTAs</span>
              </button>
              <button
                onClick={() => downloadJson('globals.json', globalsData)}
                className="px-5 py-3 border border-border-subtle rounded-lg text-sm flex items-center gap-2 hover:border-border-prominent"
              >
                <Download className="h-4 w-4" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: SEO & METADATA ===================== */}
        {activeTab === 'metadata' && (
          <div className="space-y-8">
            <div className="border-b border-border-subtle pb-4">
              <h2 className="text-xl font-bold">SEO & Metadata</h2>
              <p className="text-xs text-text-secondary mt-1">
                The browser tab title, the description shown in search results, and the preview card
                used when a page is shared on LinkedIn, WhatsApp or X.
              </p>
            </div>
            <MetadataEditor data={metadataData} setData={setMetadataData} />
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('metadata.json', metadataData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save SEO & Metadata</span>
              </button>
              <button
                onClick={() => downloadJson('metadata.json', metadataData)}
                className="px-5 py-3 border border-border-subtle rounded-lg text-sm flex items-center gap-2 hover:border-border-prominent"
              >
                <Download className="h-4 w-4" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Global Settings & Brand Logo</h2>

            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Header Brand Logo</h3>
              <p className="text-xs text-text-secondary">
                Upload your official company or summit logo to be displayed in the header and navigation bar.
              </p>
              <ImageUpload
                label="Site Logo (PNG, JPG, JPEG, WebP)"
                value={siteData.brand?.logo}
                onChange={(url) => setSiteData({ ...siteData, brand: { ...siteData.brand, logo: url } })}
                onStatusChange={setStatus}
                recommendedSize="Transparent PNG or WebP recommended (approx 300x80px)"
              />
            </div>

            <div className="p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4">
              <h3 className="font-semibold text-brand-secondary border-b border-border-subtle pb-2">Event Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Event Name</label>
                  <input
                    type="text"
                    value={siteData.event?.name || ''}
                    onChange={(e) => setSiteData({ ...siteData, event: { ...siteData.event, name: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Public Location</label>
                  <input
                    type="text"
                    value={siteData.event?.locationPublic || ''}
                    onChange={(e) => setSiteData({ ...siteData, event: { ...siteData.event, locationPublic: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Display Date</label>
                  <input
                    type="text"
                    value={siteData.event?.date || ''}
                    onChange={(e) => setSiteData({ ...siteData, event: { ...siteData.event, date: e.target.value } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Seat Count</label>
                  <input
                    type="number"
                    value={siteData.event?.seats || 90}
                    onChange={(e) => setSiteData({ ...siteData, event: { ...siteData.event, seats: Number(e.target.value) } })}
                    className="w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => saveFile('site.json', siteData)}
                className="px-8 py-3 bg-brand-primary text-text-primary rounded-lg font-bold shadow-glow hover:opacity-95 transition-all text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Global Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
