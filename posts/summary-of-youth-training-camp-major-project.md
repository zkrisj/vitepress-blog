---
date: 16:02 2023/3/29
title: 青训营大项目总结 ｜ 青训营笔记
tags:
- Vue
description: 虽然业界已经有非常多知名组件库(antd/iview/material design 等)，但实际工作中各团队通常也会应设计规范要求，自行开发属于团队内部的基础/业务组件库，对于高阶前端，开发一个属于自己的组件库已经是一种普遍但重要的基本技能。
---
## 介绍
青训营大项目：
- 基于 NextJS 开发仿掘金站点
- 组件库
- 关于新冠疫情的数据可视化作品

我们团队做的是组件库项目。

## 项目需求
虽然业界已经有非常多知名组件库(antd/iview/material design 等)，但实际工作中各团队通常也会应设计规范要求，自行开发属于团队内部的基础/业务组件库，对于高阶前端，开发一个属于自己的组件库已经是一种普遍但重要的基本技能。

实际开发中有许多需要考虑的细节：
### 使用何种语言开发组件库？
- ts/es6 + babel + flow
- less/sass/stylus/postcss/atomic-css
<br><br>

|  | Sass/Less | Atomic CSS | css-in-js |
| --- | --- | --- | --- |
| 完全支持样式覆盖 | ✅ | ✅ | ❗(需要使用className支持) |
| 支持rem布局 | ✅ | ✅ | ❗(大部分库支持) |
| 可读性 | 强 | 稍弱 | 强 |
| 上手成本 | 低 | 中 | 高 |
| 是否支持SSR | 天然支持 | 天然支持 | 需要额外支持 |
| 是否支持流式渲染 | 天然支持 | 天然支持 | 需要额外支持 |
| 支持postcss | ✅ | ✅ | ❗(有自己的plugin生态) |


### 如何保证组件库质量（工程化）？
#### 单测、e2e 测试
1. 组件库的质量保障从流程上来说，主要是 code review 和严格的 UI 验收、QA 测试等流程。从技术层面来说可以收敛发包权限，以及在 CI/CD 中实现自动发包，杜绝研发过程中在非 master 分支上随意发包的危险操作。还有单元测试、快照测试、e2e 测试等常用的技术手段。

尽可能接入测试工具，包括：
- jest、chai、enzyme、karma
- @testing-library/react
- benchmark

2. lint、lint-staged、prettier、style-lint 等。

制定规范的目的在于保证质量、方便业务方使用和增加组件库的可扩展性。比如上文提到的对于样式的封装、常用 mixin 封装，强制使用颜色变量等。还有设计统一的组件库 API 风格规范，能降低业务方的使用成本。

拆解来看：
- 代码提交：
    - husky
    - commitlint
    - lint-staged
- 代码风格：
    - eslint + prettier
    - stylelint
    - commit-lint
- 文档风格：
    - remark-lint
- 组件模板：
    - plop.js
- 依赖管理：
    - lint-deps
- 目录规范

### 如何编写文档站？
组件库一般有一个演示站点。
- 对于移动端组件库，可以通过 webpack 别名的方法重写它们的组件，以支持移动端预览，方便 UI 验收。
- 对于国际化的组件，可以提供类似 vconsole 形式的 devtools，可视化切换 dark/light Mode、rtl/lrt 等能力，提高开发和测试流程中的效率。

常见的文档站技术选型：
- docz：一个非常成熟的 md 文档站工具，同样支持嵌入 react 组件
- dumi：还能支持组件调试
- changelog
- Github Pages
- vitepress
- storybook
- remark
- docsearch

### 核心需求
- 通用型组件: 比如 Button, Icon 等
- 布局型组件: 比如 Grid, Layout 布局等
- 导航型组件: 比如面包屑 Breadcrumb, 下拉菜单 Dropdown, 菜单 Menu 等
- 数据录入型组件: 比如 form 表单, Switch 开关, Upload 文件上传，日期选择，下拉选择等
- 数据展示型组件: 比如 Avator 头像, Table 表格, List 列表等
- 反馈型组件: 比如 Progress 进度条, Drawer 抽屉, Modal 对话框等

