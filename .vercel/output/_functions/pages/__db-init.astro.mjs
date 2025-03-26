import { a as createComponent, r as renderTemplate } from '../chunks/astro/server_My-EQ2pT.mjs';
import 'kleur/colors';
import 'clsx';
import { d as db, P as Post } from '../chunks/_astro_db_Dj1Q2wxM.mjs';
import { g as getCollection } from '../chunks/_astro_content_DTciDyNr.mjs';
import crypto from 'crypto';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';
export { renderers } from '../renderers.mjs';

const $$DbInit = createComponent(async ($$result, $$props, $$slots) => {
  {
    try {
      console.log("Starting database initialization...");
      const allBlogPosts = await getCollection("blog");
      console.log(`Found ${allBlogPosts.length} articles to process`);
      for (const blog of allBlogPosts) {
        const blogHash = crypto.createHash("sha256").update(blog.id).digest("hex");
        const existingBlog = await db.select().from(Post).where(eq(Post.id, blogHash));
        if (existingBlog.length === 0) {
          console.log(`Initializing new article: ${blog.id}`);
          await db.insert(Post).values({
            id: blogHash,
            likes: 0,
            reads: 0
          });
        } else {
          console.log(`Article ${blog.id} already exists in the database`);
        }
      }
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
