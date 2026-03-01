import { defineConfig } from "tsdown"

export default defineConfig({
  exports: true,
  entry: {
    index: "./src/index.ts",
    cli: "./src/cli.ts",
  },
  sourcemap: true,
})
