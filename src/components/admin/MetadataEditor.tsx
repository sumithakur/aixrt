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

/** Comma-separated in the box, an array in the file. */
function KeywordsField({
  value,
  onChange,
  hint,
}: {
  value: string[] | undefined;
  onChange: (next: string[]) => void;
  hint?: string;
}) {
  const list = value || [];
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className={label}>Keywords ({list.length})</label>
        <span className="text-[10px] font-mono text-text-muted">comma separated</span>
      </div>
      <textarea
        className={`${input} h-16`}
        value={list.join(', ')}
        placeholder="AI summit Qatar, executive AI roundtable, enterprise AI Doha"
        onChange={(e) =>
          onChange(
            e.target.value
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          )
        }
      />
      {hint && <p className="text-[10px] text-text-secondary mt-1">{hint}</p>}
    </div>
  );
}

interface Props {
  data: any;
  setData: (d: any) => void;
}

/** A quick read on what still needs attention, rather than scrolling 17 cards to find it. */
function SeoHealth({ data }: { data: any }) {
  const site = data?.site || {};
  const pages: any[] = data?.pages || [];
  const indexed = pages.filter((p) => !p.noindex);

  const checks = [
    { label: 'Pages with a title', value: `${indexed.filter((p) => p.title).length}/${indexed.length}`, bad: indexed.some((p) => !p.title) },
    { label: 'Pages with a description', value: `${indexed.filter((p) => p.description).length}/${indexed.length}`, bad: indexed.some((p) => !p.description) },
    { label: 'Titles over 60 characters', value: String(indexed.filter((p) => (p.title || '').length > TITLE_LIMIT).length), bad: indexed.some((p) => (p.title || '').length > TITLE_LIMIT) },
    { label: 'Descriptions over 160', value: String(indexed.filter((p) => (p.description || '').length > DESCRIPTION_LIMIT).length), bad: indexed.some((p) => (p.description || '').length > DESCRIPTION_LIMIT) },
    { label: 'Hidden from search', value: String(pages.length - indexed.length), bad: false },
    { label: 'AI assistants allowed', value: site.allowAiCrawlers === false ? 'No' : 'Yes', bad: site.allowAiCrawlers === false },
    { label: 'Search Console verified', value: site.verification?.google ? 'Yes' : 'Not set', bad: !site.verification?.google },
  ];

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-base p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-subtle pb-2">
        <h3 className="font-semibold text-brand-secondary">At a glance</h3>
        <span className="text-[11px] text-text-secondary">
          Live files:{' '}
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-brand-secondary hover:underline">sitemap.xml</a>
          {' · '}
          <a href="/robots.txt" target="_blank" rel="noreferrer" className="text-brand-secondary hover:underline">robots.txt</a>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
        {checks.map((c) => (
          <div key={c.label}>
            <p className={`text-lg font-bold ${c.bad ? 'text-brand-primary' : 'text-text-primary'}`}>{c.value}</p>
            <p className="text-[11px] text-text-secondary leading-tight">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
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
      <SeoHealth data={d} />

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

        <KeywordsField
          value={site.keywords}
          onChange={(keywords) => patchSite({ keywords })}
          hint="Used on any page that has none of its own. Google ignores this tag for ranking; Bing and several AI crawlers still read it, and it is where the terms you want to be found for are recorded. What actually moves rankings is the title and description above, the structured data this site publishes, and using those terms in the page copy itself."
        />
      </div>

      {/* Discovery */}
      <div className={card}>
        <h3 className={cardTitle}>Search engines & AI assistants</h3>

        <div className="space-y-2">
          <label className="flex items-start gap-2 text-xs text-text-secondary">
            <input type="checkbox" className="mt-0.5" checked={site.robots?.index !== false}
              onChange={(e) => patchSite({ robots: { ...(site.robots || {}), index: e.target.checked } })} />
            <span>
              <span className="text-text-primary font-semibold">Allow the whole site to be indexed.</span>{' '}
              Turning this off removes the entire site from search results. Individual pages can be
              hidden further down instead.
            </span>
          </label>

          <label className="flex items-start gap-2 text-xs text-text-secondary">
            <input type="checkbox" className="mt-0.5" checked={site.allowAiCrawlers !== false}
              onChange={(e) => patchSite({ allowAiCrawlers: e.target.checked })} />
            <span>
              <span className="text-text-primary font-semibold">Allow AI assistants to read the site.</span>{' '}
              Lets ChatGPT, Claude, Perplexity, Google&apos;s AI results, Copilot and Apple Intelligence
              read these pages so the summit can appear in their answers. Switching this off keeps
              them out.
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Image size in search results</label>
            <select className={input} value={site.robots?.maxImagePreview || 'large'}
              onChange={(e) => patchSite({ robots: { ...(site.robots || {}), maxImagePreview: e.target.value } })}>
              <option value="large">Large — recommended</option>
              <option value="standard">Standard</option>
              <option value="none">No image</option>
            </select>
          </div>
          <div>
            <label className={label}>Snippet length</label>
            <select className={input} value={String(site.robots?.maxSnippet ?? -1)}
              onChange={(e) => patchSite({ robots: { ...(site.robots || {}), maxSnippet: Number(e.target.value) } })}>
              <option value="-1">No limit — recommended</option>
              <option value="160">160 characters</option>
              <option value="0">No snippet</option>
            </select>
          </div>
          <div>
            <label className={label}>Google Search Console verification code</label>
            <input className={input} value={site.verification?.google || ''} placeholder="Paste the content value of the meta tag"
              onChange={(e) => patchSite({ verification: { ...(site.verification || {}), google: e.target.value } })} />
          </div>
          <div>
            <label className={label}>Bing Webmaster verification code</label>
            <input className={input} value={site.verification?.bing || ''}
              onChange={(e) => patchSite({ verification: { ...(site.verification || {}), bing: e.target.value } })} />
          </div>
        </div>
        <p className="text-[11px] text-text-secondary">
          The sitemap, robots file and the structured data describing the event, the organisation and
          its social profiles are generated from this tab and the Global / Header tab — nothing to
          maintain by hand.
        </p>
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

            <KeywordsField
              value={page.keywords}
              onChange={(keywords) => patchPage(i, { keywords })}
              hint="Leave empty to fall back to the site-wide keywords."
            />

            <div>
              <label className={label}>Canonical address (optional)</label>
              <input className={input} value={page.canonical || ''}
                placeholder={`${String(site.baseUrl || '').replace(/\/$/, '')}${page.route === '/' ? '' : page.route}`}
                onChange={(e) => patchPage(i, { canonical: e.target.value })} />
              <p className="text-[10px] text-text-secondary mt-1">
                Left blank, this page declares itself the original. Set it only when the same content
                also lives at another address and that one should be the version search engines rank.
              </p>
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
