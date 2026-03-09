import { defineDb, defineTable, column, NOW } from "astro:db";

const Post = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    likes: column.number({ optional: false, default: 0 }),
    reads: column.number({ optional: false, default: 0 }),
  },
});

export default defineDb({
  tables: { Post },
});
