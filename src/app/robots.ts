import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_dev/', '/api/'],
    },
    sitemap: 'https://www.aixsummit.com/sitemap.xml',
  };
}
