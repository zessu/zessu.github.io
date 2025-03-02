import { db, Post, eq } from "astro:db";
import { getCollection } from "astro:content";
import crypto from "crypto";

function hashSlug(slug: string) {
  return crypto.createHash("sha256").update(slug).digest("hex");
}

async function initializeArticles() {
  try {
    console.log("Starting article database initialization...");

    const allBlogPosts = await getCollection("blog");
    console.log(`Found ${allBlogPosts.length} articles in the collection`);

    for (const blog of allBlogPosts) {
      const blogHash = hashSlug(blog.id);

      // The select query returns an array, not a single item
      const existingBlog = await db
        .select()
        .from(Post)
        .where(eq(Post.id, blogHash));

      // Check if the array is empty
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
  } catch (error) {
    console.error("Error initializing articles:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeArticles();
