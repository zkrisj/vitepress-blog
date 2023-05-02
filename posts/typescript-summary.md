---
date: 8:17 2023/5/1
title: TypeScript 总结
tags:
- TypeScript
description: 不仅仅是一门语言，更是生产力工具。
---

## 介绍
TypeScript VS JavaScript：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ee8706c8e6e4c5ab0f55337121c35c2~tplv-k3u1fbpfcp-watermark.image?)

TypeScript 带来了什么：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41786b7decaa4f4f98c8ece21d3d1474~tplv-k3u1fbpfcp-watermark.image?)

## 基础类型
1. boolean、number、string
2. undefined、null
3. any、unknown、void
4. never
5. 数组类型 []
6. 元组类型 tuple

## 函数类型
1. 定义：TS 定义函数类型时要定义输入参数类型和输出类型
2. 输入参数：参数支持可选参数和默认参数
3. 输出参数：输出可以自动推断，没有返回值时，默认为 void 类型
4. 函数重载：名称相同但参数不同，可以通过重载支持多种类型

## interface
1. 定义：接口是为了定义对象类型
2. 特点：
    - 可选属性：？
    - 只读属性：readonly
    - 可以描述函数类型
    - 可以描述自定义属性
3. 总结：接口非常灵活 duck typing

## class
1. 定义：写法和 JS 差不多，增加了一些定义
2. 特点：
    - 增加了 public、private、protected 修饰符
    - 抽象类
        - 只能被继承，不能被实例化
        - 作为基类，抽象方法必须被子类实现
    - interface 约束类，使用 implements 关键字

## 高级类型
1. 联合类型 |
2. 交叉类型 &
3. 类型断言
4. 类型别名：给类型起个别名
5. type VS interface
    - 相同点：
        - 都可以定义对象或函数
        - 都允许继承
    - 差异点:
        - interface 是 TS 用来定义对象，type 是用来定义别名方便使用
        - type 可以定义基本类型，interface 不行
        - interface 可以合并重复声明，type 不行

## 泛型
官方定义：
1. 软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型这在创建大型系统时为你提供了十分灵活的功能。
2. 在像 C# 和 Java 这样的语言中，可以使用泛型来建可重用的组件个组件可以支持多种类型的数据。这样用户就可以以自己的数据类型来使用组件。
> 需要有一个类型解决输入输出可关联的问题。

基本定义:
1. 泛型的语法是 <> 里面写类型参数，一般用 T 表示。
2. 使用时有两种方法指定类型：
    1. 定义要使用的类型
    2. 通过 TS 类型推断，自动推导类型
3. 泛型的作用是临时占位，之后通过传来的类型进行推导。

基础操作符：
- typeof：获取类型
- keyof：获取所有键
- in：遍历枚举类型
- T[K]：索引访问
- extends：泛型约束

工具类型：
- Partial<T>：将类型属性变为可选
- Required<T>：将类型属性变为必选
- Readonly<T>：将类型属性变为只读
- Pick、Record...

## 声明文件
1. declare：三方库需要类型声明文件
2. .d.ts：声明文件定义
3. @types：三方库 TS 类型包
4. tsconfig.json：定义 TS 的配置

## 实例 - 泛型约束后端接口类型
```ts
import axios from 'axios'
interface API {
  '/book/detail': {
    id: number,
  },
  '/book/comment': {
    id: number
    comment: string
  }
}
function request <T extends keyof API> (url: T, obj: API[T]) {
  return axios.post(url, obj)
}
```
以下是错误使用：
1. 路径错误：
```ts
request('/book/test', {
  id: 1,
  comment: 'ok'
});
```
2. 参数错误：
```ts
request('/book/detail', {
  id: 1,
  comment: 'ok'
});
```
