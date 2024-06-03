# 模板语法

Vue 使用一种基于 HTML 的模板语法，使我们能够声明式地将其组件实例的数据绑定到呈现的 DOM 上。所有的 Vue 模板都是语法层面合法的 HTML，可以被符合规范的浏览器和 HTML 解析器解析。

在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并应用最少的 DOM 操作。

## 文本插值

最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)

v-text 通过设置元素的 textContent 属性来工作，它将覆盖元素中所有现有的内容。如果你需要更新 textContent 的部分，应该使用 mustache interpolations 代替

若想插入 HTML，你需要使用 v-html 指令

双大括号标签会被替换为相应组件实例中 msg 属性的值。同时每次 msg 属性更改时它也会同步更新。

```js
<template>
  <div>
    <div v-text="msg"></div>
    <!-- 等同于 -->
    <div>{{ msg }}</div>
    <div>传入1和2,返回{{ sum(1, 2) }}</div>
    <div>{{ message.split('').reverse().join('') }}</div>
    <!-- v-html -->
    <div>
      Using v-html directive:<span v-html="rawHtml"></span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '小米',
      message: ' 大聪明',
      rawHtml: '<span style="color: red">This should be red.</span>'
    }
  },
  methods: {
    sum(a, b) {
      return a + b;
    }
  }
}
</script>
```

v-html 的内容直接作为普通 HTML 插入—— Vue 模板语法是不会被解析的。如果你发现自己正打算用 v-html 来编写模板，不如重新想想怎么使用组件来代替。

::: danger
在你的站点上动态渲染任意的 HTML 是非常危险的，因为它很容易导致 XSS 攻击。请只对可信内容使用 HTML 插值，绝不要将用户提供的内容作为插值
:::

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

## 条件渲染

v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回真值时才被渲染。

```js
<template>
  <div>
    <button @click="awesome = !awesome">Toggle</button>
    <h1 v-if="awesome">Vue is awesome!</h1>
    <h1 v-else>Oh no 😢</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      awesome: false,
    }
  }
}

</script>
```

一个 v-else 元素必须跟在一个 v-if 或者 v-else-if 元素后面，否则它将不会被识别。

v-else-if 提供的是相应于 v-if 的“else if 区块”。

因为 v-if 是一个指令，他必须依附于某个元素。但如果我们想要切换不止一个元素呢？在这种情况下我们可以在一个 template 元素上使用 v-if，这只是一个不可见的包装器元素，最后渲染的结果并不会包含该元素。

另一个可以用来按条件显示一个元素的指令是 v-show。其用法基本一样：

```js
<template>
  <div>
    <button @click="awesome = !awesome">Toggle</button>
    <h1 v-show="awesome">Vue is awesome!</h1>
    <h1  v-show="!awesome">Oh no 😢</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      awesome: false,
    }
  }
}

</script>
```

v-show 不支持在 template 元素上使用，也不能和 v-else 搭配使用。

::: danger

v-if 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。

v-if 也是惰性的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有当条件首次变为 true 时才被渲染。

相比之下，v-show 简单许多，元素无论初始条件如何，始终会被渲染，只有 CSS display 属性会被切换。

总的来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要频繁切换，则使用 v-show 较好；如果在运行时绑定条件很少改变，则 v-if 会更合适。

:::

## 列表渲染

我们可以使用 v-for 指令基于一个数组来渲染一个列表。v-for 指令的值需要使用 item in items 形式的特殊语法，其中 items 是源数据的数组，而 item 是迭代项的别名

```js
<template>
  <div>
    v-for与数组对象---------------------------------------------------
    <li v-for="(item, index) in items" :key="index">
      {{ item.message }}
    </li>
    or直接解构
    <li v-for="({ message }, index) in items" :key="index">
      {{ message }}
    </li>
    or 也可以使用 of 作为分隔符来替代 in，这更接近 JavaScript 的迭代器语法
    <li v-for="(item, index) of items" :key="index">
      {{ item.message }}
    </li>
    v-for与对象---------------------------------------------------
    <ul>
      <li v-for="(value, key, index) in myObject" :key="index">
        {{ index }}. {{ key }}: {{ value }}
      </li>
    </ul>
    v-for的范围,从1开始
    <span v-for="n in 10">{{ n }}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [{ message: 'Lucky' }, { message: 'Bar' }],
      myObject: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      }
    }
  }
}
</script>
```

推荐在任何可行的时候为 v-for 提供一个 key attribute

::: details
Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染。

默认模式是高效的，但只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态 (例如表单输入值) 的情况。

为了给 Vue 一个提示，以便它可以跟踪每个节点的标识，从而重用和重新排序现有的元素，你需要为每个元素对应的块提供一个唯一的 key attribute
:::

一个标签同时使用，v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名，解决通过 v-for 放在 template 标签中

```js
<template>
  <div>
    <template v-for="todo in todos">
      <li v-if="!todo.isComplete">
        {{ todo.name }}
      </li>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      todos: [{ isComplete: false, name: '小维' }, { isComplete: true, name: '小窝' }, { isComplete: false, name: '小米' }]
    }
  }
}
</script>

```
