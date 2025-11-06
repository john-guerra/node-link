import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const config = [
  // ESM build (.mjs)
  {
    input: "src/index.js",
    external: ["d3"],
    output: {
      file: "dist/netviz.mjs",
      format: "es",
      sourcemap: true,
      globals: {
        d3: "d3"
      }
    },
    plugins: [resolve(), commonjs()]
  },
  // CommonJS build (.js)
  {
    input: "src/index.js",
    external: ["d3"],
    output: {
      file: "dist/netviz.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      globals: {
        d3: "d3"
      }
    },
    plugins: [resolve(), commonjs()]
  },
  // UMD build for CDN
  {
    input: "src/index.js",
    external: ["d3"],
    output: {
      file: "dist/netviz.umd.js",
      format: "umd",
      name: "netviz",
      sourcemap: true,
      globals: {
        d3: "d3"
      }
    },
    plugins: [resolve(), commonjs(), terser()]
  }
];

export default config;
