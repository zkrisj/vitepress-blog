---
date: 14:35 2023/3/29
title: TypeScript 泛型、类型转换、类型守卫 ｜ 青训营笔记
tags:
- TypeScript
description: 类型守卫就是一些在运行时检查某个作用域里的类型的表达式。
---
## TypeScript 介绍
1. TypeScript 是 JavaScript 的超集，提供了 JavaScript 的所有功能，并提供了可选的静态类型、Mixin、类、接口和泛型等特性。
2. TypeScript 的目标是通过其类型系统帮助及早发现错误并提高 JavaScript 开发效率。
3. 通过 TypeScript 编译器或 Babel 转码器转译为 JavaScript 代码，可运行在任何浏览器，任何操作系统。
4. 任何现有的 JavaScript 程序都可以运行在 TypeScript 环境中，并只对其中的 TypeScript 代码进行编译。
5. 在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型定义来提高代码的可维护性，减少可能出现的 bug。
6. 永远不会改变 JavaScript 代码的运行时行为，例如数字除以零等于 Infinity。这意味着，如果将代码从 JavaScript 迁移到 TypeScript ，即使 TypeScript 认为代码有类型错误，也可以保证以相同的方式运行。
7. 对 JavaScript 类型进行了扩展，增加了例如 `any`、`unknown`、`never`、`void`。
8. 一旦 TypeScript 的编译器完成了检查代码的工作，它就会 **擦除** 类型以生成最终的“已编译”代码。这意味着一旦代码被编译，生成的普通 JS 代码便没有类型信息。这也意味着 TypeScript 绝不会根据它推断的类型更改程序的 **行为**。最重要的是，尽管可能会在编译过程中看到类型错误，但类型系统自身与程序如何运行无关。
9. 在较大型的项目中，可以在单独的文件 tsconfig.json 中声明 TypeScript 编译器的配置，并细化地调整其工作方式、严格程度、以及将编译后的文件存储在何处。

## 泛型
泛型是一种捕获参数类型的方法，用来创建能够在多种类型上工作可重用的组件，而不是单个类型，这样用户就可以以自己的数据类型来使用组件。
```ts
function identity<T>(arg: T): T {
  return arg;
}
```
这里，使用了一个类型变量 `T`，它是一种特殊的变量，只用于表示类型而不是值。`T` 帮助捕获用户传入的类型（比如：`number`），之后就可以使用这个类型。再次使用了 `T` 当做返回值类型，这样参数类型与返回值类型就是相同的了。

可以用两种方式调用一个泛型函数：
1. 第一种方式是将所有参数（包括类型参数）传递给函数。
```ts
let output = identity<string>("myString");
// let output: string
```
这里，显式地将 `T` 设置为 `string`，使用了 `<>` 括起来，并作为函数调用的参数之一。

2. 第二种方式是最常见的，使用类型参数推断，编译器根据传入的参数类型自动设置 `T` 的类型。
```ts
let output2 = identity("myString");
// let output2: string
```
不必在尖括号（`<>`）中显式传递类型，编译器只是根据值 `myString`，即可将 `T` 设置为其类型。虽然类型参数推断是保持代码更短、更可读的有用工具，但当编译器无法推断类型时，比如在一些复杂的情况下，还是需要像第一种方式那样显式传递类型参数。

### 泛型变量
**泛型变量代表的是任意类型**。例如要在一个函数中，打印一个参数的长度。由于使用这个函数的人可能传入的是个数字，而数字是没有 `length` 属性的，所以会报错。
```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length); // error: Property 'length' does not exist on type 'T'.
  return arg;
}
```
但如果操作的是 `T` 类型的数组，`length` 属性是存在的。
```ts
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
```
泛型函数 `loggingIdentity` 接收泛型参数 `T` 和类型是 `T[]` 的数组参数 `arg`，并返回类型是 `T[]` 的数组。

