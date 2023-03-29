---
date: 17:35 2023/3/24
title: TypeScript 高级数据类型 ｜ 青训营笔记
tags:
- TypeScript
description: 如果没有定义参数类型，TypeScript 将默认使用 any，除非额外的类型信息可用，如默认参数和类型别名。
---
## TypeScript 介绍
1. TypeScript 是 JavaScript 的超集，提供了 JavaScript 的所有功能，并提供了可选的静态类型、Mixin、类、接口和泛型等特性。
2. TypeScript 的目标是通过其类型系统帮助及早发现错误并提高 JavaScript 开发效率。
3. 通过 TypeScript 编译器或 Babel 转码器转译为 JavaScript 代码，可运行在任何浏览器，任何操作系统。
4. 任何现有的 JavaScript 程序都可以运行在 TypeScript 环境中，并只对其中的 TypeScript 代码进行编译。
5. 在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型定义来提高代码的可维护性，减少可能出现的 bug。
6. 永远不会改变 JavaScript 代码的运行时行为，例如数字除以零等于 Infinity。这意味着，如果将代码从 JavaScript 迁移到 TypeScript ，即使 TypeScript 认为代码有类型错误，也可以保证以相同的方式运行。
7. 对 JavaScript 类型进行了扩展，增加了例如 `any`、`unknown`、`never`、`void`。
8. 一旦 TypeScript 的编译器完成了检查代码的工作，它就会 **擦除** 类型以生成最终的“已编译”代码。这意味着一旦代码被编译，生成的普通 JS 代码便没有类型信息。这也意味着 TypeScript 绝不会根据它推断的类型更改程序的 **行为**。最重要的是，尽管您可能会在编译过程中看到类型错误，但类型系统自身与程序如何运行无关。
9. 在较大型的项目中，可以在单独的文件 tsconfig.json 中声明 TypeScript 编译器的配置，并细化地调整其工作方式、严格程度、以及将编译后的文件存储在何处。

## 函数
TypeScript 具有定义函数参数和返回值的特定语法。
1. 函数返回值的类型可以明确定义。
```ts
function getTime(): number {
  return new Date().getTime();
}
let time = getTime(); // let time: number
console.log(time);
```
**如果没有定义返回类型，TypeScript 将尝试通过返回的变量或表达式的类型来推断它。**

2. 类型 `void` 可用于指示函数不返回任何值。
```ts
function printHello(): void {
  console.log('Hello!');
}
```
3. 函数参数的类型与变量声明的语法相似。
```ts
function multiply(a: number, b: number) {
  return a * b;
}
```
**如果没有定义参数类型，TypeScript 将默认使用 any，除非额外的类型信息可用，如默认参数和类型别名。**

4. 默认情况下，TypeScript 会假定所有参数都是必需的，但它们可以显式标记为可选。
```ts
// 这里的 `?` 运算符将参数 `c` 标记为可选
function add(a: number, b: number, c?: number) {
  return a + b + (c || 0);
}
console.log(add(2,5));
```
5. 对于具有默认值的参数，默认值位于类型注释之后。
```ts
function pow(value: number, exponent: number = 10) {
  return value ** exponent;
}
```
**TypeScript 还可以从默认值推断类型。**
```ts
function pow(value, exponent = 10) {
  return value ** exponent;
}
console.log(pow(10, '2')); // Argument of type 'string' is not assignable to parameter of type 'number'.
```
6. 命名参数遵循与普通参数相同的模式。
```ts
function divide({ dividend, divisor }: { dividend: number, divisor: number }) {
  return dividend / divisor;
}
console.log(divide({dividend: 10, divisor: 2}));
```
7. 剩余参数可以像普通参数一样类型化，但类型必须是数组，因为剩余参数始终是数组。
```ts
function add(a: number, b: number, ...rest: number[]) {
  return a + b + rest.reduce((p, c) => p + c, 0);
}
console.log(add(10,10,10,10,10));
```
8. 函数类型可以与具有类型别名的函数分开指定。
```ts
type Negate = (value: number) => number;
// 参数 value 自动从 Negate 类型被分配 number 类型
const negateFunction: Negate = (value) => value * -1;
console.log(negateFunction(10));
```
9. 函数重载是方法名字相同，而参数不同，返回类型可以相同也可以不同。
- 函数重载类型化定义了一个函数可以被调用的所有方式，在自动补全时会很有用，可以在自动补全中列出所有可能的重载记录。
- 函数重载需要定义重载签名（一个以上，定义函数的形参和返回类型，没有函数体，不可调用）和一个实现签名。
- 除了常规的函数之外，类中的方法也可以重载。
```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3); // No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```
在本例中，我们编写了两个重载：一个接受一个参数，另一个接受三个参数。前两个签名称为重载签名，但它们都不能用两个参数调用。

