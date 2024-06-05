# 组件基础

组件允许我们将 UI 划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考

在实际应用中，组件常常被组织成层层嵌套的树状结构

## 定义一个组件

一般将 Vue 组件定义在单独的 .vue，这被叫做单文件组件 (简称 SFC)

```js
<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

## 使用组件

要使用一个子组件，我们需要在父组件中导入它，这个组件将会以默认导出的形式被暴露给外部

setup不需要注册组件

```js
<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>

<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>
```

选项式

```js
<script>
import ButtonCounter from './ButtonCounter.vue'
export default {
  components: {
    ButtonCounter//注册
  }
}
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

组件可以被重用任意多次，每一个组件都维护着自己的状态，这是因为每当你使用一个组件，就创建了一个新的**实例**。

## 传递 props

如果我们正在构建一个博客，我们可能需要一个表示博客文章的组件。我们希望所有的博客文章分享相同的视觉布局，但有不同的内容。要实现这样的效果自然必须向组件中传递数据，例如每篇文章标题和内容，这就会使用到 props。

Props 是一种特别的 attributes，你可以在组件上声明注册。要传递给博客文章组件一个标题，我们必须在组件的 props 列表上声明它。这里要用到 [`defineProps`](https://cn.vuejs.org/api/sfc-script-setup.html#defineprops-defineemits) 宏：

```js
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入。声明的 props 会自动暴露给模板。`defineProps` 会返回一个对象，其中包含了可以传递给组件的所有 props：

```js
const props = defineProps(['title'])
console.log(props.title)
```

如果你没有使用 `<script setup>`，props 必须以 `props` 选项的方式声明，props 对象会作为 `setup()` 函数的第一个参数被传入：

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

一个组件可以有任意多的 props，默认情况下，所有 prop 都接受任意类型的值。

```js
<script setup>
import { ref } from 'vue'
import BlogPost from './BlogPost.vue'
  
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
</script>

<template>
	<BlogPost
  	v-for="post in posts"
	  :key="post.id"
  	:title="post.title"
	></BlogPost>
</template>
```

选项式

```js
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

[点击前往演练](https://play.vuejs.org/#eNp9Uk1P4zAQ/SsjX8JK3VS7cIpCpWXFYVcCKkBwwByqZpK6JLZlT0qrKP+dsUNThKA3z7w3H+95OvHH2nTToshE7pdOWQKP1NqZ1KqxxhF04LCEHkpnGkiYmozQRW2qufH0jqXTfSJ0ZBqA1EujmWA56eE8tDp5CkAHqsjg1wRIUY0ZJFc7WJvWadzBq6IVPHAH6CcH7u8DN4yplK6+YZ4emI+rXcBBefAGylYzU+rnH1Ln00EuC+WAsLH1gjBElO9lRAW0+Vkady5F0ABKD1qkCEyA7AV371iqipANJVmcv8/HYCiY5aNHPCqfjnPFRHw074vvKLBUGufOWH/ylMSeyVEhAPnqbNZ1gxnQ9/mU489TyfMPlapK195oHttFBWJpGqtqdDeWFP+gFBlEJGCLujav/2OOXIvR+VizwuXLF/m134acFHOHHt2GvRgxWrgKaYAv765xy+8RbEzRBueOgLfoTd2GHQfaRasLXvsDL277Lx4sn8y9v9wSar8XFRYNzOF+pGDv/x6Rflj3ND2LdVL3on8D0woZgw==)

## 监听事件

让我们继续关注我们的 `<BlogPost>` 组件。我们会发现有时候它需要与父组件进行交互。例如，要在此处实现无障碍访问的需求，将博客文章的文字能够放大，而页面的其余部分仍使用默认字号。

在父组件中，我们可以添加一个 `postFontSize` ref 来实现这个效果

给 `<BlogPost>` 组件添加一个按钮：

```js
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text']) //声明需要抛出的事件
</script>

<template>
  <h4>{{ title }}</h4>
  <button @click="$emit('enlarge-text')">Enlarge text</button>
</template>
```

父组件可以通过 `v-on` 或 `@` 来选择性地监听子组件上抛的事件，就像监听原生 DOM 事件那样

```js
<script setup>
import { ref } from 'vue'
import BlogPost from './BlogPost.vue'
const postFontSize = ref(1)
</script>

<template>
	<div :style="{ fontSize: postFontSize + 'em' }">
		<BlogPost title="My journey with Vue" @enlarge-text="postFontSize += 0.1"></BlogPost>
	</div>
</template>
```

子组件可以通过调用内置的 [**`$emit`** 方法](https://cn.vuejs.org/api/component-instance.html#emit)，通过传入事件名称来抛出一个事件

因为有了 `@enlarge-text="postFontSize += 0.1"` 的监听，父组件会接收这一事件，从而更新 `postFontSize` 的值

这声明了一个组件可能触发的所有事件，还可以对事件的参数进行[验证](https://cn.vuejs.org/guide/components/events.html#validate-emitted-events)。同时，这还可以让 Vue 避免将它们作为原生事件监听器隐式地应用于子组件的根元素。

和 `defineProps` 类似，`defineEmits` 仅可用于 `<script setup>` 之中，并且不需要导入，它返回一个等同于 `$emit` 方法的 `emit` 函数。它可以被用于在组件的 `<script setup>` 中抛出事件，因为此处无法直接访问 `$emit`：

```js
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

如果你没有在使用 `<script setup>`，你可以通过 `emits` 选项定义组件会抛出的事件。你可以从 `setup()` 函数的第二个参数，即 setup 上下文对象上访问到 `emit` 函数：

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

## 通过插槽来分配内容

我们希望能和 HTML 元素一样向组件中传递内容

```js
<AlertBox>
  Something bad happened.
</AlertBox>
```

这可以通过 Vue 的自定义 `<slot>` 元素来实现

```js
<!-- AlertBox.vue -->
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>
```

## 动态组件

有些场景会需要在两个组件间来回切换，比如 Tab 界面：

上面的例子是通过 Vue 的 `<component>` 元素和特殊的 `is` attribute 实现的：

```js
<!-- currentTab 改变时组件也改变 -->
<component :is="tabs[currentTab]"></component>
```

在上面的例子中，被传给 `:is` 的值可以是以下几种：

- 被注册的组件名
- 导入的组件对象

你也可以使用 `is` attribute 来创建一般的 HTML 元素。

当使用 `<component :is="...">` 来在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过KeepAlive标签强制被切换掉的组件仍然保持“存活”的状态。
