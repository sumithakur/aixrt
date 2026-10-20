'use client';

import React from 'react';

const input =
  'w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary';
const label = 'block text-xs font-semibold text-text-muted mb-1';
const card = 'p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4';
const cardTitle = 'font-semibold text-brand-secondary border-b border-border-subtle pb-2';

/** Google truncates around these lengths, so the counter turns amber past them. */
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

function Counter({ value, limit }: { value: string; limit: number }) {
  const length = (value || '').length;
  const over = length > limit;
  return (
    <span className={`text-[10px] font-mono ${over ? 'text-brand-primary' : 'text-text-muted'}`}>
      {length}/{limit}
      {over ? ' — may be cut off in search results' : ''}
    </span>
  );
}

interface Props {
  data: any;
  setData: (d: any) => void;
}

/**
 * Edits content/metadata.json: the site-wide SEO defaults, the per-page title and
 * description, and the templates used by the six roundtable detail pages.
 */
export function MetadataEditor({ data, setData }: Props) {
  const d = data || {};
  const site = d.site || {};
  const pages: any[] = d.pages || [];
  const detail = d.roundtableDetail || {};

  const patchSite = (value: any) => setData({ ...d, site: { ...site, ...value } });
  const patchDetail = (value: any) => setData({ ...d, roundtableDetail: { ...detail, ...value } });
  const patchPage = (index: number, value: any) => {
    const next = [...pages];
    next[index] = { ...next[index], ...value };
    setData({ ...d, pages: next });
  };

  /** What the browser tab and search result will actually say for this page. */
  const previewTitle = (page: any) => {
    const title = page.title || site.defaultTitle || '';
    if (page.absoluteTitle || !site.titleTemplate) return title;
    return String(site.titleTemplate).replace('%s', title);
  };

  return (
    <div className="space-y-6">
      {/* Site-wide defaults */}
      <div className={card}>
        <h3 className={cardTitle}>Site-wide defaults</h3>
        <p className="text-xs text-text-secondary">
          Used for the browser tab suffix and for anything a page below leaves blank.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Site name</label>
            <input className={input} value={site.siteName || ''}
              onChange={(e) => patchSite({ siteName: e.target.value })} />
          </div>
          <div>
            <label className={label}>Site address</label>
            <input className={input} value={site.baseUrl || ''} placeholder="https://example.com"
              onChange={(e) => patchSite({ baseUrl: e.target.value })} />
            <p className="text-[10px] text-text-secondary mt-1">
              Used to build absolute links in social previews. No trailing slash.
            </p>
          </div>
          <div>
            <label className={label}>Browser tab pattern</label>
            <input className={input} value={site.titleTemplate || ''} placeholder="%s | AIX Roundtables 2026"
              onChange={(e) => patchSite({ titleTemplate: e.target.value })} />
            <p className="text-[10px] text-text-secondary mt-1">
              <code className="text-brand-secondary">%s</code> is replaced by each page&apos;s title.
            </p>
          </div>
          <div>
            <label className={label}>Social card type</label>
            <select className={input} value={site.twitterCard || 'summary_large_image'}
              onChange={(e) => patchSite({ twitterCard: e.target.value })}>
              <option value="summary_large_image">Large image</option>
              <option value="summary">Small image</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label className={label}>Default title</label>
            <Counter value={site.defaultTitle || ''} limit={TITLE_LIMIT} />
          </div>
          <input className={input} value={site.defaultTitle || ''}
            onChange={(e) => patchSite({ defaultTitle: e.target.value })} />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label className={label}>Default description</label>
            <Counter value={site.defaultDescription || ''} limit={DESCRIPTION_LIMIT} />
          </div>
          <textarea className={`${input} h-20`} value={site.defaultDescription || ''}
            onChange={(e) => patchSite({ defaultDescription: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Default share title</label>
            <input className={input} value={site.ogTitle || ''}
              onChange={(e) => patchSite({ ogTitle: e.target.value })} />
          </div>
          <div>
            <label className={label}>Share image path</label>
            <input className={input} value={site.ogImage || ''} placeholder="/og-image.png"
              onChange={(e) => patchSite({ ogImage: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Default share description</label>
            <textarea className={`${input} h-16`} value={site.ogDescription || ''}
              onChange={(e) => patchSite({ ogDescription: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Share image alt text</label>
            <input className={input} value={site.ogImageAlt || ''}
              onChange={(e) => patchSite({ ogImageAlt: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Per-page */}
      <div className="space-y-4">
        <h3 className="font-semibold text-brand-secondary">Page by page ({pages.length})</h3>
        <p className="text-xs text-text-secondary -mt-2">
          Leave the share fields blank to reuse the page title and description.
        </p>

        {pages.map((page, i) => (
          <div key={page.route || i} className={card}>
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="text-xs font-bold text-brand-secondary uppercase">{page.label || page.route}</span>
              <span className="text-xs text-text-muted font-mono">{page.route}</span>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className={label}>Page title</label>
                <Counter value={page.title || ''} limit={TITLE_LIMIT} />
              </div>
              <input className={input} value={page.title || ''}
                onChange={(e) => patchPage(i, { title: e.target.value })} />
              <p className="text-[10px] text-text-secondary mt-1">
                Browser tab and search result:{' '}
                <span className="text-text-primary">{previewTitle(page)}</span>
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className={label}>Search description</label>
                <Counter value={page.description || ''} limit={DESCRIPTION_LIMIT} />
              </div>
              <textarea className={`${input} h-20`} value={page.description || ''}
                onChange={(e) => patchPage(i, { description: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Share title (optional)</label>
                <input className={input} value={page.ogTitle || ''} placeholder="Same as page title"
                  onChange={(e) => patchPage(i, { ogTitle: e.target.value })} />
              </div>
              <div>
                <label className={label}>Share description (optional)</label>
                <input className={input} value={page.ogDescription || ''} placeholder="Same as search description"
                  onChange={(e) => patchPage(i, { ogDescription: e.target.value })} />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs text-text-secondary">
                <input type="checkbox" checked={!!page.absoluteTitle}
                  onChange={(e) => patchPage(i, { absoluteTitle: e.target.checked })} />
                Use this title exactly, without the site name after it
              </label>
              <label className="flex items-center gap-2 text-xs text-text-secondary">
                <input type="checkbox" checked={!!page.noindex}
                  onChange={(e) => patchPage(i, { noindex: e.target.checked })} />
                Hide this page from search engines
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Roundtable detail templates */}
      <div className={card}>
        <h3 className={cardTitle}>Roundtable detail pages</h3>
        <p className="text-xs text-text-secondary">
          One set of patterns covers all six. Available placeholders:{' '}
          <code className="text-brand-secondary">{'{shortTitle}'}</code>{' '}
          <code className="text-brand-secondary">{'{title}'}</code>{' '}
          <code className="text-brand-secondary">{'{coreQuestion}'}</code>{' '}
          <code className="text-brand-secondary">{'{suffix}'}</code> (the shared description ending set
          on the Roundtables tab).
        </p>
        <div>
          <label className={label}>Title pattern</label>
          <input className={input} value={detail.titleTemplate || ''}
            onChange={(e) => patchDetail({ titleTemplate: e.target.value })} />
        </div>
        <div>
          <label className={label}>Description pattern</label>
          <textarea className={`${input} h-20`} value={detail.descriptionTemplate || ''}
            onChange={(e) => patchDetail({ descriptionTemplate: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Share title pattern</label>
            <input className={input} value={detail.ogTitleTemplate || ''}
              onChange={(e) => patchDetail({ ogTitleTemplate: e.target.value })} />
          </div>
          <div>
            <label className={label}>Share description pattern</label>
            <input className={input} value={detail.ogDescriptionTemplate || ''}
              onChange={(e) => patchDetail({ ogDescriptionTemplate: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
