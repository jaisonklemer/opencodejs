const { default: axios } = require("axios");
const fs = require("fs");
const chalk = require("chalk");
const config = require("../config.json");
const Downloader = require("nodejs-file-downloader");

const API_URL = "https://opencode.tray.com.br";

const path = process.cwd();

const themePath = config.theme_id
  ? `/api/themes/${config.theme_id}/assets`
  : `/api/themes/assets`;
var query = `?gem_version=2.0.0`;

const options = {
  headers: {
    Authorization: `Token token=${config.api_key}_${config.password}`,
  },
};

async function list() {
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

async function getAllAssets() {
  var url = API_URL + themePath + query;
  const response = await axios.get(url, options);
  return response.data;
}

async function getAsset(asset) {
  downloadFile(response.data["assets"][0]);
}

async function downloadFiles() {
  var assets = await getAllAssets();
  assets["assets"].forEach((file) => {
    downloadFile(file);
  });
}

async function downloadFile(asset) {
  var url = API_URL + themePath;
  query = query + `&key=${asset.path}`;
  var filePath = "/" + asset.path.split("/")[1];

  var fileAsset = await axios.get(url + query, options);
  var currentPath = process.cwd() + filePath;

  if (fileAsset.data.content) {
    var content = Buffer.from(fileAsset.data.content, "base64");
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
  fs.writeFileSync(currentPath + "/" + asset.name, content, { flag: "wx" });

  console.log(chalk.green(`[DOWNLOAD] ${asset.path} - OK`));
}

module.exports = { list, configure, getAllAssets, downloadFiles };
