---
date: 17:27 2023/3/24
title: TypeScript 基本数据类型 ｜ 青训营笔记
tags:
- TypeScript
description: TypeScript 不能正确地推断出变量的类型时，将设置类型为 any（禁用类型检查的类型）。
---
## TypeScript 介绍
1. TypeScript 是 JavaScript 的超集，提供了 JavaScript 的所有功能，并提供了可选的静态类型、Mixin、类、接口和泛型等特性。
2. TypeScript 的目标是通过其类型系统帮助及早发现错误并提高 JavaScript 开发效率。
3. 通过 TypeScript 编译器或 Babel 转码器转译为 JavaScript 代码，可运行在任何浏览器，任何操作系统。
4. 任何现有的 JavaScript 程序都可以运行在 TypeScript 环境中，并只对其中的 TypeScript 代码进行编译。
5. 在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型定义来提高代码的可维护性，减少可能出现的 bug。
6. 永远不会改变 JavaScript 代码的运行时行为，例如数字除以零等于 `Infinity`。这意味着，如果将代码从 JavaScript 迁移到 TypeScript ，即使 TypeScript 认为代码有类型错误，也可以保证以相同的方式运行。
7. 对 JavaScript 类型进行了扩展，增加了例如 `any`、`unknown`、`never`、`void`。
8. 一旦 TypeScript 的编译器完成了检查代码的工作，它就会 **擦除** 类型以生成最终的“已编译”代码。这意味着一旦代码被编译，生成的普通 JS 代码便没有类型信息。这也意味着 TypeScript 绝不会根据它推断的类型更改程序的 **行为**。最重要的是，尽管您可能会在编译过程中看到类型错误，但类型系统自身与程序如何运行无关。
9. 在较大型的项目中，可以在单独的文件 `tsconfig.json` 中声明 TypeScript 编译器的配置，并细化地调整其工作方式、严格程度、以及将编译后的文件存储在何处。

## 类型分配
创建变量时，TypeScript 有两种分配类型的方式：
- 显式的 - 明确写出类型。更易于阅读且更有目的性。
- 隐式的 - 不写出类型，TypeScript 将根据分配的值“猜测”类型（称为 infer 类型推导）。分配更短，输入速度更快，并且经常在开发和测试时使用。
```ts
let firstName = "Dylan"; // 推断为 string 类型
firstName = 33; // 现在赋值为 number 类型，报错
```
**TypeScript 不能正确地推断出变量的类型时，将设置类型为 any（禁用类型检查的类型）。**
```ts
// json 为隐式 any 类型，因为 JSON.parse 不知道它返回什么类型的数据
let json = JSON.parse("55");
console.log(typeof json); // number
json = '1';
console.log(typeof json); // string
```

## 类型推导
1. 在没有显式类型注释时使用类型推断来提供类型信息。例如，下面隐式声明变量：
```ts
let x = 3;
```
变量的类型 `x` 将被推断为 `number`，这种推断发生在初始化变量和成员、设置参数默认值和确定函数返回类型时。

2. 当从多个表达式进行类型推断时，这些表达式的类型用于计算“最佳通用类型”。
```ts
let x = [0, 1, ''];
```
要推断上例中 `x` 的类型，我们必须考虑每个数组元素的类型。在这里，我们为数组类型提供了两种选择：`number` 和 `string`，可以看到提示推导为 `let x: (number | string)[]`。

3. 在某些情况下类型共享公共结构，但没有一种类型是所有候选类型的超类型。
```ts
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
let zoo = [new Rhino(), new Elephant(), new Snake()];
```
当没有找到“最佳通用类型”时，得到的推断将是联合数组类型，可以看到提示推导为 `let zoo: (Rhino | Elephant | Snake)[]`。

