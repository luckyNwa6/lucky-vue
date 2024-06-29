# 前言

本章节将实现一个上传功能，结合项目的真正需求

## 原生上传

由于需要校验压缩包中的内容

```shell
npm  i  jszip
```

简单上传页

```js
<template>
  <div>
    <input ref="fileInput" type="file" multiple @change="handleFileChange" style="display: none" />
    <button @click="openFileInput">选择文件</button>
    <button @click="resetFileInput">重置</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JSZip from 'jszip'

const fileInput = ref(null) // 创建一个 ref 引用

const openFileInput = () => {
  fileInput.value.click() // 打开文件选择对话框
}

const handleFileChange = (event) => {
  const files = event.target.files // 获取选中的文件列表
  console.log(files)

  // 遍历文件列表
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    reader.onload = (e) => {
      const zipData = e.target.result // 获取ZIP文件的内容

      // 使用JSZip解压缩ZIP文件
      JSZip.loadAsync(zipData).then((zip) => {
        // 处理解压缩后的内容
        zip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            // 如果是文件而不是目录
            zipEntry.async('string').then((fileContent) => {
              // 处理文件内容
              console.log(`文件名：${zipEntry.name}`)
              // console.log(`文件内容：${fileContent}`)
            })
          }
        })
      })
    }

    reader.readAsArrayBuffer(file) // 以ArrayBuffer格式读取文件内容
  }
}

const resetFileInput = () => {
  fileInput.value.value = '' // 通过 .value 访问和修改引用的值
}
</script>

<style scoped></style>

```

在上传的过程中，如果第一次上传a文件，第二次再上传会没有效果，因为浏览器的缓存，需要去引用上传实例里的输入框设为空才能继续，由于业务要求，需要点击菜单下拉框里的按钮触发选择文件夹

```js
  uploadRef.value.$el.querySelector('input').value = '';//可上传同名
  uploadRef.value.$el.querySelector('input').click(); //触发点击选择文件框
```

业务过程：

原是列表上有个上传按钮--->点击弹框显示上传弹框--->在这里上传，由于一旦关闭弹框就要重新传而且影响用户其他操作--->采用新页面给它异步上传就不影响用户操作别的东西

新上传页面-->文件有它的格式要求-->用了部分的elementplus的上传组件（正常它的上传按钮都是在这个组件插槽里的，我这自定义按钮放外面所以都用不了该组件的方法如提交）-->验证zip里的格式-->进度条3种状态

