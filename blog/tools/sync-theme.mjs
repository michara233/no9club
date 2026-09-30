// 把仓库根目录里的主题文件同步到 blog/themes/redefine。
//
// 主题源码始终只保留在仓库根目录（方便继续合并上游 hexo-theme-redefine），
// Hexo 需要主题位于 themes/<name>/ 下，所以在每次构建前做一次同步。
// Cloudflare Pages 的 Build command 用的是 `npm run build`，会自动执行本脚本。

import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const blogDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const themeSource = resolve(blogDir, "..");
const themeTarget = join(blogDir, "themes", "redefine");

// package.json 也被主题脚本 require（读取版本号），必须一并同步。
const THEME_ENTRIES = [
  "_config.yml",
  "package.json",
  "layout",
  "source",
  "scripts",
  "languages",
];

rmSync(themeTarget, { recursive: true, force: true });
mkdirSync(themeTarget, { recursive: true });

for (const entry of THEME_ENTRIES) {
  cpSync(join(themeSource, entry), join(themeTarget, entry), {
    recursive: true,
  });
}

console.log(`[sync-theme] ${themeSource} -> ${themeTarget}`);