在下面这个示例中，我们可以用字符串或数组调用它。但是，我们不能使用可能是字符串或数组的值调用它，报错：`No overload matches this call.`，因为 TypeScript 只能将函数调用解析为单个重载：
```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any[] | string) {
  return x.length;
}
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]); // No overload matches this call.
```
因为两个重载都有相同的参数计数和相同的返回类型，所以我们可以编写一个非重载版本的函数：
```ts
function len(x: any[] | string) {
  return x.length;
}
```
现在我们可以使用任意一种值调用它，所以如果可能，可以首选具有联合类型的参数，而不是重载函数。

## 枚举
枚举是一个特殊的“类”，表示一组常量（不可更改的变量）。使用枚举类型可以为一组数值赋予更加友好的名字。枚举有两种数据类型：`string` 和 `numer`。
1. 默认情况下，枚举会将第一个值初始化为 `0`，后面的值依次值加 `1`。
```ts
enum CardinalDirections {
  North,
  East,
  South,
  West
};
let currentDirection: CardinalDirections = CardinalDirections.North;
console.log(currentDirection); // '0' 因为 North 是第一个值
// currentDirection = 'North'; // Error: "North" is not assignable to type 'CardinalDirections'.
```
2. 可以设置第一个枚举的值的数字，并让它自动递增。
```ts
enum CardinalDirections {
  North = 1,
  East,
  South,
  West
}
console.log(CardinalDirections.North); // logs 1
console.log(CardinalDirections.West); // logs 4
```
3. 可以为每个枚举值分配唯一的数值，值将不会自动递增。
```ts
enum StatusCodes {
  NotFound = 404,
  Success = 200,
  Accepted = 202,
  BadRequest = 400
};
console.log(StatusCodes.NotFound); // logs 404
console.log(StatusCodes.Success); // logs 200
```
4. `string` 类型比 `numer` 类型枚举更常见，因为它们的可读性和目的性更强。
```ts
enum CardinalDirections {
  North = 'North',
  East = "East",
  South = "South",
  West = "West"
};
console.log(CardinalDirections.North); // logs "North"
console.log(CardinalDirections.West); // logs "West"
```
**可以混合字符串和数字枚举值，但不建议这样做。**

5. 可以通过枚举值来获取枚举名称。
```ts
enum StatusCodes {
  NotFound = 404,
  Success = 200,
  Accepted = 202,
  BadRequest = 400
};
let s1 = StatusCodes[200]; // string | undefined
console.log(s1); // Success
```
6. 如果某个属性的值是计算出来的，它后面的第一位成员必须初始化。
```ts
const value = 0;
enum List {
  A = value,
  B = 2,  // 必须初始化
  C,
}
```
7. 为了避免在额外生成的代码上的开销和额外的非直接的对枚举成员的访问，我们可以使用 `const` 枚举，常量枚举不允许包含计算成员。不同于常规的枚举，它们在编译阶段会被删除。
```ts
const a = 1;
const enum Enum {
  A = 1,
  B = A * 2,
  C = a * 2, // const enum member initializers can only contain literal values and other computed enum values.
}
```
8. 使用 keyof typeof 来获取将所有 Enum 键表示为字符串的 Type。
```ts
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}
// 相当于 type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
type LogLevelStrings = keyof typeof LogLevel;
```

## 联合类型
联合类型（Union Types）可以通过 `|` 运算符将变量设置多种类型，赋值时可以根据设置的类型来赋值。当一个值可以是多个单一类型时，可以使用联合类型。例如当变量是 `string` 或 `number` 时。
```ts
function printStatusCode(code: string | number) {
  console.log(`My status code is ${code}.`)
}
printStatusCode(404);
printStatusCode('404');
```
注意：使用联合类型时，需要知道你的类型是什么，以避免类型错误：
```ts
function printStatusCode(code: string | number) {
  console.log(`My status code is ${code.toUpperCase()}.`); // error: Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'
}
```
在上述示例中，因为 `toUpperCase()` 是一个字符串方法，而数字无法访问它。

