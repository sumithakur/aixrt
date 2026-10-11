import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Roundtable } from '@/types/content';
import { ChairSlot } from '@/components/content/ChairSlot';

interface RoundtableCardProps {
  roundtable: Roundtable;
  className?: string;
}

export function RoundtableCard({ roundtable, className = '' }: RoundtableCardProps) {
  const accentTopBar: Record<string, string> = {
    fintech: 'bg-accent-fintech',
    industrial: 'bg-accent-industrial',
    cybersecurity: 'bg-accent-cybersecurity',
    state: 'bg-accent-state',
    agentic: 'bg-accent-agentic',
  };

  const accentBadgeText: Record<string, string> = {
    fintech: 'text-accent-fintech border-accent-fintech/30 bg-accent-fintech/10',
    industrial: 'text-accent-industrial border-accent-industrial/30 bg-accent-industrial/10',
    cybersecurity: 'text-accent-cybersecurity border-accent-cybersecurity/30 bg-accent-cybersecurity/10',
    state: 'text-accent-state border-accent-state/30 bg-accent-state/10',
    agentic: 'text-accent-agentic border-accent-agentic/30 bg-accent-agentic/10',
  };

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border-subtle bg-bg-raised/85 p-6 sm:p-8 backdrop-blur-sm transition-all duration-base hover:-translate-y-1 hover:border-border-prominent hover:shadow-card ${className}`}
    >
      {/* Top accent line */}
      <div
        className={`absolute left-0 right-0 top-0 h-1.5 ${
          accentTopBar[roundtable.accent] || 'bg-brand-primary'
        }`}
      />

      <div>
        {/* Table number & short title */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className={`rounded-pill border px-3 py-1 font-display text-xs font-bold uppercase tracking-wider ${
              accentBadgeText[roundtable.accent] || 'text-brand-secondary border-brand-secondary/30'
            }`}
          >
            Table {roundtable.order} · {roundtable.shortTitle}
          </span>
          <span className="text-xs font-medium text-text-muted">15 Seats</span>
        </div>

        {/* Working Title */}
        <h3 className="mb-3 font-display text-xl font-bold text-text-primary group-hover:text-text-primary sm:text-2xl">
          {roundtable.title}
        </h3>

        {/* Core Question as pullquote */}
        <p className="mb-6 font-display text-base font-medium italic leading-relaxed text-text-secondary">
          &ldquo;{roundtable.coreQuestion}&rdquo;
        </p>

        {/* Theme Chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {roundtable.themes.slice(0, 4).map((theme) => (
            <span
              key={theme}
              className="rounded-pill border border-border-subtle bg-bg-surface/80 px-3 py-1 text-xs text-text-secondary"
            >
              {theme}
            </span>
          ))}
          {roundtable.themes.length > 4 && (
            <span className="rounded-pill border border-border-subtle bg-bg-surface/50 px-2.5 py-1 text-xs text-text-muted">
              +{roundtable.themes.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border-subtle">
        {/* Status-aware chair slot */}
        <ChairSlot
          status={roundtable.chair?.status}
          organisation={roundtable.chair?.organisation}
          personName={roundtable.chair?.personName}
          personRole={roundtable.chair?.personRole}
        />

        {/* Link to detail */}
        <div className="pt-2">
          <Link
            href={`/roundtables/${roundtable.slug}`}
            className="group/link inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary hover:underline"
          >
            <span>Read full roundtable brief</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
