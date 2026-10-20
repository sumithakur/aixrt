import React from 'react';
import { getLiveGlobals } from '@/lib/server-content';
import { CTABand } from '@/components/content/CTABand';

interface CTABandLiveProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Server-only wrapper around CTABand that pulls the CTA copy from Firestore
 * via getLiveGlobals, so edits made in the admin appear without a rebuild.
 * Client components cannot render this — they should use <CTABand /> directly.
 */
export async function CTABandLive({ title, subtitle, className }: CTABandLiveProps) {
  const globals = await getLiveGlobals();

  return (
    <CTABand
      title={title}
      subtitle={subtitle}
      className={className}
      content={globals?.cta}
      registerUrl={globals?.registerUrl}
    />
  );
}
