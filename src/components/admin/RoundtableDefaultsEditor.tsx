'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const input =
  'w-full p-2 bg-bg-surface border border-border-subtle rounded text-sm text-text-primary';
const label = 'block text-xs font-semibold text-text-muted mb-1';
const card = 'p-6 bg-bg-base border border-border-subtle rounded-xl space-y-4';
const cardTitle = 'font-semibold text-brand-secondary border-b border-border-subtle pb-2';

interface Props {
  data: any;
  setData: (d: any) => void;
}

/** Offsets are fixed: the summit runs in December, outside every DST window listed. */
const TIMEZONES = [
  { label: 'Doha · Riyadh · Kuwait · Bahrain (GMT+3)', offset: '+03:00' },
  { label: 'Dubai · Abu Dhabi · Muscat (GMT+4)', offset: '+04:00' },
  { label: 'Cairo · Johannesburg (GMT+2)', offset: '+02:00' },
  { label: 'India (GMT+5:30)', offset: '+05:30' },
  { label: 'Singapore · Hong Kong (GMT+8)', offset: '+08:00' },
  { label: 'London (GMT)', offset: '+00:00' },
  { label: 'New York (GMT-5)', offset: '-05:00' },
];

const ISO_RE = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?([+-]\d{2}:\d{2})?$/;

/** Splits "2026-12-14T14:30:00+03:00" into its date, time and offset parts. */
function parseIso(iso?: string) {
  const m = ISO_RE.exec(String(iso || ''));
  return m ? { date: m[1], time: m[2], offset: m[3] || '+03:00' } : {};
}

const SESSION_KEYS = ['1', '2'];
const FALLBACK_TIMES: Record<string, { start: string; end: string }> = {
  '1': { start: '14:30', end: '16:00' },
  '2': { start: '16:30', end: '18:00' },
};

/**
 * Edits the parts of roundtables.json that are shared by all tables:
 * session timings, the Session Specifications panel, button labels and headings.
 * Changing anything here changes every roundtable page at once.
 */
