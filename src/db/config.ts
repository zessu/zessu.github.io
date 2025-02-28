import { defineDb, defineTable, column, NOW } from "astro:db";

const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    post: column.number(),
    comment: column.text({ optional: true }),
    datePosted: column.date({ default: NOW }),
  },
  foreignKeys: [
    {
      columns: ["post"],
      references: () => [Post.columns.id],
    },
  ],
});

const Post = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    likes: column.number({ optional: true }),
  },
});

export default defineDb({
  tables: { Post, Comment },
});
