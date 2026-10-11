'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { MobileNav } from '@/components/layout/MobileNav';
import { EditionTopBar } from '@/components/layout/EditionTopBar';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Scroll listener for sticky background transition past 80px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsPartnersOpen(false);
    setIsMobileNavOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Programme', href: '/programme' },
  ];

  return (
    <>
      {/* Skip to main content link for a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-text-primary focus:shadow-raised"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 w-full z-40 transition-all duration-base ${
          isScrolled
            ? 'border-b border-border-subtle bg-bg-base/92 shadow-card backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <EditionTopBar />
        <div className={`transition-all duration-base ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="mx-auto flex max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <Logo size="md" className="w-[130px] sm:w-[160px] lg:w-[190px] transition-all" />
            <div className="hidden sm:flex flex-col border-l border-text-muted/30 pl-4 sm:pl-6 justify-center">
              <span className="text-[10px] font-medium text-text-muted leading-tight mb-0.5">Powered by</span>
              <a href="https://www.risin.ventures" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-text-primary leading-tight underline hover:text-brand-secondary transition-colors">
                Risin Ventures
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-secondary ${
                  pathname === link.href ? 'text-brand-secondary font-semibold' : 'text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Roundtables with MegaMenu */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                href="/roundtables"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-secondary ${
                  pathname.startsWith('/roundtables')
                    ? 'text-brand-secondary font-semibold'
                    : 'text-text-primary'
                }`}
                aria-expanded={isMegaMenuOpen}
                aria-haspopup="true"
              >
                <span>Roundtables</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-fast ${
                    isMegaMenuOpen ? 'rotate-180 text-brand-secondary' : 'text-text-muted'
                  }`}
                />
              </Link>
            </div>

            <Link
              href="/showcase"
              className={`text-sm font-medium transition-colors hover:text-brand-secondary ${
                pathname.startsWith('/showcase')
                  ? 'text-brand-secondary font-semibold'
                  : 'text-text-primary'
              }`}
            >
              AI Showcase
            </Link>

            {/* Partners Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPartnersOpen(true)}
              onMouseLeave={() => setIsPartnersOpen(false)}
            >
              <Link href="/partners"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-secondary ${
                  pathname.startsWith('/partners')
                    ? 'text-brand-secondary font-semibold'
                    : 'text-text-primary'
                }`}
                aria-expanded={isPartnersOpen}
                aria-haspopup="true"
              >
                <span>Sponsors</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-fast ${
                    isPartnersOpen ? 'rotate-180 text-brand-secondary' : 'text-text-muted'
                  }`}
                />
              </Link>

              {isPartnersOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 rounded-md border border-border-subtle bg-bg-raised p-2 shadow-card backdrop-blur-md">
                  <Link
                    href="/partners"
                    className="block rounded-sm px-3 py-2 text-xs font-medium text-text-primary hover:bg-bg-surface hover:text-brand-secondary"
                  >
                    Our Sponsors
                  </Link>
                  <Link
                    href="/partners/become-a-partner"
                    className="block rounded-sm px-3 py-2 text-xs font-medium text-brand-primary hover:bg-bg-surface hover:text-brand-primary-hover"
                  >
                    Become a Sponsor (Chair a Table)
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/signals"
              className={`text-sm font-medium transition-colors hover:text-brand-secondary ${
                pathname.startsWith('/signals')
                  ? 'text-brand-secondary font-semibold'
                  : 'text-text-primary'
              }`}
            >
              Signals
            </Link>
          </nav>

          {/* Right Action: Become a Sponsor & Register */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              href="/partners/become-a-partner"
              variant="secondary"
              size="sm"
              className="hidden md:inline-flex text-xs font-semibold hover:border-brand-secondary hover:text-brand-secondary transition-colors"
            >
              Become a Sponsor
            </Button>
            <Button
              href="/request-an-invitation"
              variant="primary"
              size="sm"
              className="text-xs font-semibold sm:text-sm shadow-glow"
            >
              Register
            </Button>

            {/* Mobile Hamburger toggle */}
            <button type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary lg:hidden"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        </div>

        {/* Desktop MegaMenu portal */}
        <div
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
}
