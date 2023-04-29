---
date: 5:42 2023/4/30
title: JavaScript 闭包
tags:
- JS
description: 闭包让开发者可以从内部函数访问外部函数的作用域。
---
## 介绍
1. 闭包（英语：Closure），又称词法闭包（Lexical Closure）或函数闭包（function closures），是在支持头等函数的编程语言中实现词法绑定的一种技术。
2. 闭包在实现上是一个结构体，它存储了一个函数（通常是其入口地址）和一个关联的环境（相当于一个符号查找表）。环境里是若干对符号和值的对应关系，它既要包括约束变量（该函数内部绑定的符号），也要包括自由变量（在函数外部定义但在函数内被引用），有些函数也可能没有自由变量。换而言之，闭包让开发者可以从内部函数访问外部函数的作用域。
3. 闭包跟函数最大的不同在于，当捕捉闭包的时候，它的自由变量会在捕捉时被确定，这样即便脱离了捕捉时的上下文，它也能照常运行。捕捉时对于值的处理可以是值拷贝，也可以是名称引用，这通常由语言设计者决定，也可能由用户自行指定（如C++）。

## 使用
下面在全局上下文中，定义了一个 `showName` 函数。
```js
function showName() {
  const company = "Bytedance";
  const dep = "边缘云";
  const name = "zhangqi";
  console.log('company', company);
  return function() {
    console.log(dep);
    return name;
  }
}
const getName = showName();
console.log(getName());
```
上面代码会依次打印：
```
company Bytedance
边缘云
zhangqi
```
第 11 行，`showName` 函数已被执行完成，按照通常逻辑，里面的变量应该被回收，但是我们还是通过 `getName` 函数访问到了它里面的变量 `dep` 和 `name`。

因为 `showName` 函数返回了一个函数，这个函数产生了一个闭包，这个闭包是一个地址，它指向了堆上的一块内存，这块内存存储了闭包要访问的外部函数的两个变量 `dep` 和 `name`：
```js
{
  dep: "边缘云",
  name: "zhangqi"
}
```
这个闭包会一直跟随通过 `showName` 函数返回的函数赋值的 `getName` 函数的生命周期结束。所以即使 `showName` 函数执行结束，它里面的这个闭包也是没有被回收的。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28164737dc7a488e82c4f1aec7fb52ea~tplv-k3u1fbpfcp-watermark.image?)

## 性能问题
1. 在 Javascript 中，如果一个对象不再被引用，那么这个对象就会被 GC 回收。如果两个对象互相引用，而不再被第3者所引用，那么这两个互相引用的对象也会被回收。因为函数 a 被 b 引用，b 又被 a 外的 c 引用，这就是为什么函数 a 执行后不会被回收的原因。
2. 通常，如果引用闭包的函数是一个全局变量，那么闭包会一直存在直到页面关闭；但如果这个闭包以后不再使用的话，就会造成内存泄漏。如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。
3. 如果不是某些特定任务需要使用闭包，在其他函数中创建函数是不明智的，因为闭包在处理速度和内存消耗方面对脚本性能具有负面影响。例如，在创建新的对象或者类时，方法通常应该关联于对象的原型，而不是定义到对象的构造器中。原因是这将导致每次构造器被调用时，方法都会被重新赋值一次（也就是说，对于每个对象的创建，方法都会被重新赋值）。例如：
```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
  this.getName = function() {
    return this.name;
  };

  this.getMessage = function() {
    return this.message;
  };
}
```
在上面的代码中，我们并没有利用到闭包的好处，因此可以避免使用闭包。修改成如下：
```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype = {
  getName() {
    return this.name;
  },
  getMessage() {
    return this.message;
  }
};
```
但我们不建议重新定义原型，可以对原型进行更新操作：
```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype.getName = function() {
  return this.name;
};
MyObject.prototype.getMessage = function() {
  return this.message;
};
```

## 总结
理解 JavaScript 的闭包是迈向高级 JS 程序员的必经之路，理解了其解释和运行机制才能写出更为安全和优雅的代码。

## 参考资料
1. [闭包 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)