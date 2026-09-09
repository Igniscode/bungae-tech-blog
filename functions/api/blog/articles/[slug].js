import { fail, getArticle, json } from '../../../_lib/blog-api.js';
export async function onRequestGet({ params, env }) {
  try { const article = await getArticle(env, String(params.slug)); return article ? json({ article }) : json({ error: { code: 'not_found' } }, 404); }
  catch (error) { return fail(error); }
}