理想情况下，我们可能希望 `zoo` 被推断为 `Animal[]`，但是因为数组中没有严格意义上的 `Animal` 类型的对象，所以我们没有对数组元素类型进行推断。为了纠正这一点，当没有一个类型是所有其他候选类型的超级类型时，就明确地提供类型。
```ts
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

4. 当表达式的类型由其所在位置暗示时，就会出现上下文类型化。例如：
```ts
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);
  console.log(mouseEvent.kangaroo);
};
```
在这里，TypeScript 类型检查器通过 `Window.onmousedown` 事件能够推断出 `mouseEvent` 参数的类型，该参数确实包含 `button` 属性，但不包含 `kangaroo` 属性。可以看到报错提示：`Property 'kangaroo' does not exist on type 'MouseEvent'.`。TypeScript 足够聪明，它也可以在其他上下文中推断类型：
```ts
window.onscroll = function (uiEvent) {
  console.log(uiEvent.button);
};
```
TypeScript 知道 `Window.onscroll` 事件中参数 `uiEvent` 是一个 `UIEvent`，而不是像前面示例那样的 `MouseEvent`。`UIEvent` 对象不包含 `button` 属性，因此会抛出错误 `Property 'button' does not exist on type 'Event'.`。

如果此函数不在上下文类型位置，则函数的参数将隐式具有类型 `any`，并且不会发出错误（除非使用 `noImplicitAny` 配置）：
```ts
// @noImplicitAny: false
const handler = function (uiEvent) {
  console.log(uiEvent.button); // <- OK
};
```
我们还可以显式地为函数的参数提供类型信息以覆盖任何上下文类型：
```ts
window.onscroll = function (uiEvent: any) {
  console.log(uiEvent.button); // 不报错，打印undefined，因为UIEvent对象不包含button属性
};
```
上下文类型化适用于许多情况。常见情况包括函数调用的参数、赋值的右侧、类型断言、对象和数组文字的成员以及返回语句。上下文类型也会充当“最佳通用类型”中的候选类型。例如：
```ts
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()];
}
```
在此示例中，“最佳通用类型”将从以下四个类型中选择：`Animal`、`Rhino`、`Elephant` 和 `Snake`。最终，通过“最佳通用类型”算法为 `Animal`。

## 数组
TypeScript 具有定义数组的特定语法。
1. 在元素类型后面加上 `[]`。
```ts
const arr: number[] = [1, 2];
```
2. 使用数组泛型。
```ts
const arr2: Array<number> = [1, 2];
```
3. `readonly` 关键字可以防止数组内容被更改。
```ts
const arr: readonly number[] = [1, 2];
// arr.push(3); // Property 'push' does not exist on type 'readonly number[]'.
```
4. 如果数组有值，TypeScript 可以推断它的类型。
```ts
const numbers = [1, 2, 3]; // 推断为类型 number[]
numbers.push(4); // OK

// numbers.push("2"); // Argument of type 'string' is not assignable to parameter of type 'number'
```

## 元组
数组中元素的数据类型都一般是相同的（`any[]` 类型的数组可以不同），如果存储的元素数据类型不同，则需要使用元组。
1. 如果添加未定义的类型，会抛出错误；如果赋值时类型相同，顺序不同，同样会抛出错误。
```ts
let x: [string, number];
x = ['hi', 1];
// x.push(true); // Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
// x = [1, 'hi']; // Type 'number' is not assignable to type 'string'. Type 'string' is not assignable to type 'number'.
```
2. `readonly` 关键字可以防止元组内容被更改。
```ts
let y: readonly [string, number] = ['hi', 1];
// y.push(undefined); // Property 'push' does not exist on type 'readonly [string, number]'.
```
3. “命名元组”允许为我们的索引值所代表的内容提供更多上下文。
```ts
const graph: [x: number, y: number] = [55.2, 41.3];
const [a, b] = graph;
```

## object
1. TypeScript 具有定义对象的特定语法。
```ts
const car: { type: string, model: string, year: number } = {
  type: "Toyota",
  model: "Corolla",
  year: 2009
};
```
对象类型可以单独写，也可以作为类型别名和接口重用。

2. TypeScript 可以根据属性的值推断属性的类型。
```ts
const car = {
  type: "Toyota",
};
car.type = "Ford";
// car.type = 2; // Type 'number' is not assignable to type 'string'.
```
3. 可选属性是不必在对象定义中定义的属性。
```ts
const car: { type: string, mileage?: number } = { // no error  
  type: "Toyota"  
};  
car.mileage = 2000;
```
4. 索引签名可用于没有定义属性列表的对象。
```ts
const nameAgeMap: { [index: string]: number } = {};
nameAgeMap.Jack = 25; // no error
nameAgeMap.Mark = "Fifty"; // Error: Type 'string' is not assignable to type 'number'.
```
上述索引签名也可以通过使用工具类型 `Record<string, number>` 实现。

5. Typescript 中的对象必须是特定类型的实例。
```ts
const sites = {
  site1: "Runoob",
  site2: "Google",
};
sites.sayHello = function() {
  console.log("hello " + sites.site1);
};
sites.sayHello();
```
上面示例在对象上面没有对应的 `sayHello` 类型定义，将不能进行属性赋值，会出现编译错误，：`Property 'sayHello' does not exist on type '{ site1: string; site2: string; }'.`，所以必须在对象上面定义类型模板。
```ts
const sites = {
  site1: "Runoob",
  site2: "Google",
  sayHello: function() {}
};
```

## null 和 undefined
默认情况下，类型检查器认为 `null` 与 `undefined` 可以赋值给任何类型，即 `null` 与 `undefined` 是所有其它类型的一个有效值。除非在 `tsconfig.json` 中设置 `strictNullChecks` 为 `true`，当你声明一个变量时，它不会自动地包含 `null` 或 `undefined`，但可以使用联合类型明确的包含它们，例如 `string | null`。
1. `null` 和 `undefined` 是原始类型，可以像字符串等其他类型一样使用。
```ts
let y: undefined = undefined;
console.log(typeof y);