export function RoundtableDefaultsEditor({ data, setData }: Props) {
  const d = data || {};
  const defaults = d.defaults || {};
  const facts = defaults.facts || [];
  const sessions = defaults.sessions || {};

  const patch = (value: any) => setData({ ...d, defaults: { ...defaults, ...value } });

  // The date and time zone are shared by both sessions, so they are picked once.
  // Existing content has only ISO strings, so fall back to reading them.
  const firstParsed = parseIso(sessions['1']?.startIso);
  const eventDate = defaults.eventDate || firstParsed.date || '2026-12-14';
  const timezone = defaults.timezone || firstParsed.offset || '+03:00';
  const timeOf = (iso: string | undefined, fallback: string) => parseIso(iso).time || fallback;

  /**
   * Rebuilds every session from the pickers. The displayed timing and the two ISO
   * strings used for calendar links are derived here, so they can never disagree.
   */
  const applySchedule = (change: {
    date?: string;
    timezone?: string;
    key?: string;
    start?: string;
    end?: string;
  }) => {
    const date = change.date ?? eventDate;
    const tz = change.timezone ?? timezone;
    const next: Record<string, any> = { ...sessions };

    SESSION_KEYS.forEach((key) => {
      const s = next[key] || {};
      const fb = FALLBACK_TIMES[key];
      const start = change.key === key && change.start !== undefined ? change.start : timeOf(s.startIso, fb.start);
      const end = change.key === key && change.end !== undefined ? change.end : timeOf(s.endIso, fb.end);
      next[key] = {
        ...s,
        timing: start && end ? `${start} – ${end}` : s.timing || '',
        startIso: start ? `${date}T${start}:00${tz}` : s.startIso,
        endIso: end ? `${date}T${end}:00${tz}` : s.endIso,
      };
    });

    patch({ eventDate: date, timezone: tz, sessions: next });
  };

  return (
    <div className={card}>
      <h3 className={cardTitle}>Shared settings — applies to all roundtables</h3>
      <p className="text-xs text-text-secondary">
        Edit once here and every roundtable page updates. Nothing below is per-table.
      </p>

      {/* Session timings */}
      <div className="space-y-3">
        <p className={label}>Session timings</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-border-subtle rounded p-3">
          <div>
            <label className={label} htmlFor="rt-event-date">Date of the roundtables</label>
            <input
              id="rt-event-date"
              type="date"
              className={input}
              value={eventDate}
              onChange={(e) => applySchedule({ date: e.target.value })}
            />
          </div>
          <div>
            <label className={label} htmlFor="rt-timezone">Time zone</label>
            <select
              id="rt-timezone"
              className={input}
              value={timezone}
              onChange={(e) => applySchedule({ timezone: e.target.value })}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.offset} value={tz.offset}>
                  {tz.label}
                </option>
              ))}
              {!TIMEZONES.some((tz) => tz.offset === timezone) && (
                <option value={timezone}>Current setting (GMT{timezone})</option>
              )}
            </select>
          </div>
        </div>

        {SESSION_KEYS.map((key) => {
          const s = sessions[key] || {};
          const fb = FALLBACK_TIMES[key];
          const start = timeOf(s.startIso, fb.start);
          const end = timeOf(s.endIso, fb.end);
          return (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border border-border-subtle rounded p-3">
              <div className="sm:col-span-1 text-xs font-bold text-brand-secondary pb-2.5">S{key}</div>
              <div className="sm:col-span-3">
                <label className={label} htmlFor={`rt-s${key}-start`}>Starts</label>
                <input
                  id={`rt-s${key}-start`}
                  type="time"
                  className={input}
                  value={start}
                  onChange={(e) => applySchedule({ key, start: e.target.value })}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={label} htmlFor={`rt-s${key}-end`}>Ends</label>
                <input
                  id={`rt-s${key}-end`}
                  type="time"
                  className={input}
                  value={end}
                  onChange={(e) => applySchedule({ key, end: e.target.value })}
                />
              </div>
              <div className="sm:col-span-5 pb-2.5">
                <p className="text-[11px] text-text-secondary">
                  Shown on the site as{' '}
                  <span className="text-text-primary font-semibold">{s.timing || `${start} – ${end}`}</span>
                </p>
              </div>
            </div>
          );
        })}
        <p className="text-[11px] text-text-secondary">
          Each table is assigned to session 1 or 2 in its own card below. Calendar links are generated
          from the date, times and time zone above.
        </p>
      </div>

      {/* Session Specifications panel */}
      <div className="space-y-3">
        <p className={label}>Session Specifications panel (right-hand sidebar)</p>
        {facts.map((f: any, i: number) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end border border-border-subtle rounded p-3">
            <div className="sm:col-span-4">
              <label className={label}>Title</label>
              <input className={input} value={f.title || ''}
                onChange={(e) => { const n = [...facts]; n[i] = { ...f, title: e.target.value }; patch({ facts: n }); }} />
            </div>
            <div className="sm:col-span-7">
              <label className={label}>Detail</label>
              <input className={input} value={f.detail || ''}
                onChange={(e) => { const n = [...facts]; n[i] = { ...f, detail: e.target.value }; patch({ facts: n }); }} />
            </div>
            <div className="sm:col-span-1 pb-1">
              <button type="button" className="text-brand-primary hover:opacity-70" aria-label="Remove specification"
                onClick={() => patch({ facts: facts.filter((_: any, x: number) => x !== i) })}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button type="button"
          onClick={() => patch({ facts: [...facts, { title: 'New specification', detail: '' }] })}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add specification
        </button>
        <p className="text-[11px] text-text-secondary">
          Write <code className="text-brand-secondary">{'{sessionTiming}'}</code> in a detail line to insert
          that table&apos;s own session time (e.g. &quot;14:30 – 16:00&quot;).
        </p>
      </div>

      {/* Headings & buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Themes heading</label>
          <input className={input} value={defaults.themesHeading || ''}
            onChange={(e) => patch({ themesHeading: e.target.value })} />
        </div>
        <div>
          <label className={label}>Participants heading</label>
          <input className={input} value={defaults.participantsHeading || ''}
            onChange={(e) => patch({ participantsHeading: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Participants intro line</label>
          <input className={input} value={defaults.participantsIntro || ''}
            onChange={(e) => patch({ participantsIntro: e.target.value })} />
        </div>
        <div>
          <label className={label}>Badge beside the table name</label>
          <input className={input} value={defaults.cardMeta || ''} placeholder="75 Minutes · 15 Seats"
            onChange={(e) => patch({ cardMeta: e.target.value })} />
        </div>
        <div>
          <label className={label}>Search/share description suffix</label>
          <input className={input} value={defaults.metaDescriptionSuffix || ''}
            onChange={(e) => patch({ metaDescriptionSuffix: e.target.value })} />
        </div>
        <div>
          <label className={label}>Primary button label</label>
          <input className={input} value={defaults.requestSeatLabel || ''}
            onChange={(e) => patch({ requestSeatLabel: e.target.value })} />
        </div>
        <div>
          <label className={label}>Secondary button label</label>
          <input className={input} value={defaults.chairTableLabel || ''}
            onChange={(e) => patch({ chairTableLabel: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Secondary button link</label>
          <input className={input} value={defaults.chairTableHref || ''}
            onChange={(e) => patch({ chairTableHref: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

/** Editable list of short strings — used for themes and participant profiles. */
export function StringListEditor({
  title,
  hint,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  hint?: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className={label}>
        {title} ({items.length})
      </label>
      {hint && <p className="text-[11px] text-text-secondary -mt-1">{hint}</p>}
      {items.map((value, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={input}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              const n = [...items];
              n[i] = e.target.value;
              onChange(n);
            }}
          />
          <button
            type="button"
            className="text-brand-primary hover:opacity-70 shrink-0"
            aria-label={`Remove ${title} item`}
            onClick={() => onChange(items.filter((_, x) => x !== i))}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:underline"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}
