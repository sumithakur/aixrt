'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { REGISTER_URL } from '@/lib/links';
import { getSiteConfig } from '@/lib/content';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createAnnouncementSubscriber } from '@/store/contact/contactActions';

export function SiteFooter() {
  const config = getSiteConfig();
  const dispatch = useAppDispatch();
  const announcementSubscriber = useAppSelector((state) => state.contact.announcementSubscriber);
  const subscribed = announcementSubscriber.status === 'succeeded';
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid work email.');
      return;
    }
    setError('');
    dispatch(createAnnouncementSubscriber({ email: email.trim() }));
  };

  return (
    <footer className="border-t border-border-subtle bg-bg-base pt-16 text-text-secondary">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        {/* Above columns: Announcement capture */}
        <div className="mb-16 rounded-lg border border-border-subtle bg-bg-raised/70 p-6 sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="font-display text-lg font-bold text-text-primary sm:text-xl">
                Stay updated on speaker and chair announcements
              </h3>
              <p className="mt-1.5 text-xs text-text-secondary sm:text-sm">
                Roundtable chairs, speakers and Showcase companies are announced as they are confirmed.
                Receive editorial updates directly.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-sm bg-status-confirmed/10 p-3 text-sm text-status-confirmed border border-status-confirmed/30">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    {announcementSubscriber.data?.already_subscribed
                      ? 'You are already subscribed. You will receive confirmed announcements directly.'
                      : 'Thank you. You will receive confirmed announcements directly.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your work email"
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
                      <span>Get updates</span>
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

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="font-display text-xs italic text-text-primary">
              {config.event.tagline}
            </p>
            <p className="text-xs text-text-muted">
              {config.event.date} · {config.event.locationPublic}
            </p>
            <p className="text-sm text-text-muted mt-2">
              Organised by{' '}
              <a href={config.event.organiserUrl || "https://www.risin.ventures"} target="_blank" rel="noopener noreferrer" className="font-bold text-base text-brand-primary hover:text-brand-secondary transition-colors underline">
                {config.event.organiser}
              </a>
            </p>
          </div>

          {/* Column 2: The Summit */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              The Summit
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/programme" className="hover:text-brand-secondary">
                  The Programme
                </Link>
              </li>
              <li>
                <Link href="/roundtables" className="hover:text-brand-secondary">
                  Six Executive Roundtables
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="hover:text-brand-secondary">
                  AI Showcase & Connections
                </Link>
              </li>
              {config.features.showSpeakers && (
                <li>
                  <Link href="/speakers" className="hover:text-brand-secondary">
                    Speakers & Chairs
                  </Link>
                </li>
              )}
              {config.features.showRecognition && (
                <li>
                  <Link href="/recognition" className="hover:text-brand-secondary">
                    AIX AI Impact Recognition
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Participate */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              Participate
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  // href="/request-an-invitation"
                  href={REGISTER_URL}
                  className="font-medium text-brand-secondary hover:underline"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/partners/become-a-partner"
                  className="font-medium text-brand-primary hover:underline"
                >
                  Become a Sponsor (Chair a Table)
                </Link>
              </li>
              <li>
                <Link href="/showcase/apply" className="hover:text-brand-secondary">
                  Apply to Showcase
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-secondary">
                  Contact Organising Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: More */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              More
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand-secondary">
                  About AIX Summit 2026
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-brand-secondary">
                  Sponsors & Chairs
                </Link>
              </li>
              <li>
                <Link href="/signals" className="hover:text-brand-secondary">
                  Roundtable Signals Report
                </Link>
              </li>
              <li>
                <Link href="/venue" className="hover:text-brand-secondary">
                  Venue & Doha Travel
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-secondary">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/legal/confidentiality" className="hover:text-brand-secondary">
                  Chatham House Confidentiality
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Utility bottom bar */}
        <div className="flex flex-col items-center justify-between border-t border-border-subtle py-8 text-xs text-text-muted sm:flex-row">
          <p className="text-sm">© 2026 AIX Summit. Organised by <a href={config.event.organiserUrl || "https://www.risin.ventures"} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-primary hover:text-brand-secondary transition-colors underline">Risin Ventures</a>. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap gap-4 sm:mt-0">
            <Link href="/legal/confidentiality" className="hover:text-text-secondary">
              Chatham House Conduct
            </Link>
            <Link href="/legal/privacy" className="hover:text-text-secondary">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-text-secondary">
              Terms of Attendance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
