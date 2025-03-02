// db-init-integration.mjs
import crypto from "crypto";

export default function createIntegration() {
  return {
    name: "db-init-integration",
    hooks: {
      // Note: We're using the "astro:config:setup" hook which runs earlier
      "astro:config:setup": ({ command, injectRoute }) => {
        // Only run during build, not dev
        if (command === "build") {
          // Inject a virtual route that will run our initialization code
          injectRoute({
            pattern: "/__db-init",
            entrypoint: "src/pages/__db-init.astro",
          });
        }
      },
    },
  };
}
