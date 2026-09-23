import { listArticles } from '../_lib/blog-api.js';

const STATIC_POSTS = [
  {
    slug: 'pages-deploy-verify',
    publishedAt: '2026-09-08T09:00:00.000Z',
    title: '배포는 끝이 아니다: Pages 정적 사이트 검증 자동화',
    description: '배포 뒤 2분 검증 스크립트와 Actions 연동, 실측 로그 포함.'
  },
  {
    slug: 'hello-cloudflare-pages',
    publishedAt: '2026-09-03T09:00:00.000Z',
    title: 'Cloudflare Pages에 기술블로그를 올리기까지',
    description: 'Astro 정적 빌드부터 Pages 배포, 공개 URL 검증까지의 실제 절차를 정리했습니다.'
  },
  {
    slug: 'astro-content-collections',
    publishedAt: '2026-09-02T09:00:00.000Z',
    title: 'Astro Content Collections로 글 관리하기',
    description: 'Markdown frontmatter를 스키마로 검증하고 글 목록·상세를 자동 생성하는 방법.'
  },
  {
    slug: 'pages-rollback-strategy',
    publishedAt: '2026-09-01T09:00:00.000Z',
    title: '정적 블로그 롤백 전략: Pages Deployments',
    description: '깨진 배포가 나가도 1분 안에 되돌리는 Pages 히스토리 기반 롤백 절차.'
  }
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

export async function onRequest(context) {
  try {
    let dbArticles = [];
    try {
      dbArticles = await listArticles(context.env, 100, 0);
    } catch (e) {
      console.error('Failed to list articles for rss:', e);
    }

    const allMap = new Map();
    for (const a of dbArticles) {
      allMap.set(a.slug, a);
    }
    for (const s of STATIC_POSTS) {
      if (!allMap.has(s.slug)) {
        allMap.set(s.slug, s);
      }
    }

    const allPosts = Array.from(allMap.values()).sort((a, b) => {
      return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    });

    const itemsXml = allPosts.map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>https://home.bungae.site/blog/${esc(p.slug)}/</link>
      <guid>https://home.bungae.site/blog/${esc(p.slug)}/</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>번개 기술블로그</title>
    <link>https://home.bungae.site/blog/</link>
    <description>만들면서 배우는 번개 팀의 기록</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
