import {
  isAbsolute,
  resolve,
  dirname,
  relative,
} from "path";
import {
  mkdirSync,
  readFileSync,
  existsSync,
  writeFileSync,
} from "fs";
// @ts-ignore
import JsDocApi from "jsdoc-api";
import handlebars from "handlebars";
import glob from "fast-glob";
import { logger } from "./logger";
import { transpile } from "typescript";
import micromatch from "micromatch";
import type { JsDocSchema, TemplateContext } from "./types";
import { defaultConfig } from "./config";
import type { DocsConfig } from "./config";

export class JsDocApplication {
  config: DocsConfig;

  configDir = "";

  matchedFiles: string[] = [];

  contentMapping: { [k: string]: JsDocSchema[] } = {};

  outputContentMapping: { [k: string]: string } = {};

  templateContent = "";

  constructor(config: DocsConfig, configFile: string) {
    this.config = {
      ...defaultConfig,
      ...(config || {}),
    };

    // 检查配置文件是否存在
    if (!existsSync(configFile)) {
      logger.warn(`can not find config file from ${configFile}`);
      return;
    }
    // 记录配置文件所处路径
    this.configDir = resolve(configFile, "../");

    this.init();
  }

  init() {
    const { input, ignore } = this.config;
    this.matchedFiles = glob.sync(input, {
      cwd: this.configDir,
      absolute: true,
      onlyFiles: true,
      ignore,
    });

    let templatePath = "";
    // 如果模板路径是绝对路径，则直接使用
    if (isAbsolute(this.config.template)) {
      templatePath = this.config.template;
    } else {
      // 否则根据配置文件所处路径查找模板文件
      templatePath = resolve(this.configDir, this.config.template);
    }

    if (!existsSync(templatePath)) {
      logger.warn(`template not found: ${templatePath}`);
      return;
    }
    this.templateContent = readFileSync(templatePath, {
      encoding: "utf-8",
    });
  }

  start() {
    const { outputDir } = this.config;
    const { configDir } = this;
    const handlebarTemplate = handlebars.compile(this.templateContent);

    this.matchedFiles.forEach((filepath) => {
      const jsDocs = readJsDoc(filepath);
      const templateContext = jsDocs.map(formatJsDocSchema);
      this.contentMapping[filepath] = jsDocs;

      // 当前文件路径与文档输出根目录的相对路径
      let configDirRelativePath = relative(configDir, filepath);

      // 获取与`config.input`匹配部分的路径，并将其转换为相对路径
      const matched = micromatch.capture(this.config.input, configDirRelativePath);
      if (Array.isArray(matched)) {
        configDirRelativePath = [ "." ].concat(matched).join("/").replace(/\/\//, "/");
      }

      // 文档根目录 + 文档路径 + 相对路径 + .md
      const outputFilePath = `${resolve(configDir, outputDir, configDirRelativePath)}.md`;

      this.outputContentMapping[outputFilePath] = templateContext.map((context) => handlebarTemplate(context)).join("\n\n");
    });

    const outputPath = resolve(configDir, outputDir);
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true });
    }

    this.output();
  }

  output() {
    Object.entries(this.outputContentMapping).forEach(([filepath, content]) => {
      const dir = dirname(filepath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      if (content.trim()) {
        writeFileSync(filepath, content.trim(), {
          encoding: "utf-8",
        });
      }
    });

    logger.success("✔ Document generated successfully!");
  }
}

/**
 * @description 读取文件内容，解析jsdoc。如果是ts文件，会转换成js文件。
 * @param { string } input 文件路径
 * @returns { JsDocSchema[] } jsdoc结构数组
 */
export const readJsDoc = (input: string) => {
  if (!existsSync(input)) {
    logger.warn(`File not found: ${input}`);
    return [];
  }

  let fileContent = readFileSync(input, { encoding: "utf-8" });

  // jsdoc无法识别ts，所以需要将ts转换为js
  if (input.endsWith(".ts")) {
    fileContent = transpile(fileContent);
  }
  const res: JsDocSchema[] = JsDocApi.explainSync({
    source: fileContent,
  });

  return res.filter((t) => t.comment && t.ignore !== true);
};

const joinWithDivider = (type: string[]) => {
  if (!type || type.length === 0) return "";
  const len = type.length;
  if (len === 1) return type[0];
  let result = "";
  type.forEach((t, index) => {
    if (index !== len - 1) {
      result += `${t} | `;
    }
    result += t;
  });
  return result;
};

export const formatJsDocSchema = (schema: JsDocSchema): TemplateContext => {
  const { params = [], examples = [] } = schema;
  const returns = (schema.returns || []).map((r) => {
    return {
      ...r,
      type: joinWithDivider(r.type?.names),
    };
  });

  return {
    ...schema,
    params: params.map((param) => {
      return {
        ...param,
        type: joinWithDivider(param.type?.names),
      };
    }),
    returns: {
      type: joinWithDivider(returns.map((r) => r.type)),
      description: joinWithDivider(returns.map((r) => r.description)),
    },
    examples: examples.join("\n"),
  };
};
