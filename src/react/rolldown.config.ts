import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/lib/index.ts",
  platform: "neutral",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
  ],
  output: {
    file: "dist/index.js",
    format: "esm",
  },
});
