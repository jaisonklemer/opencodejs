const { default: axios } = require("axios");
const fs = require("fs-extra");
const chalk = require("chalk");
const globals = require("./globals");
const Watcher = require("chokidar");

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
    console.log(
      chalk.green(
        `[${i + 1}/${assets["assets"].length}] ${assets["assets"][i].path} - OK`
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
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

  return true;
}

function fileWatcher() {
  if (ThemeConfig.check() == false) {
    ThemeConfig.logError();
    process.exit();
  }

  Watcher.watch(".", { ignored: "config.json", ignoreInitial: true }).on(
    "all",
    (event, path) => {
      // console.log(path);
      checkFileName(path);
    }
  );

  console.log(chalk.yellow("[INFO] File watcher is running..."));
}

function checkFileName(filePath) {
  fileName = filePath.split("/");
  fileName = fileName[fileName.length - 1];

  if (fileName.match(globals.fileNameRegex)) {
    uploadFile(filePath);
  }
}

function uploadFile(file) {
  var data = { key: `/${file}` };

  var content = fs.readFileSync(file);
  content = Buffer.from(content).toString("base64");

  Object.assign(data, { value: content, gem_version: "2.0.0" });

  var url = ThemeConfig.themePath();

  console.log(chalk.blue(`[UPLOAD] Uploading file ${data.key}`));
  api
    .put(url, data)
    .then((response) => {
      console.log(chalk.green(`[SUCCESS] File ${data.key} uploaded!`));
    })
    .catch((error) => {
      console.log(chalk.red(`[ERROR] ${error.response.data.message}`));
    });
}

module.exports = { list, getAllAssets, downloadFiles, fileWatcher };
