const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const t = require("babel-types");
const traverse = require("babel-traverse").default;
const config = require("./transtrc-config");

function extract(content) {
  const newContent = formatContent(content);

  try {
    const ast = babylon.parse(newContent, {
      sourceType: "module"
    });
    return extractItems(ast);
  } catch {
    console.warn(
      "format error: please refer to example, one line one sentence"
    );
    return false;
  }
}

function formatContent(content) {
  const data = content
    .split("\n")
    .filter(item => !/[\f|\n|\t|\v]$/.test(item) && item)
    .map(item => {
      if (item.endsWith(";")) {
        item = item.substring(0, item.length - 1);
      }
      item = item.replace(/^(\"|\')|(\"|\')$/g, "");
      return { item: item };
    });

  return `const data = ${JSON.stringify(data)}`;
}

function extractItems(ast) {
  let nodes = [];
  traverse(ast, {
    ObjectProperty: ({ node }) => {
      if (node.value.type === "StringLiteral") {
        nodes.push(node.value.value);
      }
    }
  });
  return nodes;
}

module.exports = extract;