具体效果，可参考 [antd](https://www.antdv.com/components/overview-cn/)。

## 技术选用
##### 核心技术栈
- ts +vue3
- sass
- vite

##### 测试工具
- vitest

##### 规范工具
- 代码提交规范：husky（提交时自动检查）+ commitlint（提交信息样式检查）
- 代码风格：eslint（语法）+ prettier（格式）+ husky（提交时自动检查）

##### 文档工具
- vitepress

##### 包管理工具
- pnpm

## 项目结构
```
.
├── .husky               # gi t提交时触发的钩子函数
├── config               # 配置文件
├── coverage             # 覆盖率报告
├── demo                 # 代码范例
├── docs                 # 静态站点相关配置
├── internal             # 里面放置的有 eslint 配置、打包配置
├── node_modules  
├── packages             # 项目的核心目录，组件的编写	
├── scripts              # 脚本发布、提交信息检查
├── src                  # 组件代码
└── types                # TS类型定义
```
### 组件目录结构
以 button 组件为例：
```
├── src                  # 组件代码
    └── button           # 组件包名
         ├── index.ts    # 组件入口
         ├── Button.tsx  # 组件代码  
         └── __tests__   # 测试用例
                  └── Button.spec.ts
```
- 包名：小写 + 中划线；
- 统一入口文件： index.ts；
- 组件代码： 大驼峰；
- 测试用例代码 ： 测试对象名+ .spec.ts。

以 button 组件为例子的测试：
1. 定义测试文件 `src/button/__tests__/Button.test.ts`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a64f1a93c6f4f6aa3082bca5fe9d882~tplv-k3u1fbpfcp-zoom-1.image)

    1. 在测试文件中创建一个 `describe` 分组。
    2. 在第一个参数中输入 `'Button'`，表明是针对 `Button` 组件的测试。
    3. 编写测试用例 `test`。
    4. 使用 `shallowMount` 初始化组件，测试按钮是否工作正常，只需要断言判断按钮中的字符串是否正确就可以了。

2. 配置 package.json。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39bbc040113248f6bb586b56446ddcf5~tplv-k3u1fbpfcp-zoom-1.image)

