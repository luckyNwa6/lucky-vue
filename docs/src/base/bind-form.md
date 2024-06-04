# 表单输入绑定

手动连接值绑定和更改事件监听器很麻烦，v-model帮我们简化了这一步骤

```js
<template>
  <input :value="text" @input="event => text = event.target.value">
  <hr>
  <input v-model="text" placeholder="edit me" />
  <p>Message is: {{ text }}</p>
</template>

<script>
export default {
  data() {
    return {
      text: 'Hello World!'
    }
  }
}
</script>

```

v-model 不会在输入拼音阶段时触发更新。如果想在拼字阶段也触发更新，使用input 事件监听器和 value 绑定

## 多行文本 ​

```js
<template>
  <span>Multiline message is:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <textarea v-model="message" placeholder="add multiple lines"></textarea>
  <hr>
  <p style="white-space: pre-line;">{{ text }}</p>
  <textarea :value="text" @input="event => text = event.target.value"></textarea>
</template>
<script>
export default {
  data() {
    return {
      message: '',
      text: '',
    }
  }
}
</script>
```

## 选项框 ​
复选框、单选按钮、选择器

```js
<template>
  <input type="checkbox" id="checkbox" v-model="checked" />
  <label for="checkbox">是否勾选</label>
  {{ checked }}
  <hr>
  <div>Checked names: {{ checkedNames }}</div>

  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>

  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>

  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>

  <hr>
  <div>Picked: {{ picked }}</div>

  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">One</label>

  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Two</label>
  <hr>
  <div>Selected: {{ selected }}</div>
  <select v-model="selected">
    <option disabled value="">Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <hr>
  <select v-model="selected2">
    <option v-for="option in options2" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      checkedNames: [],
      picked: "One",
      selected: "",
      selected2: 'A',
      options2: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ]
    }
  }
}
</script>
```

## 修饰符 ​

`.lazy`

v-model 会在每次 input 事件后更新数据 (IME 拼字阶段的状态例外)。你可以添加 lazy 修饰符来改为在每次 change 事件后更新数据：

```js
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

`.number`
可以确保即使浏览器返回的是字符串，Vue也会尝试将其转换为Number类型

```js
<input v-model.number="age" />
```

如果该值无法被 parseFloat() 处理，那么将返回原始值。

`.trim​`
默认自动去除用户输入内容中两端的空格，你可以在 v-model 后添加 .trim 修饰符：

```js
<input v-model.trim="msg" />
```

