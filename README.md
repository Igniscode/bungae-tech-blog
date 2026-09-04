# bungae-tech-blog

번개컴퍼니 랜딩 + 기술블로그 단일 정적 사이트.

- 공개 URL: https://bungae-tech-blog.pages.dev
- 소스 기준: Cloudflare Pages 프로덕션 배포 17bf670c HTML과 1:1 대조 재구성 (2026-09-04)
- 구성: index + about + blog index + blog 3 posts + contact + services + 404, robots.txt, _redirects(`/posts/* -> /blog/:splat` 301)
- 빌드 없음: 정적 HTML을 Pages에 그대로 배포 (output dir = repo root)
- 브랜치: `dev`(기본) + `main`(Pages 프로덕션 브랜치, 동일 커밋)
