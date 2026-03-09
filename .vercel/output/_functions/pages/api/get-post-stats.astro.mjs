import { d as db, P as Post } from '../../chunks/_astro_db_BfEb3RNj.mjs';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const hash = url.searchParams.get("hash");
  if (!hash) {
    return new Response(JSON.stringify({ error: "Missing hash" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const result = await db.select().from(Post).where(eq(Post.id, hash));
  if (result.length === 0) {
    return new Response(JSON.stringify({ likes: 0, reads: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(
    JSON.stringify({
      likes: result[0].likes,
      reads: result[0].reads
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
