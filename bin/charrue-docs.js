#!/usr/bin/env node
const minimist = require("minimist");
const path = require("path");
const { loadConfig } = require("@charrue/load-config")
const { JsDocApplication } = require("../dist/index.js");

const argv = minimist(process.argv.slice(2));
const configFile = argv.config || "charrue.config.js"
let configName = path.basename(configFile);
const ext = path.extname(configName);
const configPath = path.resolve(process.cwd(), configFile);
if (ext) {
  configName = configName.substring(0, configName.indexOf(ext))
}

loadConfig(configName, { cwd: configPath })
  .then(configResult => {
    if (!configResult) {
      console.error(`Config file ${configPath} not found`)
      process.exit(1)
    }
    const userConfig = configResult.config;
    const userConfigFilePath = configResult.path;
    const app = new JsDocApplication(
      userConfig ? userConfig.docs : null,
      userConfigFilePath
    );
    app.start();
  })



