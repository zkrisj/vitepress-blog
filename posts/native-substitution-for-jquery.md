---
date: 17:45 2023/3/23
title: 总结一下 jQuery 的原生替代方法
tags:
- jQuery
description: jQuery 可以保护我们不受浏览器兼容的影响，而事实上，在 IE8 之后，浏览器自己就很容易处理兼容问题。
---
# 总结一下 jQuery 的原生替代方法
## 介绍
jQuery 是当今网络上使用最多的库，虽然 jQuery 相对较小且运行速度相当快，但它仍然代表应用程序中的一定量的开销。jQuery 提供的大部分功能现在都可以通过原生 DOM API 实现，并且在当今的 Web 应用程序中可能是不必要的。一些开发者认为，jQuery 可以保护我们不受浏览器兼容的影响，而事实上，在 IE8 之后，浏览器自己就很容易处理兼容问题了，而在 IE 时代之后，浏览器在兼容方面会做得更多。

## fetch 替代 AJAX 方法
### $(selector).load
```js
$('#selector').load('/path/to/template.html');
// 等价替换
const response = await fetch('/path/to/template.html');
const body = await response.text();
document.querySelector('#selector').innerHTML = body;
```

### $.get
```
$.get('/my/url', function(data){
  // 处理 data 数据
});
// 等价替换
const response = await fetch('/my/url');
if (!response.ok) {
}
const data = await response.text();
```

### $.getJSON
```js
$.getJSON('/my/url', function(data){
  // 处理 data 数据
});
// 等价替换
const response = await fetch('/my/url');
const data = await response.json();
```

### $.ajax
```js
$.ajax({
  type: 'POST',
  url: '/my/url',
  data: data,
  success: function (res) {},
  error: function () {}
});
// 等价替换
const res = await fetch('/my/url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

## 元素操作
### $(el).toggle
```js
$(el).toggle();
// 等价替换
el.classList.toggle('hide');
```
```css
.hide {
  display: none;
}
```

### $(el).addClass
```js
$(el).addClass(className);
// 等价替换
el.classList.add(className);
```

### $(el).removeClass
```js
$(el).removeClass(className);
// 等价替换
el.classList.remove(className);
```

### $(el).hasClass
```js
$(el).hasClass(className);
// 等价替换
el.classList.contains(className);
```

### $(el).css
```js
$(el).css(ruleName);
// 等价替换
getComputedStyle(el)[ruleName];

$(el).css(prop, val);
// 等价替换
el.style.cssText = `${prop}: ${val}`;
```

### $(target).after
```js
$(target).after(element);
// 等价替换
target.after(element);
```

### $(target).before
```js
$(target).before(element);
// 等价替换
target.before(el);
```

### $(parent).append
```js
$(parent).append(el);
// 等价替换
parent.append(el);
```

### $(el).appendTo
```js
$(el).appendTo(parent);
// 等价替换
parent.append(el);
```

### $(el).clone
```js
$(el).clone();
// 等价替换
el.cloneNode(true);
```

### $(el).closest
```js
$(el).closest(selector);
// 等价替换
el.closest(selector);
```

### $.contains
```js
$.contains(el, childNode);
// 等价替换
el.contains(childNode);
```

### :contains
```js
$("div:contains('my text')");
// 等价替换
[...document.querySelectorAll('div')].filter((el) =>
  el.textContent.includes('my text')
);
```

### Create Elements
```js
$('<div>Hello World!</div>');
// 等价替换
function generateElements(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.children;
}
generateElements('<div>Hello World!</div>');
```

### $(selector).each
```js
$(selector).each(function (i, el) {});
// 等价替换
document.querySelectorAll(selector).forEach((el, i) => {});
```

### $(el).empty
```js
$(el).empty();
// 等价替换
el.replaceChildren();
```

### $(selector).filter
```js
$(selector).filter(filterFn);
// 等价替换
[...document.querySelectorAll(selector)].filter(filterFn);
```

### $(el).find
```js
$(el).find(selector);
// 等价替换
el.querySelectorAll(`:scope ${selector}`);
```

### $(el).height|width
```js
$(el).height();
$(el).width();
// 等价替换
el.getBoundingClientRect().height;
el.getBoundingClientRect().width;

