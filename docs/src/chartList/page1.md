# 前言

本章节将记录 echarts 在项目中的常见配置，以便提高开发速度 😜

echarts 4.x（以下简称 `v4`）升级到 echarts 5.x（以下简称 `v5`），`v5` 仍然带来了一些非兼容改动，需要特别关注，`v5` 不再支持 IE8 浏览器，过渡动画的增强

[官网配置项](https://echarts.apache.org/zh/option.html#xAxis.id')



## 引用 ECharts

如果使用者在 `v4` 中这样引用了 echarts：

```js
import echarts from "echarts";
// 或者按需引入
import echarts from "echarts/lib/echarts";
```

这两种方式，`v5` 中不再支持了。

使用者需要如下更改代码解决这个问题

```js
import * as echarts from "echarts";
// 按需引入
import * as echarts from "echarts/lib/echarts";
```
