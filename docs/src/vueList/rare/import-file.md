# 前言
在vite构建的vue3项目中，没有require命令去动态引入本地图片

## Demo

引入图片方法如下：  
方式1，无法动态
```js
import emptyImage from '@/assets/home/yd_4.png'


<img :src="emptyImage" class="h-50 w-50" />

```
方法2，正常调用，传参可以v-for来获取动态的
```ts

const getFilePath = (url: string) => {
  console.log('🚀 ~ getFilePath ~ url:', url)
  let imgH = new URL(`/src/assets/home/${url}`, import.meta.url).href
  console.log('🚀 ~ getFilePath ~ imgH:', imgH)
  return imgH
}

<img :src="getFilePath('yd_4.png')" />
```
在项目中用的是芋道框架改版的，用上面的方案会出现undefined，由于import.meta.url返回的是包含查询参数的完整 URL，可能会导致路径拼接时出现错误。window.location来获取当前页面的URL路径
解决
```js
    getFilePath(url) {
      console.log('接收', url, 'SSS', window.location.href);
      let img = new URL(`/src/assets/images/${url}`, window.location.href).href;
      console.log('返回', img);
      return img;
    },
```

## 引入jquery
vue2项目由于某第三方验证码组件需要jq

安装
```shell
npm i jquery -S
```

main.js声明

```shell
import $ from 'jquery' // 本地有也可以这样 import $ from '@/assets/captcha/js/jquery.min.js' 
window.jQuery = $
window.$ = $
```
这样声明完就可以直接全局使用了

随便去新建一个vue文件，去打印一下即可，其他第三方的js需要jQuery这个对象，才去全局声明的
```js
 console.log(jQuery)
```

