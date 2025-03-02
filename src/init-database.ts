import { db, Post, eq } from "astro:db";
import { getCollection } from "astro:content";
import crypto from "crypto";

function hashSlug(slug: string) {
  return crypto.createHash("sha256").update(slug).digest("hex");
}

export async function initializeArticles() {
  try {
    const allBlogPosts = await getCollection("blog");
    for (const blog of allBlogPosts) {
      const blogHash = hashSlug(blog.id);

      const existingBlog = await db
        .select()
        .from(Post)
        .where(eq(Post.id, blogHash));

      if (existingBlog.length === 0) {
        await db.insert(Post).values({
          id: blogHash,
          likes: 0,
          reads: 0,
        });
      }
    }
    return true;
  } catch (error) {
    console.error("Error initializing articles:", error);
    return false;
  }
}
