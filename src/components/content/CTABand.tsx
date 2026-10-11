import React from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface CTABandProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function CTABand({
  title = 'Doha, 14 December 2026',
  subtitle = 'An invitation-led room of around 110 senior decision-makers, six sponsored roundtables, and high-value stage moments.',
  className = '',
}: CTABandProps) {
  return (
    <div className={`relative overflow-hidden border-t border-border-subtle bg-bg-raised/70 py-20 ${className}`}>
      {/* Subtle radial glow matching brand guidelines */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(247,70,169,0.18)_0%,rgba(22,12,53,0)_70%)]" />

      <Container size="narrow" className="relative text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/request-an-invitation" variant="gradient" size="lg">
            Request an invitation
          </Button>
          <Button href="/partners/become-a-partner" variant="secondary" size="lg">
            Partner with us (Chair a Table)
          </Button>
        </div>
      </Container>
    </div>
  );
}
