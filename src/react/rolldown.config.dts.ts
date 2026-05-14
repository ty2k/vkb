import { dts } from "rolldown-plugin-dts";

export default {
  input: "./dist/types/index.d.ts",
  output: [{ dir: "dist", format: "esm" }],
  plugins: [dts()],
};
