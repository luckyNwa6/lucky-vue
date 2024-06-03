# 模板语法

Vue 使用一种基于 HTML 的模板语法，使我们能够声明式地将其组件实例的数据绑定到呈现的 DOM 上。所有的 Vue 模板都是语法层面合法的 HTML，可以被符合规范的浏览器和 HTML 解析器解析。

在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并应用最少的 DOM 操作。

## 文本插值

最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)：

```js
<template>
  <div>
    <span>Message: {{ msg }}</span>
    <div>传入1和2,返回{{sum(1,2)}}</div>
    <div>{{ message.split('').reverse().join('') }}</div>
  </div>
</template>
<script>
  export default{
    data(){
    return{
      msg:'哈哈',
      message:' 你 干 吗'
      }},
    methods:{
      sum(a,b){
        return a+b;
      }
    }
  }
</script>
```

双大括号标签会被替换为相应组件实例中 msg 属性的值。同时每次 msg 属性更改时它也会同步更新。

## 原始 HTML

若想插入 HTML，你需要使用 v-html 指令：

```js
<template>
  <div>
    <div>
      Using v-html directive:<span v-html="rawHtml"></span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">This should be red.</span>'
    }
  },
}
</script>
```

## Attribute 绑定

双大括号不能在 HTML attributes 中使用。想要响应式地绑定一个 attribute，应该使用 v-bind 指令

```html
<div v-bind:id="dynamicId"></div>
```

v-bind 指令指示 Vue 将元素的 id attribute 与组件的 dynamicId 属性保持一致。如果绑定的值是 null 或者 undefined，那么该 attribute 将会从渲染的元素上移除。

因为 v-bind 非常常用，我们提供了特定的简写语法：

```html
<button :disabled="isButtonDisabled"></button>
<div :id="`list-${id}`"></div>
```
