---
title: Hello no9club
date: 2026-09-30 13:30:00
published: false
tags:
  - 开始
categories:
  - 作品集
---

这是博客的第一篇文章，可以直接删除，也可以留着当作写作模板。

## 新增文章

在 `blog/` 目录下执行：

```bash
npm run new "文章标题"
```

它会用 `blog/scaffolds/post.md` 生成 `blog/source/_posts/文章标题.md`，写完存盘即可。

## 本地预览

```bash
cd blog
npm install      # 第一次需要
npm run dev      # http://localhost:4000
```

`npm run dev` 会先把仓库根目录的主题同步到 `blog/themes/redefine`，再启动 Hexo 本地服务器。

## 站点的样子由哪里决定

- 博客本体（标题、语言、链接格式、每页篇数）：`blog/_config.yml`
- 主题外观（导航栏、配色、首页横幅、评论、插件开关）：`blog/_config.redefine.yml`
- 主题的完整默认值（所有可配置项都在这里）：仓库根目录的 `_config.yml`
<a href="/images/486.jpg" download>486.jpg</a>
