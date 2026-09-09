import { fail, getArticle } from '../_lib/blog-api.js';
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const prose = (s) => esc(s).split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
export async function onRequest(context) {
  try {
    const article = await getArticle(context.env, String(context.params.slug));
    if (!article) return context.next();
    const url = `https://home.bungae.site/blog/${article.slug}/`;
    const tags = article.tags.map((tag) => `<span class="tag">#${esc(tag)}</span>`).join('');
    const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(article.title)} | 번개컴퍼니</title><meta name="description" content="${esc(article.description)}"><link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(article.title)}"><meta property="og:description" content="${esc(article.description)}"><meta property="og:url" content="${url}"><style>body{margin:0;background:#f6f7f9;color:#16212f;font:17px/1.8 -apple-system,BlinkMacSystemFont,"Noto Sans KR",sans-serif}header,footer{background:#fff;border-bottom:1px solid #dfe5ec}nav,main,footer div{max-width:720px;margin:auto;padding:20px 24px}nav a,a{color:#16365c}h1{font-size:clamp(28px,6vw,42px);line-height:1.3}.meta,.desc{color:#5a6c80}.tag{display:inline-block;border:1px solid #dfe5ec;border-radius:999px;padding:1px 10px;margin:2px 4px 2px 0;font-size:13px}article{margin:36px 0}footer{border-top:1px solid #dfe5ec;border-bottom:0;margin-top:48px}</style></head><body><header><nav><a href="/"><strong>번개컴퍼니</strong></a> · <a href="/blog/">기술블로그</a></nav></header><main><div class="meta">${esc(article.publishedAt.slice(0,10))} · ${esc(article.author)} · ${esc(article.category)}</div><h1>${esc(article.title)}</h1><p class="desc">${esc(article.description)}</p><div>${tags}</div><article>${prose(article.content)}</article><p><a href="/blog/">← 글 목록으로</a></p></main><footer><div>번개컴퍼니 · 빠르게 검증하고, 단단하게 만듭니다.</div></footer></body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch (error) { return fail(error); }
}
