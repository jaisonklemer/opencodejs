#!/usr/bin/env node

const { program } = require("commander");
const { list, getAllAssets, downloadFiles, fileWatcher } = require("./base");
const ThemeConfig = require("./config");

// ThemeConfig.load();

program.version("1.0.0");

program
  .option("-w, --watch", "watch for file change")
  .option("-l, --list", "list all themes")
  .option("-d, --download", "download all theme files")
  .option(
    "-c, --configure",
    "Setting up config file\n\n Usage: opencodejs -c API_KEY PASS THEME_ID\n"
  );

program.parse(process.argv);

const options = program.opts();
const args = program.args;

if (options.list) {
  list();
}

if (options.configure) {
  ThemeConfig.configure(args);
}

if (options.assets) {
  getAllAssets();
}

if (options.download) {
  downloadFiles();
}

if (options.watch) {
  fileWatcher();
}
