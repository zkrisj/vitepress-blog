---
date: 18:38 2023/3/23
title: form 表单新属性 submitter、新方法 requestSubmit、新事件 formdata
tags:
- HTML
- JS
description: 
---
## SubmitEvent.submitter
表示发送 submit 事件的表单元素。通常是 type 属性是 submit 的 `<input>` 元素或者 type 属性是 submit 的 `<button>` 元素，也可能是启动提交过程的其他元素。
```js
form.addEventListener('submit', (event) => {
  const { submitter } = event;
  console.log(submitter);
  // 阻止默认的表单提交行为
  event.preventDefault();
});
```
如果提交不是由表单控件触发的（使用 HTMLFormElement.requestSubmit() 方法），则 submitter 的值是 null。

表单外 HTML 元素通过绑定事件调用 HTMLFormElement.submit() 方法——不会触发表单的 submit 事件（也不会触发表单验证），所以不能通过 SubmitEvent 来获取 submitter 属性。

## HTMLFormElement.requestSubmit
- HTMLFormElement.requestSubmit() 方法会触发表单验证，验证通过后会触发开发者自定义的 submit 事件。
- HTMLFormElement.submit() 方法会直接触发表单元素的原生提交——不会触发表单的 submit 事件（也不会触发表单验证），页面会跳转到 action 属性定义的 URL 或刷新（action 属性值为空时）。

语法：
```js
requestSubmit()
requestSubmit(submitter)
```
调用 requestSubmit() 时指定的 submitter 参数必须是当前表单元素的后代或者必须具有引用当前表单的 form 属性，否则会抛出 DOMException。

<iframe src="https://code.juejin.cn/pen/7156249675828297741"></iframe>

## HTMLFormElement: formdata event
formdata 事件在构建表示表单数据的条目列表后触发，例如在提交表单时或调用 FormData() 构造函数传入表单元素参数时。
```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // 构造 FormData 对象，触发 formdata 事件
  const formData = new FormData(form);
  console.log(JSON.stringify([...formData]));
});
form.addEventListener('formdata', (e) => {
  console.log('formdata fired');
  const { formData } = e;
  // 将输入值转成小写
  formData.set('field1', formData.get('field1').toLowerCase());
  formData.set('field2', formData.get('field2').toLowerCase());
  // 追加 name 字段
  formData.append('name', 'test');
});
b1.onclick = e => {
  // 提交表单，触发 formdata 事件
  form.requestSubmit();
}
```
<iframe src="https://code.juejin.cn/pen/7156259844729602079"></iframe>

## 浏览器支持
![developer.mozilla.org_en-US_docs_Web_API_SubmitEvent_submitter.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eba04f384414afda53488c4d8571128~tplv-k3u1fbpfcp-watermark.image?)

![CPT2210200040-701x293.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b65a1cb945ae41188d572097fbb06e76~tplv-k3u1fbpfcp-watermark.image?)

![developer.mozilla.org_en-US_docs_Web_API_HTMLFormElement_formdata_event.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cfb68db58cf4f65a19b2bc588eaa95d~tplv-k3u1fbpfcp-watermark.image?)

## 原文链接
- [2022年新出了哪些form表单新特性？](https://www.zhangxinxu.com/wordpress/2022/10/2022-new-form-property/)
