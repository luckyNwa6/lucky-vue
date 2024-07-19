# 前言

本专栏将记录 ElementUi以及ElementPlus的使用中遇到的Bug

## element-ui的表格设置固定栏后，右侧边框线消失


```css
.el-table__row td:not(.is-hidden):last-child {
  border-left:1px solid #EBEEF5;
}
 
.el-table__header th:not(.is-hidden):last-child{
  border-left:1px solid #EBEEF5;
}
 
 
.el-table__header-wrapper tr th:nth-last-child(1){
  border-right:none;
}
 
.el-table__body-wrapper tr td:nth-last-child(1){
  border-right:none;
}
```

## element表格多出一横线

```css
// 隐藏伪元素（表格多出的横线）
::v-deep.el-table::before {
  display: none !important;
}  

要是第一个不行就用第二个


 // 隐藏伪元素（表格多出的横线）
  .el-table::after,
  .el-table::before {
    display: none;
  }

```