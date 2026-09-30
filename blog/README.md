# no9club 博客站点

这个目录是 Hexo 站点本体，主题是本仓库根目录里的 `hexo-theme-redefine`（fork）。

主题源码不做复制、只保留在仓库根目录，构建前由 `tools/sync-theme.mjs` 同步到 `blog/themes/redefine`（同步目录已加入 `.gitignore`），这样以后还能继续合并上游主题更新。

## 目录速览

| 路径 | 作用 |
| --- | --- |
| `_config.yml` | Hexo 站点配置（标题、语言、URL、分页、`theme: redefine`） |
| `_config.redefine.yml` | 主题配置覆盖，站点标题/作者/导航栏等个性化设置写这里 |
| `source/_posts/` | 文章 Markdown |
| `scaffolds/` | `hexo new` 用的文章模板 |
| `tools/sync-theme.mjs` | 把根目录主题同步进 `themes/redefine` |
| `public/` | 构建产物（已忽略提交） |

## 本地使用

```bash
cd blog
npm install
npm run dev        # 本地预览 http://localhost:4000
npm run new "标题"  # 新建文章
npm run build      # 生成静态站点到 public/
```

## Cloudflare Pages 部署设置

| 设置项 | 值 |
| --- | --- |
| Root directory（根目录） | `blog` |
| Build command（构建命令） | `npm run build` |
| Build output directory（输出目录） | `public` |

不需要环境变量。构建时使用的 Node 版本是 Cloudflare 默认的 22.x。

部署完成后，把 `blog/_config.yml` 和 `blog/_config.redefine.yml` 里的 `url` 改成正式域名（例如 `https://no9club.pages.dev` 或你自己的域名），否则文章里的绝对链接和 RSS 会指向错误地址。

## 说明

- 主题需要 `hexo-wordcount`（字数统计）和 `hexo-generator-feed`（RSS），已列入 `dependencies`。
- 如果要开启本地搜索，需要额外安装 `hexo-generator-searchdb`，并在 `_config.redefine.yml` 里把 `navbar.search.enable` 设为 `true`。
- 如果 `themes/redefine` 目录看起来缺失，这是正常的：它是构建时生成的，运行 `npm run sync-theme` 即可重建。
