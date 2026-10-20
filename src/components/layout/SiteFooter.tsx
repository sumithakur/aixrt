'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { REGISTER_URL } from '@/lib/links';
import { getSiteConfig, getNavigation, getGlobals } from '@/lib/content';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createAnnouncementSubscriber } from '@/store/contact/contactActions';

export interface FooterLink {
  label: string;
  href?: string;
  requiresFeature?: string;
  useRegisterUrl?: boolean;
  emphasis?: 'primary' | 'secondary';
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface FooterContent {
  newsletter?: {
    heading?: string;
    description?: string;
    placeholder?: string;
    buttonLabel?: string;
    successMessage?: string;
    alreadySubscribedMessage?: string;
    invalidEmailMessage?: string;
  };
  organisedByLabel?: string;
  columns?: FooterColumn[];
  copyright?: string;
  legalLinks?: FooterLink[];
}

interface SiteFooterProps {
  /** Supplied by the layout so Firestore edits appear without a rebuild. */
  navigation?: { footer?: FooterContent };
  registerUrl?: string;
}

export function SiteFooter({ navigation, registerUrl }: SiteFooterProps) {
  const config = getSiteConfig();
  const nav = navigation ?? (getNavigation() as any);
  const footer: FooterContent = nav?.footer ?? {};
  const resolvedRegisterUrl =
    registerUrl || (getGlobals() as any)?.registerUrl || REGISTER_URL;

  const news = footer.newsletter ?? {};
  const columns = footer.columns ?? [];

  const dispatch = useAppDispatch();
  const announcementSubscriber = useAppSelector((state) => state.contact.announcementSubscriber);
  const subscribed = announcementSubscriber.status === 'succeeded';
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError(news.invalidEmailMessage || 'Please provide a valid work email.');
      return;
    }
    setError('');
    dispatch(createAnnouncementSubscriber({ email: email.trim() }));
  };

  /** Hide links gated behind a feature flag that is currently off. */
  const isVisible = (link: FooterLink) =>
    !link.requiresFeature || Boolean((config.features as any)?.[link.requiresFeature]);

  const hrefFor = (link: FooterLink) => (link.useRegisterUrl ? resolvedRegisterUrl : link.href || '#');

  const linkClass = (link: FooterLink) => {
    if (link.emphasis === 'secondary') return 'font-medium text-brand-secondary hover:underline';
    if (link.emphasis === 'primary') return 'font-medium text-brand-primary hover:underline';
    return 'hover:text-brand-secondary';
  };

  const organiserAnchor = (
    <a
      href={config.event.organiserUrl || 'https://www.risin.ventures'}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-brand-primary hover:text-brand-secondary transition-colors underline"
    >
      {config.event.organiser}
    </a>
  );

  /** Splits "© 2026 … {organiser} … reserved." around the {organiser} token. */
  const renderCopyright = () => {
    const template = footer.copyright || '© 2026 AIX Summit. Organised by {organiser}. All rights reserved.';
    const [before, after] = template.split('{organiser}');
    if (after === undefined) return <>{template}</>;
    return (
      <>
        {before}
        {organiserAnchor}
        {after}
      </>
    );
  };

  return (
    <footer className="border-t border-border-subtle bg-bg-base pt-16 text-text-secondary">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        {/* Above columns: Announcement capture */}
        <div className="mb-16 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="font-display text-lg font-bold text-text-primary sm:text-xl">
                {news.heading || 'Stay updated on speaker and chair announcements'}
              </h3>
              <p className="mt-1.5 text-xs text-text-secondary sm:text-sm">
                {news.description ||
                  'Roundtable chairs, speakers and Showcase companies are announced as they are confirmed. Receive editorial updates directly.'}
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-sm bg-status-confirmed/10 p-3 text-sm text-status-confirmed border border-status-confirmed/30">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    {announcementSubscriber.data?.already_subscribed
                      ? news.alreadySubscribedMessage ||
                        'You are already subscribed. You will receive confirmed announcements directly.'
                      : news.successMessage || 'Thank you. You will receive confirmed announcements directly.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label htmlFor="footer-announcement-email" className="sr-only">
                      {news.placeholder || 'Enter your work email'}
                    </label>
                    <input
                      id="footer-announcement-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={news.placeholder || 'Enter your work email'}
                      required
                      className="w-full rounded-sm border border-border-subtle bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="shrink-0"
                      isLoading={announcementSubscriber.status === 'loading'}
                    >
                      <span>{news.buttonLabel || 'Get updates'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {(error || announcementSubscriber.error) && (
                    <p className="text-xs text-brand-rose">{error || announcementSubscriber.error}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Brand column + CMS-driven link columns */}
        <div className="grid grid-cols-1 gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="font-display text-xs italic text-text-primary">{config.event.tagline}</p>
            <p className="text-xs text-text-muted">
              {config.event.date} · {config.event.locationPublic}
            </p>
            <p className="text-sm text-text-muted mt-2">
              {footer.organisedByLabel || 'Organised by'} {organiserAnchor}
            </p>
          </div>

          {columns.map((column) => {
            const links = (column.links || []).filter(isVisible);
            if (!links.length) return null;
            return (
              <div key={column.heading} className="space-y-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
                  {column.heading}
                </h4>
                <ul className="space-y-2 text-xs">
                  {links.map((link) => (
                    <li key={`${column.heading}-${link.label}`}>
                      <Link href={hrefFor(link)} className={linkClass(link)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Utility bottom bar */}
        <div className="flex flex-col items-center justify-between border-t border-border-subtle py-8 text-xs text-text-muted sm:flex-row">
          <p className="text-sm">{renderCopyright()}</p>
          <div className="mt-4 flex flex-wrap gap-4 sm:mt-0">
            {(footer.legalLinks ?? []).map((link) => (
              <Link key={link.label} href={link.href || '#'} className="hover:text-text-secondary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
