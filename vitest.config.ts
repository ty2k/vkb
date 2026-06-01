// vitest.config.ts
// ----------------
// Used for testing the `v-k-b` package distributed files.
// Individual front-end components in `src` are out of scope.

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["__tests__/importTests.test.ts"],
    exclude: ["src"],
  },
});
