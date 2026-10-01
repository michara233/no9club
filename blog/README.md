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

## 文章里插入图片

两种写法都实测可用，挑一种顺手的固定用就行。

### 写法一：图片统一放站点目录（最简单）

1. 图片放进 `blog/source/images/`，例如 `blog/source/images/screenshot.png`。
2. 文章里写**以 `/` 开头的绝对路径**：

```markdown
![截图说明](/images/screenshot.png)
```

`/images/...` 是从站点根目录算起的，不要写 `./`，也不要带 `public`。

### 写法二：每篇文章一个资源文件夹（图片多时更整齐）

`blog/_config.yml` 里已经配好：

```yaml
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true
```

用法：`npm run new "文章标题"` 会同时生成 `source/_posts/文章标题/` 目录，把图片丢进去，正文里直接写文件名：

```markdown
![截图说明](screenshot.png)
```

构建后图片会被复制到 `public/2026/09/30/文章标题/screenshot.png`，页面引用的就是这个路径。

**注意**：`post_asset_folder` 只对**相对路径**生效。如果图片不在该文章的资源文件夹里，写 `![x](screenshot.png)` 会被渲染器改写成 `/screenshot.png`（去站点根目录找），结果是 404——相对路径只配合资源文件夹使用，其它情况一律用 `/images/...`。

### 细节开关

| 想调整 | 配置项（写在 `blog/_config.redefine.yml`） |
| --- | --- |
| 图片圆角 | `articles.style.image_border_radius`（默认 `14px`） |
| 图片对齐 | `articles.style.image_alignment`（`center` / `left`） |
| 显示图片说明（取 alt 文字） | `articles.style.image_caption: true` |
| 关闭图片懒加载 | `articles.lazyload: false` |

- 文章里的图片默认**点击可放大**（主题自带查看器），不用额外配置。
- 文章封面用 front matter：`cover: /images/cover.jpg`；`thumbnail: false` 可以关掉首页列表里的缩略图。
- 图片别太大：超过 25 MiB 会被 `tools/check-output-size.mjs` 拦下（Cloudflare Pages 单文件上限），而且大图会永久留在 git 历史里、拖慢国内访问。建议压到 200 KB 以内、宽度 1600px 左右，格式优先 WebP。

## 文章作者信息

默认每篇文章都显示全站作者（`blog/_config.redefine.yml` 的 `info.author`）。想让某篇文章署名不同的人，在它的 front matter 里写：

```yaml
---
title: 某位学长的作品
date: 2026-09-30 23:00:00
author: 张三
avatar: /images/zhangsan.png   # 可选，这一篇单独用这个头像
---
```

- **`author` 请用字符串写法**。主题也支持 `author: {name: 张三, avatar: xxx}` 这种对象写法，作者名和头像能正常显示，但会有一个副作用：`<meta property="article:author">` 会变成 `[object Object]`（`layout/components/header/head.ejs` 把对象直接交给了 Hexo 的 `open_graph` 助手）。想单独换头像就用上面的 `avatar:` 键——`page.avatar` 的优先级高于全站头像 `defaults.avatar`。
- 显示位置：文章头部的作者栏、文末版权模块的「作者」一行、以及分享卡片的作者。
- 作者栏只在 `info.author` 或站点 `author` 有值时才出现（当前两者都有值，所以一直显示）。
- 想加「楼主 / Lv1」这类作者标签：`articles.author_label`（`enable`、`auto` 按发文数自动分级、`list` 自定义标签列表）。

## 站点身份 / SEO / 页脚

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题、语言、URL、`<meta name="description">`、keywords | `blog/_config.yml` 的 `title` / `subtitle` / `description` / `keywords` / `url` |
| 导航栏和页脚显示的名字、副标题 | `blog/_config.redefine.yml` 的 `info.title` / `info.subtitle` / `info.author` |
| 首页横幅大标题、副标题 | `blog/_config.redefine.yml` 的 `home_banner.title` / `home_banner.subtitle.text`（默认标题是主题的 "Theme Redefine"） |
| 分享卡片的描述、配图 | `global.open_graph.description` / `global.open_graph.image` |
| 页脚"博客已运行 X 天"的起算时间 | `footer.start`（默认是主题作者的 `2022/8/17`，一定要改成自己的） |
| 备案号（国内服务器才需要） | `footer.icp` |

