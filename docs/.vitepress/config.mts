import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue.js",
  description: "渐进式JavaScript 框架",
  base: "/lucky-vue-study/",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

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
  },
});
