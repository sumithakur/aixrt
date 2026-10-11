'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface Edition {
  name: string;
  slug: string;
  href: string;
  label: string;
  isCurrent?: boolean;
}

export const EDITIONS: Edition[] = [
  { name: 'QATAR', slug: 'qatar', href: '/', label: 'Doha · Dec 2026', isCurrent: true },
  { name: 'OMAN', slug: 'oman', href: '/editions/oman', label: 'Muscat · Stay Tuned' },
  { name: 'KSA', slug: 'ksa', href: '/editions/ksa', label: 'Riyadh · Stay Tuned' },
  { name: 'UAE', slug: 'uae', href: '/editions/uae', label: 'Dubai / Abu Dhabi · Stay Tuned' },
];

export function EditionTopBar() {
  const pathname = usePathname();

  const getCurrentSlug = () => {
    if (pathname.startsWith('/editions/oman')) return 'oman';
    if (pathname.startsWith('/editions/ksa')) return 'ksa';
    if (pathname.startsWith('/editions/uae')) return 'uae';
    return 'qatar';
  };

  const currentSlug = getCurrentSlug();

  return (
    <div className="w-full bg-gradient-to-r from-[#621d96] via-[#4f167e] to-[#3b0f61] text-white border-b border-purple-900/40 relative z-50">
      <div className="mx-auto flex max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8 h-9 sm:h-10 text-xs">
        {/* Editions list */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          {EDITIONS.map((edition, index) => {
            const isActive = currentSlug === edition.slug;
            return (
              <React.Fragment key={edition.slug}>
                <Link
                  href={edition.href}
                  className={`flex items-center gap-1.5 font-bold tracking-wider uppercase transition-all duration-fast px-2 py-0.5 rounded ${
                    isActive
                      ? 'text-white bg-white/15 shadow-sm'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{edition.name}</span>
                  {edition.slug === 'qatar' && (
                    <span className="hidden md:inline text-[10px] font-medium text-brand-secondary/90 normal-case ml-0.5">
                      (Active Edition)
                    </span>
                  )}
                </Link>
                {index < EDITIONS.length - 1 && (
                  <span className="text-brand-secondary text-[11px] sm:text-xs select-none" aria-hidden="true">
                    ✦
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right tag / context */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-purple-200/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-secondary animate-pulse" />
          <span>GCC Executive AI Series</span>
        </div>
      </div>
    </div>
  );
}
