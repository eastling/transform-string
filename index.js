"use strict";

const path = require("path");
const fs = require("fs");

const tesseract = require("node-tesseract-ocr");
const clipboardy = require("clipboardy");
const program = require("commander");

const extract = require("./lib/extract");
const config = require("./lib/transtrc-config");

const { imageBaseUrl, lang } = config;

program
  .option("-r, --rule <name>", "select your rule")
  .option("-f, --file [name]>", "select your file")
  .option("-i, --image <name>", "select your image")
  .parse(process.argv);

const { rule, image, file } = program.opts();

if (!rule) {
  return console.log("please select a rule with -r");
}

let transformFn = null;
try {
  const ruleFile = path.resolve(process.cwd(), rule);
  transformFn = require(ruleFile);
} catch (e) {
  console.log(`can not require fn, ${e}`);
  return;
}

const fileurl = path.resolve(process.cwd(), `${file}`);

let fileContent = "";
try {
  fs.accessSync(fileurl, fs.R_OK);
  fileContent = fs.readFileSync(fileurl, "utf-8");
} catch {
  return console.log(`something wrong when read file ${fileurl}`);
}

run(fileContent);

async function getContentFromImage(content, name) {
  const imageUrl = path.resolve(process.cwd(), `${imageBaseUrl}`, `${name}`);

  const options = {
    lang,
    oem: 1,
    psm: 3
  };

  return await tesseract.recognize(imageUrl, options);
}

async function run(content) {
  if (image) {
    try {
      content = await getContentFromImage(content, image);
    } catch (e) {
      console.log(`tesseract error, please refer to example, ${e}`);
      return;
    }
  }

  const items = extract(content);

  if (items === false) {
    return;
  }

  try {
    const text = transformFn(items);
    clipboardy.writeSync(text);
    console.log("result has copied to clipboard");
  } catch {
    console.log("transtring fail, please try again");
  }
}
