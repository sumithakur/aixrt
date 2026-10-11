import React from 'react';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'base' | 'raised' | 'surface' | 'hero';
}

export function Section({ children, className = '', id, variant = 'base' }: SectionProps) {
  const bgStyles = {
    base: 'bg-bg-base',
    raised: 'bg-bg-raised border-y border-border-subtle',
    surface: 'bg-bg-surface border-y border-border-subtle',
    hero: 'bg-bg-base relative overflow-hidden',
  }[variant];

  return (
    <section id={id} className={`py-16 sm:py-24 lg:py-28 ${bgStyles} ${className}`}>
      {children}
    </section>
  );
}
