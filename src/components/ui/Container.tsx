import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export function Container({ children, className = '', size = 'default' }: ContainerProps) {
  const maxWidth = {
    narrow: 'max-w-4xl',
    default: 'max-w-[1536px]',
    wide: 'max-w-[1440px]',
  }[size];

  return <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidth} ${className}`}>{children}</div>;
}

interface SectionProps {
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
