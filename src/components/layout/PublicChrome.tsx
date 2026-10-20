'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides the public header and footer on the CMS.
 *
 * The admin panel is its own surface: the visitor navigation is not usable there,
 * and because both it and the CMS toolbar are sticky, rendering them together left
 * two bars stacked over the editing fields.
 *
 * The decision is made in a client component so the public pages can still be
 * rendered statically — reading the path from headers() in the layout would make
 * every page on the site dynamic.
 */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}
