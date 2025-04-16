# 前言

Flex是Flexible Box的缩写，弹性布局

基础概念：

1. flex 容器（flex container）
2. flex 项目（flex item）
3. 主轴（main axis)
4. 交叉轴（cross axis）
5. 占用主轴空间（main size）
6. 占用交叉轴空间（cross size）
7. 线轴起止点（main start、main end、cross start、cross end）

Flex 布局发生在父和子容器之间，父一旦被申明为 Flex 布局（flex 容器），它的所有子元素自动成为容器成员（flex 项目）

项目（flex 项目）默认是沿主轴X方向排列的，单个项目占据主轴的空间称之为 main size，占据交叉Y轴的空间称之为 cross size

## Flex布局

下面的属性一般设置给父容器，样式取值图：

![flex1](https://imgs.luckynwa.top/profile/mdS/flex1.png)

垂直换行flex-direction: column 加flex-wrap: wrap，如果有2列，就从1列开始从上到下，多了就第二列

![flex1](https://imgs.luckynwa.top/profile/mdS/flex2.png)

![flex3](https://imgs.luckynwa.top/profile/mdS/flex3.png)



```CSS
.box {
  display: flex;
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

space-between 会使项目两端对齐，并且项目之间的间距相同

space-around 同样会是的项目间距相同，不同之处是与两端也会有间距



容器成员属性

![flex4](https://imgs.luckynwa.top/profile/mdS/flex4.png)

flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大

flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。负值对该属性无效。如果flex-shrink值为0，表示该项目不收缩

flex-basis属性定义了在分配多余空间之前，项目占据的**主轴空间**（main size）浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小

======================================================================================

flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。

flex: auto  相当于 flex: 1 1 auto

flex: none 相当于 flex: 0 0 auto

可以给子div设置比如3个，A:flex:1  B:flex:2  C:flex:1      均分1宽度， B占一半

