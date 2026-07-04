// import { defineConfig } from "vitepress";

import topNav from "../src/js/topNav.js"; // 头部导航

import { vueListBar } from "../src/js/Bars/vueListBar"; //VueList的侧边菜单
import { chartListBar } from "../src/js/Bars/chartListBar"; //VueList的侧边菜单
import { elListBar } from "../src/js/Bars/elListBar";
import { frontendListBar } from "../src/js/Bars/frontendListBar";
export default {
  title: "小维 · Vue文档",
  description: "渐进式JavaScript 框架",
  base: "/lucky-vue/",
  outDir: "../dist", // 设置输出目录
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/lucky-vue/favicon.ico",
      },
    ],
  ],
  themeConfig: {
    logo: "https://imgs.luckynwa.top/profile/mdS/logoVitePress.png",
    outline: {
      label: "导航",
    },
    search: {
      provider: "local",
    },

    nav: topNav,
    sidebar: {
      "/src/vueList": vueListBar,
      "/src/chartList": chartListBar,
      "/src/elList": elListBar,
      "/src/frontendList": frontendListBar,
    },

    socialLinks: [{ icon: "github", link: "https://github.com/luckyNwa6" }],
    footer: {
      message: "By Lucky 小维",
      copyright: `Copyright © 2023-${new Date().getFullYear()}💘<a href='https://luckynwa.top/about' style='color: #3eaf7c;text-decoration:none'>小维的博客</a>`,
    },

    // lastUpdated: {
    //   text: "更新时间",
    //   formatOptions: {
    //     dateStyle: "short",
    //     timeStyle: "short",
    //   },
    // },
    lastUpdatedText: "最后更新",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
};
