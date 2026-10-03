"use strict";

// 配色切换：NO9 品牌色（默认） ↔ 经典配色（调整配色之前主题自带的那套）
//
// 两套色板的 CSS 变量写在 blog/_config.redefine.yml 的 inject 段里（搜索 data-palette 就能找到）。
// 这里只负责两件事，都不改主题模板，所以将来合并上游主题不受影响：
//   1. 前置脚本：在 <head> 里就把 <html data-palette="..."> 定下来，避免刷新时闪一下；
//   2. 右下角工具盘里插一个「调色板」按钮，点了就切换，并把选择记在 localStorage。
//
// 想再加一套色板：① 在 _config.redefine.yml 的 inject 段里照抄一段 html[data-palette="名字"] 的规则；
// ② 在下面的 PALETTES 里加一条（name 用于提示文字，themeColor 用于手机端状态栏颜色）；
// ③ ORDER 里加上名字即可（按钮会按 ORDER 循环切换）。

const STORAGE_KEY = "no9club-palette";
const PARAM_KEY = "palette";
const DEFAULT_PALETTE = "brand";

const PALETTES = {
  brand: { name: "NO9 品牌色", themeColor: "#E01B2E" },
  classic: { name: "经典配色", themeColor: "#A31F34" },
};

const ORDER = ["brand", "classic"];

// ---- 1) 前置脚本：尽量早地决定用哪套，避免闪屏 ----
// 优先级：网址参数 ?palette=xxx（临时预览，不写入偏好） > localStorage 里记住的选择 > 默认
const EARLY_SCRIPT = `
<script data-palette-init>
  (function () {
    var name = "${DEFAULT_PALETTE}";
    try {
      var fromUrl = new URLSearchParams(window.location.search).get("${PARAM_KEY}");
      var saved = window.localStorage.getItem("${STORAGE_KEY}");
      if (fromUrl && ${JSON.stringify(ORDER)}.indexOf(fromUrl) !== -1) {
        name = fromUrl;
      } else if (saved && ${JSON.stringify(ORDER)}.indexOf(saved) !== -1) {
        name = saved;
      }
    } catch (error) {
      // 隐私模式下 localStorage 可能不可用，保持默认即可
    }
    document.documentElement.setAttribute("data-palette", name);
  })();
</script>
`;

// ---- 2) 按钮脚本：注入开关 + 处理切换 ----
// 用 data-swup-reload-script 让 swup 在换页时重新执行本段；同时挂了主题的 page:refresh 事件兜底，
// mount() 是幂等的（已经有按钮就跳过），所以重复执行不会出现两个按钮。
const TOGGLE_SCRIPT = `
<script data-palette-toggle data-swup-reload-script>
  (function () {
    var STORAGE_KEY = "${STORAGE_KEY}";
    var PALETTES = ${JSON.stringify(PALETTES)};
    var ORDER = ${JSON.stringify(ORDER)};

    function current() {
      var name = document.documentElement.getAttribute("data-palette");
      return PALETTES[name] ? name : "${DEFAULT_PALETTE}";
    }

    function apply(name) {
      document.documentElement.setAttribute("data-palette", name);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta && PALETTES[name]) {
        meta.setAttribute("content", PALETTES[name].themeColor);
      }
      var tip = "配色：" + PALETTES[name].name + "（点击切换）";
      document.querySelectorAll(".tool-palette-toggle").forEach(function (item) {
        item.title = tip;
      });
    }

    function mount() {
      var lists = document.querySelectorAll(".side-tools-container .hidden-tools-list");
      if (!lists.length) {
        return;
      }
      lists.forEach(function (list) {
        if (list.querySelector(".tool-palette-toggle")) {
          return;
        }
        var anchor = list.querySelector(".tool-dark-light-toggle") || list.lastElementChild;
        var item = document.createElement("li");
        item.className =
          "right-bottom-tools tool-palette-toggle flex justify-center items-center";
        item.innerHTML = '<i class="fa-solid fa-palette"></i>';
        item.addEventListener("click", function () {
          var next = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
          try {
            window.localStorage.setItem(STORAGE_KEY, next);
          } catch (error) {
            // 存不了也不影响本次切换
          }
          apply(next);
        });
        if (anchor && anchor.parentNode === list) {
          anchor.insertAdjacentElement("afterend", item);
        } else {
          list.appendChild(item);
        }
      });
      apply(current());
    }

    if (!window.__no9clubPaletteHooked) {
      window.__no9clubPaletteHooked = true;
      window.addEventListener("redefine:page:refresh", mount);
      var hookSwup = function () {
        if (window.swup && window.swup.hooks) {
          window.swup.hooks.on("page:view", mount);
        }
      };
      window.addEventListener("redefine:swup:ready", hookSwup);
      hookSwup();
    }

    mount();
  })();
</script>
`;

hexo.extend.injector.register("head_end", EARLY_SCRIPT);
hexo.extend.injector.register("body_end", TOGGLE_SCRIPT);
