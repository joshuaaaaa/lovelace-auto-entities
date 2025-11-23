import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

const dev = process.env.ROLLUP_WATCH;

const basePlugins = [
  nodeResolve(),
  json(),
  typescript(),
  getBabelOutputPlugin({ presets: ["@babel/preset-env"] }),
  !dev && terser({ format: { comments: false } }),
];

export default {
  input: "src/entity-display-card.ts",
  output: {
    file: "entity-display-card.js",
    format: "es",
  },
  plugins: basePlugins,
};
