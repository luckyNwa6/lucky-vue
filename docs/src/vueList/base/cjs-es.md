# 前言

语法差异
CommonJS：使用 require() 导入模块，使用 **module.exports 或 exports 导出模块**
ES Module：使用 import 导入模块，使用 export 导出模块

编译时 vs 运行时：
CommonJS 是在运行时加载模块，模块代码是动态执行的
ES Module 是在编译时静态解析模块依赖关系，以便更好地进行优化和静态分析

异步加载：
CommonJS 不支持异步加载模块，只能同步加载
ES Module 支持异步加载模块，可以使用动态 import() 实现按需加载模块

作用域：
CommonJS 模块在运行时将模块中定义的变量放在一个单独的作用域中，并且是值的拷贝
ES Module 模块会创建一个词法作用域，在模块中定义的变量不会被外部访问，需要显式导出才能被其他模块引用

循环依赖：
CommonJS 允许循环依赖，但可能会导致一些问题
ES Module 不允许循环依赖，会在静态解析阶段就报错

总的来说，ES Module 是 ECMAScript 的官方标准，具有更好的静态分析、异步加载和模块作用域等特性；而 CommonJS 在 Node.js 等环境下广泛使用，是一种常见的模块系统。在现代的 Web 开发中，通常推荐使用 ES Module 来组织和管理模块

## 使用
CommonJS自定义的模块，默认有
```js
module.exports = {}
```
**A:自定义模块a**
```js
const age = 20
// 向 module.exports 对象上挂载 username 属性
module.exports.username = 'aa'
// 向 module.exports 对象上挂载 sayHello 方法
module.exports.sayHello = function () {
  console.log('Hello')
  return '返回值'
}
module.exports.age = age
```
调用，前面区别说了，这里的module可以省略，直接export.age这种即可
```js
const myNode = require('./myNode')
console.log(myNode.sayHello())
```
**B:如果a里额外新增,等于覆盖默认的，所以只会导出这个,上面的方法也调用不到**
```js
module.exports = {
    nickname: "ZZZ",
}
```
要么直接声明A方案，省略module，或者使用B直接导出一个对象，不要混用，自己会乱
