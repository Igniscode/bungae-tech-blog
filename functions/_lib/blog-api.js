const FIELDS = ['title', 'slug', 'description', 'content', 'author', 'tags', 'category', 'publishedAt'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ApiError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
const text = (value, max) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw new ApiError(400, 'invalid_string');
  return value.trim();
};
export function validateArticle(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ApiError(400, 'invalid_object');
  if (Object.keys(value).some((key) => !FIELDS.includes(key))) throw new ApiError(400, 'unknown_field');
  const slug = text(value.slug, 120);
  if (!SLUG.test(slug)) throw new ApiError(400, 'invalid_slug');
  if (!Array.isArray(value.tags) || value.tags.length > 12) throw new ApiError(400, 'invalid_tags');
  const publishedAt = value.publishedAt ? text(value.publishedAt, 40) : new Date().toISOString();
  if (!Number.isFinite(Date.parse(publishedAt))) throw new ApiError(400, 'invalid_published_at');
  return {
    title: text(value.title, 300), slug, description: text(value.description, 1000),
    content: text(value.content, 100000), author: text(value.author, 200),
    tags: value.tags.map((tag) => text(tag, 60)), category: text(value.category, 100),
    publishedAt: new Date(publishedAt).toISOString(),
  };
}
const toRow = (a) => ({ title: a.title, slug: a.slug, description: a.description, content: a.content, author: a.author, tags: a.tags, category: a.category, published_at: a.publishedAt });
const fromRow = (r) => validateArticle({ title: r.title, slug: r.slug, description: r.description, content: r.content, author: r.author, tags: r.tags, category: r.category, publishedAt: r.published_at });
const same = (a, b) => JSON.stringify(validateArticle(a)) === JSON.stringify(validateArticle(b));

function config(env, write = false) {
  const base = env.BLOG_SUPABASE_URL?.replace(/\/$/, '');
  const key = write ? env.BLOG_SUPABASE_SERVICE_ROLE_KEY : env.BLOG_SUPABASE_ANON_KEY;
  if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(base || '') || !key) throw new ApiError(503, 'database_not_configured');
  return { base: `${base}/rest/v1/tech_blog_articles`, key };
}
async function query(env, params, init = {}, write = false) {
  const { base, key } = config(env, write);
  let response;
  try {
    response = await fetch(`${base}?${params}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...init.headers } });
  } catch { throw new ApiError(503, 'database_unavailable'); }
  const data = await response.json().catch(() => null);
  return { response, data };
}
export async function getArticle(env, slug) {
  if (!SLUG.test(slug)) throw new ApiError(400, 'invalid_slug');
  const params = new URLSearchParams({ select: '*', slug: `eq.${slug}`, published_at: `lte.${new Date().toISOString()}`, limit: '1' });
  const { response, data } = await query(env, params);
  if (!response.ok || !Array.isArray(data)) throw new ApiError(503, 'database_unavailable');
  return data.length ? fromRow(data[0]) : null;
}
export async function listArticles(env, limit, offset) {
  const params = new URLSearchParams({ select: '*', published_at: `lte.${new Date().toISOString()}`, order: 'published_at.desc,slug.asc', limit: String(limit), offset: String(offset) });
  const { response, data } = await query(env, params);
  if (!response.ok || !Array.isArray(data)) throw new ApiError(503, 'database_unavailable');
  return data.map(fromRow);
}
export async function insertArticle(env, article) {
  const params = new URLSearchParams();
  const { response, data } = await query(env, params, { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(toRow(article)) }, true);
  if (response.ok) return true;
  if (response.status !== 409 || data?.code !== '23505') throw new ApiError(503, 'database_unavailable');
  const existingParams = new URLSearchParams({ select: '*', slug: `eq.${article.slug}`, limit: '1' });
  const existing = await query(env, existingParams, {}, true);
  if (!existing.response.ok || !existing.data?.[0]) throw new ApiError(503, 'retry_lookup_failed');
  if (!same(article, fromRow(existing.data[0]))) throw new ApiError(409, 'article_slug_conflict');
  return false;
}
export function authorize(request, env) {
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
  const expected = env.BLOG_UPLOAD_TOKEN || '';
  if (expected.length < 32 || supplied.length !== expected.length) throw new ApiError(expected.length < 32 ? 503 : 401, expected.length < 32 ? 'upload_not_configured' : 'unauthorized');
  let diff = 0; for (let i = 0; i < expected.length; i++) diff |= supplied.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff) throw new ApiError(401, 'unauthorized');
}
export const json = (data, status = 200, headers = {}) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
export const fail = (error) => { const e = error instanceof ApiError ? error : new ApiError(500, 'internal_error'); return json({ error: { code: e.code } }, e.status); };
