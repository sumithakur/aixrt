'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { REGISTER_URL } from '@/lib/links';
import { getNavigation, getGlobals, getSiteConfig } from '@/lib/content';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { MobileNav } from '@/components/layout/MobileNav';
import { EditionTopBar, type TopBarContent } from '@/components/layout/EditionTopBar';

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** 'link' = plain link, 'mega' = opens the roundtables MegaMenu, 'dropdown' = simple menu */
  type?: 'link' | 'mega' | 'dropdown';
  children?: NavChild[];
}

export interface HeaderContent {
  skipLinkLabel?: string;
  poweredByLabel?: string;
  registerLabel?: string;
  sponsorLabel?: string;
  mobileMenuLabel?: string;
  items?: NavItem[];
}

interface SiteHeaderProps {
  /** Supplied by the layout so Firestore edits appear without a rebuild. */
  navigation?: { header?: HeaderContent; topBar?: TopBarContent };
  registerUrl?: string;
}

export function SiteHeader({ navigation, registerUrl }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Hover menus sit below a small gap. Closing instantly on mouseleave makes the
  // panel unreachable, so closing is deferred and cancelled if the pointer arrives.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMega = () => { cancelClose(); setOpenDropdown(null); setIsMegaMenuOpen(true); };
  const openMenu = (href: string) => { cancelClose(); setIsMegaMenuOpen(false); setOpenDropdown(href); };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setOpenDropdown(null);
    }, 220);
  };
  useEffect(() => cancelClose, []);

  const config = getSiteConfig();
  const nav = navigation ?? (getNavigation() as any);
  const header: HeaderContent = nav?.header ?? {};
  const items: NavItem[] = header.items ?? [];
  const resolvedRegisterUrl = registerUrl || (getGlobals() as any)?.registerUrl || REGISTER_URL;

  // Scroll listener for sticky background transition past 80px
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape closes any open menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { cancelClose(); setIsMegaMenuOpen(false); setOpenDropdown(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setOpenDropdown(null);
    setIsMobileNavOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-brand-secondary ${
      isActive(href) ? 'text-brand-secondary font-semibold' : 'text-text-primary'
    }`;

  return (
    <>
      {/* Skip to main content link for a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-text-primary focus:shadow-raised"
      >
        {header.skipLinkLabel || 'Skip to main content'}
      </a>

      <header
        className={`sticky top-0 w-full z-40 transition-all duration-base ${
          isScrolled
            ? 'border-b border-border-subtle bg-bg-base/92 shadow-card backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <EditionTopBar content={nav?.topBar} />
        <div className={`transition-all duration-base ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="mx-auto flex max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex shrink-0 items-center gap-4 sm:gap-6">
              <Logo size="md" className="w-[130px] sm:w-[160px] lg:w-[190px] transition-all" />
              <div className="hidden sm:flex flex-col border-l border-text-muted/30 pl-4 sm:pl-6 justify-center">
                <span className="text-[10px] font-medium text-text-secondary leading-tight mb-0.5">
                  {header.poweredByLabel || 'Powered by'}
                </span>
                <a
                  href={config.event.organiserUrl || 'https://www.risin.ventures'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-text-primary leading-tight underline hover:text-brand-secondary transition-colors"
                >
                  {config.event.organiser}
                </a>
              </div>
            </div>

            {/* Desktop Navigation — rendered from navigation.json */}
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Main Navigation">
              {items.map((item) => {
                if (item.type === 'mega') {
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={openMega}
                      onMouseLeave={scheduleClose}
                      onFocus={openMega}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1 ${linkClass(item.href)}`}
                        aria-expanded={isMegaMenuOpen}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-fast ${
                            isMegaMenuOpen ? 'rotate-180 text-brand-secondary' : 'text-text-secondary'
                          }`}
                        />
                      </Link>
                    </div>
                  );
                }

                if (item.type === 'dropdown') {
                  const open = openDropdown === item.href;
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => openMenu(item.href)}
                      onMouseLeave={scheduleClose}
                      onFocus={() => openMenu(item.href)}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1 ${linkClass(item.href)}`}
                        aria-expanded={open}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-fast ${
                            open ? 'rotate-180 text-brand-secondary' : 'text-text-secondary'
                          }`}
                        />
                      </Link>

                      {open && (item.children?.length ?? 0) > 0 && (
                        <div className="absolute left-0 top-full mt-2 w-60 rounded-md border border-border-subtle bg-bg-raised p-2 shadow-card backdrop-blur-md">
                          {item.children!.map((child, i) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block rounded-sm px-3 py-2 text-xs font-medium hover:bg-bg-surface ${
                                i === 0
                                  ? 'text-text-primary hover:text-brand-secondary'
                                  : 'text-brand-primary hover:text-brand-primary-hover'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action: Become a Sponsor & Register */}
            <div className="flex items-center gap-2 sm:gap-3">
              {header.sponsorLabel !== '' && (
                <Button
                  href="/partners/become-a-partner"
                  variant="secondary"
                  size="sm"
                  className="hidden md:inline-flex text-xs font-semibold hover:border-brand-secondary hover:text-brand-secondary transition-colors"
                >
                  {header.sponsorLabel || 'Become a Sponsor'}
                </Button>
              )}
              <Button
                href={resolvedRegisterUrl}
                variant="primary"
                size="sm"
                className="text-xs font-semibold sm:text-sm shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {header.registerLabel || 'Register'}
              </Button>

              {/* Mobile Hamburger toggle */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary lg:hidden"
                aria-label={header.mobileMenuLabel || 'Open mobile navigation menu'}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop MegaMenu portal */}
        <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
          <MegaMenu isOpen={isMegaMenuOpen} onClose={() => { cancelClose(); setIsMegaMenuOpen(false); }} />
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
}
