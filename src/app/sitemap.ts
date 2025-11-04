import { MetadataRoute } from 'next';
// import { translations } from '@/lib/translations'; // Reserved for future use

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';
  const baseUrls = [
    {
      url: `${siteUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/it`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/it/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/it/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/it/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/it/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/en/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/it/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // TODO: Add blog posts dynamically when Supabase is connected
  // For now, add mock posts
  const mockPosts = [
    { slug: 'compound-effect-investing', published_at: '2024-12-15' },
    { slug: '50-30-20-rule', published_at: '2024-12-10' },
    { slug: 'stop-chasing-quick-wins', published_at: '2024-11-20' },
    { slug: 'debt-snowball-vs-avalanche', published_at: '2024-11-15' },
    { slug: 'why-6-months-not-enough', published_at: '2024-10-25' },
    { slug: 'side-hustles-that-scale', published_at: '2024-10-15' },
  ];

  const blogPosts = mockPosts.flatMap(post => [
    {
      url: `${siteUrl}/en/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/it/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  return [...baseUrls, ...blogPosts];
}

