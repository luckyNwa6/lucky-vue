# 拓展指令

这些指令可以用于添加特定的行为、处理事件、操作 DOM 元素等

## v-pre

元素内具有 v-pre，所有 Vue 模板语法都会被保留并按原样渲染。最常见的用例就是显示原始双大括号标签及内容。

## v-once

在随后的重新渲染，元素/组件及其所有子项将被当作静态内容并跳过渲染。这可以用来优化更新时的性能。

```js
<template>
  <div>
    <div v-pre>{{ this will not be compiled }}</div>
    <span v-once>This will never change: {{message}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: ' 哈哈',
    }
  }
}
</script>

```

## 自定义指令

待完成

[前往 CSDN 小维的博客](https://blog.csdn.net/weixin_44055864?spm=1011.2415.3001.5343)

[前往小维个人博客](https://luckynwa.top)

[前往小维 Github](https://github.com/luckyNwa6)

[前往小维 UI 站](https://myui.luckynwa.top/)

[前往小维 工具站](https://mytool.luckynwa.top/lucky-tools/)
