// 左侧导航栏
export const vueListBar = [
  {
    text: "开始",
    items: [
      { text: "简介", link: "/src/vueList/start/start-explain" },
      { text: "快速上手", link: "/src/vueList/start/start-go" },
    ],
  },
  {
    text: "基础",
    items: [
      { text: "模板语法", link: "/src/vueList/base/template-syntax" },
      { text: "事件处理", link: "/src/vueList/base/event-listeners" },
      { text: "类与样式绑定", link: "/src/vueList/base/bind-class-style" },
      { text: "表单输入绑定", link: "/src/vueList/base/bind-form" },
      { text: "生命周期", link: "/src/vueList/base/life-cycle" },
      { text: "计算属性", link: "/src/vueList/base/calculate-attributes" },
      { text: "侦听器", link: "/src/vueList/base/listener" },
      { text: "模板引用", link: "/src/vueList/base/ref-template" },
      { text: "组件基础", link: "/src/vueList/base/component-base" },
      { text: "CJS和ES", link: "/src/vueList/base/cjs-es" },
    ],
  },
  {
    text: "常用",
    items: [
      { text: "注册", link: "/src/vueList/deep-component/register" },
      {
        text: "传值",
        link: "/src/vueList/deep-component/value-transmission",
      },
      { text: "路由", link: "/src/vueList/deep-component/router-use" },
      { text: "缓存", link: "/src/vueList/deep-component/localStorage" },
      { text: "VueX", link: "/src/vueList/deep-component/vueX-use" },
    ],
  },
  {
    text: "拓展内容",
    items: [{ text: "拓展指令", link: "/src/vueList/rare/instructions" }],
  },
];
