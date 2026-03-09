import { defineAction, ActionError } from "astro:actions";
import { db, Post, eq, sql } from "astro:db";
import { z } from "astro:schema";

export const server = {
  likePost: defineAction({
    input: z.object({
      hash: z.string(),
    }),
    handler: async (input) => {
      const { hash } = input;

      const existingPost = await db
        .select()
        .from(Post)
        .where(eq(Post.id, hash));

      if (existingPost.length === 0) {
        throw new ActionError({ code: "NOT_FOUND", message: "Post not found" });
      }

      await db
        .update(Post)
        .set({ likes: sql`${Post.likes} + 1` })
        .where(eq(Post.id, hash))
        .execute();

      return { message: "success" };
    },
  }),

  updatePostVisits: defineAction({
    input: z.object({
      hash: z.string(),
    }),
    handler: async (input) => {
      const { hash } = input;

      await db
        .update(Post)
        .set({ reads: sql`${Post.reads} + 1` })
        .where(eq(Post.id, hash))
        .execute();

      return { message: "success" };
    },
  }),
};