### 泛型类型
1. 可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。
```ts
let myIdentity: <Input>(arg: Input) => Input = identity;
```
2. 还可以使用带有调用签名的对象字面量类型来定义泛型函数。
```ts
let myIdentity2: { <T>(arg: T): T } = identity;
```
3. 可以把上面例子里的对象字面量拿出来做为一个泛型接口。
```ts
interface GenericIdentityFn {
  <T>(arg: T): T;
}
function identity<T>(arg: T): T {
  return arg;
}
let myIdentity: GenericIdentityFn = identity;
```
4. 可以把泛型参数也当作整个接口的一个参数，就能清楚的知道使用的具体是哪个泛型类型，接口里的其它成员也能知道这个参数的类型了。
```ts
interface GenericIdentityFn<T> {
  (arg: T): T;
}
function identity<T>(arg: T): T {
  return arg;
}
let myIdentity: GenericIdentityFn<number> = identity;
let myIdentity2: GenericIdentityFn<string> = identity;
```
现在接口上有了一个非泛型函数签名，它是泛型类型的一部分，而不是描述泛型函数。当使用 `GenericIdentityFn` 时，还需要指定相应的类型参数（这里：`number`），从而有效地锁定了之后代码里使用的类型。了解何时将类型参数直接放在调用签名上和接口本身上，将有助于描述类型的哪些方面是属于泛型的。

除了泛型接口，还可以创建泛型类。但是，**无法创建泛型枚举和泛型命名空间**。

### 泛型类
泛型类与泛型接口相似，在类名称后面的尖括号（`<>`）中有一个泛型类型参数列表。与接口一样，将类型参数放在类本身可以确保类的所有成员都使用同一类型。
```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) { return x + y; };
console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```
类有两部分构成：静态部分和实例部分，而泛型类指的是实例部分的类型，所以类的静态成员不能使用类的泛型类型。

### 泛型约束
有时候想操作某类型的一组值，并且知道这组值具有什么样的属性。 例如在 `loggingIdentity` 例子中，想访问 `arg` 的 `length` 属性，但是编译器并不能证明每种类型都有 `length` 属性，所以就报错了。

如果希望只要该类型具有此成员，就允许使用它，需要创建一个包含 `length` 属性的接口，然后使用 `extends` 关键字后跟该接口，即可实现约束：
```ts
interface Lengthwise {
  length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```
由于泛型函数现在受到约束，它不再适用于任何类型：
```ts
loggingIdentity(3); // Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
```
需要传入符合约束类型的值，包含所有必需的属性：
```ts
loggingIdentity({length: 10, value: 3});
```
#### 在泛型约束中使用类型参数
声明一个泛型参数，且它被另一个泛型参数约束。下面的泛型参数 `Key` 被约束为参数 `obj` 对象中存在的属性：
```ts
function getProperty<T, Key extends keyof T>(obj: T, key: Key) {
  return obj[key];
}
let x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, "a");
getProperty(x, "m"); // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```
#### 在泛型里使用类类型
使用泛型创建工厂函数时，需要通过其构造函数引用类类型。
```ts
function create<T>(c: { new (): T }): T {
  return new c();
}
```
更高级的用法是使用原型属性来推断并约束构造函数与类实例的关系，例如 Mixins 即使用了此模式。
```ts
class BeeKeeper {
  hasMask: boolean = true;
}
class ZooKeeper {
  nametag: string = "Mikle";
}
class Animal {
  numLegs: number = 4;
}
class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}
class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}
function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}
createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

## 类型转换（断言）
在处理类型时，有时需要重写变量的类型，例如库提供了不正确的类型。**强制转换**就是重写类型的过程。
### as
转换变量的一种简单方法是使用 `as` 关键字，这将直接更改给定变量的类型。
```ts
let x: unknown = 'hello';
console.log((x as string).length);
```
强制转换不会改变变量内数据的类型：
```ts
let x: unknown = 4;
console.log((x as string).length); // undefined
```
但仍然会对类型转换进行类型检查：
```ts
console.log((4 as string).length); // Error: Conversion of type 'number' to type 'string' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```
### `<>`
使用 `<>` 的工作原理与使用 `as` 转换相同。
```ts
let x: unknown = 'hello';
console.log((<string>x).length);
```
这种类型转换不能用于 `TSX` 文件中。

