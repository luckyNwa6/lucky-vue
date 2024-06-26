# 前言

计算属性允许我们声明性地计算衍生值。然而在有些情况下，我们需要在状态变化时执行一些“副作用”

例如：更改 DOM 或是根据异步操作的结果去修改另一处的状态

## 基本示例 ​

watch 选项在每次响应式属性发生变化时触发一个函数

选项式

```js
<template>
  <p>
    问一个是/否的问题记得加上?:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
  <hr>
  <button @click="watchA">点击对象变化</button>
</template>
<script>
export default {
  data() {
    return {
      question: '',
      answer: '默认回答',
      loading: false,
      obj: {
        name: '小维',
        age: 25
      }
    }
  },
  watch: {
    // 每当 question 改变时，这个函数就会执行
    question(newQuestion, oldQuestion) {
      console.log('新值是:', newQuestion)
      console.log('旧值是:', oldQuestion)
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    },
    obj: {
      handler(n, o) {
        console.log('新值是:', n)
        console.log('旧值是:', o)
      },
     // deep: true//加了这个才能监听深处对象，不然监测不到点击事件导致的值变化
    }
  },
  methods: {
    watchA() {
      this.obj.name = '小米'//要有deep才能监听到对象里值变化
     // this.obj=null
    },
    async getAnswer() {
      this.loading = true
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

组合式

```js
<template>
  <p>
    控制台查看结果:
    <input v-model="question" :disabled="loading" />
    <br>
    <button @click="x++">x变化</button>
    <br>
    <button @click="y++">y变化</button>
        <br>
    <button @click="state.someObject.age=14">OBJ变化</button>
  </p>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const question = ref('')

const loading = ref(false)

const x = ref(0)
const y = ref(0)
const state= reactive({
  name:'LUCKY',
  someObject:{
    age:12
  }
})
//监听对象
watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
      console.log(`触发了 ${state.someObject.age}`)
  },
  //{ deep: true }
)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})
// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)
// 多个来源组成的数组
watch([x, ()=>y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
// 可以直接侦听一个 ref
watch(question, (newQuestion, oldQuestion) => {
  console.log('新值是:', newQuestion)
  console.log('旧值是:', oldQuestion)

})
</script>
```

## 深层侦听器

watch 默认是浅层的：被侦听的属性，仅在被赋新值时，才会触发回调函数——而嵌套属性的变化不会触发

如果想侦听所有嵌套的变更，你需要深层侦听器：

选项式

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // 注意：在嵌套的变更中，
        // 只要没有替换对象本身，
        // 那么这里的 `newValue` 和 `oldValue` 相同
      },
      deep: true,
    },
  },
};
```

组合式

直接给 `watch()` 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：

```js
const obj = reactive({ count: 0 });

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
});

obj.count++;
```

相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调：

```js
watch(
  () => state.someObject, //对象中对象
  () => {
    // 仅当 state.someObject 被替换时触发
  }
);
```

你也可以给上面这个例子显式地加上 `deep` 选项，强制转成深层侦听器：

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
);
```

::: danger

深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能。

:::

## 即时回调的侦听器 ​

watch 默认是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。

我们可以用一个对象来声明侦听器，这个对象有 handler 方法和 immediate: true 选项，这样便能强制回调函数立即执行

选项式

```js
export default {
  watch: {
    question: {
      handler(newQuestion, oldQuestion) {
        // 在组件实例创建时会立即调用
        console.log("新值是:", newQuestion);
        console.log("旧值是:", oldQuestion);
        if (newQuestion.includes("?")) {
          this.getAnswer();
        }
      },
      // 强制立即执行回调
      immediate: true,
    },
  },
};
```

组合式

```js
<template>
  <p>
    控制台查看结果:
    <button @click="todoId++">todoId加1</button>
  </p>
</template>
<script setup>
import {  ref, watch,watchEffect } from 'vue'
const todoId = ref(1)
const data = ref(null)

// watch(
//   todoId,
//   async () => {
//     const response = await fetch(
//       `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
//     )
//     data.value = await response.json()
//     console.log('监听到了',data.value)
//   },
//   { immediate: true }
// )
//同效果简写
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
   console.log('监听到了',data.value)
})
</script>
```

这个例子中，回调会立即执行，不需要指定 `immediate: true`。在执行期间，它会自动追踪 `todoId.value` 作为依赖（和计算属性类似）。每当 `todoId.value` 变化时，回调会再次执行。有了 `watchEffect()`，我们不再需要明确传递 `todoId` 作为源值。

:::tip

`watchEffect` 仅会在其**同步**执行期间，才追踪依赖。在使用异步回调时，只有在第一个 `await` 正常工作前访问到的属性才会被追踪。

:::

回调函数的初次执行就发生在 created 钩子之前。Vue 此时已经处理了 data、computed 和 methods 选项，所以这些属性在第一次调用时就是可用的。

## watch 和 watchEffect

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。

- `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

## 回调的触发时机 ​

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。

类似于组件更新，用户创建的侦听器回调函数也会被批量处理以避免重复调用。

例如，如果我们同步将一千个项目推入被侦听的数组中，我们可能不希望侦听器触发一千次。

默认情况下，侦听器回调会在父组件更新 (如有) 之后、所属组件的 DOM 更新之前被调用。

这意味着如果你尝试在侦听器回调中访问所属组件的 DOM，那么 DOM 将处于更新前的状态。

## this.$watch()​

我们也可以使用组件实例的 $watch() 方法来命令式地创建一个侦听器：

```js
export default {
  created() {
    this.$watch("question", (newQuestion) => {
      // ...
    });
  },
};
```

如果要在特定条件下设置一个侦听器，或者只侦听响应用户交互的内容，这方法很有用。它还允许你提前停止该侦听器。

## 停止侦听器 ​

用 watch 选项或者 $watch() 实例方法声明的侦听器，会在宿主组件卸载时自动停止。因此，在大多数场景下，你无需关心怎么停止它。

在少数情况下，你的确需要在组件卸载之前就停止一个侦听器，这时可以调用 $watch() API 返回的函数

选项式

```js
const unwatch = this.$watch("foo", callback);

// ...当该侦听器不再需要时
unwatch();
```

组合式

在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。

一个关键点是，侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：

```js
<script setup>
  import {watchEffect} from 'vue' // 它会自动停止 watchEffect(() => {}) //
  ...这个则不会！ setTimeout(() => {watchEffect(() => {})}, 100)
</script>
```

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：

```js
const unwatch = watchEffect(() => {});
// ...当该侦听器不再需要时
unwatch();
```

注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：

```js
// 需要异步请求得到的数据
const data = ref(null);

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
});
```
