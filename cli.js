#!/usr/bin/env node

const { program } = require("commander");
const { list, configure } = require("./src/base");

program.version("1.0.0");

program
  .option("-w, --watch", "watch for file change")
  .option("-l, --list", "list all themes")
  .option(
    "-c, --configure",
    "Setting up config file\n Usage: opencodejs -c API_KEY PASS THEME_ID\n"
  );

program.parse(process.argv);

const options = program.opts();
const args = program.args;

if (options.list) {
  list();
}

if (options.configure) {
  configure(args);
}
