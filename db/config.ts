import { defineDb, defineTable, column, NOW } from "astro:db";

const Comment = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    postId: column.text(),
    post: column.text({ deprecated: true }),
    comment: column.text({ optional: true }),
    datePosted: column.date({ default: NOW }),
  },
  foreignKeys: [
    {
      columns: ["postId"],
      references: () => [Post.columns.id],
    },
  ],
});

const Post = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    likes: column.number({ optional: false, default: 0 }),
    reads: column.number({ optional: true, default: 0 }),
  },
});

export default defineDb({
  tables: { Post, Comment },
});
