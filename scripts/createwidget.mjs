import fs from "fs";
import path from "path";
import { exit } from "process";

import YAML from "json-to-pretty-yaml";
import Yml from "yml";

const root = path.resolve("./");

const widgetId = process.argv.splice(2)[0];

if (!widgetId) {
  console.log(
    "\x1B[31m%s\x1B[0m",
    "Please provide the widget id you want to create."
  );
  exit();
}

const pluginInfo = Yml.load(`${root}/public/reearth.yml`);
if (!pluginInfo) {
  console.log("\x1B[31m%s\x1B[0m", "Can't load reearth.yml.");
  exit();
}

if (pluginInfo.extensions.find((e) => e.id === widgetId)) {
  console.log("\x1B[31m%s\x1B[0m", "WidgetId already exists.");
  exit();
}

// add into yml
pluginInfo.extensions.push({
  id: widgetId,
  type: "widget",
  name: widgetId,
});

fs.writeFileSync(
  `${root}/public/reearth.yml`,
  YAML.stringify(pluginInfo).replace(/"/g, "")
);

// add config
const configWeb = fs
  .readFileSync(`${root}/vite.config.starter-web.ts`, { encoding: "utf-8" })
  .replace("starter", widgetId);

fs.writeFileSync(`${root}/vite.config.${widgetId}-web.ts`, configWeb);

const configPlugin = fs
  .readFileSync(`${root}/vite.config.starter.ts`, { encoding: "utf-8" })
  .replace("starter", widgetId);

fs.writeFileSync(`${root}/vite.config.${widgetId}.ts`, configPlugin);

// add web
if (!fs.existsSync(`${root}/web/components/pages/${widgetId}`)) {
  fs.mkdirSync(`${root}/web/components/pages/${widgetId}`);
}

["app.css", "App.tsx", "index.html", "main.tsx"].forEach((webFile) => {
  fs.writeFileSync(
    `${root}/web/components/pages/${widgetId}/${webFile}`,
    fs
      .readFileSync(`${root}/web/components/pages/starter/${webFile}`, {
        encoding: "utf-8",
      })
      .replace("starter", widgetId)
      .replace("Starter", widgetId)
  );
});

// add plugin
fs.writeFileSync(
  `${root}/src/widgets/${widgetId}.ts`,
  fs
    .readFileSync(`${root}/src/widgets/starter.ts`, {
      encoding: "utf-8",
    })
    .replace("starter", widgetId)
    .replace("Starter", widgetId)
);

console.log(
  "\x1B[36m%s\x1B[0m",
  "Create finished. You need to add script in package.json manually."
);