3. 在控制台启动测试命令，并查看结果。
```
pnpm test
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9326e27a1a52450196473df92e1386fe~tplv-k3u1fbpfcp-zoom-1.image)

> 在代码编写阶段，建议只对重点功能进行测试，没必要一定追求过高的测试覆盖率。

## monorepo
pnpm 原生支持 monorepo 方案：
- pnpm-workspace.yaml 定义了工作空间的根目录。
- 如果我们要单独对某一个项目下安装一些包时，可以到该项目目录下安装，或者在根目录下使用 `pnpm i 包 --filter 项目名`。
- 当我们要在根目录下安装某些包，需要加上 `-w` 后缀。

```
# pnpm-workspace.yaml
packages:
  - packages/*
  - docs
  - play
  - internal/*
```

## git flow
1. 代码提交形式为：`type: 提交信息`。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/131cc95daaae40768f44c2ba73ae880b~tplv-k3u1fbpfcp-watermark.image?)

2. 主要有以下分支：
- `main` 分支：跟线上发布版本保持一致
- `develop` 分支：开发的主分支，保证最新的代码
- 其他分支：完成一个新的功能时用到的分支

3. 需要注意的是：
- `main` 分支不要动！
- 当功能完成之后需要合并时，合并到 `develop` 分支，注意合并之前先拉取 `develop` 分支，合并时建议多使用 `rebase` 指令，保证提交记录的简洁。

## 文档
1. 在 `packages/components/index.ts` 中按格式**导出组件**。
```ts
import { App } from 'vue'
import DateTimePicker from './DatePicker/DateTimePicker/DateTimePicker.vue'
import Input from './input/Input.vue'
import Pagination from './Pagination/index'
import WvTable from './Table/index'
import WvRadio from './Table/radio'
import Button from "./Button/src/Button.vue";
import Col from './Layout/src/col.vue';
import Row from './Layout/src/row.vue'
import Notification from './notification/Notification.vue'
import { Dropdown, DropdownItem, DropdownMenu } from './Dropdown'
import WVcarousel from './carousel/WV-carousel.vue'

// 导出单独组件
export {
  DateTimePicker,
  Input,
  Pagination,
  Button,
  Col,
  Row,
  Notification,
  WvTable,
  WvRadio,
  Dropdown,
  DropdownMenu,
  DropdownItem
}

// 编写一个插件，实现一个install方法
export default {
  install(app: App): void {
    app.component('DateTimePicker', DateTimePicker);
    app.component('Input', Input);
    app.component('Pagination', Pagination);
    app.component('WvTable', WvTable)
    app.component('WvRadio', WvRadio)
    app.component('WButton', Button);
    app.component('WRow', Row);
    app.component('WCol', Col);
    app.component(Notification.name, Notification)
    app.component('WDropdown', Dropdown)
    app.component('WDropdownMenu', DropdownMenu)
    app.component('WDropdownItem', DropdownItem)
    app.component("WVcarousel", WVcarousel);
  },
}
```
2. 配置 `docs/.vitepress/config.ts`，添加左侧导航栏条目。
```ts
const sidebar = {
  '/': [
    { text: '快速开始', link: '/' },
    {
      text: '通用',
      children: [
        { text: 'Button 按钮', link: '/components/Button/' },
        { text: 'Layout 布局', link: '/components/Layout/' },
      ]
    },
    {
      text: 'Form表单组件',
      children: [
        { text: 'DateTimePicker 日期选择器', link: '/components/DateTimePicker/' },
        { text: 'Input 输入框', link: '/components/Input/' },
      ]
    },
    {
      text: 'Data 数据展示',
      children: [
        { text: 'Table 表格', link: '/components/Table/' },
        { text: 'Pagination 分页', link: '/components/Pagination/' }
      ]
    },
    {
      text: 'Feedback 反馈组件',
      children: [
        { text: 'Notification 通知', link: '/components/Notification/' }
      ]
    },
    {
      text: 'Navigation 导航',
      children: [
        { text: 'Dropdown 下拉菜单', link: '/components/Dropdown/' }
      ]
    },
    {
      text: 'Others 其他',
      children: [
        { text: 'carousel 轮播图', link: '/components/carousel/' }
      ]
    },
  ]
}
export default {
  title: "🔨 weView",
  themeConfig: {
    sidebar,
  },

  markdown: {
    config: (md) => {
      const { demoBlockPlugin } = require('vitepress-theme-demoblock')
      md.use(demoBlockPlugin)
    }
  }
}
```
3. 新建主题配置文件 `docs/.vitepress/theme/index.ts`，导入默认主题、已安装主题、在 `packages/components/index.ts` 中导出的组件和需要的字体样式文件。
```ts
import DefaultTheme from 'vitepress/theme'
// 主题样式
import 'vitepress-theme-demoblock/theme/styles/index.css'
// 插件的组件，主要是demo组件
import Demo from 'vitepress-theme-demoblock/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/components/DemoBlock.vue'
import weView from '../../../packages/components/index.ts'
import '../../../packages/fonts/iconfont.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(weView)
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
  },
}
```

4. 在 `docs/components/` 下面新建**组件名称**文件夹，名字为 `link` 属性值对应路径 `/components/` 后的单词。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec81bf1e54a648bea8374ccc8567ee76~tplv-k3u1fbpfcp-watermark.image?)

5. 在**组件名称**文件夹中新建 `index.md` 文件，可以在里面引入和使用外部 Vue 组件。例如：
```html
:::demo 基础使用
```vue
<template>
 <Input v-model="inputText2" placeholder="请输入..." clearable/>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const inputText2 = ref('')
    return {
      inputText2
    }
  },
}
</script>
\```
:::
```
会渲染出以下内容：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/556d2a9315e34beeb5472aa0c1732134~tplv-k3u1fbpfcp-watermark.image?)

## 分页和表格
因为我负责的是 `Pagination` 和 `Table` 组件，但 Ant Design Vue 和 Element Plus 的表格组件都太复杂了，所以我参考的是较简单的 layui - vue。

### Pagination
#### HTML 结构
```html
<template>
  <div class="pager pager-default">
    <!-- 辅助标签, 为 total computed 逻辑正常执行而创建的临时标签 -->
    <div style="display: none">{{ totalPage }}</div>
    <span v-if="showCount" class="pager-count">共 {{ total }} 条 {{ maxPage }}
      页</span>
    <a href="javascript:;" class="pager-prev" :class="[
        currentPage === 1 ? 'disabled' : '',
        theme && currentPage !== 1 ? 'pager-a-' + theme : '',
      ]" @click="prev()">
      <slot v-if="slots.prev" name="prev" />
      <template v-else>上一页</template>
    </a>
    <template v-if="showPage">
      <template v-for="index of totalPage" :key="index">
        <span v-if="index === currentPage" class="pager-curr">
          <em class="pager-em" :class="[theme ? 'bg-' + theme : '']" />
          <em>{{ index }}</em>
        </span>
        <a v-else href="javascript:;" @click="jump(index)"
          :class="[theme ? 'pager-a-' + theme : '']">{{ index }}</a>
      </template>
    </template>
    <a href="javascript:;" class="pager-next" :class="[
        currentPage === maxPage || maxPage === 0 ? 'disabled' : '',
        theme && currentPage !== maxPage && maxPage !== 0
          ? 'pager-a-' + theme
          : '',
      ]" @click="next()">
      <slot v-if="slots.next" name="next" />
      <template v-else>下一页</template>
    </a>
    <span v-if="showLimit" class="pager-limits">
      <select v-model="inlimit" @change="changelimit">
        <option v-for="val of limits" :key="val" :value="val">
          {{ val }} 条/页
        </option>
      </select>
    </span>
    <a v-if="showRefresh" href="javascript:;" @click="refresh"
      class="pager-refresh">
      <i class="wv-icon wv-icon-refresh" />
    </a>
    <span v-if="props.showSkip" class="pager-skip">
      到第
      <input v-model="currentPageShow" @keypress.enter="jumpPage()"
        type="number" class="input input-number" />页
      <button type="button" class="pager-btn" @click="jumpPage()"
        :disabled="currentPageShow > maxPage || currentPageShow == currentPage">
        确认
      </button>
    </span>
  </div>
</template>
```
1. 最外层是分页组件容器（`div.pager`），内容从左到右为：总条数和总页数文本（`span`）、上一页链接（`a`）、页码（`template`>`span`>`em`）、下一页链接（`a`）、每页数量选择框（`span`>`select`）、刷新按钮图标（`a`>`i`）、跳转文本、跳转输入框（`input`）、跳转确定按钮（`button`）。

2. 有以下插槽：
| 插槽   | 描述  | 默认值 |
| ---- | --- | --- |
| `prev` | 上一页 | 上一页 |
| `next` | 下一页 | 下一页 |

  
#### JS 代码
1. `props`，有以下属性和默认值：
```ts
interface PageProps {
  total: number
  limit: number
  theme?: string
  showPage?: boolean
  showSkip?: boolean
  showCount?: boolean
  showLimit?: boolean
  showRefresh?: boolean
  pages?: number
  limits?: number[]
  modelValue?: number
}

const props = withDefaults(defineProps < PageProps > (), {
  limit: 10, // 每页数量
  pages: 10, // 页码链接最大数量
  modelValue: 1, // 当前页
  theme: 'blue', // 主题色
  showPage: false, // 显示页码
  showSkip: false, // 显示跳转
  showCount: false, // 显示总数
  showLimit: true, // 显示每页数量选择框
  showRefresh: false, // 显示刷新按钮图标
  limits: () => [10, 20, 30, 40, 50], // 每页数量选择框的选项
})
```

2. `emits`，有以下事件：
```ts
const emit = defineEmits([
  'update:modelValue', // 当前页变化
  'update:limit', // 每页数量选择框的选项变化
  'change', // 当前页和每页数量选择框的选项变化
])
```

3. `watch`，有以下在数据更改时调用的侦听回调：
```ts
watch( // 监听传入每页数量参数时，赋值给 inlimit
  () => props.limit,
  () => {
    inlimit.value = props.limit
  }
)
watch(inlimit, () => { // 监听每页数量选择框的选项变化时，触发事件
  emit('update:limit', inlimit.value)
})
watch(currentPage, () => { // 监听当前页码变化时，更新 currentPage、currentPageShow 的值，触发事件
  const min = totalPage.value[0]
  const max = totalPage.value[totalPage.value.length - 1]
  if (currentPage.value > max) currentPage.value = max
  if (currentPage.value < min) currentPage.value = min
  currentPageShow.value = currentPage.value
  emit('update:modelValue', currentPage.value)
})
watch( // 监听传入当前页码参数时，更新 currentPage、currentPageShow 的值
  () => props.modelValue,
  () => {
    currentPage.value = props.modelValue
    currentPageShow.value = currentPage.value
  }
)
```

### Table
#### HTML 结构
```html
<template>
  <div ref="tableRef">
    <table class="wv-hide" wv-filter="test" />
    <div class="wv-form wv-border-box wv-table-view" :class="classes">
      <div v-if="defaultToolbar || slot.toolbar" class="wv-table-tool">
        <div class="wv-table-tool-temp">
          <slot name="toolbar" />
        </div>
        <div v-if="defaultToolbar" class="wv-table-tool-self">
          <!-- 筛选 -->
          <wv-dropdown v-if="showToolbar('filter')" updateAtScroll
            :style="toolbarStyle('filter')">
            <div class="wv-inline" title="筛选" wv-event>
              <i class="wv-icon wv-icon-slider" />
            </div>
            <template #content>
              <div class="wv-table-tool-checkbox">
                <wv-checkbox v-for="column in tableHeadColumns[0]"
                  v-model="tableColumnKeys" skin="primary"
                  :disabled="!!column.children" :key="column.key"
                  :value="column.key">{{ column.title }}</wv-checkbox>
              </div>
            </template>
          </wv-dropdown>

          <!-- 导出 -->
          <div v-if="showToolbar('export')" class="wv-inline" title="导出"
            wv-event :style="toolbarStyle('export')" @click="exportData()">
            <i class="wv-icon wv-icon-export" />
          </div>

          <!-- 打印 -->
          <div v-if="showToolbar('print')" :style="toolbarStyle('print')"
            class="wv-inline" title="打印" wv-event @click="print()">
            <i class="wv-icon wv-icon-print" />
          </div>
        </div>
      </div>

      <div class="wv-table-box-header" v-if="slot.header">
        <slot name="header" />
      </div>

      <div class="wv-table-box">
        <!-- 表头 -->
        <div class="wv-table-header">
          <!-- :style="[{ 'padding-right': `${scrollWidthCell}px` }]" -->
          <div class="wv-table-header-wrapper" ref="tableHeader">
            <table class="wv-table" :wv-size="size" :wv-skin="skin"
              ref="tableHeaderTable">
              <colgroup>
                <template v-for="column in tableBodyColumns" :key="column">
                  <template v-if="tableColumnKeys.includes(column.key)">
                    <col :width="column.width" :style="{
                        minWidth: column.minWidth ? column.minWidth : '50px',
                      }" />
                  </template>
                </template>
              </colgroup>
              <thead>
                <template v-for="(
                    tableHeadColumn, tableHeadColumnIndex
                  ) in tableHeadColumns" :key="tableHeadColumnIndex">
                  <tr>
                    <template v-for="(column, columnIndex) in tableHeadColumn"
                      :key="column">
                      <th v-if="tableColumnKeys.includes(column.key)"
                        :colspan="column.colspan" :rowspan="column.rowspan"
                        class="wv-table-cell" :class="[
                          renderFixedClassName(column, columnIndex),
                          column.fixed ? `wv-table-fixed-${column.fixed}` : '',
                          column.type == 'checkbox'
                            ? 'wv-table-cell-checkbox'
                            : '',
                          column.type == 'radio' ? 'wv-table-cell-radio' : '',
                          column.type == 'number' ? 'wv-table-cell-number' : '',
                        ]" :style="[
                          {
                            textAlign: column.align,
                          },
                          renderHeadFixedStyle(
                            column,
                            columnIndex,
                            tableHeadColumn,
                            tableHeadColumnIndex,
                            tableHeadColumns
                          ),
                        ]">
                        <template v-if="column.type == 'checkbox'">
                          <wv-checkbox v-model="hasChecked"
                            :is-indeterminate="!allChecked" skin="primary"
                            value="all" @change="changeAll" />
                        </template>
                        <template v-else>
                          <span>
                            <template v-if="column.titleSlot">
                              <slot :name="column.titleSlot" />
                            </template>
                            <template v-else>
                              {{ column.title }}
                            </template>
                          </span>
                          <!-- 插槽 -->
                          <span v-if="column.sort"
                            class="wv-table-sort wv-inline" wv-sort>
                            <i @click.stop="sortTable($event, column.key, 'asc')"
                              class="wv-edge wv-table-sort-asc" title="升序" />
                            <i @click.stop="
                                sortTable($event, column.key, 'desc')
                              " class="wv-edge wv-table-sort-desc"
                              title="降序" />
                          </span>
                        </template>
                      </th>
                    </template>
                  </tr>
                </template>
              </thead>
            </table>
          </div>
        </div>
        <!-- 表身 -->
        <div class="wv-table-body wv-table-main"
          :style="{ height: height, maxHeight: maxHeight }" ref="tableBody">
          <table class="wv-table"
            v-if="tableDataSource.length > 0 && loading == false"
            :class="{ 'wv-table-even': props.even }" :wv-size="size"
            :wv-skin="skin">
            <colgroup>
              <template v-for="(column, columnIndex) in tableBodyColumns"
                :key="columnIndex">
                <template v-if="tableColumnKeys.includes(column.key)">
                  <col :width="column.width" :style="{
                      minWidth: column.minWidth ? column.minWidth : '50px',
                    }" />
                </template>
              </template>
            </colgroup>
            <tbody>
              <!-- 渲染 -->
              <template v-for="(children, index) in tableDataSource"
                :key="index">
                <table-row :id="id" :index="index" :data="children" :page="page"
                  :columns="tableBodyColumns" :columnSlotNames="columnSlotNames"
                  :indent-size="indentSize"
                  :currentIndentSize="currentIndentSize"
                  :tableColumnKeys="tableColumnKeys"
                  :expandSpace="childrenExpandSpace" :expandIndex="expandIndex"
                  :cellStyle="cellStyle" :cellClassName="cellClassName"
                  :rowStyle="rowStyle" :rowClassName="rowClassName"
                  :spanMethod="spanMethod" :defaultExpandAll="defaultExpandAll"
                  :getCheckboxProps="getCheckboxProps"
                  :getRadioProps="getRadioProps"
                  v-model:expandKeys="tableExpandKeys"
                  v-model:selectedKeys="tableSelectedKeys"
                  v-model:selectedKey="tableSelectedKey" @row="rowClick"
                  @row-double="rowDoubleClick"
                  @row-contextmenu="rowContextmenu">
                  <template v-for="name in columnSlotNames" #[name]="slotProp: {
                      data: any,
                      column: any,
                      row: any,
                      rowIndex: number,
                      columnIndex: number,
                    }">
                    <slot :name="name" :row="slotProp.data"
                      :data="slotProp.data" :column="slotProp.column"
                      :rowIndex="slotProp.rowIndex"
                      :columnIndex="slotProp.columnIndex" />
                  </template>
                  <template v-if="slot.expand"
                    #expand="slotProp: { data: any, row: any }">
                    <slot name="expand" :data="slotProp.data"
                      :row="slotProp.row" />
                  </template>
                </table-row>
              </template>
              <tr v-if="hasTotalRow" class="wv-table-total">
                <template v-for="(column, columnIndex) in columns"
                  :key="columnIndex">
                  <template v-if="tableColumnKeys.includes(column.key)">
                    <td :style="[
                        {
                          textAlign: column.align,
                          whiteSpace: column.ellipsisTooltip
                            ? 'nowrap'
                            : 'normal',
                        },
                        renderFixedStyle(column, columnIndex),
                      ]" :class="[
                        'wv-table-cell',
                        renderFixedClassName(column, columnIndex),
                        column.fixed ? `wv-table-fixed-${column.fixed}` : '',
                      ]" v-html="renderTotalRowCell(column)" />
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
          <template v-if="tableDataSource.length == 0 && loading == false">
            <wv-empty />
            <div :style="{ width: tableBodyEmptyWidth }" />
          </template>
          <template v-if="loading == true">
            <div class="wv-table-loading">
              <i
                class="wv-icon-loading wv-icon wv-anim wv-anim-rotate wv-anim-loop" />
            </div>
          </template>
        </div>
        <div class="wv-table-footer" v-if="slot.footer">
          <slot name="footer" />
        </div>
      </div>
      <div v-if="page && page.total > 0" class="wv-table-page">
        <table-page :total="page.total" :pages="page.pages" :theme="page.theme"
          :limits="page.limits" :showSkip="page.showSkip"
          :show-page="page.showPage" :showRefresh="page.showRefresh"
          :showLimit="page.showLimit" :showCount="page.showCount"
          v-model:current="page.current" v-model:limit="page.limit"
          @change="change" />
      </div>
    </div>
  </div>
</template>
```
1. 最外层是表格组件容器（`div.wv-table-view`），内容从上到下为：工具栏（`div.wv-table-tool`）、header插槽（`div.wv-table-box-header`）、表格（`div.wv-table-box`）、分页（`div.wv-table-page`）。

2. 有以下插槽：
| 插槽               | 描述     | 参数                                  |
| ---------------- | ------ | ----------------------------------- |
| `toolbar`          | 自定义工具栏 | --                                  |
| `header`           | 顶部扩展   | --                                  |
| `footer`           | 底部扩展   | --                                  |
| `column.titleSlot` | 列标题    |                                     |
| `expand`           | 嵌套面板   | `{ row } `                            |
| `customSlot`       | 自定义列插槽 | `{ row，rowIndex，column，columnIndex }` |

#### JS 代码
1. `props`，有以下属性和默认值：
```ts
interface TableProps {
  id?: string
  skin?: string
  size?: string
  page?: Recordable
  columns: Recordable[]
  dataSource: Recordable[]
  defaultToolbar?: boolean | any[]
  selectedKey?: string
  selectedKeys?: Recordable[]
  indentSize?: number
  childrenColumnName?: string
  height?: number
  maxHeight?: string
  even?: boolean
  expandIndex?: number
  rowClassName?: string | Function
  cellClassName?: string | Function
  rowStyle?: string | Function
  cellStyle?: string | Function
  spanMethod?: Function
  defaultExpandAll?: boolean
  expandKeys?: Recordable[]
  loading?: boolean
  getCheckboxProps?: Function
  getRadioProps?: Function
}

const props = withDefaults(defineProps<TableProps>(), {
  id: 'id', // 主键
  size: 'md', // 尺寸
  indentSize: 30, // 树表行级缩进
  childrenColumnName: 'children', // 树节点字段
  dataSource: () => [], // 数据源
  selectedKeys: () => [], // 选中项 (多选)
  defaultToolbar: false, // 工具栏
  selectedKey: '', // 选中项 (单选)
  maxHeight: 'auto', // 表格最大高度
  even: false, // 斑马条纹
  rowClassName: '', // 行类名称
  cellClassName: '', // 列类名称
  expandIndex: 0, // 展开所在列
  rowStyle: '', // 行样式
  cellStyle: '', // 列样式
  defaultExpandAll: false, // 默认展开所有列
  spanMethod: () => {}, // 合并算法
  expandKeys: () => [], // 展开的列
  loading: false, // 加载动画
  getCheckboxProps: () => {}, // 多选行属性
  getRadioProps: () => {}, // 单选行属性
})
```

2. `emits`，有以下事件：
```ts
const emit = defineEmits([
  'update:current', // 当前页变化
  'update:limit', // 每页数量选择框的选项变化
  'change', // 当前页和每页数量选择框的选项变化
  'update:expandKeys', // 展开树节点
  'update:selectedKeys', // 多选行选中
  'update:selectedKey', // 单选行选中
  'row-contextmenu', // 行右击
  'row-double', // 行双击
  'row', // 行单击
])
```

3. `watch`，有以下在数据更改时调用的侦听回调：
```ts
watch( // 监听传入高度、数据源参数变化时，更新表格滚动宽度
  () => [props.height, props.maxHeight, props.dataSource],
  () => {
    nextTick(() => {
      getScrollWidth()
    })
  }
)

watch( // 监听 columns 变化时，计算列内容
  tableColumns,
  () => {
    tableColumnKeys.value = []
    tableBodyColumns.value = []
    tableHeadColumns.value = []

    findFindNode(tableColumns.value)
    findFindNodes(tableColumns.value)
    findFinalNode(0, tableColumns.value)
  },
  { immediate: true }
)

watch( // 监听传入多选行选中参数变化时，更新 tableSelectedKeys
  () => props.selectedKeys,
  () => {
    tableSelectedKeys.value = props.selectedKeys
  },
  { deep: true }
)

watch( // 监听传入树节点展开参数变化时，更新 tableExpandKeys
  () => props.expandKeys,
  () => {
    tableExpandKeys.value = props.expandKeys
  },
  { deep: true }
)

watch( // 监听传入数据源参数变化时，更新 tableDataSource、tableSelectedKeys、tableSelectedKey
  () => props.dataSource,
  () => {
    tableDataSource.value = [...props.dataSource]
    tableSelectedKeys.value = []
    tableSelectedKey.value = s
  },
  { deep: true }
)

watch( // 监听多选行选中变化时，更新 allChecked、hasChecked（图标改变），触发事件
  tableSelectedKeys,
  () => {
    if (tableSelectedKeys.value.length === props.dataSource.length) {
      allChecked.value = true
    } else {
      allChecked.value = false
    }
    if (tableSelectedKeys.value.length > 0) {
      hasChecked.value = true
    } else {
      hasChecked.value = false
    }
    emit('update:selectedKeys', tableSelectedKeys.value)
  },
  { deep: true, immediate: true }
)

watch( // 监听展开树节点时，触发事件
  tableExpandKeys,
  () => {
    emit('update:expandKeys', tableExpandKeys.value)
  },
  { deep: true, immediate: true }
)
```

## 项目地址
- 项目地址：https://github.com/linhr123/weView
- 演示地址：https://zzy003527.github.io