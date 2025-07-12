import { getCollection } from "astro:content";
import { db, Post } from "astro:db";
import crypto from "crypto";

export default async function () {
  try {
    const posts = await getCollection("blog", ({ data }) => {
      return import.meta.env.PROD ? data.draft !== true : true;
    });

    const completedPosts = posts.map((post) => {
      console.log(post.id);
      const hash = crypto.createHash("sha256").update(post.id).digest("hex");
      console.log(hash);
      return { id: hash, likes: 0, reads: 0 };
    });

    await db.insert(Post).values(completedPosts).execute();
  } catch (error) {
    console.error(error);
  }
}
