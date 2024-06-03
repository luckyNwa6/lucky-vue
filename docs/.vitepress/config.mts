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
          { text: "快速上手", link: "/src/start/start-go" },
        ],
      },
      {
        text: "基础",
        items: [
          { text: "模板语法", link: "/src/base/template-syntax" },
          { text: "响应式", link: "/src/base/responsive" },
          { text: "计算属性", link: "/src/base/calculate-attributes" },
          { text: "类与样式绑定", link: "/src/base/bind-class-style" },
          { text: "条件渲染", link: "/src/base/if-rendering" },
          { text: "列表渲染", link: "/src/base/list-rendering" },
          { text: "事件处理", link: "/src/base/event-listeners" },
          { text: "表单输入绑定", link: "/src/base/bind-form" },
          { text: "生命周期", link: "/src/base/life-cycle" },
          { text: "侦听器", link: "/src/base/listener" },
          { text: "模板引用", link: "/src/base/ref-template" },
          { text: "组件基础", link: "/src/base/component-base" },
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
