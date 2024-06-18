# 前言

直接访问底层 DOM 元素，可以使用特殊的 ref attribute：

```js
<input ref="input">
```

它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。比如组件挂载时将焦点设置到一个 input 元素上

或在一个元素上初始化一个第三方库。

## 访问模板引用 ​

挂载结束后引用都会被暴露在 `this.$refs` 之上

选项式

```js
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

注意，你只可以在组件挂载后才能访问模板引用。如果你想在模板中的表达式上访问 $refs.input，在初次渲染时会是 undefined。这是因为在初次渲染前这个元素还不存在呢！

组合式 1

```js
<template>
  <input ref="input" />
</template>
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)
onMounted(() => {
  input.value.focus()

})
</script>
```

组合式 2 侦听一个模板引用 ref 的变化，确保考虑到其值为 `null` 的情况

```js
<template>
  <input ref="input" />
</template>
<script >
import { ref, onMounted, watchEffect } from 'vue'
export default {
  setup() {
    const input = ref(null)
    watchEffect(() => {
      if (input.value) {
        input.value.focus()
      } else {
        // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
      }
    })
    return {
      input
    }
  }
}
</script>
```

## 组件上的 ref​

这一小节假设你已了解组件的相关知识，或者你也可以先跳过这里，之后再回来看。

模板引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例

选项式

```js
<template>
  <div>
    <Child ref="child"/>
    <button @click="$refs.child.sum++">传值给子</button>
  </div>
</template>

<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    console.log(this.$refs.child)
    console.log(this.$refs.child.name)
  },
  data() {
    return {
    }
  }
}
</script>
```

Child.vue

```js
<template>
  <div>这是子组件渲染哒！</div>
</template>
<script>
export default {
  //expose: ['name', 'publicMethod'],//这2个公开父组件访问,没有这个配置则全部公开
  data() {
    return {
      name: 'luckyNwa',
      privateData: '小黑子',
      sum: 0,
    }
  },
  methods: {
    publicMethod() {
      console.log('公开方法1')
    },
    privateMethod() {
      console.log('私有方法1')
    },
  },
  watch: {
    sum(n, o) {
      console.log('值变化了n', n)
      console.log('值变化了o', o)
    },
  },
}
</script>
```

如果一个子组件使用的是选项式 API ，被引用的组件实例和该子组件的 this 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这使得在父组件和子组件之间创建紧密耦合的实现细节变得很容易，当然也因此，应该只在绝对需要时才使用组件引用。大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互

组合式

```js
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 是 <Child /> 组件的实例
})
</script>

<template>
  <Child ref="child" />
</template>
```

Child.vue

```js
<script setup>
  import {ref} from 'vue' const a = 1 const b = ref(2) // 像 defineExpose
  这样的编译器宏不需要导入 defineExpose({(a, b)})
</script>
```

当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 `{ a: number, b: number }` (ref 都会自动解包，和一般的实例一样)
