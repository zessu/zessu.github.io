import { db, Post, eq } from "astro:db";
import { getCollection } from "astro:content";
import crypto from "crypto";

export async function initializeArticles() {
  try {
    console.log("Starting article database initialization...");

    const allBlogPosts = await getCollection("blog");
    console.log(`Found ${allBlogPosts.length} articles in the collection`);

    for (const blog of allBlogPosts) {
      const blogHash = hashSlug(blog.id);

      const existingBlog = await db
        .select()
        .from(Post)
        .where(eq(Post.id, blogHash));

      if (existingBlog.length === 0) {
        console.log(`Initializing new article: ${blog.data.title || blog.id}`);

        await db.insert(Post).values({
          id: blogHash,
          likes: 0,
          reads: 0,
        });

        console.log(`Article ${blog.id} initialized successfully`);
      } else {
        console.log(`Article ${blog.id} already exists in the database`);
      }
    }

    console.log("Article initialization complete!");
    return true;
  } catch (error) {
    console.error("Error initializing articles:", error);
    return false;
  }
}

function hashSlug(slug: string) {
  return crypto.createHash("sha256").update(slug).digest("hex");
}
