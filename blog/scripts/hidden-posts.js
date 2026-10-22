"use strict";

// Posts with `hidden: true` are kept out of every listing generator (index,
// archive, category, tag, feed, search...), but still get a page at their
// permalink through the `hidden-posts` generator below.
hexo.extend.filter.register("before_generate", function () {
  if (typeof this._bindLocals === "function") {
    this._bindLocals();
  }

  const posts = this.locals.get("posts");
  if (!posts) {
    return;
  }

  const hiddenPosts = posts.filter((post) => post.hidden === true);
  const visiblePosts = posts.filter((post) => post.hidden !== true);

  this.locals.set("hidden_posts", hiddenPosts);
  this.locals.set("posts", visiblePosts);
});

hexo.extend.generator.register("hidden-posts", function (locals) {
  const hiddenPosts = locals.hidden_posts;

  if (!hiddenPosts || hiddenPosts.length === 0) {
    return [];
  }

  return hiddenPosts.toArray().map((post) => {
    post.__post = true;
    post.prev = null;
    post.next = null;

    const { path, layout } = post;
    if (!layout || layout === "false") {
      return { path, data: post.content };
    }

    const layouts = ["post", "page", "index"];
    if (layout !== "post") {
      layouts.unshift(layout);
    }

    return { path, layout: layouts, data: post };
  });
});
