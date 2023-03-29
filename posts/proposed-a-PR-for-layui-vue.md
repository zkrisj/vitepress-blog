---
date: 16:04 2023/3/29
title: 如何给开源项目提 PR，给 layui- vue 提了个 PR，已合并
tags:
- Vue
description: 拉取请求只能在不同的两个分支之间打开，可以在创建拉取请求时指定要将更改合并到哪个分支。
---
## Pull Request 介绍
1. 贡献者请项目维护者“拉取”修改的软件内容（因此称为拉取请求），若此修改内容应该成为正式代码库的一部分，就需要合并拉取请求中提到的软件内容。
2. 最常用的方式是“Fork + Pull”模式：如果要为拉取请求创建新分支，又没有仓库的写入权限，可以先对仓库 Fork，仓库参与者不必向仓库创建者申请提交权限，而是在自己的托管空间下建立仓库的派生（Fork）。
3. 拉取请求只能在不同的两个分支之间打开，可以在创建拉取请求时指定要将更改合并到哪个分支。

### 创建拉取请求
1. Fork 创建存储库分支。
2. 进行修复。
3. 创建拉取请求。
- 在存储库的主页“Branch（分支）”菜单中，选择包含提交的分支。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9428ffb54ae4499bff254b4af12f37f~tplv-k3u1fbpfcp-watermark.image?)

- 在文件列表上方，单击 “拉取请求”。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8940f2b6d2e34cf885c8042ee4c25472~tplv-k3u1fbpfcp-watermark.image?)

- 使用基础分支下拉菜单选择要向其合并更改的分支，然后使用比较分支下拉菜单选择进行了更改的主题分支。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b90d59978e9449c0922ed12ffcd1de51~tplv-k3u1fbpfcp-watermark.image?)

- 为你的拉取请求输标题和说明。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/513141772c8a46e2aa10ad7403ed3e11~tplv-k3u1fbpfcp-watermark.image?)

- 要创建可供审查的拉取请求，请单击“创建拉取请求”。若要创建草稿拉取请求，请使用下拉列表并选择“创建草稿拉取请求”，然后单击“草稿拉取请求”。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61ce5d4321a34fa9bc56b4c76380c0a5~tplv-k3u1fbpfcp-watermark.image?)

- 创建拉取请求后，你可以请求特定人员审查你提议的更改。如果你是组织成员，还可以请求特定团队审查你的更改。

- 在存储库名称下，单击 “拉取请求”。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92415a076c7444099ab6542b142e47b7~tplv-k3u1fbpfcp-watermark.image?)

- 在拉取请求列表中，单击你想要请求特定人员或团队审查的拉取请求。
- 导航到右侧边栏中的“审查者”。
- 若要向建议的人员请求审查，请在“审查者”下其用户名旁，单击“请求” 。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbe5a7fdcabf4535963ed0a8764aab9d~tplv-k3u1fbpfcp-watermark.image?)

- （可选）若要向建议人员以外的其他人请求审查，请单击“审查者”，然后单击下拉菜单中的姓名。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a444854a26947958eefa95fdce8e000~tplv-k3u1fbpfcp-watermark.image?)

更改后，可以请求审查者重新审查你的拉取请求。导航到右侧边栏中的“审查者”，然后单击你想要其审查的审查者姓名旁边的 ![1.svg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7517b840c2a54db0b7194f99b779fe5a~tplv-k3u1fbpfcp-watermark.image?)。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acd523461d45458fa14e296d87cfe610~tplv-k3u1fbpfcp-watermark.image?)

- 被请求的审查者或团队将收到你请求他们审查拉取请求的通知。如果你请求团队审查，并启用了代码评审分配，则会向特定成员发出请求，并且取消团队作为审查者。
- 审查拉取请求后，对仓库具有推送权限的任何人都可以完成合并。

### 合并拉取请求
1. 在存储库名称下，单击 “Pull requests”。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b886027b6fb849b694bd5cb5b1221e5c~tplv-k3u1fbpfcp-watermark.image?)

2. 在“Pull Requests（拉取请求）”列表中，单击要合并的拉取请求。
3. 根据对仓库启用的合并选项，你可以：
- 单击“合并拉取请求”，将所有提交合并到基分支中。 如果未显示“合并拉取请求”选项，则单击合并下拉菜单，然后选择“创建合并提交” 。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cbf7633ce274746b476a921508c93b2~tplv-k3u1fbpfcp-watermark.image?)

- 单击合并下拉菜单，选择“压缩并合并”，然后单击“压缩并合并”按钮，将多个提交压缩为一个提交。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8676ad12855047c1b7b471029402e266~tplv-k3u1fbpfcp-watermark.image?)

- 单击合并下拉菜单，选择“变基并合并”，然后单击“变基并合并”按钮，将多个提交变基为一个基分支。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87a692e558b243a084b43897a1ba9ac5~tplv-k3u1fbpfcp-watermark.image?)

