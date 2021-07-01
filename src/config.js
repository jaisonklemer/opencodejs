const fs = require("fs-extra");
const globals = require("./globals");
const chalk = require("chalk");

class ThemeConfig {
  static load() {
    this.config = {};
    try {
      this.config = require(globals.currentDir + "\\config.json");
    } catch (error) {
      return this.config;
    }
    return this.config;
  }

  static async check() {
    var configFile = await fs.existsSync(globals.currentDir + "\\config.json");
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
      globals.currentDir + "\\config.json",
      `{"api_key": "${api_key}", "password": "${pass}", "theme_id": "${theme_id}"}`
    );
  }

  static logError() {
    console.log(
      chalk.red(
        "Config file not set. Execute opencodejs -c API_KEY PASS THEME_ID"
      )
    );
  }
}

module.exports = ThemeConfig;
