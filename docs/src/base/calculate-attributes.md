# 前言

如果在模板中写太多逻辑，会让模板变得臃肿

## 基础示例

比如说，我们有这样一个包含嵌套数组的对象

选项式

```js
<template>
  <p>Has published books:</p>
  如果有多个下面这种表达式，显得臃肿
  <div>{{ author.books.length > 0 ? 'Yes' : 'No' }}</div>
  <div>使用计算属性：{{ publishedBooksMessage }}</div>
</template>
<script>
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // 一个计算属性的 getter
    publishedBooksMessage() {
      // `this` 指向当前组件实例
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
</script>
```

组合式

```js
<template>
  <div>{{publishedBooksMessage}}</div>
  当前的值是{{ fullName }}
  <button @click="fullName = '小薇 小王'">修改计算属性的值</button>
</template>
<script setup >
import { reactive,computed,ref } from 'vue';

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})

const firstName = ref('John')

const lastName = ref('Doe')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

组合式 2

```js
<template>
  <div>{{ publishedBooksMessage }}</div>
</template>
<script>
import { reactive, computed, ref } from 'vue';

export default {
  setup() {
    const author = reactive({
      name: 'John Doe',
      books: [
        'Vue 2 - Advanced Guide',
        'Vue 3 - Basic Guide',
        'Vue 4 - The Mystery'
      ]
    });
    // 一个计算属性 ref
    const publishedBooksMessage = computed(() => {
      return author.books.length > 0 ? 'Yes' : 'No';
    });

    return {
      publishedBooksMessage
    };
  }
}
</script>
```

推荐使用计算属性来描述依赖响应式状态的复杂逻辑

在模板中使用计算属性的方式和一般的属性并无二致。Vue 会检测到 this.publishedBooksMessage 依赖于 this.author.books，所以当 this.author.books 改变时，任何依赖于 this.publishedBooksMessage 的绑定都将同时更新。

## 计算属性缓存 vs 方法

注意到我们在表达式中像这样调用一个函数也会获得和计算属性相同的结果

```js
<template>
  <p>Has published books:</p>
  如果有多个下面这种表达式，显得臃肿
  <div>{{ author.books.length > 0 ? 'Yes' : 'No' }}</div>
  <div>使用计算属性：{{ publishedBooksMessage }}</div>
  <div>{{ now }}不是一个响应式依赖，计算属性永远不会更新</div>
  <button @click="publishedBooksMessage = 'No'">点击（提示只读）</button>
</template>
<script>
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // 一个计算属性的 getter
    publishedBooksMessage() {
      // `this` 指向当前组件实例
      return this.author.books.length > 0 ? 'Yes' : 'No'
    },
    now() {
      return Date.now()
    }
  }
}
</script>
```

若我们将同样的逻辑定义为一个方法而不是计算属性，两种方式在结果完全相同，不同之处在于计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。这意味着只要 author.books 不改变，无论多少次访问 publishedBooksMessage 都会立即返回先前的计算结果，而不用重复执行 getter 函数。

相比之下，方法调用总是会在重渲染发生时再次执行函数。

为什么需要缓存呢？

想象一下我们有一个非常耗性能的计算属性 list，需要循环一个巨大的数组并做许多计算逻辑，并且可能也有其他计算属性依赖于 list。没有缓存的话，我们会重复执行非常多次 list 的 getter，然而这实际上没有必要！如果你确定不需要缓存，那么也可以使用方法调用。

## 可写计算属性 ​

计算属性默认是只读的。当你尝试修改一个计算属性时，你会收到一个运行时警告。只在某些特殊场景中你可能才需要用到“可写”的属性，你可以通过同时提供 getter 和 setter 来创建

```js
<template>
  当前的值是{{ fullName }}
  <button @click="fullName = '小薇 小王'">修改计算属性的值</button>
</template>
<script>
export default {
  data() {
    return {
      firstName: '小维',
      lastName: '小艾',
    }
  },
  computed: {
    fullName: {
      // getter
      get() {
        return this.firstName + " " + this.lastName;
      },
      // setter
      set(newValue) {
        // 注意：我们这里使用的是解构赋值语法
        [this.firstName, this.lastName] = newValue.split(" ");
      },
    },
  }
}
</script>
```

## 最佳实践 ​

Getter 不应有副作用 ​
计算属性的 getter 应只做计算而没有任何其他的副作用，请务必牢记。举例来说，不要改变其他状态、在 getter 中做异步请求或者更改 DOM！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。在之后的指引中我们会讨论如何使用侦听器根据其他响应式状态的变更来创建副作用。

避免直接修改计算属性值 ​
从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。
