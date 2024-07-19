# 前言

客户端路由的作用是在单页应用 (SPA) 中将浏览器的 URL 和用户看到的内容绑定起来。当用户在应用中浏览不同页面时，URL 会随之更新，但页面不需要从服务器重新加载

## 使用

1、 this.$router.push 进行编程式路由跳转

2、 router-link 进行页面按钮式路由跳转

3、 this.$route.params 获取路由传递参数

4、this.$route.query 获取路由传递参数

5、 params 和 query 都是传递参数的，params 不会在 url 上面出现，并且 params 参数是路由的一部分，是一定要存在的 query 则是我们通常看到的 url 后面的跟在？后面的显示参数

```js
//直接跳转,通过path
this.$router.push({path:`/lucky/${id}`})
this.$route.params.id   //子组件获取
{                       //路由中配置
    path:'/lucky/:id',
    name:'lucky',
    component：Lucky
}

在地址栏中显示传递的参数id, ，刷新页面，参数不丢失
```

```js
//通过路由属性中的name来确定匹配的路由，通过params来传递参数
this.$router.push({
          name: 'particulars',
          params: {
            id: id
          }
      })

接收
this.$route.params.id

地址栏中不显示参数，刷新页面，参数丢失
```

```js
//query传递的参数会显示在url后面?id=？
this.$router.push({
          path: 'particulars',
          query: {
            id: 1
          }
      })

接收
this.$route.query.id    拿值

参数显示在地址栏中，刷新页面参数不丢失
```
项目中遇到删除不需要的url后面的参数

```js
    if (this.$route.query.deviceId) {
      console.log("🚀 ~ created ~ this.$route.query:", this.$route.query);
      // 如果路由中携带了 deviceId 参数，则删除它
      let query = { ...this.$route.query };
      delete query.deviceId;
      this.$router.replace({ query });
      console.log("🚀 ~ created ~ this.$route.query:", this.$route.query);
    }

```