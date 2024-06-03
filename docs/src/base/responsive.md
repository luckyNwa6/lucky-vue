# 响应式基础

API 参考

本页和后面很多页面中都分别包含了选项式 API 和组合式 API 的示例代码。现在你选择的是 组合式 API。你可以使用左侧侧边栏顶部的“API 风格偏好”开关在 API 风格之间切换。

## 声明响应式状态

ref()​
在组合式 API 中，推荐使用 ref() 函数来声明响应式状态：

```js
import { ref } from "vue";
const count = ref(0);
```
