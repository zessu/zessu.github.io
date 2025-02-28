import { getCollection } from "astro:content";
import { db, Post, Comment } from "astro:db";
import crypto from "crypto";

export default async function () {
  const posts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const completedPosts = posts.map((post) => {
    const hash = crypto.createHash("sha256").update(post.id).digest("hex");
    return { id: hash };
  });

  console.log(completedPosts);

  await db.insert(Post).values(completedPosts).execute();
}
