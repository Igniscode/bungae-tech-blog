import { ApiError, authorize, fail, insertArticle, json, listArticles, validateArticle } from '../../../_lib/blog-api.js';

export async function onRequestGet({ request, env }) {
  try {
    const search = new URL(request.url).searchParams;
    const limit = search.get('limit') || '50', offset = search.get('offset') || '0';
    if (!/^\d+$/.test(limit) || !/^\d+$/.test(offset) || +limit < 1 || +limit > 100 || +offset > 10000) throw new ApiError(400, 'invalid_pagination');
    return json({ articles: await listArticles(env, +limit, +offset) });
  } catch (error) { return fail(error); }
}
export async function onRequestPost({ request, env }) {
  try {
    authorize(request, env);
    if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') throw new ApiError(415, 'application_json_required');
    const raw = await request.text(); if (raw.length > 110000) throw new ApiError(413, 'payload_too_large');
    let body; try { body = JSON.parse(raw); } catch { throw new ApiError(400, 'invalid_json'); }
    const article = validateArticle(body), created = await insertArticle(env, article);
    return json({ article, created }, created ? 201 : 200, { Location: `/api/blog/articles/${article.slug}` });
  } catch (error) { return fail(error); }
}
