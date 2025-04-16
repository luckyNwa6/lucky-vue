# 前言

item------->每个元素值 (必)
index----->索引（可选）  
arr-------- >当前数组（可选）
推荐 vscode 的一款插件来写以下的 demo，该插件可以直接在 js 文件中显示结果，搜 Quokka.js
用这个插件去新建一个 js 文件，直接就运行在 node 上了



## 常规

下面都是----数组名.下面方法  **下面几个都改变原数组** 

+ push（） 末尾添加数据       return数组的长度

+ pop（） 末尾出删除数据     return删除的那个数据

+ unshift（） 头部添加数据   return数组的长度

+ shift（） 头部删除数据        return删除的那个数据

+ reverse（）翻转数组          return翻转好的数组

+ sort（） 排序 

  ```js
  var myArray=[1,0,44,3]
  myArray.sort()// 没变化，正序
  myArray.sort((a,b)=>{return a-b})//从小到大
  myArray.sort((a,b)=>{return b-a})//从大到小
  console.log(myArray);
  
  ```

+ splice（）截取数组

  ```js
  var arr=[1,0,44,3]
  var res=arr.splice(1,2)//参数1表示开始索引,参数2表示截取2个
  console.log(res);//截取[ 0, 44 ] 
  console.log(arr);//结果[ 1, 3 ]
  
  var arr2=[1,2,3,4,5,6]
  arr2.splice(0, arr2.length, ...arr)//参数1表示开始索引,参数2表示多少个，后续可以无数个要插入的数据，这里用解构上面数组插入
  console.log(arr2);//[ 1, 3 ]
  ```

+ concat（） 合并数组    return一个新的数组   **下面几个都不改变原数组** 

  ```js
  var arr=[1,0,44,3]
  var res=arr.concat(1,2)//参数1表示开始索引,参数2表示截取2个
  console.log(res);
  console.log(arr);//[1,0,44,3]
  ```

+ join（） 数组转字符串  不改变原

  ```js
  var arr=[1,0,44,3]
  var res=arr.join('-')//参数1表示开始索引,参数2表示截取2个
  console.log(res);//'1-0-44-3'
  ```

+ slice（）截取数组的一部分数据  和上面有个很像少了个p

  ```js
  var arr=[1,0,44,3]
  var res=arr.slice(1,2)//索引 左闭合右开
  console.log(res);//[0]
  ```

+ indexOf(要查询的数据)  从左检查数组中有没有这个数值

  如果有就返回该数据第一次出现的索引   没有返回 -1  

  还可以数组名.indexOf(要查询的数据,开始索引)

+ lastIndexOf   从右边开始类似上面

```js
dmeo1(字符串中含-)
      if(s.indexof('-')>0){
   		let parts= s.split('-')   切割成数组
   		parts[parts.length-1] //获取最后一个的值
	 }

```



## for..in

for in中index索引为字符串型数字，会遍历数组[所有的可枚举属性]，一般遍历对象用的

遍历的是数组的索引

```js
var myArray=[1,2]
myArray.name="name数组"
for (var index in myArray) {
    console.log("字符串型数字:", index) //'0' '1' '2'
    console.log(myArray[index]);//结果 1，2，"name数组"
}
```

## for..of

遍历的是数组元素值

```js
let arr=[ 
  {name:'张三',age:23},
  {name:'张三',age:25}
]

for(let cont of arr){
  console.log(cont);  // {name:'张三',age:23},{name:'张三',age:25}
}
```

## forEach

不返回新数组，返回undefined

不适合要中止或跳出循环的情况

直接修改原数组

```js
const aa = [1, 2, 3, 4, 5, 6];
const a = aa.forEach((item, index, arr) => {
  console.log(item, index, arr);
  arr[index] = 2 * item;
});
console.log(a);      //undefined
console.log(aa);    //[ 2, 4, 6, 8, 10, 12 ]
```

## map

返回一个新的数组，遍历中没值返回undefined

原数组不改变

```js
const bb = [1, 2, 3, 4, , 6];
const b = bb.map((item, index, arr) => {
  console.log(item);
  return 2 * item;
});
c=bb.map((v) => v * 2);
console.log(b);		//[ 2, 4, 6, 8, undefined, 12 ]
console.log(bb);	//[ 1, 2, 3, 4, undefined, 6 ]
console.log(c);		//[ 2, 4, 6, 8, undefined, 12 ]
```

## every

返回一个布尔值，表示数组中所有元素是否都满足条件

顺序遍历如果有一个不满足就打断并返回false

```js
const cc = [11, 2, 3, 4, 5, 6];
const c = cc.every((v) => {
  console.log(v); //11,2
  return v > 2;
});
console.log(c); //false
```

## some

返回一个布尔值，表示数组中是否存在满足条件的元素

顺序遍历，找到就马上返回true，不再继续

```js
const dd = [1, 2, 3, 4, 5, 6];
const d = dd.some((v) => {
  console.log(v);//1,2,3
  return v > 2;
});
console.log(d);//true
```

## find

返回数组中第一个满足条件的元素

都不满足则返回undefined

findIndex方法和这个差不多，返回索引，没找到则返回-1

```js
const ee = [1, 2, 3, 4, 5, 6];
const e = ee.find((v) => v > 3);
console.log(e);//4
```

## filter

filter方法会返回一个新的数组

包含所有满足条件的元素

```js
const ff = [1, 2, 3, 4, 5, 6];
const f = ff.filter((v) => v > 3);
console.log(f);//[ 4, 5, 6 ]
```

## reduce

返回一个值，这个值是通过将数组中的每个值（从左到右）

开始reducer函数应用于初始值（或前一个结果）而计算得出的

前2个参数是必须的，第一个参数为**累加值**，是上次返回的结果，第**二**个参数为**当前元素**

initValue是可选的，表示传递给函数的初始值。如果没有提供，则将使用数组的第一个元素

```js
const gg = [1, 2, 3];
const initValue = 0;
const g = gg.reduce((accumulator, currentValue, index, arr) => {
  console.log(accumulator, currentValue);//[0,1],[1,2],[3,3]
  return accumulator + currentValue;
}, initValue);
console.log(g);//6
```

## 总结

forEach 不会返回一个新的数组，只有它里面改值会影响原数组

map 可以返回新数组用于映射，如每个元素都加倍或执行其他转换操作

every 返回一布尔值，需数组中全部满足

some 只要满足一个

find 返回第一个满足的元素值

filter    过滤返回新数组，如筛选出所有偶数或满足其他条件的元素

reduce     用于计算
