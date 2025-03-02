// db-init-integration.mjs
import crypto from "crypto";

export default function createIntegration() {
  return {
    name: "db-init-integration",
    hooks: {
      "astro:config:setup": ({ command, injectRoute }) => {
        if (command === "build") {
          injectRoute({
            pattern: "/__db-init",
            entrypoint: "src/pages/__db-init.astro",
          });
        }
      },
    },
  };
}