$(el).height(val);
$(el).width(val);
// 等价替换
function setHeight(el, val) {
  if (typeof val === 'function') val = val();
  else if (typeof val === 'string') el.style.height = val;
  else el.style.height = val + 'px';
}
function setWidth(el, val) {
  if (typeof val === 'function') val = val();
  else if (typeof val === 'string') el.style.width = val;
  else el.style.width = val + 'px';
}
```

### $(el).index
```js
$(el).index();
// 等价替换
[...el.parentNode.children].indexOf(el);
```

### $(el).innerHeight|innerWidth
```js
$(el).innerHeight();
$(el).innerHeight(150);
$(el).innerWidth();
$(el).innerWidth(150);
// 等价替换
function innerHeight(el, value) {
  if (value === undefined) {
    return el.clientHeight;
  } else {
    el.style.height = value;
  }
}
function innerWidth(el, value) {
  if (value === undefined) {
    return el.clientWidth;
  } else {
    el.style.width = value;
  }
}
innerHeight(el);
innerHeight(el, 150);
innerWidth(el);
innerWidth(el, 150);
```

### $(selector).last
```js
$(selector).last();
// 等价替换
document.querySelectorAll(selector).at(-1);
```

### $(el).is
```js
$(el).is('.my-class');
// 等价替换
el.matches('.my-class');
```

### $(el).offset
```js
$(el).offset();
// 等价替换
function offset(el) {
  const box = el.getBoundingClientRect();
  const docElem = document.documentElement;
  return {
    top: box.top + window.pageYOffset - docElem.clientTop,
    left: box.left + window.pageXOffset - docElem.clientLeft
  };
}
```

### 相对视口的位置
```js
function offset(el) {
  const offset = $(el).offset();
  return {
    top: offset.top - document.body.scrollTop,
    left: offset.left - document.body.scrollLeft
  };
}
// 等价替换
el.getBoundingClientRect();
```

### $(el).offsetParent
```js
$(el).offsetParent();
// 等价替换
el.offsetParent || el;
```

### $(el).outerHeight|outerWidth
```js
$(el).outerHeight();
$(el).outerWidth();
// 等价替换
el.offsetHeight;
el.offsetWidth;

// 加上 margin
$(el).outerHeight(true);
$(el).outerWidth(true);
// 等价替换
function outerHeight(el) {
  const style = getComputedStyle(el);
  return (
    el.getBoundingClientRect().height +
    parseFloat(style.getPropertyValue('marginTop')) +
    parseFloat(style.getPropertyValue('marginBottom'))
  );
}
function outerWidth(el) {
  const style = getComputedStyle(el);
  return (
    el.getBoundingClientRect().width +
    parseFloat(style.getPropertyValue('marginLeft')) +
    parseFloat(style.getPropertyValue('marginRight'))
  );
}
outerHeight(el);
outerWidth(el);
```

### $(el).parents
```js
$(el).parents(selector);
// 等价替换
function parents(el, selector) {
  const parents = [];
  while ((el = el.parentNode) && el !== document) {
    if (!selector || el.matches(selector)) parents.unshift(el);
  }
  return parents;
}
```

### $(el).position
```js
$(el).position();
// 等价替换
function position(el) {
  const {top, left} = el.getBoundingClientRect();
  const {marginTop, marginLeft} = getComputedStyle(el);
  return {
    top: top - parseInt(marginTop),
    left: left - parseInt(marginLeft)
  };
}
```

### $(el).next|prev
```js
$(el).next();
$(el).prev();
// 等价替换
el.nextElementSibling;
el.previousElementSibling;

$(el).next(selector);
$(el).prev(selector);
// 等价替换
function next(el, selector) {
  if (selector) {
    let next = el.nextElementSibling;
    while (next && !next.matches(selector)) {
      next = next.nextElementSibling;
    }
    return next;
  }
}
function prev(el, selector) {
  if (selector) {
    let previous = el.previousElementSibling;
    while (previous && !previous.matches(selector)) {
      previous = previous.previousElementSibling;
    }
    return previous;
  }
}
```

### $(el|selector).remove
```js
$(el).remove();
// 等价替换
el.remove();

