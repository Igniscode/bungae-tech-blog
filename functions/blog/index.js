import { listArticles } from '../_lib/blog-api.js';

const STATIC_POSTS = [
  {
    slug: 'pages-deploy-verify',
    publishedAt: '2026-09-08T09:00:00.000Z',
    title: '배포는 끝이 아니다: Pages 정적 사이트 검증 자동화',
    description: '배포 뒤 2분 검증 스크립트와 Actions 연동, 실측 로그 포함.',
    tags: ['cloudflare-pages', 'automation', 'qa']
  },
  {
    slug: 'hello-cloudflare-pages',
    publishedAt: '2026-09-03T09:00:00.000Z',
    title: 'Cloudflare Pages에 기술블로그를 올리기까지',
    description: 'Astro 정적 빌드부터 Pages 배포, 공개 URL 검증까지의 실제 절차를 정리했습니다.',
    tags: ['cloudflare-pages', 'astro', 'hosting']
  },
  {
    slug: 'astro-content-collections',
    publishedAt: '2026-09-02T09:00:00.000Z',
    title: 'Astro Content Collections로 글 관리하기',
    description: 'Markdown frontmatter를 스키마로 검증하고 글 목록·상세를 자동 생성하는 방법.',
    tags: ['astro', 'markdown']
  },
  {
    slug: 'pages-rollback-strategy',
    publishedAt: '2026-09-01T09:00:00.000Z',
    title: '정적 블로그 롤백 전략: Pages Deployments',
    description: '깨진 배포가 나가도 1분 안에 되돌리는 Pages 히스토리 기반 롤백 절차.',
    tags: ['cloudflare-pages', 'ops', 'rollback']
  }
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

function renderCard(p) {
  const date = (p.publishedAt || '').slice(0, 10);
  const tagsHtml = (p.tags || []).map(t => `<span class="tag">#${esc(t)}</span>`).join('');
  return `<a class="card" href="/blog/${esc(p.slug)}/">
  <div class="meta">${esc(date)}</div>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.description)}</p>
  <div style="margin-top:8px;">${tagsHtml}</div>
</a>`;
}

const PREFIX = "<!DOCTYPE html><html lang=\"ko\" data-theme=\"light\"> <head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>\uae30\uc220\ube14\ub85c\uadf8 | \ubc88\uac1c\ucef4\ud37c\ub2c8</title><meta name=\"description\" content=\"\ubc88\uac1c\ucef4\ud37c\ub2c8 \uae30\uc220\ube14\ub85c\uadf8 \u2014 \ub9cc\ub4e4\uba74\uc11c \ubc30\uc6b0\ub294 \uae30\ub85d\"><link rel=\"icon\" type=\"image/svg+xml\" href=\"/assets/bungae-mark.svg\"><script>\n    (function () {\n      try {\n        var saved = null; try { saved = localStorage.getItem('bungae-theme'); } catch (e2) {}\n        var theme = saved || 'light';\n        document.documentElement.setAttribute('data-theme', theme);\n      } catch (e) {}\n    })();\n</script><style>:root{--paper:#F6F7F9;--ink:#16212F;--muted:#5A6C80;--card:#FFFFFF;--line:#DFE5EC;--accent:#16365C;--accent-ink:#FFFFFF;--accent-soft:#E8EEF5;--eyebrow:#3D5A7A;--dark-paper:#0F151E;--dark-ink:#D6DDE6;--dark-muted:#97A6B9;--dark-card:#18222F;--dark-line:#2B3A4E;--dark-accent:#8FB0D1}html[data-theme=dark]{--paper:var(--dark-paper);--ink:var(--dark-ink);--muted:var(--dark-muted);--card:var(--dark-card);--line:var(--dark-line);--accent:var(--dark-accent);--accent-ink:#0F151E;--accent-soft:#1D2B3E;--eyebrow:var(--dark-accent)}*,*:before,*:after{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-size:16px;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,Apple SD Gothic Neo,Noto Sans KR,Segoe UI,Roboto,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit}.wrap{max-width:1080px;margin:0 auto;padding:0 24px}.prose{max-width:720px}header.site{border-bottom:1px solid var(--line);background:var(--card);position:sticky;top:0;z-index:10}.nav{display:flex;align-items:center;gap:4px;min-height:64px}.brand{font-weight:800;font-size:18px;letter-spacing:-.02em;text-decoration:none;margin-right:auto;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:9px}.brand-mark{display:inline-flex;width:26px;height:26px;border-radius:7px;background:var(--accent);color:var(--accent-ink);align-items:center;justify-content:center;font-size:13px;line-height:1}.brand-mark svg{display:block}.brand-logo{height:30px;width:auto;display:block;flex-shrink:0}.brand-logo.logo-dark{display:none}html[data-theme=dark] .brand-logo.logo-light{display:none}html[data-theme=dark] .brand-logo.logo-dark{display:block}@media(max-width:720px){.brand-logo{height:28px}}.menu-btn{display:none;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:8px;padding:6px 10px;font-size:16px;cursor:pointer;line-height:1;flex-shrink:0}.nav-links{display:flex;align-items:center;gap:2px}.nav a.link{text-decoration:none;padding:8px 13px;border-radius:8px;font-size:15px;font-weight:500;color:var(--muted);white-space:nowrap;flex-shrink:0}.nav a.link:hover{color:var(--ink);background:var(--accent-soft)}.nav a.link.active{color:var(--ink);background:var(--accent-soft)}.theme-btn{border:1px solid var(--line);background:var(--card);color:var(--muted);border-radius:8px;padding:7px 13px;font-size:13px;font-weight:600;cursor:pointer;margin-left:8px;white-space:nowrap;flex-shrink:0}.theme-btn:hover{color:var(--ink);border-color:var(--muted)}.hero{padding:64px 0 48px}.eyebrow{color:var(--eyebrow);font-weight:700;letter-spacing:.14em;font-size:12px;text-transform:uppercase}.eyebrow:after{content:\"\";display:block;width:36px;height:2px;background:var(--accent);margin-top:10px;opacity:.55}.hero h1{font-size:clamp(28px,4vw,40px);line-height:1.32;letter-spacing:-.025em;margin:14px 0 14px;font-weight:800}.hero p.lead{font-size:17px;line-height:1.75;color:var(--muted);max-width:620px;margin:0}.cta-row{display:flex;gap:10px;margin-top:26px;flex-wrap:wrap}.btn{display:inline-block;text-decoration:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;background:var(--accent);color:var(--accent-ink);border:1px solid var(--accent)}.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}.btn.ghost:hover{border-color:var(--muted)}section.block{padding:36px 0}section.block h2{font-size:22px;letter-spacing:-.02em;margin:0 0 6px;font-weight:800}section.block .sub{color:var(--muted);margin:0 0 20px;font-size:15px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:22px;text-decoration:none}.card h3{margin:0 0 8px;font-size:17px;letter-spacing:-.01em;line-height:1.5}.card h3 .num{display:block;font-size:11.5px;font-weight:700;letter-spacing:.12em;color:var(--eyebrow);margin-bottom:6px}.card p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.7}.card .meta{font-size:13px;color:var(--muted);margin-bottom:6px}.tag{display:inline-block;font-size:12px;border:1px solid var(--line);border-radius:999px;padding:1px 10px;margin:2px 4px 2px 0;color:var(--muted)}footer.site{border-top:1px solid var(--line);margin-top:48px;padding:28px 0 40px;color:var(--muted);font-size:13.5px;background:var(--card)}footer.site a{color:inherit}.crumb{font-size:13.5px;color:var(--muted);margin:24px 0 0}.crumb a{color:inherit}article.post h1{font-size:28px;line-height:1.45;letter-spacing:-.02em}article.post pre{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;overflow-x:auto;font-size:14px;line-height:1.7}article.post code{font-size:.9em}@media(max-width:640px){.nav{flex-wrap:wrap;padding-top:8px;padding-bottom:8px;row-gap:4px}.brand{font-size:17px;margin-right:0}.theme-btn{order:2;margin-left:auto}.menu-btn{display:block;order:3;margin-left:8px}.nav-links{order:4;flex-basis:100%;display:none;flex-direction:column;align-items:stretch;gap:2px;padding:4px 0 2px}.nav-links.open{display:flex}.nav a.link{display:block;padding:10px 12px;font-size:15px}.hero{padding:44px 0 32px}.hero-grid{grid-template-columns:1fr}.hero-visual{order:-1;padding:20px}.hero-visual img{max-width:180px}.corp-band{grid-template-columns:1fr}.tigo-card{grid-template-columns:1fr;text-align:center}.tigo-card img{margin:0 auto}.page-hero{grid-template-columns:1fr}.page-hero img{max-width:170px;margin:0 auto}}</style></head> <body> <header class=\"site\"> <div class=\"wrap nav\"> <a class=\"brand\" href=\"/\"><img class=\"brand-logo logo-light\" src=\"/assets/bungae-logo.svg\" alt=\"\ubc88\uac1c\ucef4\ud37c\ub2c8\" width=\"155\" height=\"30\"><img class=\"brand-logo logo-dark\" src=\"/assets/bungae-logo-dark.svg\" alt=\"\ubc88\uac1c\ucef4\ud37c\ub2c8\" width=\"155\" height=\"30\"></a> <nav class=\"nav-links\" id=\"primaryNav\" aria-label=\"\uc8fc\uc694 \uba54\ub274\"><a class=\"link\" data-nav=\"services\" href=\"/services/\">\uc11c\ube44\uc2a4</a> <a class=\"link\" data-nav=\"about\" href=\"/about/\">\uc18c\uac1c</a> <a class=\"link\" data-nav=\"blog\" href=\"/blog/\">\uae30\uc220\ube14\ub85c\uadf8</a> <a class=\"link\" data-nav=\"contact\" href=\"/contact/\">\uc5f0\ub77d</a></nav> <button class=\"theme-btn\" id=\"themeToggle\" type=\"button\">\ub2e4\ud06c \ubaa8\ub4dc</button> <button class=\"menu-btn\" id=\"menuToggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"primaryNav\" aria-label=\"\uba54\ub274 \uc5f4\uae30\">\u2630</button> </div> </header> <main class=\"wrap\">  <p class=\"crumb\"><a href=\"/\">\ud648</a> / \uae30\uc220\ube14\ub85c\uadf8</p> <h1>\ubc88\uac1c \uae30\uc220\ube14\ub85c\uadf8</h1> <p class=\"sub\">\ub9cc\ub4e4\uba74\uc11c \ubc30\uc6b0\ub294 \ubc88\uac1c \ud300\uc758 \uae30\ub85d. \ud68c\uc0ac \uc0ac\uc774\ud2b8\uc758 \ud558\uc704 \ud56d\ubaa9\uc73c\ub85c \uc5f0\uc7ac\ub429\ub2c8\ub2e4. <a href=\"/blog/about/\">\ube14\ub85c\uadf8 \uc18c\uac1c</a></p> <div class=\"grid\">\n";
const SUFFIX = "\n</div></main> <footer class=\"site\"> <div class=\"wrap\"> <div>\ubc88\uac1c\ucef4\ud37c\ub2c8 \u00b7 \ube60\ub974\uac8c \uac80\uc99d\ud558\uace0, \ub2e8\ub2e8\ud558\uac8c \ub9cc\ub4ed\ub2c8\ub2e4.</div> <div style=\"margin-top:6px;\"> <a href=\"/blog/\">\uae30\uc220\ube14\ub85c\uadf8</a> \u00b7 <a href=\"/about/\">\ud68c\uc0ac \uc18c\uac1c</a> \u00b7 <a href=\"/contact/\">\uc5f0\ub77d\ud558\uae30</a> </div> <div style=\"margin-top:6px;\">\uc774\uc804 \ube14\ub85c\uadf8 \uc8fc\uc18c(/posts/\u00b7/about \ube14\ub85c\uadf8 \uc548\ub0b4)\ub294 \ud558\uc704 \uacbd\ub85c(/blog/)\ub85c \uc774\uc804\ub418\uc5c8\uc2b5\ub2c8\ub2e4.</div> </div> </footer> <script data-section=\"blog\">\n    (function () {\n      var btn = document.getElementById('themeToggle');\n      function label() {\n        var t = document.documentElement.getAttribute('data-theme');\n        if (btn) btn.textContent = t === 'dark' ? '\ub77c\uc774\ud2b8 \ubaa8\ub4dc' : '\ub2e4\ud06c \ubaa8\ub4dc';\n      }\n      if (btn) btn.addEventListener('click', function () {\n        var cur = document.documentElement.getAttribute('data-theme');\n        var next = cur === 'dark' ? 'light' : 'dark';\n        document.documentElement.setAttribute('data-theme', next);\n        try { localStorage.setItem('bungae-theme', next); } catch (e) {}\n        label();\n      });\n      label();\n      try {\n        var sec = document.currentScript && document.currentScript.getAttribute('data-section');\n        if (sec) {\n          var el = document.querySelector('.nav a[data-nav=\"' + sec + '\"]');\n          if (el) el.classList.add('active');\n        }\n      } catch (e) {}\n    })();\n</script> <script>(function(){var t=document.getElementById(\"menuToggle\"),n=document.getElementById(\"primaryNav\");if(t&&n){t.addEventListener(\"click\",function(){var o=n.classList.toggle(\"open\");t.setAttribute(\"aria-expanded\",o?\"true\":\"false\");t.setAttribute(\"aria-label\",o?\"\uba54\ub274 \ub2eb\uae30\":\"\uba54\ub274 \uc5f4\uae30\");});}})();</script><script>(async function(){try{var r=await fetch('/api/blog/articles?limit=50');if(!r.ok)return;var j=await r.json(),g=document.querySelector('.grid');(j.articles||[]).reverse().forEach(function(a){if(document.querySelector('a[href=\"/blog/'+a.slug+'/\" ]'))return;var e=document.createElement('a');e.className='card';e.href='/blog/'+a.slug+'/';e.innerHTML='<div class=\"meta\"></div><h3></h3><p></p><div style=\"margin-top:8px\"></div>';e.querySelector('.meta').textContent=a.publishedAt.slice(0,10);e.querySelector('h3').textContent=a.title;e.querySelector('p').textContent=a.description;(a.tags||[]).forEach(function(tag){var s=document.createElement('span');s.className='tag';s.textContent='#'+tag;e.lastElementChild.appendChild(s)});g.prepend(e)})}catch(e){}})();</script></body> </html>\n";

export async function onRequest(context) {
  try {
    let dbArticles = [];
    try {
      dbArticles = await listArticles(context.env, 100, 0);
    } catch (e) {
      console.error('Failed to list db articles:', e);
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

    const cardsHtml = allPosts.map(renderCard).join('\n');
    const html = PREFIX + cardsHtml + SUFFIX;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return context.next();
  }
}
