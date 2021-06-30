const { default: axios } = require("axios");
const fs = require("fs");
const chalk = require("chalk");

const API_URL = "https://opencode.tray.com.br";

const path = process.cwd();

async function list() {
  const config = require("../config.json");
  var query = `?gem_version=2.0.0`;
  var options = {
    headers: {
      Authorization: `Token token=${config.api_key}_${config.password}`,
    },
  };

  var response = await axios.get(API_URL + `/api/list${query}`, options);

  response.data["themes"].forEach((theme) => {
    if (theme.published == 0) {
      console.log(
        chalk.red(`ID: ${theme.name}\nNome: ${theme.id}\nStatus: Inativo`)
      );
      console.log(
        chalk.red("================================================")
      );
    } else {
      console.log(
        chalk.green(`ID: ${theme.name}\nNome: ${theme.id}\nStatus: Ativo`)
      );
      console.log(
        chalk.green("================================================")
      );
    }
  });
}

async function configure(args) {
  const [api_key, pass, theme_id] = args;
  fs.writeFileSync(
    path + "/config.json",
    `{"api_key": "${api_key}", "password": "${pass}", "theme_id": "${theme_id}"}`
  );
}

module.exports = { list, configure };
