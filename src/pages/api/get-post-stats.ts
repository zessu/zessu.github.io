import { db, Post, eq } from "astro:db";

export const prerender = false;

export const GET = async ({ url }: { url: URL }) => {
  const hash = url.searchParams.get("hash");

  if (!hash) {
    return new Response(JSON.stringify({ error: "Missing hash" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await db
    .select()
    .from(Post)
    .where(eq(Post.id, hash));

  if (result.length === 0) {
    return new Response(JSON.stringify({ likes: 0, reads: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      likes: result[0].likes,
      reads: result[0].reads,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
