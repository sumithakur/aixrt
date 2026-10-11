'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';
import { getRoundtables } from '@/lib/content';
import { Button } from '@/components/ui/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const roundtables = getRoundtables();

  // Scroll lock when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg-base/98 backdrop-blur-2xl lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Top bar inside drawer */}
      <div className="flex h-20 items-center justify-between border-b border-border-subtle px-6">
        <span className="font-display text-sm font-semibold tracking-wider text-text-primary">
          AIX SUMMIT 2026
        </span>
        <button
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mb-6">
          <Button
            href="/request-an-invitation"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Request an Invitation
          </Button>
        </div>

        <nav className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Main
            </p>
            <Link
              href="/about"
              onClick={onClose}
              className="block font-display text-lg font-medium text-text-primary hover:text-brand-secondary"
            >
              About AIX Summit
            </Link>
            <Link
              href="/programme"
              onClick={onClose}
              className="block font-display text-lg font-medium text-text-primary hover:text-brand-secondary"
            >
              The Programme
            </Link>
            <Link
              href="/showcase"
              onClick={onClose}
              className="block font-display text-lg font-medium text-text-primary hover:text-brand-secondary"
            >
              AI Showcase & Connections
            </Link>
            <Link
              href="/signals"
              onClick={onClose}
              className="block font-display text-lg font-medium text-text-primary hover:text-brand-secondary"
            >
              Roundtable Signals
            </Link>
          </div>

          <div className="space-y-3 border-t border-border-subtle pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Executive Roundtables
              </p>
              <Link
                href="/roundtables"
                onClick={onClose}
                className="text-xs font-medium text-brand-secondary"
              >
                View Hub
              </Link>
            </div>
            <div className="space-y-2">
              {roundtables.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/roundtables/${rt.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-sm bg-bg-raised/40 p-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-raised hover:text-brand-secondary"
                >
                  <span>{rt.shortTitle}</span>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-border-subtle pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Partnerships & Info
            </p>
            <Link
              href="/partners/become-a-partner"
              onClick={onClose}
              className="block font-display text-base font-medium text-brand-primary hover:underline"
            >
              Become a Partner (Chair a Table)
            </Link>
            <Link
              href="/venue"
              onClick={onClose}
              className="block text-sm text-text-secondary hover:text-text-primary"
            >
              Venue & Doha Travel
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="block text-sm text-text-secondary hover:text-text-primary"
            >
              Frequently Asked Questions
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block text-sm text-text-secondary hover:text-text-primary"
            >
              Contact Organiser
            </Link>
            <Link
              href="/legal/confidentiality"
              onClick={onClose}
              className="block text-sm text-text-secondary hover:text-text-primary"
            >
              Chatham House Confidentiality
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-border-subtle p-6 text-center text-xs text-text-muted">
        Monday 14 December 2026 · Doha, Qatar
      </div>
    </div>
  );
}