## 类型别名和接口
TypeScript 允许类型与使用它们的变量分开定义。类型别名和接口允许在不同的变量之间轻松共享类型。
### 类型别名
1. 类型别名就像我们使用了匿名对象类型一样。
```ts
type Point = {
  x: number;
  y: number;
};
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```
2. 可以使用类型别名为任何类型命名，而不仅仅是对象类型。例如，类型别名可以命名联合类型：
```ts
type ID = number | string;
```
3. 类型别名可以定义指定区间具体的数值，该类型只能取定义的区间内的数值。
```ts
type Direction = 'center' | 'left' | 'right';
let d: Direction = ''; // Type '""' is not assignable to type 'Direction'.
```
4. 类型别名可以指定模板字符串类型规则。
```ts
type BooleanString = `${boolean}`;
const bool: BooleanString = '1'; // Type '"1"' is not assignable to type '"false" | "true"'.

type SerialNumber= `${number}.${number}`;
const id: SerialNumber= '1.2';
```

### 接口
接口类似于类型别名，但是**只适用于对象类型**。
1. 就像上面使用类型别名一样，TypeScript 只关心我们传递给 `printCoord` 的值的结构——它是否具有预期的属性。只关心类型的结构和功能，这就是我们将 TypeScript 称为结构类型系统的原因。
```ts
interface Point {
  x: number;
  y: number;
}
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```
2. 接口的几乎所有功能都可以在类型别名中使用，关键区别在于类型别名不能重新定义以添加新属性，而接口始终是可扩展的。
```ts
type Window = {
  title: string
}
// Error: Duplicate identifier 'Window'.
type Window = {
  ts: TypeScriptAPI
}

interface Window {
  title: string
}
interface Window {
  ts: TypeScriptAPI
}
```
3. 接口通过 `extends` 关键字可以继承另一个接口、类、类型别名来扩展成员，支持多继承，在 `extends` 关键字之后用逗号分隔。
```ts
interface Show {
  isShow: boolean;
}
type Graphic = {
  name: string;
}
class Point {
  x: number;
  y: number;
}
interface Point3d extends Point, Graphic, Show {
  z: number;
}

const point3d: Point3d = { x: 1, y: 2, z: 3, name: '1', isShow: true };
```
4. 与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型。可索引类型具有一个 索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。
```ts
interface i1 {
  [index: number]: string
}
let list: i1 = ["0", "1", "2"];
// list2 = ["0", 1, "2"] // Type 'number' is not assignable to type 'string'.

interface i2 {
  [index: string]: number
}
const list2: i2 = {};
list2["0"] = 0;
list2[1] = "1"; // Type 'string' is not assignable to type 'number'.
```
> TypeScript 支持两种索引签名：字符串和数字。可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。这是因为当使用 `number` 来索引时，JavaScript 会将它转换成 `string` 然后再去索引对象。也就是说用 `100`（一个 `number`）去索引等同于使用 `"100"`（一个 `string`）去索引，因此两者需要保持一致。字符串索引签名能够很好的描述 `dictionary` 模式，并且它们也会确保所有属性与其返回值类型相匹配。
```ts
class Animal {
  name: string;
}
class Dog extends Animal {
  breed: string;
}
// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
  [x: number]: Animal; // 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
  [x: string]: Dog;
}

interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，name的类型与索引类型返回值的类型不匹配
}
```
5. 除了描述带有属性的普通对象外，接口也可以描述函数类型。
- 使用接口表示函数类型，需要给接口定义一个调用签名，它就像是一个只有参数列表和返回值类型的函数定义。
- 参数列表里的每个参数都需要名字和类型，对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。
- 函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。
- 如果不指定类型，类型系统会推断出参数类型。
```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
mySearch = function(src, sub) {
  let result = src.search(sub);
  return result > -1;
}
```

### 交叉类型
接口允许我们通过扩展其他类型来构建新类型。TypeScript 还提供了另一种称为交叉类型的结构，使用 `&` 运算符定义，主要用于组合现有的对象类型。
1. 交叉类型包含了所需的所有类型的特性。
```ts
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}
draw({ color: "blue", radius: 42 });
// 'raidus' does not exist in type 'Colorful & Circle'. Did you mean to write 'radius'?
draw({ color: "red", raidus: 42 });
```
在这里，我们将 `Colorful` 和 `Circle` 相交以生成一个包含 `Colorful` 和 `Circle` 的所有成员的新类型。

2. 可以将多个接口类型合并成一个类型，实现等同于接口继承的效果。
```ts
interface A {
  name: string;
  age: number;
}
interface B {
  name: string;
  height: string;
}
type Person = A & B;  // 相当于求并集
const person: Person = { name: 'Tom', age: 18, height: '60kg' };
```
3. 类型别名也可以与接口交叉。
```ts
interface Animal {
  name: string
}
type Person = Animal & {
  age: number;
}
```
4. 类型别名可以通过交叉类型实现接口的继承行为。
```ts
type Animal = {
  name: string
}
type Bear = Animal & { 
  honey: boolean 
}
```
5. 原始类型之间交叉类型为 `never`，因为任何类型都不能满足同时属于多种原始类型。
```ts
type Useless = string & number; // type Useless: never
Useless = 1; // 'Useless' only refers to a type, but is being used as a value here.
```

