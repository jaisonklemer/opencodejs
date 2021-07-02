const fs = require("fs-extra");
const globals = require("./globals");
const chalk = require("chalk");
const path = require("path");
class ThemeConfig {
  static load() {
    this.config = {};
    try {
      // console.log(path.join(globals.currentDir, "config.json"));
      this.config = require(path.join(globals.currentDir, "config.json"));
    } catch (error) {
      return this.config;
    }
    return this.config;
  }

  static check() {
    var configFile = fs.existsSync(
      path.join(globals.currentDir, "config.json")
    );
    return configFile;
  }

  static themePath() {
    if (this.config == {}) {
      this.logError();
      process.exit();
    } else {
      return this.config.theme_id
        ? `/api/themes/${this.config.theme_id}/assets`
        : `/api/themes/assets`;
    }
  }

  static configure(args) {
    const [api_key, pass, theme_id] = args;
    fs.writeFileSync(
      path.join(globals.currentDir, "config.json"),
      `{"api_key": "${api_key}", "password": "${pass}", "theme_id": "${theme_id}"}`
    );
  }

  static logError({
    msg = "Config file not set. Execute opencodejs -c API_KEY PASS THEME_ID",
  }) {
    console.log(chalk.red(msg));
  }
}

module.exports = ThemeConfig;
