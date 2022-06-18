import path from "path";
import rimraf from "rimraf";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonJs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const rollupConfigs = {
  cjs: {
    module: "CommonJS",
    format: "cjs",
    ext: "js",
  },
  esm: {
    module: "ESNext",
    format: "esm",
    ext: "mjs",
  },
};

const external = Object.keys(pkg.dependencies).filter((name) => name !== "@charrue/node-toolkit");

const config = Object.entries(rollupConfigs).map(([mod, moduleConfig]) => {
  return {
    input: path.resolve(__dirname, "./src/index.ts"),
    output: {
      dir: path.resolve(__dirname, "dist"),
      format: mod,
      exports: module === "cjs" ? "named" : undefined,
      entryFileNames: `[name].${moduleConfig.ext}`,
    },
    external,
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      typescript({
        include: [ "src/**/*.ts" ],
        exclude: [ "/__tests__/**/*" ],
        sourceMap: false,
        declaration: true,
        declarationDir: path.resolve(__dirname, "dist"),
      }),
      commonJs(),
    ],
  };
});

rimraf.sync("./dist");
export default config;
