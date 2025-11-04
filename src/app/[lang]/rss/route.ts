import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/blog';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    const validLang = lang === 'it' ? 'it' : 'en';

    const posts = await getPublishedPosts();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';

    // Generate RSS XML
    // getPublishedPosts already returns only published posts
    const rssItems = posts
      .slice(0, 20) // Latest 20 posts
      .map(post => {
        const title = post.title[validLang] || post.title.en;
        const excerpt = post.excerpt[validLang] || post.excerpt.en;
        const postUrl = `${siteUrl}/${validLang}/blog/${post.slug}`;
        const pubDate = post.published_at 
          ? new Date(post.published_at).toUTCString()
          : new Date().toUTCString();

        // Escape XML special characters
        const escapeXml = (str: string) => {
          return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        };

        return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.cover_image ? `<enclosure url="${post.cover_image}" type="image/jpeg" />` : ''}
      <category>${escapeXml(post.category)}</category>
      ${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
      })
      .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>StackMoneyUp - Personal Finance Growth</title>
    <link>${siteUrl}</link>
    <description>No bullshit. No easy money promises. Just real strategies for building wealth.</description>
    <language>${validLang === 'it' ? 'it-IT' : 'en-US'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>StackMoneyUp RSS Generator</generator>
${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