页脚那行"主题 Redefine v2.9.0"是主题作者要求保留的署名，写死在 `layout/components/footer/footer.ejs`（模板里有注释说明），不在配置项里，建议保留。

## Cloudflare Pages 部署设置

| 设置项 | 值 |
| --- | --- |
| Root directory（根目录） | `blog` |
| Build command（构建命令） | `npm run build` |
| Build output directory（输出目录） | `public` |

不需要环境变量。构建时使用的 Node 版本是 Cloudflare 默认的 22.x。

部署完成后，把 `blog/_config.yml` 和 `blog/_config.redefine.yml` 里的 `url` 改成正式域名（例如 `https://no9club.pages.dev` 或你自己的域名），否则文章里的绝对链接和 RSS 会指向错误地址。

## 站内搜索

主题自带**本地搜索**（纯前端，不需要第三方服务，读者也不用登录），已开启：

| 部分 | 在哪 | 说明 |
| --- | --- | --- |
| 索引文件 | `blog/_config.yml` 的 `search:` 段 | `hexo-generator-searchdb` 生成 `public/search.json`；`path` 必须和下面主题请求的路径一致 |
| 搜索 UI | `blog/_config.redefine.yml` 的 `navbar.search` | `enable: true` 开启（导航栏出现搜索图标，点开是弹窗）；`preload: true` 表示页面加载时预取索引，文章多了想省流量可改 `false` |

索引内容由 `content: true` / `format: striptags` 控制：收录标题和纯文本正文，所以搜正文关键词也能命中。

注意：

- 只有**已发布**的文章会进索引：`published: false`、`source/_drafts/` 里的草稿都不收录。
- 加密文章（front matter 写 `password`）的正文不会以明文出现在索引里（主题在生成索引前就加密了正文），所以搜不到它的内容——这是符合预期的。
- 文章多了以后 `public/search.json` 会变大（几十篇通常几百 KB），配合 `preload: false` 更省流量。

## 装成手机 App（PWA）

站点已经按 PWA 配好：手机浏览器访问后可以"添加到主屏幕"，之后像 App 一样全屏运行、有独立图标，断网也能看到已缓存的页面。

| 文件 | 作用 |
| --- | --- |
| `blog/source/manifest.webmanifest` | 应用名、图标、启动方式（`display: standalone`）、主题色 |
| `blog/source/sw.js` | Service Worker：页面网络优先、静态资源"先用缓存后台更新"，断网回退缓存 |
| `blog/source/images/pwa-icon-{180,192,512}.png`、`pwa-icon-maskable-512.png` | 图标（由头像缩放生成；maskable 那张带品牌底色，适配安卓的自适应图标） |
| `blog/scripts/pwa.js` | 用 Hexo 的 injector 往每个页面注入 manifest、主题色、iOS 图标标签和 SW 注册脚本（不改主题模板） |

安装方式：

- **安卓 Chrome**：菜单里会出现「安装应用 / 添加到主屏幕」（部分版本会自动弹提示）。
- **iOS Safari**：点「分享」→「添加到主屏幕」（iOS 不会自动提示安装；图标用的是 `pwa-icon-180.png`）。
- PWA 需要 HTTPS，Cloudflare Pages 自带，`http://localhost:4000` 本地预览也算安全上下文。

维护要点：

- 改了缓存策略、或想强制所有访客刷新缓存：把 `blog/source/sw.js` 里的 `VERSION` 加一（旧缓存会自动清理）。
- 换图标：直接替换 `blog/source/images/pwa-icon-*.png` 四个文件即可（尺寸 180 / 192 / 512 / 512）。
- 改 App 名称、起始页、主题色：改 `blog/source/manifest.webmanifest`；`theme-color` 与 iOS 的标题还在 `blog/scripts/pwa.js` 里，两处保持一致。
- 静态资源是"先用缓存、后台更新"，所以发版后极少数访客可能第一次打开看到旧样式，刷新一次即最新。

