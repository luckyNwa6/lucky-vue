# 前言

本章节将实现一个简单的图表案例，并解析其中的具体配置

## Demo

选项式

```js
<template>
  <div>
    <div id="lucky" style="width: 600px; height: 600px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      myChart: null,
      dataX: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'], //x轴的数据
      seriesValue: [5, 20, 36, 10, 10, 20], //X轴对应的数据
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.myChart = echarts.init(document.getElementById('lucky')) // 基于准备好的dom要有宽度，初始化echarts实例
      // 指定图表的配置项和数据，不管折线图、柱状图、饼图等都需要配置，后续抽离封装
      var option = {
        title: {
          text: 'ECharts 入门示例',
        },
        tooltip: {},
        legend: {
          data: ['销量'],
        },
        xAxis: {
          data: this.dataX,
        },
        yAxis: {

        },
        series: [
          {
            name: '销量', //数据中对应的名称
            type: 'bar', //柱状图
            data: this.seriesValue,
          },
        ],
      }
      // 使用刚指定的配置项和数据显示图表，后续有点击事件
      this.myChart.setOption(option)
    },
  },
}
</script>
```

组合式

```js
const chart = ref(null)
const chartId = 'productType' + Math.round(Math.random() * 10000)

  chart.value = echarts.init(document.getElementById(chartId))

  chart.value.setOption(option, true)
```

