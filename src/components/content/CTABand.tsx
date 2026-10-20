import React from 'react';
import { Button } from '@/components/ui/Button';
import { REGISTER_URL } from '@/lib/links';
import { Container } from '@/components/ui/Container';
import { getGlobals } from '@/lib/content';

export interface CTAContent {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryUseRegisterUrl?: boolean;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

interface CTABandProps {
  /** Per-page override of the CMS title. */
  title?: string;
  /** Per-page override of the CMS subtitle. */
  subtitle?: string;
  /** Supplied by CTABandLive so server pages get Firestore content. */
  content?: CTAContent;
  /** Supplied by CTABandLive. Falls back to the env/static register URL. */
  registerUrl?: string;
  className?: string;
}

/**
 * Presentational CTA band. Safe in both server and client components.
 * Server pages should render <CTABandLive /> so the copy comes from Firestore;
 * client pages render this directly and get the bundled content/globals.json.
 */
export function CTABand({ title, subtitle, content, registerUrl, className = '' }: CTABandProps) {
  const fallback = content ?? (getGlobals() as any)?.cta ?? {};
  const resolvedRegisterUrl = registerUrl || (getGlobals() as any)?.registerUrl || REGISTER_URL;

  const resolvedTitle = title ?? fallback.title ?? 'Doha, 14 December 2026';
  const resolvedSubtitle =
    subtitle ??
    fallback.subtitle ??
    'An invitation-led room of around 110 senior decision-makers, six sponsored roundtables, and high-value stage moments.';

  const primaryLabel = fallback.primaryLabel ?? 'Register';
  const primaryHref =
    fallback.primaryUseRegisterUrl === false ? fallback.primaryHref || '/' : resolvedRegisterUrl;
  const secondaryLabel = fallback.secondaryLabel ?? 'Become a Sponsor (Chair a Table)';
  const secondaryHref = fallback.secondaryHref ?? '/partners/become-a-partner';

  return (
    <div className={`relative overflow-hidden border-t border-border-subtle bg-bg-raised/70 py-20 ${className}`}>
      {/* Subtle radial glow matching brand guidelines */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(247,70,169,0.18)_0%,rgba(22,12,53,0)_70%)]" />

      <Container size="narrow" className="relative text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          {resolvedTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
          {resolvedSubtitle}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          {primaryLabel && (
            <Button href={primaryHref} variant="gradient" size="lg">
              {primaryLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button href={secondaryHref} variant="secondary" size="lg">
              {secondaryLabel}
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}