4. 如有提示，输入提交消息，或接受默认消息。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4d8ae2c21e3485f9d460626d44245bd~tplv-k3u1fbpfcp-watermark.image?)

5. 单击“确认合并”、“确认压缩并合并”，或“确认变基并合并” 。
6. （可选）删除分支。这有助于仓库的分支列表保持整洁。

## 给 layui- vue 提了个 PR，已合并
青训营中我们团队做的是组件库项目。因为我负责的是 `Pagination` 和 `Table` 组件，但 Ant Design Vue 和 Element Plus 的表格组件都太复杂了，所以我参考的是较简单的 layui - vue。

### Bug
由于开发测试完组件后，也需要写对应的组件演示文档。在写文档过程中，发现了 `Table` 组件演示文档中的一个 Bug：

![60cecd3b_2215500.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84610116a36a4d7a9a8804789c05e6d6~tplv-k3u1fbpfcp-watermark.image?)

可以看到，行内编辑图标首次点击无效，只能从上到下开启编辑、从下到上关闭编辑，点击其他行图标也只从首行开始编辑。出问题的代码：
```html
<template>
  <lay-table :columns="columns28" :data-source="dataSource28">
    <template #username="{ data }">
      <lay-input v-if="edingKeys[data.id]" :model-value="data.username" @input="changeUsername($event, data)">
        <template #suffix>
          <lay-icon type="layui-icon-close" style="right:10px;" v-if="edingKeys[data.id]" @click="deleteEdit(data.id)"></lay-icon>
        </template>
      </lay-input>
      <span v-else>
        {{ data.username }} 
        <lay-icon type="layui-icon-edit" style="position: absolute;right: 10px;" v-if="!edingKeys[data.id]" @click="editHandle(data.id)"></lay-icon>
      </span>
    </template>
  </lay-table>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {

    const edingKeys = ref([])

    const columns28 = [
      {
        title:"账户",
        width:"200px",
        key:"username",
        customSlot: "username"
      },{
        title:"密码",
        width: "300px",
        key:"password"
      },{
        title:"性别",
        key:"sex"
      },{
        title:"年龄",
        width: "300px",
        key:"age"
      },{
        title:"备注",
        width: "180px",
        key:"remark",
        ellipsisTooltip: true
      }
    ]

    const dataSource28 = ref([
      {id:"1",username:"root", password:"root",sex:"男", age:"18", remark: 'layui - vue（谐音：类 UI) '},
      {id:"2",username:"root", password:"root",sex:"男", age:"18", remark: 'layui - vue（谐音：类 UI) '},
      {id:"3",username:"woow", password:"woow",sex:"男", age:"20", remark: 'layui - vue（谐音：类 UI) '},
      {id:"4",username:"woow", password:"woow",sex:"男", age:"20", remark: 'layui - vue（谐音：类 UI) '},
      {id:"5",username:"woow", password:"woow",sex:"男", age:"20", remark: 'layui - vue（谐音：类 UI) '}
    ])

    const editHandle = (key) => {
      edingKeys.value.push(key);
    }

    const deleteEdit = (key) => {
      edingKeys.value.splice(edingKeys.value.indexOf(key),1);
    }

    const changeUsername = (val, data) => {
      dataSource28.value.forEach(element => {
        if(element.id == data.id) {
          element.username = val;
        }
      });
    }

    return {
      edingKeys,
      deleteEdit,
      columns28,
      editHandle,
      dataSource28,
      changeUsername,
    }
  }
}
</script>
```
上面代码在 `lay-input`、`lay-icon type="layui-icon-close"`、`lay-icon type="layui-icon-edit"` 这三个组件上使用 `v-if` 表达式来条件性地渲染元素时，条件分别为 `edingKeys[data.id]`、`edingKeys[data.id]` 和 `!edingKeys[data.id]`。响应式变量 `edingKeys` 初始化时是一个空数组，在点击行编辑图标时，由绑定的 `editHandle` 方法将当前行的 `id` 字段添加到数组中，然后由响应式对象 `edingKeys` 根据行的 `id` 字段动态改变上述三个条件表达式的值，从而动态渲染行的编辑状态。

问题出在：`id` 字段是数字类型字符串，而 **在 JavaScript 中，可以同时使用字符串 `arr["1"]` 或数字 `arr[1]` 访问对象属性和数组元素。**

例如，当点击第三行的编辑图标时，`editHandle` 方法会将 `"3"` 添加到数组中，此时 `edingKeys` 的值为 `["3"]`，数组中只有一个元素，所以只有 `edingKeys[0]` 的条件为真，而 `edingKeys[1]`、`edingKeys[2]` 以后的值都为 `undefined`，条件都为假，所以第一次点击任何行时都不会有反应。然后我们点击第四行的编辑图标，此时 `editHandle` 方法会将 `"4"` 添加到数组中，此时 `edingKeys` 的值为 `["3", "4"]`，只有 `edingKeys[0]`、`edingKeys[1]` 的条件为真，而 `edingKeys[2]`、`edingKeys[3]` 以后的值都为 `undefined`，条件都为假。所以第一行变成了编辑状态，而不是第三行或第四行。

