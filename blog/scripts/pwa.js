"use strict";

// 让站点可以"安装"为手机 App（PWA）：
//   1. 往每个页面的 <head> 注入 manifest、主题色、iOS 图标等标签；
//   2. 往 </body> 注入 Service Worker 注册脚本（负责离线与缓存）。
//
// 用 Hexo 核心的 injector 实现，不改主题模板，所以将来合并上游主题不会冲突。
// 相关文件：blog/source/manifest.webmanifest、blog/source/sw.js、
//          blog/source/images/pwa-icon-*.png

const MANIFEST_PATH = "/manifest.webmanifest";
const SERVICE_WORKER_PATH = "/sw.js";
const APPLE_TOUCH_ICON = "/images/pwa-icon-180.png";
const THEME_COLOR = "#E01B2E";

const HEAD_SNIPPET = `
    <link rel="manifest" href="${MANIFEST_PATH}">
    <meta name="theme-color" content="${THEME_COLOR}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="No9Club">
    <link rel="apple-touch-icon" sizes="180x180" href="${APPLE_TOUCH_ICON}">
`;

const BODY_SNIPPET = `
<script data-pwa-register>
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("${SERVICE_WORKER_PATH}").catch(function (error) {
        console.warn("[pwa] Service Worker 注册失败：", error);
      });
    });
  }
</script>
`;

hexo.extend.injector.register("head_end", HEAD_SNIPPET);
hexo.extend.injector.register("body_end", BODY_SNIPPET);
