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

## 添加文章

```bash
cd blog
npm run new "我的第一篇文章"     # 生成 source/_posts/我的第一篇文章.md
npm run dev                      # 本地预览 http://localhost:4000
```

写完 `git add source/_posts && git commit && git push`，Cloudflare 会自动重新构建。

文章开头的 front matter（`---` 之间的部分）常用字段：

| 字段 | 说明 |
| --- | --- |
| `title` | 标题 |
| `date` | 发布时间，`YYYY-MM-DD HH:mm:ss` |
| `updated` | 更新时间，可选 |
| `categories` / `category` | 分类，数组或单个值 |
| `tags` / `tag` | 标签，数组或单个值 |
| `description` | 摘要，同时用于 SEO/分享卡片 |
| `cover` / `banner` | 文章顶部大图；`thumbnail: false` 可关掉列表缩略图 |
| `sticky: true` | 置顶到首页 |
| `comments: false` | 单篇关闭评论 |
| `copyright` / `license` | 版权开关与协议 |

文章 URL 由 `_config.yml` 的 `permalink: :year/:month/:day/:title/` 决定，`:title` 取文件名（改标题请同时改文件名或 front matter 里的 `permalink`）。

图片建议放在 `blog/source/images/`，正文里用 `![说明](/images/xxx.jpg)` 引用。**不要**放进仓库根目录的 `source/`——那是主题资源目录，会被同步进 `themes/redefine`。

归档（`/archives`）、分类（`/categories`）、标签（`/tags`）三个页面已在 `source/` 下建好，导航栏链接在 `_config.redefine.yml` 的 `navbar.links` 里，可自行增删。

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