$(selector).remove();
// 等价替换
for (const el of [...document.querySelectorAll(selector)]) {
  el.remove();
}
```

### $(el).replaceWith
```js
$(el).replaceWith(string);
// 等价替换
el.outerHTML = string;
```

### $(el).scrollLeft
```js
$(el).scrollLeft();
$(el).scrollLeft(value);
// 等价替换
function scrollLeft(el, value) {
  if (value === undefined) {
    return el.pageXOffset;
  } else {
    if (el === window || el.nodeType === 9) {
      el.scrollTo(value, el.pageXOffset);
    } else {
      el.pageXOffset = value;
    }
  }
}
```

### $(el).scrollTop
```js
$(el).scrollTop();
$(el).scrollTop(value);
// 等价替换
function scrollTop(el, value) {
  if (value === undefined) {
    return el.pageYOffset;
  } else {
    if (el === window || el.nodeType === 9) {
      el.scrollTo(value, el.pageYOffset);
    } else {
      el.pageYOffset = value;
    }
  }
}
```

### $(formElement).serialize
```js
$(formElement).serialize();
// 等价替换
new URLSearchParams(new FormData(formElement)).toString();
```

### $(el).siblings
```js
$(el).siblings();
// 等价替换
[...el.parentNode.children].filter((child) => child !== el);
```

### $(el).wrap
```js
el.wrap('<div></div>');
// 等价替换
function wrap(el) {
  const wrappingElement = document.createElement('div');
  el.replaceWith(wrappingElement);
  wrappingElement.appendChild(el);
}
```

### $(el).unwrap
```js
$(el).unwrap();
// 等价替换
el.replaceWith(...el.childNodes);
```

### $(el).val
```js
$(el).val();
// 等价替换
function val(el) {
  if (el.options && el.multiple) {
    return el.options
      .filter((option) => option.selected)
      .map((option) => option.value);
  } else {
    return el.value;
  }
}
```

## 事件操作
### $(document).ready
```js
$(document).ready(function () {});
// 等价替换
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
```

### $(document).on
```js
$(document).on(eventName, elementSelector, handler);
// 等价替换
document.addEventListener(eventName, (event) => {
  if (event.target.closest(elementSelector)) {
    handler.call(event.target, event);
  }
});
```

### $(el).click
```js
$(el).click(function () {});
// 等价替换
el.addEventListener('click', () => {});
```

### $(el).on
```js
$(el).on(eventName, eventHandler);
$(el).on(eventName, selector, eventHandler);
// 等价替换
function addEventListener(el, eventName, eventHandler, selector) {
  if (selector) {
    const wrappedHandler = (e) => {
      if (e.target && e.target.matches(selector)) {
        eventHandler(e);
      }
    };
    el.addEventListener(eventName, wrappedHandler);
    return wrappedHandler;
  } else {
    el.addEventListener(eventName, eventHandler);
    return eventHandler;
  }
}
addEventListener(el, eventName, eventHandler);
addEventListener(el, eventName, eventHandler, selector);
```

### $(el).off
```js
$(el).off(eventName, eventHandler);
// 等价替换
el.removeEventListener(eventName, eventHandler);
```

### $(el).trigger
```js
$(el).trigger('my-event', {some: 'data'});
// 等价替换
const event = new CustomEvent('my-event', {detail: {some: 'data'}});
el.dispatchEvent(event);

$(el).trigger('focus');
$(el).trigger(new PointerEvent('pointerover'));
// 等价替换
function trigger(el, eventType) {
  if (typeof eventType === 'string' && typeof el[eventType] === 'function') {
    el[eventType]();
  } else {
    const event =
      eventType === 'string'
        ? new Event(eventType, {bubbles: true})
        : eventType;
    el.dispatchEvent(event);
  }
}
trigger(el, 'focus');
trigger(el, new PointerEvent('pointerover'));
```

## 内置操作
### $.inArray|isArray
```js
$.inArray(item, array);
$.isArray(arr);
// 等价替换
array.indexOf(item);
Array.isArray(arr);
```

### $.each|map
```js
$.each(array, fn);
$.map(array, fn);
// 等价替换
array.forEach(fn);
array.map(fn);

$.each(obj, function (key, value) {});
// 等价替换
for (const [key, value] of Object.entries(obj)) {}
```

### $.proxy
```js
$.proxy(fn, context);
// 等价替换
fn.bind(context);
```

### $.extend
```js
$.extend({}, objA, objB);
// 等价替换
const result = {...objA, ...objB};

$.extend(true, {}, objA, objB);
// 等价替换
function deepExtend(out, ...arguments_) {
  if (!out) {
    return {};
  }
  for (const obj of arguments_) {
    if (!obj) {
      continue;
    }
    for (const [key, value] of Object.entries(obj)) {
      switch (Object.prototype.toString.call(value)) {
        case '[object Object]':
          out[key] = deepExtend(out[key], value);
          break;
        case '[object Array]':
          out[key] = deepExtend(new Array(value.length), value);
          break;
        default:
          out[key] = value;
      }
    }
  }
  return out;
}
deepExtend({}, objA, objB);
```

### $.isNumeric
```js
$.isNumeric(val);
// 等价替换
function isNumeric(num) {
  if (typeof num === 'number') return num - num === 0;
  if (typeof num === 'string' && num.trim() !== '')
    return Number.isFinite(+num);
  return false;
}
isNumeric(val);
```

### $.parseHTML
```js
$.parseHTML(htmlString);
// 等价替换
function parseHTML(str) {
  const tmp = document.implementation.createHTMLDocument('');
  tmp.body.innerHTML = str;
  return [...tmp.body.childNodes];
}
parseHTML(htmlString);
```

### $.type
```js
$.type(obj);
// 等价替换
Object.prototype.toString
  .call(obj)
  .replace(/^\[object (.+)\]$/, '$1')
  .toLowerCase();
```

## 原文链接
- [You might not need jQuery](https://youmightnotneedjquery.com/)