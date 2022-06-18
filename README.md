<p><center> <img src="https://raw.githubusercontent.com/ckangwen/image-host/main/images/charrue-docs.png" /> </center></p>

## 功能说明

基于JsDoc的文档生成工具。

## 下载
``` bash
npm install @charrue/gen-docs
```

## 使用说明
1. 下载`@charrue/gen-docs`
2. 创建配置文件`charrue.config.ts`
``` ts
import { defineDocsConfig } from "@charrue/gen-docs"

export default defineDocsConfig({
  docs: {
    input: "src/**/*.ts",
    outputDir: "docs",
    template: "docs.hbs",
  }
})
```
3. 设置npm scripts并执行
``` json
"scripts": {
  "docs": "charrue-docs"
}
```

`charrue-docs`默认指定的配置文件路径为`charrue.config.ts`或`charrue.config.js`。
此外可以通过`--config`手动指定配置文件: `charrue-docs --config=./scripts/custom.js`。

### 模板配置说明

TODO