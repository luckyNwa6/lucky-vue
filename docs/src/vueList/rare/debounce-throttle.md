# 前言

当涉及到处理频繁触发的事件或函数时，防抖和节流是两种常用的技术，用于优化性能和改善用户体验

## 防抖

防抖用于限制连续触发的事件的执行频率。当一个事件被触发时，防抖会延迟一定的时间执行对应的处理函数。如果在延迟时间内再次触发了同样的事件，那么之前的延迟执行将被取消，重新开始计时。

**总结：在单位时间内频繁触发事件，只有最后一次生效**

场景 :用户在输入框输入 1 个字符都会发送请求，正常是全部输入完成才发送

项目中遇到的场景，需要鼠标悬浮在图表的时候，将 ToolsTip 里的数据回显到头部，由于是 2 张图表，无法直接赋值，必须通过请求后端接口，由于 ToolsTip 里的 Api 是鼠标放上面就会触发，就会出现发起了 N 个请求，这时候就可以利用防抖，只有一定时间没有动作，才会请求后端接口。

vue 中

```js
	//防抖方法,传入函数和延迟
    debounce(fn, delay) {
      let timer = null;              //默认是空
      return function () {
        if (timer) {                 //如果存在则
          clearTimeout(timer);       //清空定时器
        }
        timer = setTimeout(() => {   //赋值定时器
          fn();
        }, delay);
      };
    },
```

监听 echarts 的 tooltip 事件

```js
let charts = document.getElementById("line_charts");
let myChart = this.$echarts.init(charts);
myChart.on(
  "showTip",
  this.debounce(() => {
    that.getData();
  }, 2000)
);
```

如果是监听 input 输入框
参考如下:

```js
const inputDOM = document.getElementById("input");
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  };
}
inputDOM.addEventListener(
  "input",
  debounce(() => {
    console.log("发送请求");
  }, 500)
);
```

## 节流

节流是一种限制函数执行频率的技术。它可以确保在某个时间段内，函数不会被连续触发执行，而是以一定的时间间隔执行。

**总结：一段时间内只执行一次**

函数节流的常见应用场景是在处理**频繁触发**的事件，例如验证码刷新、窗口滚动、鼠标点击等。通过使用函数节流，可以减少事件处理函数的执行次数，提高性能和响应速度。

传入需要节流的函数和延迟即可

```js
//节流 一段时间内只执行一次
// 第一次执行cd为true,执行定时器，快速第二次进由于定时器还没有结束，cd为true，所以不执行，等待定时器结束，cd为false，执行新一轮
function throttle(fn, delay) {
  let cd = false;
  return function () {
    if (cd) {
      console.log("节流中");
      return false;
    }
    cd = true;
    setTimeout(() => {
      fn();
      cd = false;
    }, delay);
  };
}
```
