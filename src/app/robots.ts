import { MetadataRoute } from 'next';
import { getLiveMetadata } from '@/lib/server-content';

export const dynamic = 'force-dynamic';

/**
 * Crawlers that answer questions rather than return links — the assistants people
 * increasingly ask instead of searching. They are named individually because a
 * blanket rule is not enough: several only read directives addressed to them, and
 * being absent from their index means being absent from those answers.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'cohere-ai',
  'Meta-ExternalAgent',
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo: any = (await getLiveMetadata()) || {};
  const site: any = seo.site || {};
  const baseUrl = String(site.baseUrl || 'https://aixrt-sigma.vercel.app').replace(/\/$/, '');

  const disallow = ['/_dev/', '/api/', '/admin'];

  const rules: MetadataRoute.Robots['rules'] = [{ userAgent: '*', allow: '/', disallow }];

  if (site.allowAiCrawlers !== false) {
    rules.push({ userAgent: AI_CRAWLERS, allow: '/', disallow });
  } else {
    rules.push({ userAgent: AI_CRAWLERS, disallow: '/' });
  }

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
