import fs from "fs";
import path from "path";

import archiver from "archiver";
import Yml from "yml";

const root = path.resolve("./");

const pluginInfo = Yml.load(`${root}/public/reearth.yml`);
const filename = `${pluginInfo.id}-${pluginInfo.version}.zip`;

fs.copyFileSync(`${root}/README.md`, `${root}/dist/plugin/README.md`);
fs.copyFileSync(`${root}/LICENSE`, `${root}/dist/plugin/LICENSE`);

const output = fs.createWriteStream(`${root}/package/${filename}`);
const archive = archiver("zip", { zlib: { level: 9 } });

archive.pipe(output);

archive.directory(`${root}/dist/plugin/`, false);

archive.finalize();
