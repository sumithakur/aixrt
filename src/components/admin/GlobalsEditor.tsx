'use client';

import React from 'react';

const input =
  'w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary';
const label = 'block text-xs font-semibold text-text-muted mb-1';
const card = 'p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4';
const cardTitle = 'font-semibold text-brand-secondary border-b border-border-subtle pb-2';

interface Props {
  data: any;
  setData: (d: any) => void;
}

/**
 * Edits content/globals.json — the closing CTA band that appears at the bottom
 * of nearly every page, plus the single global Register URL.
 */
export function GlobalsEditor({ data, setData }: Props) {
  const d = data || {};
  const cta = d.cta || {};
  const setCta = (value: any) => setData({ ...d, cta: value });

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4 border-b border-border-subtle pb-2">Global CTAs</h2>
      <p className="text-xs text-text-secondary -mt-4">
        These control the closing call-to-action band shown at the bottom of almost every page, and
        the Register link used by every Register button on the site.
      </p>

      <div className={card}>
        <h3 className={cardTitle}>Register Link (used site-wide)</h3>
        <p className="text-xs text-text-secondary">
          Every Register button — header, footer and CTA band — points here. Change it once and it
          updates everywhere.
        </p>
        <div>
          <label className={label}>Register URL</label>
          <input
            className={input}
            placeholder="https://..."
            value={d.registerUrl || ''}
            onChange={(e) => setData({ ...d, registerUrl: e.target.value })}
          />
        </div>
      </div>

      <div className={card}>
        <h3 className={cardTitle}>Closing CTA Band</h3>

        <div>
          <label className={label}>Title</label>
          <input
            className={input}
            value={cta.title || ''}
            onChange={(e) => setCta({ ...cta, title: e.target.value })}
          />
        </div>

        <div>
          <label className={label}>Subtitle</label>
          <textarea
            rows={3}
            className={input}
            value={cta.subtitle || ''}
            onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Primary button label</label>
            <input
              className={input}
              value={cta.primaryLabel || ''}
              onChange={(e) => setCta({ ...cta, primaryLabel: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>Primary button link</label>
            <input
              className={input}
              placeholder="Uses the Register URL above"
              disabled={cta.primaryUseRegisterUrl !== false}
              value={cta.primaryHref || ''}
              onChange={(e) => setCta({ ...cta, primaryHref: e.target.value })}
            />
            <label className="mt-2 flex items-center gap-2 text-[11px] text-text-secondary">
              <input
                type="checkbox"
                checked={cta.primaryUseRegisterUrl !== false}
                onChange={(e) => setCta({ ...cta, primaryUseRegisterUrl: e.target.checked })}
              />
              Use the global Register URL
            </label>
          </div>
          <div>
            <label className={label}>Secondary button label (blank hides it)</label>
            <input
              className={input}
              value={cta.secondaryLabel ?? ''}
              onChange={(e) => setCta({ ...cta, secondaryLabel: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>Secondary button link</label>
            <input
              className={input}
              value={cta.secondaryHref || ''}
              onChange={(e) => setCta({ ...cta, secondaryHref: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
