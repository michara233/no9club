// 部署前自检，挡住两类会让 Cloudflare Pages 部署失败的问题：
//   1) 单个文件超过 25 MiB（Cloudflare Pages 硬上限，超出后构建成功但部署校验报错）
//   2) 页面渲染成了空文件（Hexo 渲染出错时只打 ERROR 日志，退出码仍然是 0）
//
// 由 npm run build 在 hexo generate 之后自动调用。

import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SIZE_LIMIT = 25 * 1024 * 1024; // Cloudflare Pages: 25 MiB per file
const RENDERED_EXTENSIONS = [".html", ".xml", ".json"];

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public");

const walk = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
};

const tooBig = [];
const emptyPages = [];

for (const file of walk(publicDir)) {
  const size = statSync(file).size;
  const relativePath = relative(publicDir, file).replaceAll("\\", "/");

  if (size > SIZE_LIMIT) {
    tooBig.push({ relativePath, size });
  } else if (
    size === 0 &&
    RENDERED_EXTENSIONS.some((extension) => relativePath.endsWith(extension))
  ) {
    emptyPages.push(relativePath);
  }
}

if (tooBig.length > 0) {
  console.error(
    `\n[check-output-size] 有文件超过 Cloudflare Pages 的单文件上限 25 MiB，部署会失败：`,
  );
  for (const { relativePath, size } of tooBig) {
    console.error(`  ${(size / 1024 / 1024).toFixed(1)} MB  ${relativePath}`);
  }
  console.error(
    `\n这类大附件请放到 GitHub Releases 或网盘，再把文章里的链接改成对应地址，不要放在 blog/source/ 下。\n`,
  );
}

if (emptyPages.length > 0) {
  console.error(`\n[check-output-size] 以下页面渲染成了 0 字节，说明构建时有渲染错误：`);
  for (const relativePath of emptyPages) {
    console.error(`  ${relativePath}`);
  }
  console.error(`\n请检查构建日志里的 ERROR 行（常见原因是 _config.redefine.yml 里留了空的分区键）。\n`);
}

if (tooBig.length > 0 || emptyPages.length > 0) {
  process.exit(1);
}

console.log(`[check-output-size] OK：没有超过 25 MiB 的文件，也没有空页面。`);
