import { c as createComponent, r as renderTemplate } from '../chunks/astro/server_XkzkhHpx.mjs';
import 'kleur/colors';
import 'clsx';
import { d as db, P as Post } from '../chunks/_astro_db_Dj1Q2wxM.mjs';
import { g as getCollection } from '../chunks/_astro_content_MM6b9Clb.mjs';
import crypto from 'crypto';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';
export { renderers } from '../renderers.mjs';

const $$DbInit = createComponent(async ($$result, $$props, $$slots) => {
  {
    try {
      console.log("Starting database initialization...");
      const allBlogPosts = await getCollection("blog");
      console.log(`Found ${allBlogPosts.length} articles to process`);
      const allBlogHashes = allBlogPosts.map((blogPost) => {
        return crypto.createHash("sha256").update(blogPost.id).digest("hex");
      });
      const allBlogHashesResultPromises = allBlogHashes.map(async (blogHash) => {
        return await db.select().from(Post).where(eq(Post.id, blogHash));
      });
      const blogsWithExistingHashesPromise = await Promise.all(
        allBlogHashesResultPromises
      );
      const blogsIdsWithExistingHashes = blogsWithExistingHashesPromise.flat().map((post) => {
        return post.id;
      });
      const newBlogPosts = allBlogPosts.filter((blogPost) => {
        const blogHash = crypto.createHash("sha256").update(blogPost.id).digest("hex");
        return !blogsIdsWithExistingHashes.includes(blogHash);
      });
      const newBlogPostsPromises = newBlogPosts.map(async (blogPost) => {
        const blogHash = crypto.createHash("sha256").update(blogPost.id).digest("hex");
        return db.insert(Post).values({
          id: blogHash,
          likes: 0,
          reads: 0
        });
      });
      await Promise.all(newBlogPostsPromises);
      console.log("Database initialization complete!");
    } catch (error) {
      console.error(`Error initializing articles}`);
    }
  }
  return renderTemplate``;
}, "/home/kali/code/zessu.github.io/src/pages/__db-init.astro", undefined);
const $$file = "/home/kali/code/zessu.github.io/src/pages/__db-init.astro";
const $$url = "/__db-init";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DbInit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
