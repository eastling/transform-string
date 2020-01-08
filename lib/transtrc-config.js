"use strict";

const path = require("path");
const fs = require("fs");
const root = require("app-root-path");

const defaultConfig = require("./default.config.js");

const TRANSTR_CONFIG_NAME = ".transtr-config.js";

const customConfigPath = path.join(root.path, TRANSTR_CONFIG_NAME);

let customConfig;

try {
  fs.accessSync(customConfigPath, fs.R_OK);

  customConfig = require(customConfigPath);
} catch (err) {
  customConfig = {};
}

const transtrConfig = Object.assign({}, defaultConfig, customConfig);

module.exports = transtrConfig;
