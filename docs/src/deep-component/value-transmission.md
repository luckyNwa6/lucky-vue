# 传值

组件在被封装好之后，彼此之间是相互独立的，不存在父子关系 在使用组件的时候，根据彼此的嵌套关系，形成了父子关系、兄弟关系

## 选项式

父---->子 用 props

子---->父 用 自定义事件

Father.vue

```js
<template>
  <div>
    <div>message是父组件的数据要传给子组件的msg</div>
    <div>numberChange是子组件的自定义事件，触发则调用父的getNewSum方法</div>
    <hr />
    <Son :msg="message" @numberChange="getNewSum" />
    <hr />
    <div>这里展示子组件传过来的值变化：{{ sum }}</div>
    <hr />
    使用Ref来做测试,父--->子
    <Son ref="son" />
  </div>
</template>
<script>
import Son from './Son.vue'
export default {
  components: { Son },
  data() {
    return {
      message: '传给孩子的',
      sum: 0
    }
  },
  methods: {
    getNewSum(val, val2) {
      console.log('传过来的值：', val, val2)
      this.sum = val

    }
  },
  mounted() {
    console.log('dom挂载后的值', this.$refs.son)
    this.$refs.son.valueRef = 22  //这样能直接修改值
  }
}
</script>
```

Son.vue

```js
<template>
  <div>
    这是子组件里的内容哒！<button @click="addSum">+1</button>
    <div>接收到了父亲传过来的值---{{ msg }} | 默认值-{{ propB}}</div>
    <div>当前的valueRef----{{ valueRef}}</div>
  </div>
</template>
<script >

export default {
  //props: ['msg']
  props: {
    propA: Number,
    propB: {
      default() {
        return 'propB'
      }
    },
    msg: {
      type: String,//这里也可以是[String, null],
     // required: true,
      default:"消息",
    }
  },
  data(){
    return{
      sum:0,
      valueRef:0
    }
  },
  methods:{
    addSum(){
      this.$emit('numberChange',++this.sum,'LUCKY')//可以传很多数据
    }
  }
}
</script>

```

## 组合式1

Father.vue

```js
<template>
  <div>
    <div>message是父组件的数据要传给子组件的msg</div>
    <div>numberChange是子组件的自定义事件，触发则调用父的getNewSum方法</div>
    <hr />
    <Son :msg="message" @numberChange="getNewSum" />
    <hr />
    <div>这里展示子组件传过来的值变化：{{ sum }}</div>
    <hr />
    使用Ref来做测试,父--->子
    <Son ref="son" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Son from './Son.vue'

export default {
  components: { Son },
  setup() {
    const message = ref('传给孩子的')
    const sum = ref(0)

    const getNewSum = (val, val2) => {
      console.log('传过来的值：', val, val2)
      sum.value = val
    }

    onMounted(() => {
      console.log('dom挂载后的值', son.value)
      son.value.valueRef = 22 // 这样能直接修改值
    })

    const son = ref(null)

    return { message, sum, getNewSum, son }
  }
}
</script>

```

Son.vue

```js
<template>
  <div>
    这是子组件里的内容哒！<button @click="addSum">+1</button>
    <div>接收到了父亲传过来的值---{{ msg }} | 默认值-{{ propB }}</div>
    <div>当前的valueRef----{{ valueRef }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    propA: Number,
    propB: {
      default() {
        return 'propB'
      }
    },
    msg: {
      type: String,
      default: '消息'
    }
  },
  setup() {
    const sum = ref(0)
    const valueRef = ref(0)

    const addSum = () => {
      sum.value++
      emit('numberChange', sum.value, 'LUCKY') // 可以传很多数据
    }

    return { sum, valueRef, addSum }
  }
}
</script>

```

## 组合式2(推荐)

Father.vue

```js
<template>
  <div>
    <div>message是父组件的数据要传给子组件的msg</div>
    <div>numberChange是子组件的自定义事件，触发则调用父的getNewSum方法</div>
    <hr />
    <Son :msg="message" @numberChange="getNewSum" />
    <hr />
    <div>这里展示子组件传过来的值变化：{{ sum }}</div>
    <hr />
    使用Ref来做测试,父--->子
    <Son ref="son" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Son from './Son.vue'

const message = ref('传给孩子的')
const sum = ref(0)
const son = ref(null)

const getNewSum = (val, val2) => {
  console.log('传过来的值：', val, val2)
  sum.value = val
}
onMounted(() => {
  console.log('dom挂载后的值', son.value.valueRef)
  son.value.valueRef=3
})
</script>

```

Son.vue

```js
<template>
  <div>
    这是子组件里的内容哒！<button @click="addSum">+1</button>
    <div>接收到了父亲传过来的值---{{ msg }} | 默认值-{{ propB }}</div>
    <div>当前的valueRef----{{ valueRef }}</div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits,defineExpose} from 'vue'

const props = defineProps({
  propA: Number,
  propB: {
    default: 'propB'
  },
  msg: {
    type: String,
    default: '消息'
  }
})
const emit=defineEmits(['numberChange'])


const sum = ref(0)
const valueRef = ref(0)

defineExpose({//暴露出去
  valueRef
});

const addSum = () => {
  emit('numberChange', sum.value++,'luckyNwa') // 可以传很多数据
}
</script>

```

## 补充

子----->子 兄弟组件用 EventBus vue2.x

![](https://luckynwa.top/mypic/mdS/eventBus.png)
