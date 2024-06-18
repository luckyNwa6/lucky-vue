# 前言

 JavaScript 提供的一种在浏览器端存储数据的机制，它允许我们将数据以键值对的形式保存在用户的本地浏览器中

## 常用缓存

**Cookie**

优点：浏览器关闭后，cookie 仍然存在，因此用户可以保持登录状态

缺点：容易受到[CSRF](https://so.csdn.net/so/search?q=CSRF&spm=1001.2101.3001.7020)（跨站请求伪造）攻击

**SessionStorage**

它只在当前会话中存在，当用户关闭浏览器后，sessionStorage 中的数据将被清除

缺点：如果用户在浏览器中打开新的标签页或窗口，那么新的页面将无法访问 sessionStorage 中的数据

**LocalStorage**

一般将 token 存储在 localStorage 中

优点：即使在浏览器关闭后，localStorage 中的数据仍然存在，因此用户可以保持登录状态

localStorage 中的数据可以在同一浏览器的所有标签页和窗口中共享

缺点：容易受到 XSS（跨站脚本）攻击

## Demo

```js
vue项目中
*****localStorage

let user = JSON.stringify(res.data.user)   字符串转成json格式
localStorage.setItem('user', user) 存
localStorage.getItem("user")   读取
JSON.parse(localStorage.getItem("user"))  json转为对象格式才能.出来，重点
localStorage.setItem("user", ""); 设为空
localStorage.removeItem('user')  //移除


*****sessionStorage

sessionStorage.setItem('token', data.token) 字符串格式不需要转
sessionStorage.getItem('token')   可以直接这样读,因为只存了一个token字符串
sessionStorage.setItem('ADMIN', JSON.stringify(data)) 存
sessionStorage.removeItem('user') 删


*****cookie

"vue-cookie": "^1.1.4",
import VueCookie from "vue-cookie"
Vue.use(VueCookie);

在request.js中发起请求拦截器里添加,记得先引入Vue
    config.headers["picToken"] = Vue.cookie.get("picToken"); // 请求头带上token
    return config;

this.$cookie.set("picToken", data.token);
this.$cookie.get('picToken')

uniapp中

//存储token,只需要存字符串即可
uni.setStorageSync('token', res.data.data.token);  同步存
uni.setStorageSync('userInfo', JSON.stringify(res.data.data));

uni.clearStorageSync();  删
const obj=JSON.parse(uni.getStorageSync('userInfo')); 读

// 将字符串转json格式存本地
this.setUser(res.data.data);//存vuex里不需要转json,默认转对象,np
this.setToken(res.data.data.token);

其他地方vuex拿值
import { mapGetters } from 'vuex';
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
    getMyMsg() { //不用转都能拿到
      getMyMsgs(this.getUser.userId).then(res => {
        console.log(this.getUser.token);
        this.myMsg = res.data.data;
      });
    }
  }
```