以此类推，继续点击将依次从从上到下开启编辑状态。当点击任意某个已经开启编辑状态的行上的关闭图标时，`deleteEdit` 方法会将当前行的 `id` 字段从 `edingKeys` 数组中删除，`edingKeys` 数组的长度将减一。所以会从 `edingKeys` 数组的长度减一索引处，即从 `edingKeys[edingKeys.length-1]` 开始取消编辑。继续点击任意关闭图标，将依次从下到上关闭行编辑状态。

### 解决方法
很简单，只需要把三个 `v-if` 表达式的条件 `edingKeys[data.id]`、`edingKeys[data.id]` 和 `!edingKeys[data.id]` 改为 `edingKeys.includes(data.id)`、`edingKeys.includes(data.id)` 和 `!edingKeys.includes(data.id)`，`includes()` 方法用来判断一个数组是否包含一个指定的值。

但更完善的方法是在 `editHandle` 方法中将整个行数据而不是行的 `id` 字段添加到数组中，然后使用 `edingKeys.includes(data)`、`edingKeys.includes(data)` 和 `!edingKeys.includes(data)` 来判断编辑状态。因为行的 `id` 字段如果不是唯一的，即多行的 `id` 字段值相同，会出现点击一行的编辑和关闭图标，将同时开启和关闭多行的编辑状态。每行的行数据却是唯一的。
```html
<template>
  <lay-table :columns="columns28" :data-source="dataSource28">
    <template #username="{ data }">
      <lay-input v-if="edingKeys.includes(data)" :model-value="data.username" @input="changeUsername($event, data)">
        <template #suffix>
          <lay-icon type="layui-icon-close" style="right:10px;" v-if="edingKeys.includes(data)"  @click="deleteEdit(data)"></lay-icon>
        </template>
      </lay-input>
      <span v-else>
        {{ data.username }} 
        <lay-icon type="layui-icon-edit" style="position: absolute;right: 10px;" v-if="!edingKeys.includes(data)"  @click="editHandle(data)"></lay-icon>
      </span>
    </template>
  </lay-table>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {

    const edingKeys = ref([])

    const columns28 = [
      {
        title:"账户",
        width:"200px",
        key:"username",
        customSlot: "username"
      },{
        title:"密码",
        width: "300px",
        key:"password"
      },{
        title:"性别",
        key:"sex"
      },{
        title:"年龄",
        width: "300px",
        key:"age"
      },{
        title:"备注",
        width: "180px",
        key:"remark",
        ellipsisTooltip: true
      }
    ]

    const dataSource28 = ref([
      {id:"1",username:"root", password:"root",sex:"男", age:"18", remark: 'layui - vue（谐音：类 UI) '},
      {id:"2",username:"root", password:"root",sex:"男", age:"18", remark: 'layui - vue（谐音：类 UI) '},
      {id:"3",username:"woow", password:"woow",sex:"男", age:"20", remark: 'layui - vue（谐音：类 UI) '},
      {id:"4",username:"woow", password:"woow",sex:"男", age:"20", remark: 'layui - vue（谐音：类 UI) '},
      {id:"5",username:"woow", password:"woow",sex:"男", age:"20", remark: 'layui - vue（谐音：类 UI) '}
    ])

    const editHandle = (data) => {
      edingKeys.value.push(data);
    }

    const deleteEdit = (data) => {
      edingKeys.value.splice(edingKeys.value.indexOf(data),1);
    }

    const changeUsername = (val, data) => {
      dataSource28.value.forEach(element => {
        if(element.id == data.id) {
          element.username = val;
        }
      });
    }

    return {
      edingKeys,
      deleteEdit,
      columns28,
      editHandle,
      dataSource28,
      changeUsername,
    }
  }
}
</script>
```
修复后的效果：

![07df7525_2215500.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e1c971fc86249afa43cee61590c10c9~tplv-k3u1fbpfcp-watermark.image?)

### 提了 PR
由于 [layui](https://gitee.com/layui/layui-vue) 仓库在 gitee，GitHub 上面的仓库已经撤下了，所以在 gitee 上面提的 PR，gitee PR 操作比 GitHub 更加方便和简单，在 Fork 项目的主页点击 `+ Pull Request` 按钮，然后选择分支，输入标题和说明即可。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b0e4b9a9c66410293d537e55465c297~tplv-k3u1fbpfcp-watermark.image?)

目前 **已合并**。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48e9085eb0f449c183001497969e47f1~tplv-k3u1fbpfcp-watermark.image?)