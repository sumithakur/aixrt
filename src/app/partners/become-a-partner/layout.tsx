import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/page-metadata';

/**
 * This page is a client component, so it cannot export metadata itself.
 * This layout carries its CMS-managed title, description and social preview.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/partners/become-a-partner');
}

export default function BecomeAPartnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
