'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRoundtables } from '@/lib/content';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  const roundtables = getRoundtables();

  const accentBorderColors: Record<string, string> = {
    fintech: 'hover:border-accent-fintech',
    industrial: 'hover:border-accent-industrial',
    cybersecurity: 'hover:border-accent-cybersecurity',
    state: 'hover:border-accent-state',
    agentic: 'hover:border-accent-agentic',
  };

  const accentTextColors: Record<string, string> = {
    fintech: 'text-accent-fintech',
    industrial: 'text-accent-industrial',
    cybersecurity: 'text-accent-cybersecurity',
    state: 'text-accent-state',
    agentic: 'text-accent-agentic',
  };

  return (
    <div
      className="absolute left-0 right-0 top-full w-full origin-top border-t-8 border-transparent bg-clip-padding transform border-b border-border-subtle bg-bg-raised/95 p-6 shadow-card backdrop-blur-xl transition-all duration-base"
      role="region"
      aria-label="Executive Roundtables Navigation"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-3">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-primary">
              Six Executive Roundtables
            </h3>
            <p className="text-xs text-text-secondary">
              Parallel 75-minute curated discussions · 15 seats each · Chatham House Rule
            </p>
          </div>
          <Link
            href="/roundtables"
            className="group flex items-center gap-1.5 text-xs font-medium text-brand-secondary hover:underline"
          >
            <span>View Roundtables Hub</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {roundtables.map((rt) => (
            <Link
              key={rt.slug}
              href={`/roundtables/${rt.slug}`}
              className={`group flex flex-col justify-between rounded-md border border-border-subtle bg-bg-surface/60 p-4 transition-all duration-base hover:-translate-y-1 hover:bg-bg-surface hover:shadow-card ${
                accentBorderColors[rt.accent] || 'hover:border-brand-primary'
              }`}
            >
              <div>
                <span
                  className={`mb-2 inline-block font-display text-[11px] font-bold uppercase tracking-wider ${
                    accentTextColors[rt.accent] || 'text-brand-secondary'
                  }`}
                >
                  Table {rt.order}
                </span>
                <h4 className="mb-2 font-display text-sm font-bold text-text-primary group-hover:text-text-primary">
                  {rt.shortTitle}
                </h4>
                <p className="line-clamp-3 text-xs leading-relaxed text-text-secondary">
                  &ldquo;{rt.coreQuestion}&rdquo;
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-brand-secondary group-hover:underline">
                <span>Explore Lane</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
