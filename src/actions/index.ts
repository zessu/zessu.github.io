import { defineAction } from "astro:actions";
import { db, Post, eq } from "astro:db";
import { z } from "astro:schema";

export const server = {
  likePost: defineAction({
    input: z.object({
      count: z.number(),
      hash: z.string(),
    }),
    handler: async (input) => {
      try {
        const { hash } = input;
        const existingPost = await db
          .select()
          .from(Post)
          .where(eq(Post.id, hash));

        if (existingPost.length === 0)
          throw new Error("could not find post with that identifier");

        await db
          .update(Post)
          .set({ likes: existingPost[0].likes + 1 })
          .where(eq(Post.id, hash))
          .execute();
      } catch (error) {
        console.log(error);
      }
    },
  }),
  updatePostVisits: defineAction({
    input: z.object({
      hash: z.string(),
    }),
    handler: async (input) => {
      try {
        const { hash } = input;
        const postReads = await db
          .select({ reads: Post.reads })
          .from(Post)
          .where(eq(Post.id, hash));

        if (postReads.length === 0)
          throw new Error(`theres a problem with post: ${hash}`);

        await db
          .update(Post)
          .set({ reads: postReads[0].reads + 1 })
          .where(eq(Post.id, hash))
          .execute();
      } catch (error) {
        console.log(error);
      }
    },
  }),
};
