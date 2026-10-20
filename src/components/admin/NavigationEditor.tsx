'use client';

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const input =
  'w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary';
const label = 'block text-xs font-semibold text-text-muted mb-1';
const card = 'p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4';
const cardTitle = 'font-semibold text-brand-secondary border-b border-border-subtle pb-2';

interface Props {
  data: any;
  setData: (d: any) => void;
}

/** Edits content/navigation.json — top bar, header nav, and the whole footer. */
export function NavigationEditor({ data, setData }: Props) {
  const d = data || {};
  const topBar = d.topBar || {};
  const header = d.header || {};
  const footer = d.footer || {};

  const patch = (section: string, value: any) => setData({ ...d, [section]: value });

  const move = <T,>(arr: T[], from: number, to: number): T[] => {
    if (to < 0 || to >= arr.length) return arr;
    const next = [...arr];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  };

  // ---------- Top bar ----------
  const editions = topBar.editions || [];
  const setEditions = (items: any[]) => patch('topBar', { ...topBar, editions: items });

  // ---------- Header ----------
  const navItems = header.items || [];
  const setNavItems = (items: any[]) => patch('header', { ...header, items });

  // ---------- Footer ----------
  const columns = footer.columns || [];
  const setColumns = (cols: any[]) => patch('footer', { ...footer, columns: cols });
  const legalLinks = footer.legalLinks || [];
  const news = footer.newsletter || {};

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">
        Navigation &amp; Footer
      </h2>
      <p className="text-xs text-text-secondary -mt-4">
        Everything in the top edition bar, the main menu and the footer. Changes appear on every
        page of the site.
      </p>

      {/* ============ TOP BAR ============ */}
      <div className={card}>
        <h3 className={cardTitle}>Top Edition Bar</h3>

        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={topBar.enabled !== false}
            onChange={(e) => patch('topBar', { ...topBar, enabled: e.target.checked })}
          />
          Show the edition bar across the top of the site
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Series label (right-hand side)</label>
            <input
              className={input}
              value={topBar.seriesLabel || ''}
              onChange={(e) => patch('topBar', { ...topBar, seriesLabel: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>Active edition note</label>
            <input
              className={input}
              value={topBar.activeEditionNote || ''}
              onChange={(e) => patch('topBar', { ...topBar, activeEditionNote: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className={label}>Editions</p>
          {editions.map((ed: any, i: number) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end border border-border-subtle rounded p-3">
              <div className="sm:col-span-2">
                <label className={label}>Name</label>
                <input className={input} value={ed.name || ''}
                  onChange={(e) => { const n = [...editions]; n[i] = { ...ed, name: e.target.value }; setEditions(n); }} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Slug</label>
                <input className={input} value={ed.slug || ''}
                  onChange={(e) => { const n = [...editions]; n[i] = { ...ed, slug: e.target.value }; setEditions(n); }} />
              </div>
              <div className="sm:col-span-3">
                <label className={label}>Link</label>
                <input className={input} value={ed.href || ''}
                  onChange={(e) => { const n = [...editions]; n[i] = { ...ed, href: e.target.value }; setEditions(n); }} />
              </div>
              <div className="sm:col-span-3">
                <label className={label}>Label (tooltip)</label>
                <input className={input} value={ed.label || ''}
                  onChange={(e) => { const n = [...editions]; n[i] = { ...ed, label: e.target.value }; setEditions(n); }} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 pb-1">
                <label className="flex items-center gap-1 text-[11px] text-text-secondary">
                  <input type="checkbox" checked={!!ed.isCurrent}
                    onChange={(e) => {
                      const n = editions.map((x: any, idx: number) => ({ ...x, isCurrent: idx === i ? e.target.checked : false }));
                      setEditions(n);
                    }} />
                  Current
                </label>
                <button type="button" onClick={() => setEditions(editions.filter((_: any, idx: number) => idx !== i))}
                  className="text-brand-primary hover:opacity-70" aria-label="Remove edition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button type="button"
            onClick={() => setEditions([...editions, { name: 'NEW', slug: 'new', href: '/', label: 'City · Stay Tuned', isCurrent: false }])}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add edition
          </button>
        </div>
      </div>

      {/* ============ HEADER ============ */}
      <div className={card}>
        <h3 className={cardTitle}>Header &amp; Main Menu</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Register button label</label>
            <input className={input} value={header.registerLabel || ''}
              onChange={(e) => patch('header', { ...header, registerLabel: e.target.value })} />
          </div>
          <div>
            <label className={label}>Sponsor button label (blank hides it)</label>
            <input className={input} value={header.sponsorLabel ?? ''}
              onChange={(e) => patch('header', { ...header, sponsorLabel: e.target.value })} />
          </div>
          <div>
            <label className={label}>&quot;Powered by&quot; label</label>
            <input className={input} value={header.poweredByLabel || ''}
              onChange={(e) => patch('header', { ...header, poweredByLabel: e.target.value })} />
          </div>
          <div>
            <label className={label}>Skip-to-content link text</label>
            <input className={input} value={header.skipLinkLabel || ''}
              onChange={(e) => patch('header', { ...header, skipLinkLabel: e.target.value })} />
          </div>
        </div>

        <div className="space-y-3">
          <p className={label}>Menu items (order shown is the order on the site)</p>
          {navItems.map((item: any, i: number) => (
            <div key={i} className="border border-border-subtle rounded p-3 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                <div className="sm:col-span-4">
                  <label className={label}>Label</label>
                  <input className={input} value={item.label || ''}
                    onChange={(e) => { const n = [...navItems]; n[i] = { ...item, label: e.target.value }; setNavItems(n); }} />
                </div>
                <div className="sm:col-span-4">
                  <label className={label}>Link</label>
                  <input className={input} value={item.href || ''}
                    onChange={(e) => { const n = [...navItems]; n[i] = { ...item, href: e.target.value }; setNavItems(n); }} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Type</label>
                  <select className={input} value={item.type || 'link'}
                    onChange={(e) => { const n = [...navItems]; n[i] = { ...item, type: e.target.value }; setNavItems(n); }}>
                    <option value="link">Plain link</option>
                    <option value="mega">Roundtables mega menu</option>
                    <option value="dropdown">Dropdown</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 pb-1">
                  <button type="button" onClick={() => setNavItems(move(navItems, i, i - 1))}
                    className="text-text-secondary hover:text-text-primary" aria-label="Move up">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setNavItems(move(navItems, i, i + 1))}
                    className="text-text-secondary hover:text-text-primary" aria-label="Move down">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setNavItems(navItems.filter((_: any, idx: number) => idx !== i))}
                    className="text-brand-primary hover:opacity-70" aria-label="Remove menu item">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {item.type === 'dropdown' && (
                <div className="pl-4 border-l-2 border-border-subtle space-y-2">
                  <p className="text-[11px] text-text-muted">Dropdown links</p>
                  {(item.children || []).map((child: any, ci: number) => (
                    <div key={ci} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                      <div className="sm:col-span-6">
                        <input className={input} placeholder="Label" value={child.label || ''}
                          onChange={(e) => {
                            const kids = [...(item.children || [])]; kids[ci] = { ...child, label: e.target.value };
                            const n = [...navItems]; n[i] = { ...item, children: kids }; setNavItems(n);
                          }} />
                      </div>
                      <div className="sm:col-span-5">
                        <input className={input} placeholder="/link" value={child.href || ''}
                          onChange={(e) => {
                            const kids = [...(item.children || [])]; kids[ci] = { ...child, href: e.target.value };
                            const n = [...navItems]; n[i] = { ...item, children: kids }; setNavItems(n);
                          }} />
                      </div>
                      <div className="sm:col-span-1">
                        <button type="button" className="text-brand-primary hover:opacity-70" aria-label="Remove dropdown link"
                          onClick={() => {
                            const kids = (item.children || []).filter((_: any, x: number) => x !== ci);
                            const n = [...navItems]; n[i] = { ...item, children: kids }; setNavItems(n);
                          }}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline"
                    onClick={() => {
                      const kids = [...(item.children || []), { label: 'New link', href: '/' }];
                      const n = [...navItems]; n[i] = { ...item, children: kids }; setNavItems(n);
                    }}>
                    <Plus className="h-3.5 w-3.5" /> Add dropdown link
                  </button>
                </div>
              )}
            </div>
          ))}
          <button type="button"
            onClick={() => setNavItems([...navItems, { label: 'New item', href: '/', type: 'link' }])}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add menu item
          </button>
        </div>
      </div>

      {/* ============ FOOTER NEWSLETTER ============ */}
      <div className={card}>
        <h3 className={cardTitle}>Footer — Newsletter Block</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={label}>Heading</label>
            <input className={input} value={news.heading || ''}
              onChange={(e) => patch('footer', { ...footer, newsletter: { ...news, heading: e.target.value } })} />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea rows={2} className={input} value={news.description || ''}
              onChange={(e) => patch('footer', { ...footer, newsletter: { ...news, description: e.target.value } })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Input placeholder</label>
              <input className={input} value={news.placeholder || ''}
                onChange={(e) => patch('footer', { ...footer, newsletter: { ...news, placeholder: e.target.value } })} />
            </div>
            <div>
              <label className={label}>Button label</label>
              <input className={input} value={news.buttonLabel || ''}
                onChange={(e) => patch('footer', { ...footer, newsletter: { ...news, buttonLabel: e.target.value } })} />
            </div>
            <div>
              <label className={label}>Success message</label>
              <input className={input} value={news.successMessage || ''}
                onChange={(e) => patch('footer', { ...footer, newsletter: { ...news, successMessage: e.target.value } })} />
            </div>
            <div>
              <label className={label}>Already-subscribed message</label>
              <input className={input} value={news.alreadySubscribedMessage || ''}
                onChange={(e) => patch('footer', { ...footer, newsletter: { ...news, alreadySubscribedMessage: e.target.value } })} />
            </div>
            <div>
              <label className={label}>Invalid email message</label>
              <input className={input} value={news.invalidEmailMessage || ''}
                onChange={(e) => patch('footer', { ...footer, newsletter: { ...news, invalidEmailMessage: e.target.value } })} />
            </div>
            <div>
              <label className={label}>&quot;Organised by&quot; label</label>
              <input className={input} value={footer.organisedByLabel || ''}
                onChange={(e) => patch('footer', { ...footer, organisedByLabel: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* ============ FOOTER COLUMNS ============ */}
      <div className={card}>
        <h3 className={cardTitle}>Footer — Link Columns</h3>
        <p className="text-xs text-text-secondary">
          The brand column on the left is generated automatically. These are the three link columns beside it.
        </p>

        {columns.map((col: any, ci: number) => (
          <div key={ci} className="border border-border-subtle rounded p-3 space-y-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className={label}>Column heading</label>
                <input className={input} value={col.heading || ''}
                  onChange={(e) => { const n = [...columns]; n[ci] = { ...col, heading: e.target.value }; setColumns(n); }} />
              </div>
              <button type="button" onClick={() => setColumns(move(columns, ci, ci - 1))}
                className="text-text-secondary hover:text-text-primary pb-2" aria-label="Move column up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setColumns(move(columns, ci, ci + 1))}
                className="text-text-secondary hover:text-text-primary pb-2" aria-label="Move column down">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setColumns(columns.filter((_: any, x: number) => x !== ci))}
                className="text-brand-primary hover:opacity-70 pb-2" aria-label="Remove column">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {(col.links || []).map((link: any, li: number) => (
              <div key={li} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end pl-3 border-l-2 border-border-subtle">
                <div className="sm:col-span-4">
                  <label className={label}>Label</label>
                  <input className={input} value={link.label || ''}
                    onChange={(e) => {
                      const links = [...(col.links || [])]; links[li] = { ...link, label: e.target.value };
                      const n = [...columns]; n[ci] = { ...col, links }; setColumns(n);
                    }} />
                </div>
                <div className="sm:col-span-3">
                  <label className={label}>Link</label>
                  <input className={input} placeholder="/path" value={link.href || ''} disabled={!!link.useRegisterUrl}
                    onChange={(e) => {
                      const links = [...(col.links || [])]; links[li] = { ...link, href: e.target.value };
                      const n = [...columns]; n[ci] = { ...col, links }; setColumns(n);
                    }} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Emphasis</label>
                  <select className={input} value={link.emphasis || ''}
                    onChange={(e) => {
                      const links = [...(col.links || [])]; links[li] = { ...link, emphasis: e.target.value || undefined };
                      const n = [...columns]; n[ci] = { ...col, links }; setColumns(n);
                    }}>
                    <option value="">Normal</option>
                    <option value="secondary">Teal</option>
                    <option value="primary">Pink</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Only if feature on</label>
                  <select className={input} value={link.requiresFeature || ''}
                    onChange={(e) => {
                      const links = [...(col.links || [])]; links[li] = { ...link, requiresFeature: e.target.value || undefined };
                      const n = [...columns]; n[ci] = { ...col, links }; setColumns(n);
                    }}>
                    <option value="">Always show</option>
                    <option value="showSpeakers">showSpeakers</option>
                    <option value="showRecognition">showRecognition</option>
                    <option value="showMedia">showMedia</option>
                  </select>
                </div>
                <div className="sm:col-span-1 flex items-center gap-2 pb-1">
                  <label className="flex items-center gap-1 text-[10px] text-text-secondary" title="Use the global Register URL">
                    <input type="checkbox" checked={!!link.useRegisterUrl}
                      onChange={(e) => {
                        const links = [...(col.links || [])]; links[li] = { ...link, useRegisterUrl: e.target.checked };
                        const n = [...columns]; n[ci] = { ...col, links }; setColumns(n);
                      }} />
                    Reg
                  </label>
                  <button type="button" className="text-brand-primary hover:opacity-70" aria-label="Remove footer link"
                    onClick={() => {
                      const links = (col.links || []).filter((_: any, x: number) => x !== li);
                      const n = [...columns]; n[ci] = { ...col, links }; setColumns(n);
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <button type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline"
              onClick={() => {
                const links = [...(col.links || []), { label: 'New link', href: '/' }];
                const n = [...columns]; n[ci] = { ...col, links }; setColumns(n);
              }}>
              <Plus className="h-3.5 w-3.5" /> Add link to this column
            </button>
          </div>
        ))}

        <button type="button"
          onClick={() => setColumns([...columns, { heading: 'New column', links: [] }])}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add column
        </button>
      </div>

      {/* ============ FOOTER BOTTOM ============ */}
      <div className={card}>
        <h3 className={cardTitle}>Footer — Bottom Bar</h3>
        <div>
          <label className={label}>
            Copyright line — use <code className="text-brand-secondary">{'{organiser}'}</code> where the organiser link should appear
          </label>
          <input className={input} value={footer.copyright || ''}
            onChange={(e) => patch('footer', { ...footer, copyright: e.target.value })} />
        </div>

        <div className="space-y-2">
          <p className={label}>Legal links</p>
          {legalLinks.map((link: any, i: number) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-6">
                <input className={input} placeholder="Label" value={link.label || ''}
                  onChange={(e) => { const n = [...legalLinks]; n[i] = { ...link, label: e.target.value }; patch('footer', { ...footer, legalLinks: n }); }} />
              </div>
              <div className="sm:col-span-5">
                <input className={input} placeholder="/legal/..." value={link.href || ''}
                  onChange={(e) => { const n = [...legalLinks]; n[i] = { ...link, href: e.target.value }; patch('footer', { ...footer, legalLinks: n }); }} />
              </div>
              <div className="sm:col-span-1">
                <button type="button" className="text-brand-primary hover:opacity-70" aria-label="Remove legal link"
                  onClick={() => patch('footer', { ...footer, legalLinks: legalLinks.filter((_: any, x: number) => x !== i) })}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button type="button"
            onClick={() => patch('footer', { ...footer, legalLinks: [...legalLinks, { label: 'New policy', href: '/legal/' }] })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add legal link
          </button>
        </div>
      </div>
    </div>
  );
}
