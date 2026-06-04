import { MetadataRoute } from 'next';
import { getArticles, getCountries, getPathogens, getSiteLastModified } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.hantaworld.com';
  const siteLastModified = await getSiteLastModified();
  const countries = await getCountries();
  const articles = await getArticles();
  const pathogens = await getPathogens();
  const seoPages = [
    '/hantavirus',
    '/hantavirus-symptoms',
    '/andes-virus',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: siteLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const countryUrls = countries.map((country) => ({
    url: `${baseUrl}/country/${country.slug}`,
    lastModified: siteLastModified,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: article.lastVerifiedDate || article.publishedAt,
    changeFrequency: 'never' as const,
    priority: 0.6,
  }));

  const pathogenUrls = pathogens.map((pathogen) => ({
    url: `${baseUrl}/pathogens/${pathogen.slug}`,
    lastModified: pathogen.stats?.lastVerifiedAt || siteLastModified,
    changeFrequency: 'daily' as const,
    priority: pathogen.slug === 'hantavirus' ? 0.9 : 0.75,
  }));

  return [
    {
      url: baseUrl,
      lastModified: siteLastModified,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: siteLastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: siteLastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pathogens`,
      lastModified: siteLastModified,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/about/methodology`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...seoPages,
    ...pathogenUrls,
    ...countryUrls,
    ...articleUrls,
  ];
}
