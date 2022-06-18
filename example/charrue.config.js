import { defineConfig } from "@charrue/load-config";

export default defineConfig({
  docs: {
    input: "**/*.ts",
    outputDir: "docs",
    template: "docs.hbs",
  },
});
