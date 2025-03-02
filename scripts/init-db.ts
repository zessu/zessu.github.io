// scripts/init-db.ts
import { db, Post } from "astro:db";
import { initializeArticles } from "../src/init-database";

export default async function () {
  console.log(
    "DB Config:",
    process.env.ASTRO_DB_REMOTE_URL ? "URL set" : "URL missing"
  );
  console.log(
    "Token:",
    process.env.ASTRO_DB_APP_TOKEN ? "Token set" : "Token missing"
  );

  try {
    await db.select().from(Post).limit(1);
    console.log("DB connection successful");
  } catch (e) {
    console.error("DB connection failed:", e);
    process.exit(1);
  }

  const success = await initializeArticles();
  if (!success) {
    console.error("Initialization failed");
    process.exit(1);
  }
  console.log("Database initialized successfully");
}