想要能装到手机上的**独立安装包（APK）**：PWA 是前提，接着可以用 [PWABuilder](https://www.pwabuilder.com/)（网页版，输入站点地址就能生成安卓包）或 Bubblewrap 打包；iOS 上架需要 Mac + Apple 开发者账号，国内分发还需注意 App 备案要求。

## 说明

- 主题需要 `hexo-wordcount`（字数统计）、`hexo-generator-feed`（RSS）和 `hexo-generator-searchdb`（站内搜索），都已列入 `dependencies`。
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

所以大文件不要放进 `blog/source/`，要放到站外再在文章里链接。**读者主要在国内，所以优先用国内对象存储**（GitHub Releases 国内下载很慢，只适合海外读者）：

### 推荐：腾讯云 COS / 阿里云 OSS（国内最快，链接永久）

以腾讯云 COS 为例：

1. 注册并完成实名认证（微信扫码即可），开通 COS（按量计费，开通不需要预充值）。
2. 新建存储桶（Bucket）：地域选离读者近的（如广州/上海），**访问权限选「公有读私有写」**（否则直链会 403）。
3. 进入桶 → 上传文件（控制台直接拖上去即可）→ 上传后对象的访问权限确认是「公有读」。
4. 复制对象的访问地址，形如：
   `https://<桶名>-<APPID>.cos.<地域>.myqcloud.com/mie.zip`
   把这行粘到文章的 `<a href="...">` 里即可（`pages.dev` 的博客链接到它没有任何跨域问题）。
5. 成本与防护：存储约 ¥0.1/GB/月，外网下行流量约 ¥0.5/GB（以官网价格为准）；27MB 被下载 1000 次 ≈ 十几元。建议顺便设置：
   - **防盗链**（只允许自己的博客域名 + 空 Referer 访问）；
   - **用量告警**（防止被人刷流量）。

阿里云 OSS 步骤基本一致，直链形如 `https://<桶名>.oss-<地域>.aliyuncs.com/mie.zip`。用云厂商自带的默认域名**不需要备案**；只有绑定自己的域名（如 `dl.no9club.xxx`）才需要。

### 备选

- **蓝奏云（当前使用）**：免费、下载免登录、国内速度快，适合几十 MB 的文件。
  1. 登录 lanzou.com，上传 `blog/.attachments/<文件>`（免费版单个文件上限 100 MB，27 MB 没问题）。
  2. 上传后点「分享」拿到形如 `https://wwxx.lanzouy.com/abcdef` 的链接；可以设提取码，也可以在分享设置里选无密码。
  3. 把链接写进文章的 `<a href="...">`，例如：
     `<a href="https://wwxx.lanzouy.com/abcdef">《咩》——点这里去蓝奏云下载</a>`
     **注意这是分享页面链接，不是直链**：`download` 属性不会生效，读者需要打开页面再点一次「下载」，所以链接文字里最好写清楚。
  4. 稳定性提醒：蓝奏云的分享域名会变（`lanzouy` / `lanzoux` / `lanzouw` …），平台也可能清理文件。重要文件建议另存一份（对象存储或本地），链接挂了只需改文章里那一行。
- **123 云盘 / 钛盘**：同类网盘，上传即用，注意事项与蓝奏云相同。
- **Cloudflare R2**：和博客同属 Cloudflare，免费 10 GB、出网免费，管理统一，但国内速度就是 Cloudflare 边缘的速度，不会比博客本身更快。
- **GitHub Releases**（单文件最大 2 GiB）：管理最省事，但国内下载慢，只建议给海外读者用。
- **拆成 <25 MiB 分卷放站内**：零第三方，但读者要 `copy /b part1+part2 mie.zip` 合并，体验差。

`blog/.attachments/` 是本地暂存目录（已 gitignore），放还没上传的大文件，不会被提交也不会进构建产物。

已经误提交过的大文件会永久留在 git 历史里；在意仓库体积的话可以用 `git filter-repo` 清理，但那要重写历史并强制推送，一般不值得。
