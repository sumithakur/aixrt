import React from 'react';

export function Eyebrow({
  children,
  className = '',
  accent = 'primary',
}: {
  children: React.ReactNode;
  className?: string;
  accent?: 'primary' | 'secondary' | 'fintech' | 'industrial' | 'cybersecurity' | 'state' | 'agentic';
}) {
  const accentClasses = {
    primary: 'text-brand-primary',
    secondary: 'text-brand-secondary',
    fintech: 'text-accent-fintech',
    industrial: 'text-accent-industrial',
    cybersecurity: 'text-accent-cybersecurity',
    state: 'text-accent-state',
    agentic: 'text-accent-agentic',
  }[accent];

  return (
    <div
      className={`font-display text-xs sm:text-sm font-bold uppercase tracking-widest ${accentClasses} ${className}`}
    >
      {children}
    </div>
  );
}

export function Heading({
  level = 2,
  size = 'md',
  children,
  className = '',
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  children: React.ReactNode;
  className?: string;
}) {
  const sizeClasses = {
    hero: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-text-primary leading-[1.1]',
    xl: 'text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-text-primary leading-tight',
    lg: 'text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-text-primary leading-snug',
    md: 'text-xl sm:text-2xl font-bold font-display text-text-primary',
    sm: 'text-lg sm:text-xl font-semibold font-display text-text-primary',
    xs: 'text-base font-semibold font-display text-text-primary',
  }[size];

  const Tag = `h${level}` as React.ElementType;

  return <Tag className={`${sizeClasses} ${className}`}>{children}</Tag>;
}

export function Standfirst({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-base sm:text-lg lg:text-xl leading-relaxed text-text-secondary ${className}`}>
      {children}
    </p>
  );
}

export function PullQuote({
  children,
  citation,
  className = '',
  accent = 'primary',
}: {
  children: React.ReactNode;
  citation?: string;
  className?: string;
  accent?: 'primary' | 'secondary' | 'fintech' | 'industrial' | 'cybersecurity' | 'state' | 'agentic';
}) {
  const borderAccent = {
    primary: 'border-brand-primary',
    secondary: 'border-brand-secondary',
    fintech: 'border-accent-fintech',
    industrial: 'border-accent-industrial',
    cybersecurity: 'border-accent-cybersecurity',
    state: 'border-accent-state',
    agentic: 'border-accent-agentic',
  }[accent];

  return (
    <blockquote
      className={`border-l-4 ${borderAccent} bg-bg-raised/50 py-4 px-6 rounded-r-md text-lg sm:text-xl italic font-display font-medium text-text-primary ${className}`}
    >
      &ldquo;{children}&rdquo;
      {citation && (
        <cite className="block mt-2 text-xs not-italic font-sans text-text-muted">
          — {citation}
        </cite>
      )}
    </blockquote>
  );
}
