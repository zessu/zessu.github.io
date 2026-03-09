import crypto from "crypto";
import { readdir } from "fs/promises";
import { join } from "path";
import { createClient } from "@libsql/client";

export default function createIntegration() {
  return {
    name: "db-init-integration",
    hooks: {
      "astro:build:done": async () => {
        try {
          const client = createClient({
            url: process.env.ASTRO_DB_REMOTE_URL,
            authToken: process.env.ASTRO_DB_APP_TOKEN,
          });

          const blogDir = join(process.cwd(), "src/content/blog");
          const files = await readdir(blogDir);
          const blogIds = files
            .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
            .map((f) => f.replace(/\.(md|mdx)$/, ""));

          console.log(`Found ${blogIds.length} posts to process`);

          for (const id of blogIds) {
            const hash = crypto.createHash("sha256").update(id).digest("hex");
            const existing = await client.execute({
              sql: "SELECT id FROM Post WHERE id = ?",
              args: [hash],
            });
            if (existing.rows.length === 0) {
              await client.execute({
                sql: "INSERT INTO Post (id, likes, reads) VALUES (?, 0, 0)",
                args: [hash],
              });
              console.log(`Inserted post: ${id}`);
            }
          }

          console.log("DB init complete!");
        } catch (error) {
          console.error("DB init failed:", error);
        }
      },
    },
  };
}
