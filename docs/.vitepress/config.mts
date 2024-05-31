import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue.js",
  description: "渐进式JavaScript 框架",
  base: "/lucky-vue-study/",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "https://luckynwa.top/mypic/luckyUi/logo.png",
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "开始",
        items: [
          { text: "简介", link: "/markdown-examples" },
          { text: "开始上手", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/luckyNwa6" }],
    footer: {
      message: "By Lucky 小维",
      copyright:
        "Copyright © 2024-present💘<a href='https://luckynwa.top/about' style='color: #3eaf7c;text-decoration:none'>小维的博客</a>",
    },
  },
});
