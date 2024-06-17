# 组件注册

一个 Vue 组件在使用前需要先被“注册”，这样 Vue 才能在渲染模板时找到其对应的实现

组件注册有两种方式：全局注册和局部注册

方法有时候也需要全局注册或者局部注册引入

## 全局注册

全局注册一般都是在main.js中进行

vue2

```js
import Vue from 'vue'
import { getDicts } from "@/api/system/dict/data";
import DictTag from '@/components/DictTag'
// 全局方法挂载
Vue.prototype.getDicts = getDicts
// 全局组件挂载
Vue.component('DictTag', DictTag)

```

Vue3

```js
import { createApp } from 'vue'
import App from '@/App.vue'

const app = createApp(App)

app.component(
  // 注册的名字
  'MyComponent',
  // 组件的实现
  {
    /* ... */
  }
)

app.component('MyComponent', MyComponent)
//工具类挂载
app.config.globalProperties.DICT_TYPE = DICT_TYPE

```

`app.component()` 方法也可以被链式调用：

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

全局注册的组件可以在此应用的任意组件的模板中使用

## 局部注册

全局注册虽然很方便，但有以下几个问题：

1. 全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中
2. 全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性。

相比之下，局部注册的组件需要在使用它的父组件中显式导入，并且只能在该父组件中使用。它的优点是使组件之间的依赖关系更加明确，并且对 tree-shaking (没有被使用的组件无法在生产打包时被自动移除 )更加友好

局部注册需要使用 `components` 选项：

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA//等价于ComponentA: ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

## 组件名格式

在整个指引中，我们都使用 PascalCase 作为组件名的注册格式，这是因为：

1. PascalCase 是合法的 JavaScript 标识符。这使得在 JavaScript 中导入和注册组件都很容易，同时 IDE 也能提供较好的自动补全。
2. `<PascalCase />` 在模板中更明显地表明了这是一个 Vue 组件，而不是原生 HTML 元素。同时也能够将 Vue 组件和自定义元素 (web components) 区分开来。

为了方便，Vue 支持将模板中使用 kebab-case 的标签解析为使用 PascalCase 注册的组件。这意味着一个以 `MyComponent` 为名注册的组件，在模板中可以通过 `<MyComponent>` 或 `<my-component>` 引用。这让我们能够使用同样的 JavaScript 组件注册代码来配合不同来源的模板。