### 强制转换
若要覆盖 TypeScript 在强制转换时可能引发的类型错误，先强制转换为 `unknown` 类型，然后再转换为目标类型。
```ts
let x = 1;
console.log(((x as unknown) as string).length); // undefined
console.log((<string><unknown>x2).length); // undefined
```

## 类型守卫
**类型守卫**就是一些在运行时检查某个作用域里的类型的表达式。
```ts
interface IBird {
  fly();
  layEggs();
}
interface IFish {
  swim();
  layEggs();
}
class Bird implements IBird {
  fly(){}
  layEggs(){}
}
class Fish implements IFish {
  swim(){}
  layEggs(){}
}
function getSmallPet(): IFish | IBird {
  return Math.random() > 0.5 ? new Fish() : new Bird();
}

let pet = getSmallPet();
// 如果一个值是联合类型，只能访问此联合类型的所有类型里共有的成员
pet.layEggs(); // okay
pet.swim();    // errors
```
JavaScript 里用来判断类型的方法是检查成员是否存在。
```ts
// 每一个成员访问都会报错
if (pet.swim) {
  pet.swim();
} else if (pet.fly) {
  pet.fly();
}
```
在 TypeScript 中需要使用类型断言：
```ts
if ((<Fish>pet).swim) {
  (<Fish>pet).swim();
}
else {
  (<Bird>pet).fly();
}
```
这里我们不得不多次使用类型断言。

### 自定义的类型守卫
自定义一个类型守卫，只要简单地定义一个函数，返回值是一个**类型谓词**，类型谓词形式为 `parameterName is T`， `parameterName` 必须是来自于当前函数的一个参数类型名。
```ts
// 当调用 `isFish` 时会将参数缩小为具体的类型
function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}
// 'swim' 和 'fly' 调用都没有问题了
if (isFish(pet)) {
  pet.swim();
}
else {
  pet.fly();
}
```

### typeof 类型守卫
下面定义了每个函数来判断相应类型：
```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}
function isString(x: any): x is string {
  return typeof x === "string";
}
function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  if (isString(padding)) {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```
TypeScript 会自动将 `typeof x === "number"` 识别为一个类型守卫，所以不必抽象成一个函数，也就是说可以直接在内联代码块里检查类型：
```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```
`typeof` 类型守卫只有两种形式能被识别：`typeof v === "typename"` 和 `typeof v !== "typename"`， `typename` 必须是 `number`， `string`， `boolean` 或 `symbol`。但是，TypeScript 不会阻止你与其它字符串比较，只是不会把那些表达式识别为类型守卫。

### instanceof 类型守卫
`instanceof` 类型守卫通过构造函数来缩小类型，后面要求是一个构造函数类型，TypeScript 将按照顺序缩小为：
1. 如果类型不为 `any`，函数的 `prototype` 类型。
2. 构造函数返回的联合类型。
```ts
interface Padder {
  getPaddingString(): string
}
class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) { }
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}
class StringPadder implements Padder {
  constructor(private value: string) { }
  getPaddingString() {
    return this.value;
  }
}
function getRandomPadder() {
  return Math.random() > 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder("  ");
}

// 类型为SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder();
if (padder instanceof SpaceRepeatingPadder) {
  padder; // 类型缩小为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
  padder; // 类型缩小为'StringPadder'
}
```

### 空值类型守卫
使用类型守卫来去除联合类型中的 `null` 与 JavaScript 写法一致。
```ts
function f(sn: string | null): string {
  if (sn == null) {
    return "default";
  }
  else {
    return sn;
  }
}
```
也可以使用短路运算符：
```ts
function f2(sn: string | null): string {
  return sn ?? "default";
}
```
在编译器无法消除 `null` 或 `undefined` 的情况下，可以使用非空断言运算符手动删除它们，语法是后缀添加 `!`，将从变量类型中删除 `null` 和 `undefined` 类型。
```ts
interface UserAccount {
  id: number;
  email?: string;
}
function getUser(id: string): UserAccount | undefined {
  return { email: '' } as any;
}
const user = getUser("admin");
user.id; // Object is possibly 'undefined'.
if (user) {
  user.email.length; // Object is possibly 'undefined'.
}
// 如果确定这些对象或字段存在，则添加短路可空性
user!.email!.length;
```