import React from 'react';
import type { PublishStatus } from '@/types/content';
import { UserCheck, Shield } from 'lucide-react';

interface ChairSlotProps {
  status?: PublishStatus;
  organisation?: string;
  personName?: string;
  personRole?: string;
  logo?: string;
  className?: string;
}

export function ChairSlot({
  status = 'pending',
  organisation,
  personName,
  personRole,
  logo,
  className = '',
}: ChairSlotProps) {
  // Hard confirmation gate enforcement: refuse to render names if unconfirmed
  const isConfirmed = status === 'confirmed';

  if (!isConfirmed) {
    return (
      <div
        className={`flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface/50 px-4 py-3 text-xs ${className}`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-bg-raised text-text-muted">
          <Shield className="h-4 w-4 text-brand-secondary" />
        </div>
        <div>
          <span className="font-semibold uppercase tracking-wider text-text-muted">
            Roundtable Chair
          </span>
          <p className="font-medium text-text-primary">
            To be announced
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-md border border-border-prominent bg-bg-surface px-4 py-3 text-xs ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-brand-primary/10 text-brand-primary">
        <UserCheck className="h-5 w-5" />
      </div>
      <div>
        <span className="font-semibold uppercase tracking-wider text-brand-secondary">
          Roundtable Chair
        </span>
        <p className="font-bold text-text-primary">
          {personName ? `${personName}, ` : ''}{organisation}
        </p>
        {personRole && <p className="text-text-secondary">{personRole}</p>}
      </div>
    </div>
  );
}
