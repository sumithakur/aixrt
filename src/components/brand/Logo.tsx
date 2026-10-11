import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteConfig } from '@/lib/content';

interface LogoProps {
  variant?: 'full' | 'mark';
  theme?: 'light' | 'dark' | 'mono';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({
  variant = 'full',
  size = 'md',
  theme = 'dark',
  className = '',
}: LogoProps) {
  const config = getSiteConfig();
  const brand = (config as any).brand || {};
  const logoPath =
    theme === 'light'
      ? brand.logoLight || '/brand/aix-roundtables-light-transparent.png'
      : brand.logoDark || brand.logo || '/brand/aix-roundtables-dark-transparent.png';
  
  const dimensions = {
    sm: { width: 140, height: 78 },
    md: { width: 180, height: 100 },
    lg: { width: 220, height: 122 },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-95 focus-visible:rounded-sm ${className}`}
      aria-label="AIX Summit Home"
    >
      <div className="relative flex items-center w-full">
        <img src={logoPath} alt="AIX Summit" className="object-contain w-full h-auto" />
      </div>
    </Link>
  );
}
