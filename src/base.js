const { default: axios } = require("axios");
const fs = require("fs-extra");
const chalk = require("chalk");
const globals = require("./globals");

const ThemeConfig = require("./config");

const config = ThemeConfig.load();

const options = {
  headers: {
    Authorization: `Token token=${config.api_key}_${config.password}`,
  },
};

const api = axios.create({
  baseURL: "https://opencode.tray.com.br",
  headers: options.headers,
});

async function list() {
  if (ThemeConfig.check() == false) {
    ThemeConfig.logError();
    process.exit();
  }

  var response = await api.get(`/api/list${globals.defaultQuery}`);

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

async function getAllAssets() {
  var url = ThemeConfig.themePath() + globals.defaultQuery;

  const response = await api.get(url, options);
  return response.data;
}

async function downloadFiles() {
  if (ThemeConfig.check() == false) {
    ThemeConfig.logError();
    process.exit();
  }
  var assets = await getAllAssets();

  for (i = 0; i < assets["assets"].length; i++) {
    await downloadFile(assets["assets"][i]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function downloadFile(asset) {
  var url =
    ThemeConfig.themePath() + globals.defaultQuery + `&key=${asset.path}`;

  var fileAsset = await api.get(url);

  var fileOutput = process.cwd() + asset.path;

  if (fileAsset.data.content) {
    var content = Buffer.from(fileAsset.data.content, "base64");
    fs.outputFileSync(fileOutput, content);
  }

  console.log(chalk.green(`[DOWNLOAD] ${asset.path} - OK`));
  return true;
}

module.exports = { list, getAllAssets, downloadFiles };
