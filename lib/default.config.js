const root = require("app-root-path");
const path = require("path");

module.exports = {
  entry: path.resolve(root.path, "./transtring.entry.js"),
  imageBaseUrl: path.resolve(root.path, "./images"),
  lang: "eng+chi_sim"
};
