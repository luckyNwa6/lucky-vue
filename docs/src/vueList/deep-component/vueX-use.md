# 前言

Vuex 是 Vue.js 的官方状态管理库，用于在 Vue 应用程序中管理数据的集中式存储。它基于 Flux 和 Redux 的概念，提供了一种可预测、可维护的状态管理方案，使得应用程序的状态管理变得更加简单和高效



## 核心

state

+ 用于存储应用程序的状态数据，类似于组件中的 data。所有的状态都被存储在一个单一的状态树中，可以通过 `this.$store.state` 访问

getters

+ 用于从状态树中派生出一些衍生状态，类似于计算属性。Getter 可以对状态进行包装和计算，使得组件可以直接获取派生的状态，而不需要重复编写逻辑

mutations

+ 提交更新数据的方法，必须是同步的(如果需要异步使用 action)
+ 每个 mutation 都有一个字符串的事件类型（type）和一个回调函数（handler）
  回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数，提交载荷作为第二个参数

action

+ 和 mutation 的功能大致相同，不同之处在于
+  Action 提交的是 mutation，通过 `dispatch` 方法触发 Action，而不是直接变更状态
+ Action 可以包含任意异步操作

modules

+  模块化 VueX，可以让每一个模块拥有自己的 state、mutation、action、 getters，使得结构非常清晰，方便管理

## Demo1

```js
(1)index.js文件夹配置如下

import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)
export default new Vuex.Store({
  strict: true,
  modules: {
    user
  }
})

(2)main.js也要声明

import store from './store'
new Vue({
  store,
  render: (h) => h(App)
}).$mount('#app')

(3)user.js

export default {
  state: {
    user: '', // 登录的用户
  },
  getters: {
    getUser(state) {
      return state.user
    }
  },
  mutations: {
    setUser(state, data) {
      state.user = data
    }
  },
  actions: {
    setUser({ commit }, data) {
      commit('setUser', data)
    }
  }
}

(4)使用

（11）{{$store.state.user}}   this.$store.getters.getUser

（22）Vuex规定必须通过mutation修改数据，不可以直接通过store修改状态数据

import { mapActions } from "vuex"; //通过这个设置值
import { mapGetters } from "vuex"; //通过这个获取值
  computed: {    //计算属性
    ...mapGetters(["getUser","token"])
  },
  methods: {
 	//需要给user赋值时候直接this.setUser(值),拿调用this.getUser()
    ...mapActions(["setUser","setToken"]),
    }
```

## Demo2

```js
//比如在登录时候调用这个vuex里的方法
this.$store.dispatch(Action中的方法如LoginLucky,userInfo).then(res=>{
    //处理resolve()返回结果
}).catch(()=>{
    //处理reject()
})
state:{
    sysId:getStore({name:'sysId'}) || ''
},
mutation:{
    SET_SYSID:(state,sysId)=>{
        state.sysId=sysId 
        setStore({name:'sysId',content:state.sysId})  //存缓存中 去找个localStorage工具类|sessionStorage工具类用
    }
},

action:{
	LoginLucky({commit,dispatch},userInfo={}){
        return new Promise((resolve,reject)=>{
            //这里面的异步请求
            //比如获取到系统id
            commit('SET_SYSID',sysId) //触发mutation方法
            //最外层的一个异步处理完resolve()
            //最外层一个异步的catch里reject()
        })
    }
}

```

