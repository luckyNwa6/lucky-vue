# 前言

很多时候我们后台管理系统可以收缩，然后就导致了图表变形的情况，这个时候我们就需要给图表加入自适应功能

## Vue2自适应

引入第三方库

```shell
npm i resize-detector@0.3.0
npm i lodash@4.17.21
```

新增mixins-resize.js

```js
import { addListener, removeListener } from 'resize-detector';
import _ from 'lodash';

export default {
  mounted() {
    const { onResize } = this;
    this.__resizeHandler = _.debounce(() => {
      if (typeof onResize === 'function') onResize();
    }, 100);

    this.$nextTick(() => {
      addListener(this.$el, this.__resizeHandler);
    });
  },
  beforeDestroy() {
    removeListener(this.$el, this.__resizeHandler);
  }
}
```

在图表vue中使用

```js
import ResizeMixins from '@/views/common/mixins-resize.js'
import echarts from 'echarts'

  mixins: [ResizeMixins],//混入和data同级
      
  methods: {
    //自适应分辨率
    onResize() {
      this.myChart && this.myChart.resize()   //myChart图表实例，就是渲染dom-id
      // this.$refs.swiper1 && this.$refs.swiper1.resize();
    },   
  }
```

详细可以查看Vue模板中的具体实现结果

## Vue3自适应

组合式写法

```js
import * as echarts from 'echarts'
import { useDebounceFn } from '@vueuse/core' //vue配置文件做了自动按需导入,这句可有可无

// 窗口自适应并开启过渡动画
const resize = () => {
  if (chart.value) {
    chart.value.resize({ animation: { duration: 300 } })
  }
}
// 自适应防抖优化
const debouncedResize = useDebounceFn(resize, 500, { maxWait: 800 })

onMounted(() => {
  initData()
  nextTick(() => {
    window.addEventListener('resize', debouncedResize)
  })
})

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.dispose()
    chart.value = null
    window.removeEventListener('resize', debouncedResize)
  }
})
```

