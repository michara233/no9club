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

## 换头像 / 图标 / 其它图片

1. 把图片放进 `blog/source/images/`（构建时原样发布到 `/images/...`）。
2. 在 `blog/_config.redefine.yml` 里把对应配置指向它，路径写成 `/images/文件名`。

| 想改什么 | 配置项 | 主题默认值 |
| --- | --- | --- |
| 站点头像（首页侧栏、文章页作者栏） | `defaults.avatar` | `/images/redefine-avatar.svg` |
| 浏览器标签页图标 | `defaults.favicon` | `/images/redefine-favicon.svg` |
| 导航栏 logo | `defaults.logo` | 空（不显示） |
| 首页横幅大图 | `home_banner.image.light` / `.dark` | `wallhaven-wqery6-*.webp` |
| 分享卡片默认图 | `global.open_graph.image` | `/images/redefine-og.webp` |
| 文章封面 | 文章 front matter 的 `cover` / `banner` | 无 |
| 文章作者头像 | 文章 front matter 的 `avatar` | 无 |

例如换头像和 favicon：

```yaml
defaults:
  avatar: /images/avatar.png
  favicon: /images/favicon.png
```

`blog/_config.redefine.yml` 里已经把这些项写成注释了，取消注释改路径即可。

注意：

- 图片不要放进仓库根目录的 `source/`，那是主题资源目录（会被同步进 `themes/redefine`，也会被上游更新覆盖）。主题自带的默认图在那里，仅作参考。
- 改完 push 等 Cloudflare 重新构建；如果浏览器还显示旧图，按 `Ctrl+F5` 强刷（图片被 Cloudflare 边缘缓存时可能要等几分钟）。
- 图片路径必须是 `/images/...` 这种以 `/` 开头的站点绝对路径，不要带 `public`、也不要写相对路径。

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
- 在 `_config.redefine.yml` 里不要留「只写键名、子项全被注释」的空分区（例如孤零零一行 `defaults:`）：它会把主题对应的整段配置覆盖成 `null`，页面直接渲染失败。要么整段注释掉，要么至少留一个子项。
- **注意 Hexo 的退出码不可信**：页面渲染出错时它只打印 `ERROR`，退出码仍然是 0。改完配置后除了看构建日志的 ERROR，还要确认产物不是空文件：

  ```bash
  node node_modules/hexo-cli/bin/hexo generate 2>&1 | grep -i error   # 应为空
  ls -l public/index.html                                            # 不应为 0 字节
  ```

- `npm run build` 最后会跑 `tools/check-output-size.mjs` 自检：单个文件超过 25 MiB 或页面渲染成 0 字节都会直接让构建失败并打印原因，这样就不用等 Cloudflare 那边报错（Cloudflare 的报错在最后一步，信息比较绕）。

## 大附件 / 提供下载

**Cloudflare Pages 单个文件上限 25 MiB（硬限制，不能通过配置放宽）**，超出会构建成功但部署校验失败：

```
Error: Pages only supports files up to 25 MiB in size
  dowload/咩.zip is 27.7 MiB in size
```

所以大文件不要放进 `blog/source/`，建议：

1. 上传到 **GitHub Releases**（单文件最大 2 GiB）：仓库页面 → Releases → Draft a new release → 新建一个固定 tag（例如 `downloads`）→ 把附件拖进去 → Publish release，然后用 `https://github.com/<用户名>/<仓库名>/releases/download/<tag>/<文件名>` 作为文章里的下载链接。
2. 或者用网盘 / 对象存储（Cloudflare R2、阿里云 OSS 等），直接把分享链接写进文章。

`blog/.attachments/` 是本地暂存目录（已 gitignore），放还没上传的大文件，不会被提交也不会进构建产物。

已经误提交过的大文件会永久留在 git 历史里；在意仓库体积的话可以用 `git filter-repo` 清理，但那要重写历史并强制推送，一般不值得。
