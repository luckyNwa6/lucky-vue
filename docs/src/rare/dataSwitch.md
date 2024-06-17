# 前言

日期转换在项目中经常需要使用，下面总结 2 种常用的时间转换

## 高级版

Day.js 是一个极简的 JavaScript 库，可以为现代浏览器解析、验证、操作和显示日期和时间。

[Day.js 中文网](https://dayjs.fenxianglu.cn/category/manipulate.html#%E5%A2%9E%E5%8A%A0)

vue2 中安装 ,yarn 安装报错，选择用 npm

```shell
npm i dayjs
```

全局 main.js 引入

```js
import dayjs from "dayjs";
Vue.prototype.dayjs = dayjs;
```

使用案例

```js
<template>
  <div></div>
</template>

<script>
// import dayjs from 'dayjs'
export default {
  methods: {
    init() {
      //基础调用Start-----------------------------------------------------------------------------------
      var nowTime0 = this.dayjs().unix()
      console.log('🚀 ~ convertDateTimeFormat ~ 时间戳（秒）nowTime0:', nowTime0) //1706749967
      var nowTime2 = this.dayjs().format('YYYY/MM/DD')
      console.log('🚀 ~ convertDateTimeFormat ~ 年月日格式化nowTime2:', nowTime2) // 2024/02/01
      var nowTime3 = this.dayjs().format('YYYY-MM-DD HH:mm:ss')
      console.log('🚀 ~ convertDateTimeFormat ~ 年月日时分秒nowTime:', nowTime3) //2024-02-01 09:12:15
      var nowTime4 = this.dayjs().valueOf()
      console.log('🚀 ~ convertDateTimeFormat ~ 时间戳（毫秒）nowTime4:', nowTime4) //1706750110311

      const nowStartDay = this.dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS')
      console.log('🚀 ~ convertDateTimeFormat ~ 获取当天的开始时间格式化nowStartDay:', nowStartDay)
      const nowEndDay = this.dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS')
      console.log('🚀 ~ convertDateTimeFormat ~ 当天的结束时间格式化nowEndDay:', nowEndDay)
      const date1 = this.dayjs('2023-01-10')
      const date2 = this.dayjs('2023-11-10')
      const diffDay = date2.diff(date1, 'd') //D是day的缩写也可以，月日都是首字母大写缩写.其他年、周、小时分都是小写,全拼则都是小写
      console.log('🚀 ~ convertDateTimeFormat ~ 时间差（天）dif:', diffDay)
      //基础调用END-----------------------------------------------------------------------------------
      //传值，通过案例去举一反三
      const convertTime1 = this.dayjs(1706753478000).format('YYYY-MM-DD HH:mm')
      console.log('🚀 ~ convertDateTimeFormat ~ 时间戳转日期格化convertTime:', convertTime1) // 2024-02-01 10:11

      const convertTime2 = this.dayjs('2024/01/29 08:55:18').format('YYYY-MM-DD HH:mm')
      console.log('🚀 ~ convertDateTimeFormat ~ 日期字符串格化convertTime:', convertTime2) // 2024-01-29 08:55
      // console.log('如果不想全局引入就把main.js那删了，这里引入即可，不需要加this即可使用：' + dayjs())
    },
  },
  created() {
    this.init()
  },
}
</script>
<style>
</style>

```

## 初级版

将后端传来的数组

```js
["2024/01/29 08:55:18", "2024/01/29 09:55:18", "2024/01/29 10:11:18"];
```

转为

```js
["2024-01-29 08:55", "2024-01-29 09:55", "2024-01-29 10:11"];
```

方法

```js
    convertDateTimeFormat(arr) {
      var tempArr = arr.map(function (dateTime) {
        var date = new Date(dateTime)
        var formattedDateTime =
          date.getFullYear() +
          '-' +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + date.getDate()).slice(-2) +
          ' ' +
          ('0' + date.getHours()).slice(-2) +
          ':' +
          ('0' + date.getMinutes()).slice(-2)
        return formattedDateTime
      })
      return tempArr
    },
```

如果只传入

```js
"2024/01/29 08:55:18";
```

转

```js
"2024-01-29 08:55";
```

```js
    convertDateTimeFormat(dateTime) {
      var date = new Date(dateTime)
      var formattedDateTime =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2)
      return formattedDateTime
    },

```

传入时间戳**数字类型**

```js
var curveTimestamp = 1706753478000;
```

转

```js
"2024-02-01 10:11";
```

方法

```js
    convertDateTimeFormat(timestamp) {
      var date = new Date(timestamp)
      var formattedDateTime =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2)
      return formattedDateTime
    },
```