let z: null = null;
console.log(typeof z);
```
2. 可选链 `?.` 是一种原生 JavaScript 特性，可以很好地与 TypeScript 中的 `null` 和 `undefined` 配合使用。
```ts
interface House {
  sqft: number;
  yard?: {
    sqft: number;
  };
}
function printYardSize(house: House) {
  const yardSize = house.yard?.sqft;
  if (yardSize === undefined) {
    console.log('No yard');
  } else {
    console.log(`Yard is ${yardSize} sqft`);
  }
}
let home: House = {
  sqft: 500
};
printYardSize(home); // 'No yard'
```
3. 空值合并 `??` 是另一个 JavaScript 特性，它也可以很好地与 TypeScript 的空值处理配合使用。
```ts
function printMileage(mileage: number | null | undefined) {
  console.log(`Mileage: ${mileage ?? 'Not Available'}`);
}
printMileage(null); // 'Mileage: Not Available'
printMileage(0); // 'Mileage: 0'
```
4. TypeScript 还有一种特殊的空值断言语法，可以在不进行任何显式检查的情况下从类型中删除 `null` 和 `undefined`。在任何表达式之后写 `!`，表明该值不是 `null` 或 `undefined`。
```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```
就像其他类型断言一样，这不会改变代码的运行时行为，所以只有当您知道该值不能为 `null` 或 `undefined` 时使用 `!`。

5. 即使启用了 `strictNullChecks`，默认情况下 TypeScript 也会假定数组访问永远不会返回 `undefined`（除非 `undefined` 是数组类型的一部分）。通过配置 `noUncheckedIndexedAccess` 可用于更改此行为。
```ts
let array: number[] = [1, 2, 3];
let value = array[0]; // `number | undefined` "noUncheckedIndexedAccess": true
```

## 特殊类型
TypeScript 具有可能不引用任何特定类型数据的特殊类型。

### any
`any` 是一种禁用类型检查并有效地允许使用所有类型的类型。`any` 类型是一种消除错误的有用方法，因为它禁用了类型检查，但 TypeScript 将无法提供类型安全，并且依赖类型数据的工具（例如自动完成）将无法工作。所以，我们应尽量避免使用它。

以下三种情况可以使用 `any` 类型。
1. 变量的值会动态改变时，比如来自用户的输入。
```ts
let x: any = 1; // 数字类型
x = 'I am who I am'; // 字符串类型
x = false; // 布尔类型
```
2. 改写现有代码时，任意值允许在编译时可选择地包含或移除类型检查。
```ts
let v: any = true;
v = "string"; // 没有错误
v.ifItExists(); // ifItExists 方法在运行时可能不存在而报错，但这里并不会检查
console.log(Math.round(v)); // 没有错误
```
3. 定义存储各种类型数据的数组。
```ts
const arrayList: any[] = [1, false, 'fine'];
arrayList[1] = 100;
```

### unknown
`unknown` 类型表示任何值，类似于 `any` 类型，但更安全，**因为用未知值做任何事情都是不合法的**。由于 `any` 违背了类型检查的初衷，一般不建议使用，尤其在有了 `unknown` 类型之后。
1. 任何类型可以分配给 `any` 和 `unknown`，`any` 可以分配给任何类型，`unknown` 只能分配给 `unknown` 或者 `any`。
```ts
let a: any;
let n: number;
let w: unknown = 1; 
w = "string";
w = a;
a = w;
n = a;
// n = w; // Type 'unknown' is not assignable to type 'number'
```
2. 函数返回值类型为 `unknown` 时要有 `return` 语句。
```ts
function f(): unknown {} // A function whose declared type is neither 'void' nor 'any' must return a value
```
3. 当不知道输入的数据类型时，最好使用 `unknown`。要稍后添加类型，需要强制转换它。
```ts
const w = {
  runANonExistentMethod: () => {
    console.log("I think therefore I am");
  }
} as { runANonExistentMethod: () => void };
if(typeof w === 'object' && w !== null) {
  (w as { runANonExistentMethod: Function }).runANonExistentMethod(); 
}
```

### never
`never` 代表从不会出现的值，在函数中它通常表现为抛出异常或无法执行到终止点（例如无限循环）。`never` 很少单独使用，它的主要用途是在高级泛型中。
```ts
function error(message: string): never {
  throw new Error(message);
}
function loop(): never {
  while (true) {}
}
```

### void
表示函数没有任何返回语句，或者不从这些返回语句返回任何显式值。在 JavaScript 中，不返回任何值的函数将隐式返回值 `undefined`。但是，`void` 和返回 `undefined` 在 TypeScript 中不是一回事。
```ts
function hello(): void {
  console.log("Hello");
  return true; // Type 'boolean' is not assignable to type 'void'.
}
hello();
```
函数类型 `type vf = () => void` 在实现时可以返回任何其他值，以下类型的实现是有效的：
```ts
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};
const f2: voidFunc = () => true;
const f3: voidFunc = function() {
  return true;
};
const v1 = f1();
const v2 = f2();
const v3 = f3();
console.log(v1, v2, v3); // true true true
```