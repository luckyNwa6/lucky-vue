# 前言

本专栏将记录 ElementUi以及ElementPlus的使用，以便提高开发速度 😜

[ElementUi官网](https://element.eleme.cn/#/zh-CN/component/installation)

[ElementPlus官网](https://element-plus.org/zh-CN/component/button.html)

## 引用 Element

Vue2版用的是ElementUi，一般都是在main.js中直接引入

```js
npm i element-ui -S

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
```

Vue3版用的是ElementPlus，不过一般都配合自动导入

```js
 npm install element-plus --save
 
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```
