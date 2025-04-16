
# 前言

vue2项目，封装的第一版弹框组件使用基于elment-ui

在vue同级创建components/dialog文件夹

里面放paramDialog.vue

父组件引入           dialogVisible要是改变量名，这个也记得改

## 弹框组件

代码如下：

```js
<ParamDialog :title="title" :dialogVisible.sync="dialogVisible" @dialog-closed="handleDialogClosed" :dataRe="dataFa" />

import ParamDialog from './components/dialog/paramDialog.vue';

components: {ParamDialog},
data() {
  return {
      // 弹出框
      dialogVisible: false,
      //要传给弹框的数据下面3个
      dataFa: null,
      title: '参数模板'
		}
},
methods: {
    handleView(row) {   //可以是修改也可以是新增
      console.log('打开dialog');
      this.dialogVisible = true;
      //下面看着传
	  this.dataFa = row;
      this.dataFa = { ...this.dataFa, time: this.queryParams.time, };
    },
    //关闭弹框,子传父的自定义事件监听
    handleDialogClosed(closed) {
      this.dialogVisible = false;
      // 在这里处理关闭状态
      console.log('子组件弹框关闭状态:', closed);
    },
}
```

子组件

```js
<!--参数模板弹框-->
<template>
  <el-dialog :title="title" :data="list" width="50%" :visible.sync="dialogVisible" :before-close="handleClose">
    <div>1</div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dataRe: {
      type: Object,
      default: {}
    },

    title: {
      type: String
    }
  },
  data() {
    return {
      queryParams: {
        pageNo: 1,
        pageSize: 15,
        time: '',
        deviceCode: '',
        stationId: null,
        type: null
      },
      // 遮罩层
      loading: true,
      // 表格
      list: []
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) {
        //说明是打开的,调用方法
        this.init();
      }
    }
  },
  computed: {},
  methods: {
    //关闭弹框
    handleClose() {
      this.$emit('dialog-closed', this.dialogVisible);
    },
    init() {
      this.loading = true;
      //处理父组件传过来的对象
      this.queryParams.time = this.dataRe.time;
      this.queryParams.stationId = this.dataRe.stationId;
      this.queryParams.deviceCode = this.dataRe.deviceCode;
      this.queryParams.type = this.dataRe.type;
      var stationNameC = this.dataRe.stationName;
      var timeC = this.dataRe.time;
      this.loading = true;
      console.log('🚀 ~ getList ~ this.queryParams:', this.queryParams);

      this.loading = false;
    }
  }
};
</script>
<style lang="scss" >
</style>

```