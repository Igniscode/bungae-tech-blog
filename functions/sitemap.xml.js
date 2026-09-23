import { listArticles } from './_lib/blog-api.js';

const STATIC_URLS = [
  { loc: 'https://home.bungae.site/', lastmod: '2026-09-08' },
  { loc: 'https://home.bungae.site/about/', lastmod: '2026-09-08' },
  { loc: 'https://home.bungae.site/services/', lastmod: '2026-09-08' },
  { loc: 'https://home.bungae.site/contact/', lastmod: '2026-09-08' },
  { loc: 'https://home.bungae.site/blog/', lastmod: '2026-09-23' },
  { loc: 'https://home.bungae.site/blog/pages-deploy-verify/', lastmod: '2026-09-08' },
  { loc: 'https://home.bungae.site/blog/hello-cloudflare-pages/', lastmod: '2026-09-03' },
  { loc: 'https://home.bungae.site/blog/astro-content-collections/', lastmod: '2026-09-02' },
  { loc: 'https://home.bungae.site/blog/pages-rollback-strategy/', lastmod: '2026-09-01' },
];

export async function onRequest(context) {
  try {
    let dbArticles = [];
    try {
      dbArticles = await listArticles(context.env, 100, 0);
    } catch (e) {
      console.error('Failed to list articles for sitemap:', e);
    }

    const seen = new Set(STATIC_URLS.map(u => u.loc));
    const urls = [...STATIC_URLS];

    for (const a of dbArticles) {
      const loc = `https://home.bungae.site/blog/${a.slug}/`;
      if (!seen.has(loc)) {
        seen.add(loc);
        urls.push({
          loc,
          lastmod: (a.publishedAt || '').slice(0, 10) || new Date().toISOString().slice(0, 10),
        });
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return context.next();
  }
}
