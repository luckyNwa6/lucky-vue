# 拓展指令

v-pre

元素内具有 v-pre，所有 Vue 模板语法都会被保留并按原样渲染。最常见的用例就是显示原始双大括号标签及内容。

v-once

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