## 类
TypeScript 向 JavaScript 类添加了类型和可见性修饰符。
1. 类的成员（属性和方法）使用类型注释（类似于变量）进行类型化。
```ts
class Person {
  name: string;
}
const person = new Person();
person.name = "Jane";
```
2. 类成员也可以被赋予影响可见性的特殊修饰符。TypeScript 中有三个主要的可见性修饰符：
- `public` -（默认）允许从任何地方访问类成员
- `private` - 只允许从类内部访问类成员
- `protected` - 允许从自身和继承它的任何类访问类成员
```ts
class Person {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}
const person = new Person("Jane");
console.log(person.getName()); // person.name isn't accessible from outside the class since it's private
```
3. TypeScript 通过向参数添加可见性修饰符，可以在构造函数中定义类成员。
```ts
class Person {
  constructor(private name: string) {}
  getName(): string {
    return this.name;
  }
}
const person = new Person("Jane");
console.log(person.getName()); // Jane
```
4. 与数组类似，`readonly` 关键字可以防止类成员被更改，只读属性必须在声明时或构造函数里被初始化，`readonly` 关键字也可以在构造函数中定义类成员。
```ts
class Person {
  readonly name: string = 'Jane';
  constructor(name?: string) {
    if(name) this.name = name;
  }
}
const person = new Person("a");
// person.name = ''; // Cannot assign to 'name' because it is a read-only property.
```
5. 类通过 `extends` 关键字继承另一个类，一个类只能继承一个类；通过 `implements` 关键字实现接口（接口描述了类的公共部分，而不是公共和私有两部分），一个类支持实现多个接口，在 `implements` 关键字之后用逗号分隔。
```ts
interface Shape {
  getArea: () => number;
}
class Rectangle implements Shape {
  constructor(protected readonly width: number, protected readonly height: number) {}
  getArea(): number {
    return this.width * this.height;
  }
}
class Square extends Rectangle {
  constructor(width: number) {
    super(width, width);
  }
}
```
6. 当一个类扩展另一个类时，它可以用相同的名称**重写**父类的成员。较新版本的 TypeScript 允许使用 `override` 关键字显式标记，它可以帮助防止意外重写不存在的方法。使用设置 `noImplicitOverride` 可以强制在重写时使用它。
```ts
class Rectangle {
  constructor(protected readonly width: number, protected readonly height: number) {}
  toString(): string {
    return `Rectangle[width=${this.width}, height=${this.height}]`;
  }
}
class Square extends Rectangle {
  constructor(width: number) {
    super(width, width);
  }
  override toString(): string {
    return `Square[width=${this.width}]`;
  }
}
```
7. 抽象类允许它们用作其他类的基类，而无需实现其所有成员。通过使用 `abstract` 关键字定义抽象类，未实现的成员也需要使用 `abstract` 关键字标识。抽象类不能直接实例化，因为它们没有实现其所有成员。
```ts
abstract class Polygon {
  abstract getArea(): number;
  toString(): string {
    return `Polygon[area=${this.getArea()}]`;
  }
}
class Rectangle extends Polygon {
  constructor(protected readonly width: number, protected readonly height: number) {
    super();
  }
  getArea(): number {
    return this.width * this.height;
  }
}
```
8. TypeScript 支持通过 `getters/setters` 来截取对对象成员的访问，有效地控制对对象成员的访问。只带有 `get` 不带有 `set` 的存取器自动被推断为 readonly。
```ts
class Employee {
  login: boolean;
  private _fullName: string;
  get fullName(): string {
    return this._fullName;
  }
  set fullName(newName: string) {
    console.log(this.login);
    if (this.login === true) {
      this._fullName = newName;
    } else {
      console.log("Error: Unauthorized update of employee!");
    }
  }
}
const employee = new Employee();
employee.login = true;
employee.fullName = "Bob Smith";
if (employee.fullName) {
  console.log(employee.fullName);
}
```
9. 静态成员存在于类本身上面而不是类的实例上。 
```ts
class StaticMem {
  static num: number;
  static disp(): void {
    console.log("num 值为 " + StaticMem.num);
  }
}
StaticMem.num = 12;
StaticMem.disp();
```