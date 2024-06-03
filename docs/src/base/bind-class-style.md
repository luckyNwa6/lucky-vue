# Class 与 Style 绑定

数据绑定的一个常见需求场景是操纵元素的 CSS class 列表和内联样式。因为 class 和 style 都是 attribute，我们可以和其他 attribute 一样使用 v-bind 将它们和动态的字符串绑定。但是，在处理比较复杂的绑定时，通过拼接生成字符串是麻烦且易出错的。因此，Vue 专门为 class 和 style 的 v-bind 用法提供了特殊的功能增强。除了字符串外，表达式的值也可以是对象或数组。
绑定 HTML class​
绑定对象 ​
我们可以给 :class (v-bind:class 的缩写) 传递一个对象来动态切换 class：

```js
<div :class="{ active: isActive }"></div>
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

上面的语法表示 active 是否存在取决于数据属性 isActive 的真假值。

你可以在对象中写多个字段来操作多个 class。此外，:class 指令也可以和一般的 class attribute 共存。举例来说，下面这样的状态：

配合以下模板：

```js
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

渲染的结果会是：

```js
<div class="static active"></div>
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

当 isActive 或者 hasError 改变时，class 列表会随之更新。举例来说，如果 hasError 变为 true，class 列表也会变成 "static active text-danger"。

绑定的对象并不一定需要写成内联字面量的形式，也可以直接绑定一个对象：

```js
<div :class="classObject"></div>
```

这将渲染：

```js
<div class="active"></div>
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

我们也可以绑定一个返回对象的计算属性。这是一个常见且很有用的技巧：

```js
<div :class="classObject"></div>
```

绑定数组 ​
我们可以给 :class 绑定一个数组来渲染多个 CSS class：

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
<div :class="[activeClass, errorClass]"></div>
```

渲染的结果是：

```js
<div class="active text-danger"></div>
```

如果你也想在数组中有条件地渲染某个 class，你可以使用三元表达式：

```js
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

errorClass 会一直存在，但 activeClass 只会在 isActive 为真时才存在。

然而，这可能在有多个依赖条件的 class 时会有些冗长。因此也可以在数组中嵌套对象：

```js
<div :class="[{ activeClass: isActive }, errorClass]"></div>
```

在组件上使用 ​
本节假设你已经有 Vue 组件的知识基础。如果没有，你也可以暂时跳过，以后再阅读。

对于只有一个根元素的组件，当你使用了 class attribute 时，这些 class 会被添加到根元素上并与该元素上已有的 class 合并。

举例来说，如果你声明了一个组件名叫 MyComponent，模板如下：

```js
<!-- 子组件模板 -->
<p class="foo bar">Hi!</p>
```

在使用时添加一些 class：

```js
<!-- 在使用组件时 -->
<MyComponent class="baz boo" />
```

渲染出的 HTML 为：

```js
<p class="foo bar baz boo">Hi!</p>
```

Class 的绑定也是同样的：

```js
<MyComponent :class="{ active: isActive }" />
```

当 isActive 为真时，被渲染的 HTML 会是：

```js
<p class="foo bar active">Hi!</p>
```

如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 $attrs 属性来指定接收的元素：

```js
<!-- MyComponent 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```js
<MyComponent class="baz" />
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

这将被渲染为：

你可以在透传 Attribute 一章中了解更多组件的 attribute 继承的细节。

绑定内联样式 ​
绑定对象 ​
:style 支持绑定 JavaScript 对象值，对应的是 HTML 元素的 style 属性：

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

尽管推荐使用 camelCase，但 :style 也支持 kebab-cased 形式的 CSS 属性 key (对应其 CSS 中的实际名称)，例如：

```js
<div :style="{ 'font-size': fontSize + 'px' }"></div>
直接绑定一个样式对象通常是一个好主意，这样可以使模板更加简洁：

js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

```js
<div :style="styleObject"></div>
```

同样的，如果样式对象需要更复杂的逻辑，也可以使用返回样式对象的计算属性。

绑定数组 ​
我们还可以给 :style 绑定一个包含多个样式对象的数组。这些对象会被合并后渲染到同一元素上：

```js
<div :style="[baseStyles, overridingStyles]"></div>
```

自动前缀 ​
当你在 :style 中使用了需要浏览器特殊前缀的 CSS 属性时，Vue 会自动为他们加上相应的前缀。Vue 是在运行时检查该属性是否支持在当前浏览器中使用。如果浏览器不支持某个属性，那么将尝试加上各个浏览器特殊前缀，以找到哪一个是被支持的。

样式多值 ​
你可以对一个样式属性提供多个 (不同前缀的) 值，举例来说：

```js
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

数组仅会渲染浏览器支持的最后一个值。在这个示例中，在支持不需要特别前缀的浏览器中都会渲染为 display: flex。
