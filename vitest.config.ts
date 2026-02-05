import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "lib"),
      components: path.resolve(__dirname, "components"),
    },
  },
})