![](https://luckynwa.top/mypic/mdS/image-20240629083303813.png)

采用组合式写法

```js
<template>
  <div class="upload-container">
    <div style="text-align: center; width: 100%; padding: 20px 0"><h2>导入模型</h2></div>
    <el-card style="width: 90%; margin: 0 auto; padding: 10px 25px; height: 780px; overflow: auto">
      <p class="font-bold text-[14px]">上传目标路径: 全部文件</p>
      <p class="text-[14px] mt-4 mb-4">支持以下类型和格式的模型导入。</p>

      <el-table :data="tableData" border style="width: 35%">
        <el-table-column prop="typeL" label="类型" align="center">
          <template #default="scope"> <span style="font-weight: 600">格式</span> </template></el-table-column
        >
        <el-table-column prop="2DL" align="center">
          <template #header>
            <span>
              二维地图
              <el-tooltip placement="right" effect="light" popper-class="image-tooltip">
                <template #content>
                  <img :src="image2d" />
                </template>
                <i-ep-info-filled />
              </el-tooltip>
            </span>
          </template>
          <template #default="scope"> <span style="font-weight: 600">png</span></template>
        </el-table-column>
        <el-table-column prop="DYL" align="center">
          <template #header>
            <span>
              点云
              <el-tooltip placement="right" effect="light" popper-class="image-tooltip">
                <template #content>
                  <img :src="imageDY" />
                </template>
                <i-ep-info-filled />
              </el-tooltip>
            </span>
          </template>
          <template #default="scope"> <span style="font-weight: 600">pnts</span> </template>
        </el-table-column>
        <el-table-column prop="QXL" align="center">
          <template #header>
            <span>
              倾斜模型
              <el-tooltip placement="right" effect="light" popper-class="image-tooltip">
                <template #content>
                  <img :src="imageQX" />
                </template>
                <i-ep-info-filled />
              </el-tooltip>
            </span>
          </template>
          <template #default="scope">
            <span style="font-weight: 600">b3dm</span>
          </template>
        </el-table-column>

        <el-table-column prop="QJL" align="center">
          <template #header>
            <span> 全景照片 </span>
          </template>
          <template #default="scope"> <span style="font-weight: 600">jpeg &nbsp jpg</span> </template>
        </el-table-column>
      </el-table>

      <div class="text-[14px] h-20">
        <p class="mt-4">除了全景照片可以直接上传文件（格式：jpg, jpeg）以外，其余类型的文件请将单个模型按照对应格式</p>
        <p class="mt-3">的文件结构压缩成为zip包（小于 30GB）后，再进行上传。</p>
      </div>
      <el-dropdown class="mb-4">
        <el-button type="primary" :disabled="btDisable"
          ><i-ep-upload /> 导入<i-ep-arrow-down style="margin-left: 5px" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openEditDialog('QX')" :disabled="btDisable">倾斜模型</el-dropdown-item>
            <el-dropdown-item @click="openEditDialog('DY')" :disabled="btDisable">点云</el-dropdown-item>
            <el-dropdown-item @click="openEditDialog('2D')" :disabled="btDisable">二维地图</el-dropdown-item>
            <el-dropdown-item @click="openEditDialog('QJ')" :disabled="btDisable">全景照片</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-upload
        ref="uploadRef"
        :action="addApi"
        :headers="headers"
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        :show-file-list="false"
        :on-change="handleChange"
        :auto-upload="false"
        v-show="false"
        multiple
      >
      </el-upload>
      <div class="mb-4">
        <i-ep-warning-filled style="color: #ff9900; margin-left: 5px" />
        <span style="color: #ff9900; margin-left: 5px">上传过程中请勿关闭浏览器或退出当前页面！</span>
      </div>
      <el-table
        :data="tableFileData"
        border
        class="mb-4"
        highlight-current-row
        v-loading="loading"
        height="290px"
        ref="tableRef"
      >
        <el-table-column prop="file_name" label="文件名称" width="380" align="center" show-overflow-tooltip />
        <el-table-column label="上传进度" align="center" show-overflow-tooltip>
          <template #default="scope">
            <div v-if="scope.row.showProgress">
              <el-progress
                :percentage="scope.row.uploadProgress"
                :color="customColorMethod(scope.row.uploadProgress, scope.row.state)"
              />
            </div>
            <div v-else-if="scope.row.showProgress === 0 && scope.row.file_tip === ''">
              <span></span>
            </div>
            <div v-else>
              <span>{{ scope.row.file_tip }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="上传状态" width="180" align="center" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ fileUploadOption.find(item => item.value == scope.row.state)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="模型类型" width="180" align="center" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ optionData.modelTypeOption.find(item => item.value == scope.row.model_type)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
            <el-button type="danger" v-if="!scope.row.showDel" link @click.stop="handleDelete(scope.row)"
              >取消</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button type="primary" @click="btDis" :disabled="btDisable">{{ uploadBtnName }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import _ from 'lodash';
import { ElMessage } from 'element-plus';
import image2d from '@/assets/model-import/image2d.png';
import imageDY from '@/assets/model-import/imageDY.png';
import imageQX from '@/assets/model-import/imageQX.png';
import { useUserStoreHook } from '@/store/modules/user';
import JSZip from 'jszip';
import axios from 'axios';
import optionData from '@/utils/option-data';
//文件上传状态
const fileUploadOption = [
  {
    value: 3,
    label: '待上传'
  },
  {
    value: 2,
    label: '正在上传'
  },
  {
    value: 1,
    label: '上传成功'
  },
  {
    value: 0,
    label: '上传失败'
  },
  {
    value: 4,
    label: ''
  }
];
//占用一行，不用改
const tableData = [
  {
    typeL: '格式',
    QXL: 'zip',
    DYL: 'zip',
    '2DL': 'zip',
    QJL: 'jpeg,jpg'
  }
];
//上传的文件列表展示
const tableFileData = ref([
  // {
  //   file_name: '文件名称2.zip',
  //   showProgress: 1,
  //   uploadProgress: 20,
  //   state: 2
  // },
  // {
  //   file_name: '文件名称3.zip',
  //   showProgress: 1,
  //   uploadProgress: 20,
  //   state: 0
  // },
  // {
  //   file_name: '文件名称1.zip',
  //   showProgress: 1,
  //   uploadProgress: 100,
  //   state: 1
  // },
  // {
  //   file_name: '文件名称1.zip',
  //   showProgress: 0,
  //   state: 3
  // },
  // {
  //   file_name: '文件名称1.zip',
  //   showProgress: 0,
  //   file_tip: '不支持的文件结构，请按照上传模型的结构要求上传文件。',
  //   state: 4
  // }
]);
const loading = ref(false);
const uploadRef = ref(null);
const tableRef = ref('tableRef');
const uploadBtnName = ref('上传');
const addApi = ref(null);
const userStore = useUserStoreHook();
const headers = reactive({ 'X-Auth-Token': userStore.token });
const typeModel = ref(null);
const btDisable = ref(false); //上传和导入按钮是否禁用
const fileList = ref([]);
const fileType3 = ['zip']; //倾斜、点云、二维都是zip格式
const fileTypeQJ = ['jpeg', 'jpg']; //全景照片

const openEditDialog = type => {
  console.log('当前要上传的类型是：', type);
  typeModel.value = type; //这里必须赋值，下面才知道类型
  console.log('打开了选中文件框');
  uploadRef.value.$el.querySelector('input').value = '';
  uploadRef.value.$el.querySelector('input').click(); //触发点击选择文件框
};

//下面是文件上传生命周期-----------------------------------------------------------------------------
const fileSize = 30;
const isTypeOk = ref();
// let tempList = []; //临时缓存列表
const handleChange = async (file, updatedFileList) => {
  console.log('=====================触发了handleChange的生命周期开始！！！');

  file.modelType = typeModel.value;
  if (file.name.length > 23) {
    ElMessage.warning(`文件名过长，请限制20字内!`);
    return;
  }
  const isLt = file.size / 1024 / 1024 / 1024 < fileSize;
  if (!isLt) {
    ElMessage.warning(`上传文件大小不能超过 ${fileSize} GB!`);
    return false;
  }

  const ob1 = fileList.value.find(obj => obj.name === file.name);
  const ob2 = tableFileData.value.find(obj => obj.file_name === file.name);
  if (ob1 || ob2) {
    ElMessage.warning(`文件已在列表中!`);
    return;
  }
  let fileExtension = '';
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
    console.log('🚀 ~文件扩展后缀是:', fileExtension);
  }
  isTypeOk.value = (typeModel.value === 'QJ' ? fileTypeQJ : fileType3).some(type => {
    if (fileExtension && fileExtension.toUpperCase().indexOf(type.toUpperCase()) > -1) return true;
    return false;
  });
  console.log('🚀 ~ handleChange ~ file:', file);
  if (typeModel.value !== 'QJ') {
    console.log('继续验证zip');
    try {
      const res = await unzipAndReadFiles(file);
      console.log('🚀 ~ handleChange ~ 解压回调:', res);
      isTypeOk.value = res;
    } catch (error) {
      isTypeOk.value = false; //捕获里面的异常
    }
  }

  if (!isTypeOk.value) {
    //格式有问题,加入列表中，不加入上传列表
    console.log('格式有问题,加入列表中，不加入上传列表');
    console.log(file.name);
    tableFileData.value.push({
      file_name: file.name,
      showProgress: 0,
      file_tip: '不支持的文件结构，请按照上传模型的结构要求上传文件。',
      state: 4,
      model_type: typeModel.value
    });
  } else {
    fileList.value.push(file);
    tableFileData.value.push({
      file_name: file.name,
      showProgress: 0,
      state: 3,
      uploadProgress: 0,
      model_type: typeModel.value
    });
    console.log('通过格式验证');
    console.log('🚀 ~ handleChange ~ updatedFileList:', updatedFileList);
    console.log('🚀 ~ handleChange ~ 要上传的文件列表:', fileList.value);
  }

  console.log('=====================触发了handleChange的生命周期结束！！！');
};

// 上传前校检格式和大小  这边使用自定义的上传，已经不触发了
const handleBeforeUpload = file => {
  console.log('触发了上传前的校验handleBeforeUpload');
  if (props.pic_type == '2D') {
    //二维地图和全景图校检文件类型
    let fileExtension = '';
    if (file.name.lastIndexOf('.') > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
      console.log('🚀 ~文件扩展后缀是:', fileExtension);
    }
    const isTypeOk = fileType2D.some(type => {
      if (fileExtension && fileExtension.toUpperCase().indexOf(type.toUpperCase()) > -1) return true;
      return false;
    });

    if (!isTypeOk) {
      ElMessage.warning(`文件格式不正确, 请上传${fileType2D.join('/')}格式文件!`);
      return false;
    }

    const isLt = file.size / 1024 / 1024 / 1024 < fileSize;
    if (!isLt) {
      ElMessage.warning(`上传文件大小不能超过 ${fileSize} GB!`);
      return false;
    }
    console.log('🚀 ~ findCommonNameIndex ~ fileList:', fileList.value);
  } else if (props.pic_type == 'QJ') {
    let fileExtension = '';
    if (file.name.lastIndexOf('.') > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
      console.log('🚀 ~文件扩展后缀是:', fileExtension);
    }
    const isTypeOk = fileTypeQJ.some(type => {
      if (fileExtension && fileExtension.toUpperCase().indexOf(type.toUpperCase()) > -1) return true;
      return false;
    });

    if (!isTypeOk) {
      ElMessage.warning(`文件格式不正确, 请上传${fileTypeQJ.join('/')}格式文件!`);
      return false;
    }
  }
  console.log('正在上传文件，请稍候...');
  return true;
};
const config = {
  headers: {
    'X-Auth-Token': userStore.token
  }
};
//手动上传
const uploadFile = async () => {
  // debugger;
  console.log('🚀 ~ 手动上传时候uploadFile ~ fileList.value:', fileList.value);
  if (!fileList.value.length) {
    ElMessage.warning('请先导入模型！');
    return;
  }

  btDisable.value = true;
  uploadBtnName.value = '正在上传';
  let arr = _.cloneDeep(fileList.value);
  let flagPro = false; //防止进度条上传成功还99
  for (let i = 0; i < arr.length; i++) {
    const file = arr[i];
    console.log('🚀 ~ uploadFile ~ file:', file);

    // 使用FormData上传
    const formData = new FormData();
    formData.append('file', file.raw, file.name);

    const index = tableFileData.value.findIndex(obj => obj.file_name === file.name); //在列表中删除提示那种没上传到服务器
    tableFileData.value[index].state = 2;
    tableFileData.value[index].showProgress = 1;
    tableFileData.value[index].uploadProgress = 0; //进度条
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BASE_API +
          `/achievement/api/v1/model/${userStore.userData.workspace_id}/uploadFile/${file.modelType}`,
        formData,
        {
          ...config,
          onUploadProgress: progressEvent => {
            // 计算进度百分比
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // console.log(`Upload Progress: ${percentCompleted}%`);
            if (percentCompleted === 100 && !flagPro) {
              console.log('这是前端的100进度条改99等后端返回0才100');
              tableFileData.value[index].uploadProgress = 99;
            } else if (flagPro) {
              tableFileData.value[index].uploadProgress = 100;
            } else {
              tableFileData.value[index].uploadProgress = percentCompleted; //更新实时进度条
            }
          }
        }
      );

      if (response.data.code === 0) {
        console.log('文件上传成功', response.data);
        flagPro = true;
        tableFileData.value[index].state = 1; //状态改成功
        tableFileData.value[index].showDel = 1; //禁用删除
        const index2 = fileList.value.findIndex(obj => obj.name === file.name); //文件列表删除，这样下次上传就没有它了
        // console.log('🚀 ~ 上传成功删除索引:', index2);
        if (index2 !== -1) {
          fileList.value.splice(index2, 1);
        }
        console.log('后端返回0了，进度条该100了');
        tableFileData.value[index].uploadProgress = 100; //进度条拉满
        console.log(
          '🚀 ~ uploadFile ~ tableFileData.value[index].uploadProgress:',
          tableFileData.value[index].uploadProgress
        );
      } else if (response.data.code === -1) {
        flagPro = false;
        tableFileData.value[index].uploadProgress = 99;
        console.log('上传失败了，后端说的');
        tableFileData.value[index].state = 0; //状态改失败
      }
    } catch (error) {
      tableFileData.value[index].state = 0; //状态改失败
      tableFileData.value[index].uploadProgress = 99;
      flagPro = false;
      ElMessage.warning(`网络异常，文件上传失败！`);
      console.error('文件上传失败', error);
    }
  }
};

const btDis = async () => {
  try {
    const res = await uploadFile();
    console.log('🚀 ~上传全部完毕，失败还能继续上传的列表：', fileList.value);
    // 所有文件上传完成
    btDisable.value = false;
    uploadBtnName.value = '上传';
  } catch (error) {
    btDisable.value = false;
    uploadBtnName.value = '上传';
  }
};

const unzipAndReadFiles = file => {
  return new Promise((resolve, reject) => {
    console.log(file);
    let modelType = file.modelType;
    file = file.raw;
    const reader = new FileReader();
    let tempBoolean = false; //用来存是否满足条件
    let tempSum = 0; //临时长度
    try {
      reader.onload = e => {
        const zipData = e.target.result; // 获取ZIP文件的内容
        // 使用JSZip解压缩ZIP文件
        JSZip.loadAsync(zipData)
          .then(zip => {
            console.log(zip);
            // 处理解压缩后的内容
            zip.forEach((relativePath, zipEntry) => {
              // console.log('🚀 ~ zip.forEach ~ zipEntry:', zipEntry);
              // console.log('🚀 ~ zip.forEach ~ relativePath:', relativePath);
              if (modelType === 'DY' && pathMatchesRuleDY(relativePath)) {
                tempSum++;
                // console.log('🚀 ~ zip.forEach ~ relativePath:', relativePath);
                // console.log('DY满足压缩格式！！！！！！');
                // console.log('🚀 ~ zip.forEach ~ Object.keys(zip.files).length:', Object.keys(zip.files).length);
                // console.log('🚀 ~ zip.forEach ~ tempSum:', tempSum);
                if (Object.keys(zip.files).length == tempSum) {
                  //同时满足正则
                  tempBoolean = true;
                }
              } else if (modelType === 'QX' && pathMatchesRuleQX(relativePath)) {
                tempSum++;
                console.log('QX满足压缩格式！！！');
                if (Object.keys(zip.files).length == tempSum) {
                  //同时满足正则
                  tempBoolean = true;
                }
              } else if (modelType === '2D' && pathMatchesRule2D(relativePath)) {
                console.log('有xyz.png格式！！！');
                tempBoolean = true;
              }
              // if (!zipEntry.dir) {
              //   // 如果是文件而不是目录
              //   zipEntry.async('string').then(fileContent => {
              //     // 处理文件内容
              //     console.log(`文件名：${zipEntry.name}`);
              //     // console.log(`文件内容：${fileContent}`);
              //   });
              // }
            });
            console.log('当前', tempBoolean);
            resolve(tempBoolean); // 解压缩完成，将Promise标记为成功，并传递isTypeOk的值
          })
          .catch(error => {
            console.log('这是解压时候遇到的异常');
            reject(error); // 将Promise标记为失败，并传递错误信息
          });
      };

      reader.readAsArrayBuffer(file); // 以ArrayBuffer格式读取文件内容
    } catch (error) {
      console.log('这里是解压外层捕获的异常');
      reject(error); // 将Promise标记为失败，并传递错误信息
    }
  });
};

const pathMatchesRuleDY = path => {
  // 根目录下第一个文件名为 "tileset.json"
  const pathRegex = /^[^/]+\/tileset\.json/;
  // 其他文件必须是 .json 或 .pnts 后缀
  const fileRegex = /\.json$|\.pnts$/i;
  // 路径以 / 结尾
  const trailingSlashRegex = /\/$/;
  return pathRegex.test(path) || fileRegex.test(path) || trailingSlashRegex.test(path);
};
const pathMatchesRuleQX = path => {
  // 根目录下第一个文件名为 "tileset.json"
  const pathRegex = /^[^/]+\/tileset\.json/;
  // 其他文件必须是 .json 或 .b3dm后缀
  const fileRegex = /\.json$|\.b3dm$/i;
  // 路径以 / 结尾
  const trailingSlashRegex = /\/$/;
  return pathRegex.test(path) || fileRegex.test(path) || trailingSlashRegex.test(path);
};
const pathMatchesRule2D = path => {
  //2D规则
  const regex = /^[^/]+\/\d+\/\d+\/\d+\.png$/;
  return regex.test(path);
};

/**
 * 删除
 */
function handleDelete(row) {
  ElMessageBox.confirm(`确认后将删除该条记录，且无法进行恢复`, '确认取消？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // const obj = tempList.find(obj => obj.file_name === row.name);
    // console.log('🚀 ~ handleDelete ~ index3:', index3);
    console.log('🚀 ~当前行的数据:', row);
    const index = tableFileData.value.findIndex(obj => obj.file_name === row.file_name); //在列表中删除提示那种没上传到服务器
    console.log('🚀 ~ handleDelete ~ tableFileData.value:', tableFileData.value);
    console.log('🚀 ~ tableFileData ~ index:', index);
    const index2 = fileList.value.findIndex(obj => obj.name === row.file_name); //文件列表删除
    console.log('🚀 ~ handleDelete ~ fileList.value:', fileList.value);
    console.log('🚀 ~ fileList ~ index2:', index2);
    if (index !== -1) {
      tableFileData.value.splice(index, 1);
    }
    if (index2 !== -1) {
      fileList.value.splice(index2, 1);
    }
    // if (obj) {
    //   debugger;
    //   uploadRef.value.handleRemove(obj);
    // }

    uploadRef.value.$el.querySelector('input').value = '';

    ElMessage.success('删除成功');
    // deleteModelT(row.file_id).then(data => {
    //   ElMessage.success('删除成功');
    //   handleQuery();
    // });
  });
}

//根据进度条百分比获取颜色
const customColorMethod = (percentage, state) => {
  if (percentage < 100 && state) {
    return '#409eff';
  } else if (percentage <= 100 && !state) {
    return '#ff3b30';
  } else if (percentage == 100) {
    return '#4bd863';
  }
};
</script>

<style scoped>
.upload-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
}

.upload-demo {
  width: 100%;
  margin-bottom: 20px;
  border: 1px dashed #d3d3d3;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
}

.el-upload__text em {
  color: #409eff;
  cursor: pointer;
}
</style>

```

## 组件上传

放在弹框中的

```js
<template>
  <el-dialog
    :title="title"
    :model-value="visible"
    width="600px"
    align-center
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div class="upload-container">
      <el-upload
        ref="uploadImgRef"
        :before-upload="handleBeforeUpload"
        :on-change="handleChange"
        :on-error="handleError"
        :on-remove="handRemove"
        :file-list="fileList"
        :on-success="handleSuccess"
        :action="addApi"
        :headers="headers"
        drag
        multiple
      >
        <template #default>
          <div class="upload-tip-box">
            <i-ep-uploadFilled class="el-icon-upload" />
            <div class="el-upload__text">点击或拖动文件上传</div>
          </div>
          <div class="tipB">支持图片格式：JPEG</div>
          <div class="tipB">支持视频格式：MP4</div>
        </template>
      </el-upload>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="closeDialog" v-loading="loading">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, defineProps, defineEmits, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStoreHook } from '@/store/modules/user';

const uploadImgRef = ref('uploadImgRef');

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '标题'
  }
});

const emit = defineEmits(['update:visible', 'submit']);
const loading = ref(false);
// 关闭弹窗
function closeDialog() {
  fileList.value = [];
  uploadImgRef.value.clearFiles();
  console.log('关闭弹框的文件列表：', fileList.value);
  emit('update:visible', false);
  emit('submit');
}
//保存
function handleSubmit() {}
//下面是上传相关
const fileList = ref([]);
const userStore = useUserStoreHook();

const addApi = import.meta.env.VITE_APP_BASE_API + `/media/api/v1/files/${userStore.userData.workspace_id}/uploadFile`;
const headers = reactive({ 'X-Auth-Token': userStore.token });
// console.log('获取到的token', headers);

const existingFileIndex = ref(null);

const handleChange = (file, updatedFileList) => {
  console.log('=====================触发了handleChange的生命周期开始！！！');
  console.log('🚀 ~ handleChange ~ updatedFileList:', updatedFileList);
  console.log('🚀 ~ handleChange ~ file:', file);
  // 查找目标元素的全部索引
  let indices = [];
  for (let i = updatedFileList.length - 1; i >= 0; i--) {
    if (updatedFileList[i].name === file.name) {
      console.log('name相等！！');
      indices.push(i);
    }
  }
  console.log('🚀 ~ handleChange ~ indices:', indices);
  // 如果有多个索引，删除第一个索引对应的元素
  if (indices.length > 1) {
    updatedFileList.splice(indices[0], 1);
  }

  // 向数组末尾插入元素
  // updatedFileList.push(file);
  console.log('🚀 ~ handleChange ~ updatedFileList:', updatedFileList);
  fileList.value = updatedFileList;
  // fileList.value = updatedFileList.slice(-3);
  console.log('=====================触发了handleChange的生命周期结束！！！');
};
//上传失败
const handleError = (file, updatedFileList) => {
  ElMessage.error(updatedFileList.name + '上传失败');
  console.log('handleError的生命周期！！！');
};
//文件列表移除文件时的钩子
const handRemove = (file, updatedFileList) => {
  fileList.value = updatedFileList;
  console.log('handRemove的生命周期！！！');
  console.log('🚀 ~ 移除后的文件列表:', fileList.value);
};
//上传成功
const handleSuccess = (file, updatedFileList) => {
  console.log('🚀 ~ handleSuccess的生命周期！！！', updatedFileList);
  console.log(updatedFileList.name + '上传成功');
  console.log('🚀 ~ 上传成功后 ~ fileList.value:', fileList.value);
  console.log('-----------------------------------------------------');
};
const fileType = ['MP4', 'JPEG'];
const fileSize = 5;

// 上传前校检格式和大小
const handleBeforeUpload = file => {
  // 校检文件类型
  let fileExtension = '';
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
    // console.log('🚀 ~文件扩展后缀是:', fileExtension);
  }
  const isTypeOk = fileType.some(type => {
    if (fileExtension && fileExtension.toUpperCase().indexOf(type.toUpperCase()) > -1) return true;
    return false;
  });

  if (!isTypeOk) {
    ElMessage.warning(`文件格式不正确, 请上传${fileType.join('/')}格式文件!`);
    return false;
  }
  // 校检文件大小   暂时没有校验大小
  // const isLt = file.size / 1024 / 1024 < fileSize;
  // if (!isLt) {
  //   ElMessage.warning(`上传文件大小不能超过 ${fileSize} MB!`);
  //   return false;
  // }
  // console.log('🚀 ~上传前fileList:', fileList.value);
  //文件重名限制
  // existingFileIndex.value = fileList.value.findIndex(item => {
  //   return item.name == file.name; //第一个是文件列表数组中 第二个是上传的
  // });
  // console.log('🚀 ~重名的索引为:', existingFileIndex.value);

  console.log('上传检查全部通过！正在上传文件，请稍候...');
  return true;
};
</script>
<style scoped lang="scss">
.app-form {
  ::v-deep {
    .el-input-number,
    .el-select {
      width: 100%;
    }
    .el-input-number .el-input__inner {
      text-align: left;
    }
    .el-input-number.is-controls-right .el-input__wrapper {
      padding-left: 11px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__wrapper {
      width: 100%;
    }
  }
}
.upload-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 300px;
}

:deep(.el-upload--picture-card) {
  height: 100%;
  width: 100%;
}
:deep(.el-upload__text) {
  font-size: 13px;
  margin-bottom: 13px;
  margin-top: -5px;
}

:deep(.el-upload-dragger) {
  width: 565px;
  background-color: #f9f9f9;
}
:deep(.el-upload-dragger:hover) {
  // width: 565px;
  background-color: white;
}
.el-icon-upload {
  color: #b7d9fd;
  font-size: 70px;
  margin-top: -34px;
}
.tipB {
  font-size: 13px;
  color: #cccccc;
  margin-top: 10px;
}
</style>

```

![](https://luckynwa.top/mypic/mdS/image-20240629083303814.png)
