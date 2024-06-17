import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Lucky_Vue.js",
  description: "渐进式JavaScript 框架",
  base: "/lucky-vue/",
  outDir: "../dist", // 设置输出目录
  themeConfig: {
    logo: "https://luckynwa.top/mypic/luckyUi/logo.png",
    outline: {
      label: "导航",
    },
    search: {
      provider: "local",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    // lastUpdated: {
    //   text: "更新时间",
    //   formatOptions: {
    //     dateStyle: "short",
    //     timeStyle: "short",
    //   },
    // },
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/src/start/start-explain" },
      {
        text: "博客",
        link: "https://luckynwa.top/about",
      },
      {
        text: "演练场",
        link: "https://play.vuejs.org",
      },
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
          { text: "事件处理", link: "/src/base/event-listeners" },
          { text: "类与样式绑定", link: "/src/base/bind-class-style" },
          { text: "表单输入绑定", link: "/src/base/bind-form" },
          { text: "生命周期", link: "/src/base/life-cycle" },
          { text: "计算属性", link: "/src/base/calculate-attributes" },
          { text: "侦听器", link: "/src/base/listener" },
          { text: "模板引用", link: "/src/base/ref-template" },
          { text: "组件基础", link: "/src/base/component-base" },
        ],
      },
      {
        text: "常用",
        items: [
          { text: "注册", link: "/src/deep-component/register" },
          { text: "传值", link: "/src/deep-component/value-transmission" },
          { text: "路由", link: "/src/deep-component/routerUse" },
          { text: "缓存", link: "/src/deep-component/localStorage" },
          { text: "VueX", link: "/src/deep-component/vueXUse" },
        ],
      },
      {
        text: "拓展内容",
        items: [
          { text: "ES6特性", link: "/src/rare/es6Study" },
          { text: "数组处理", link: "/src/rare/arrHandle" },
          { text: "对象处理", link: "/src/rare/objHandle" },
          { text: "日期转换", link: "/src/rare/dataSwitch" },
          { text: "防抖节流", link: "/src/rare/debounceThrottle" },
          { text: "拓展指令", link: "/src/rare/instructions" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/luckyNwa6" }],
    footer: {
      message: "By Lucky 小维",
      copyright: `Copyright © 2023-${new Date().getFullYear()}💘<a href='https://luckynwa.top/about' style='color: #3eaf7c;text-decoration:none'>小维的博客</a>`,
    },
  },
});
