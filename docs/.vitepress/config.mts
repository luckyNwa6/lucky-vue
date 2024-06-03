import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Lucky_Vue.js",
  description: "渐进式JavaScript 框架",
  base: "/lucky-vue-study/",

  themeConfig: {
    logo: "https://luckynwa.top/mypic/luckyUi/logo.png",
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/src/start/start-explain" },
    ],

    sidebar: [
      {
        text: "开始",
        items: [
          { text: "简介", link: "/src/start/start-explain" },
          { text: "开始上手", link: "/src/start/start-go" },
        ],
      },
      {
        text: "基础",
        items: [
          { text: "模板语法", link: "/src/base/template-syntax" },
          { text: "响应式", link: "/src/base/responsive" },
        ],
      },
      {
        text: "测试",
        items: [
          { text: "测试1", link: "/api-examples" },
          { text: "测试2", link: "/markdown-examples" },
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
