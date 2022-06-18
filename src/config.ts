import type { Pattern } from "fast-glob";

export type DocsConfig = {
  input: string;
  outputDir: string;
  template: string;
  ignore?: Pattern[];
}

export type DefineDocsConfigOption = {
  docs: DocsConfig;
  [k: string]: any;
}

export const defaultConfig: DocsConfig = {
  input: "src/**/.ts",
  outputDir: "docs",
  template: "docs.hbs",
};

export const defineDocsConfig = (config: DefineDocsConfigOption): DefineDocsConfigOption => config;
