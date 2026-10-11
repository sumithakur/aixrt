import React from 'react';
import Link from 'next/link';
import type { ProgrammeItem } from '@/types/content';
import { getRoundtables } from '@/lib/content';
import { Clock, ArrowRight } from 'lucide-react';

interface ProgrammeRowProps {
  item: ProgrammeItem;
}

export function ProgrammeRow({ item }: ProgrammeRowProps) {
  const roundtables = getRoundtables();

  const formatLabels: Record<string, string> = {
    arrival: 'Arrival & Networking',
    opening: 'Summit Opening',
    keynote: 'Keynote',
    'executive-conversation': 'Executive Conversation',
    showcase: 'AI Showcase',
    lunch: 'Executive Lunch',
    roundtables: 'Executive Roundtables (Chatham House)',
    connections: 'Enterprise Connections',
    plenary: 'Plenary Synthesis',
    recognition: 'Impact Recognition',
    closing: 'Closing Remarks',
    reception: 'Networking Reception',
  };

  const isDominant = item.emphasis || item.format === 'roundtables';

  return (
    <div
      className={`relative rounded-lg border transition-all duration-base p-6 sm:p-8 ${
        isDominant
          ? 'border-brand-primary/50 bg-bg-raised shadow-raised'
          : 'border-border-subtle bg-bg-raised/50 hover:border-border-prominent hover:bg-bg-raised'
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Time and Format Badge */}
        <div className="md:w-64 shrink-0">
          <div className="flex items-center gap-2 font-display text-sm font-bold text-text-primary">
            <Clock className="h-4 w-4 text-brand-secondary" />
            <span>
              {item.start} – {item.end}
            </span>
          </div>
          <span
            className={`mt-2 inline-block rounded-pill px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
              isDominant
                ? 'bg-brand-primary text-text-primary'
                : 'bg-bg-surface text-text-muted border border-border-subtle'
            }`}
          >
            {formatLabels[item.format] || item.format}
          </span>
        </div>

        {/* Content details */}
        <div className="flex-1">
          <h3
            className={`font-display font-bold text-text-primary ${
              isDominant ? 'text-xl sm:text-2xl text-brand-secondary' : 'text-lg sm:text-xl'
            }`}
          >
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
            {item.description}
          </p>

          {/* If this is the roundtables block, embed the six tables prominently! */}
          {isDominant && (
            <div className="mt-6 space-y-3 pt-4 border-t border-border-subtle">
              {item.format === 'roundtables' && <p className="font-display text-xs font-bold uppercase tracking-wider text-text-muted">Concurrent Tracks:</p>}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {roundtables.filter(rt => !(item as any).roundtableSessionId || rt.session === (item as any).roundtableSessionId).map((rt) => (
                  <Link
                    key={rt.slug}
                    href={`/roundtables/${rt.slug}`}
                    className="group flex flex-col justify-between rounded-sm border border-border-subtle bg-bg-surface/70 p-3 transition-colors hover:border-brand-secondary hover:bg-bg-surface"
                  >
                    <div>
                      <span className="font-display text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                        Table {rt.order}
                      </span>
                      <p className="font-display text-xs font-bold text-text-primary group-hover:text-text-primary">
                        {rt.shortTitle}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-text-muted group-hover:text-brand-secondary">
                      <span>View Brief</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
