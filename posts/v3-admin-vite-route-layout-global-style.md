---
date: 7:32 2023/5/9
title: V3 Admin Vite 路由配置、布局配置、全局样式
tags:
- Vue
description: 平台自定义的配置项都在 meta 属性下，而其他的比如 path、component、redirect、children、name 属性是 vue-router 自带的。
---
## 介绍
[V3 Admin Vite](https://github.com/un-pany/v3-admin-vite) 是一个免费开源的中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术。另外还有：
- Vue-Cli 5.x 版: [v3-admin](https://github.com/un-pany/v3-admin)
- Electron 桌面版: [v3-electron-vite](https://github.com/un-pany/v3-electron-vite)

## 目录结构
```sh
# v3-admin-vite
├─ .husky                # 用户提交代码时格式化代码
├─ .vscode               # 本项目推荐的 vscode 配置和拓展
├─ public
│  ├─ favicon.ico
│  ├─ app-loading.css    # 首屏加载 loading
├─ src
│  ├─ api                # api 接口
│  ├─ assets             # 静态资源
│  ├─ components         # 全局组件
│  ├─ config             # 全局配置
│  ├─ constant           # 常量/枚举
│  ├─ directives         # 全局指令
│  ├─ hooks              # 全局 hook
│  ├─ icons              # svg icon
│  ├─ layout             # 布局
│  ├─ plugins            # 全局插件
│  ├─ router             # 路由
│  ├─ store              # pinia store
│  ├─ styles             # 全局样式
│  ├─ utils              # 全局公共方法
│  └─ views              # 所有页面
│  ├─ App.vue            # 入口页面
│  └─ main.ts            # 入口文件
├─ tests                 # 单元测试
├─ types                 # ts 声明
├─ .env.development      # 开发环境
├─ .env.production       # 正式环境
├─ .env.staging          # 预发布环境
├─ .eslintrc.js          # eslint 配置
├─ .prettier.config.js   # prettier 配置
├─ tsconfig.json         # ts 编译配置
├─ unocss.config.ts      # unocss 配置
└─ vite.config.ts        # vite 配置
```

## 路由配置
路由的定义以及配置在 `@/src/router/index.ts` 文件里，比如登录路由配置：
```ts
{
  path: "/login",
  component: () => import("@/views/login/index.vue"),
  meta: {
    hidden: true
  }
}
```
平台自定义的配置项都在 `meta` 属性下，而其他的比如 `path`、`component`、`redirect`、`children`、`name` 属性是 `vue-router` 自带的。
```ts
// 设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noRedirect'

// 动态路由：必须设定路由的名字，一定要填写不然重置路由可能会出问题
// 如果要在 tags-view 中展示，也必须填 name
name: 'router-name'

meta: {
  // 设置该路由在侧边栏和面包屑中展示的名字
  title: 'title'
  
  // 设置该路由的图标，记得将 svg 导入 @/icons/svg
  svgIcon: 'svg name'
  
  // 设置该路由的图标，直接使用 Element Plus 的 Icon（与 svgIcon 同时设置时，svgIcon 将优先生效）
  elIcon: 'element-plus icon name'
  
  // 默认 false，设置 true 的时候该路由不会在侧边栏出现
  hidden: true
  
  // 设置该路由进入的权限，支持多个权限叠加（动态路由才需要设置）
  roles: ['admin', 'editor']
  
  // 默认 true，如果设置为 false，则不会在面包屑中显示
  breadcrumb: false
  
  // 默认 false，如果设置为 true，它则会固定在 tags-view 中
  affix: true
  
  // 当一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
  // 只有一个时，会将那个子路由当做根路由显示在侧边栏
  // 若想不管路由下面的 children 声明的个数都显示你的根路由
  // 可以设置 alwaysShow: true，这样就会忽略之前定义的规则，一直显示根路由
  alwaysShow: true

  // 示例: activeMenu: "/xxx/xxx"
  // 当设置了该属性进入路由时，则会高亮 activeMenu 属性对应的侧边栏
  // 该属性适合使用在有 hidden: true 属性的路由上
  activeMenu: '/dashboard'
  

  // 是否缓存该路由页面
  // 默认为 false，为 true 时代表需要缓存，此时该路由和该页面都需要设置一致的 Name
  keepAlive: false
}
```
为了让编辑器对这些配置项有类型提示，TS 定义文件放在了 `@/types/vue-router.d.ts` 中，需要改造或者新增配置项时，也应该同步修改这个文件。

### 路由缓存
设置路由缓存必须同时满足这四个条件：
1. 路由 `keepAlive` 为 `true`。
2. 路由有 `Name`。
3. 页面有 `Name`。
4. 路由和页面 `Name 保持一致`。

以表格组件路由为例：
```ts
{
  path: "/table",
  component: Layout,
  redirect: "/table/element-plus",
  name: "Table",
  meta: {
    title: "表格",
    elIcon: "Grid"
  },
  children: [{
      path: "element-plus",
      component: () => import("@/views/table/element-plus/index.vue"),
      name: "ElementPlus",
      meta: {
        title: "Element Plus",
        keepAlive: true
      }
    },
    {
      path: "vxe-table",
      component: () => import("@/views/table/vxe-table/index.vue"),
      name: "VxeTable",
      meta: {
        title: "Vxe Table",
        keepAlive: true
      }
    }
  ]
}
```
两个路由的 `Name` 分别是 `ElementPlus` 和 `VxeTable`，我们还需要去对应的页面上配置相同的 `Name`：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/197c6dc309834e548d037511b0cdf509~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/282face7462649c88b85eae558e3f819~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

配置好 `Name` 后，页面上输入一些筛选条件，然后切换到其他页面再切换回来发现这些数据还在就表示缓存成功了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b89e52276214c899739ea10d838e88a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 动态路由
1. 把不需要判断权限的路由放置在常驻路由 `constantRoutes` 中，如 `/login`、`/dashboard`。
2. `asyncRoutes` 中放置需要动态判断权限并通过 `addRoute` 动态添加的路由。
3. 注意：动态路由必须配置 `name` 属性，不然重置路由时，会漏掉没有该属性的动态路由，可能会导致业务 BUG。

## 布局配置
1. 布局的内容大致是：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ceb0070d6994ecab8edcffbffaa4258~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

页面的右侧默认有一个设置按钮，点击设置按钮后展开的布局配置界面，所有内置的可配置的选项：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/118bcd15c21a426d83bac0ccb02927b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在 `@/src/config/layout.ts` 布局配置文件里将 `showSettings` 配置项的布尔值修改为 `false` 即可关闭设置按钮。

2. 每个选项可以通过界面去配置，也可以直接修改他们对应的配置项，这些配置项也是在 `@/src/config/layout.ts` 中的，配置项和界面的对应关系如下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b55eae7ad1b0497aa0329a89a75b9d28~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 设置标签图标
1. 以首页为例，假如不设置图标，则 `svgIcon` 或 `elIcon` 属性为空：
```ts
meta: {
  title: "首页",
  affix: true
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffb516549a6b412e899cc0da755ec721~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

2. 假如想使用 `Element Plus` 的 Icon，那你应该去 [官网](https://element-plus.org/zh-CN/component/icon.html#%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88) 找一个符合要求的图标并复制它的名字。例如这个名为 `House` 的 Icon，我们直接用 `elIcon` 配置项使用它：
```ts
meta: {
  title: "首页",
  elIcon: "House",
  affix: true
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eddc2fad876b45ba98c49f105149b192~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

3. 假如想使用本地的 `SVG` 图标，应该将静态资源复制到 `@/src/icons/svg` 目录下，例如这个名为 `dashboard` 的图标：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/896c75abe6f14e4582a4f36748df5cba~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```ts
meta: {
  title: "首页",
  svgIcon: "dashboard",
  affix: true
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4147c4dc2caa474188ffc73fd02f2b71~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 全局样式
全局样式相关的的文件，全都在 `@/src/styles` 目录下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abc75587a3654d9d9271bfa69e44727b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

1. vxe-table.scss：这里可以写样式来覆盖 vxe-table 原本的样式。
2. element-plus.scss：这里可以写样式来覆盖 element-plus 原本的样式。
3. transition.scss： 这里可以写动画相关的样式。
4. mixins.scss：这里可以写和 scss `mixin` 相关的样式。
5. variables.css：这里是本项目内置的一些比较重要的和布局、颜色相关的全局样式。
6. index.scss：这里是所有样式的入口，也可以写样式来覆盖原生 html 的样式。
7. theme：这里是多主题模式相关的样式文件，目前内置了黑暗模式、深蓝色模式。

简单修改一下 `variables.css` 的效果：
```css
/** 全局 CSS 变量，这种变量不仅可以在 CSS 和 SCSS 中使用，还可以导入到 JS 中使用 */

:root {
  /** 全局背景色 */
  --v3-body-bg-color: #f2f3f5;
  /** Header 区域 = NavigationBar 组件 + TagsView 组件 */
  --v3-header-height: calc(var(--v3-navigationbar-height) + var(--v3-tagsview-height));
  /** NavigationBar 组件 */
  --v3-navigationbar-height: 50px;
  /** Sidebar 组件 */
  --v3-sidebar-width: 220px;
  --v3-sidebar-hide-width: 58px;
  --v3-sidebar-menu-item-height: 60px;
  --v3-sidebar-menu-tip-line-bg-color: var(--el-color-primary);
  --v3-sidebar-menu-bg-color: #001428;
  --v3-sidebar-menu-hover-bg-color: #ffffff10;
  --v3-sidebar-menu-text-color: #c0c4cc;
  --v3-sidebar-menu-active-text-color: #ffffff;
  /** SidebarLogo 组件 */
  --v3-sidebarlogo-bg-color: #001428;
  /** TagsView 组件 */
  --v3-tagsview-height: 34px;
  --v3-tagsview-tag-text-color: #495060;
  --v3-tagsview-tag-active-text-color: #ffffff;
  --v3-tagsview-tag-bg-color: #ffffff;
  --v3-tagsview-tag-active-bg-color: var(--el-color-primary);
  --v3-tagsview-tag-border-radius: 2px;
  --v3-tagsview-tag-border-color: #d8dce5;
  --v3-tagsview-tag-active-border-color: var(--el-color-primary);
  --v3-tagsview-tag-active-before-color: #ffffff;
  --v3-tagsview-tag-icon-hover-bg-color: #00000030;
  --v3-tagsview-tag-icon-hover-color: #ffffff;
  /** RightPanel 组件  */
  --v3-rightpanel-button-bg-color: #001428;
}
```
将上面的全局背景色灰白色 `--v3-body-bg-color: #f2f3f5` 改成黑色 `#000000` 后效果如下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab5960e0640f4e1b976dbc03e3254d1a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

1. 如果想知道某个样式是什么作用，可以直接看注释和命名，因为项目还是非常规范的。
2. 也可以直接复制变量名在编辑器里搜索，就能查看到该变量在什么地方用到了。

## 参考资料
1. [【V3 Admin Vite】教程四：平台配置（涉及布局、路由菜单、全局样式配置）](https://juejin.cn/post/7216621821960781880)
