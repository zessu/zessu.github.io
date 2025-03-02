import { initializeArticles } from "../src/init-database";

export default async function () {
  const success = await initializeArticles();
  if (!success) {
    process.exit(1);
  }
}
