---
date: 14:50 2023/3/29
title: TypeScript 工具类型、装饰器、混入(Mixins) ｜ 青训营笔记
tags:
- TypeScript
description: 在 TypeScript 中，implements 只会继承属性的类型，而不会继承实际的逻辑，所以需要根据不同的功能定义多个可复用的类，将它们作为 mixins。因为 extends 只支持继承一个父类，我们可以通过 implements 来连接多个 mixins，并且使用原型链将父类的方法实现复制到子类。
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

## 工具类型
TypeScript 提供了多种工具类型（实用类型）来帮助常见的类型转换，这些工具类型在全局范围内可用。
#### Awaited
`Awaited<Type>` 模拟异步函数中的 `await` 或 `Promises` 上的 `.then()` 方法返回值类型。
```ts
type A = Awaited<Promise<string>>;
// type A = string
type B = Awaited<Promise<Promise<number>>>;
// type B = number
type C = Awaited<boolean | Promise<number>>;
// type C = number | boolean
```

#### ConstructorParameters
`ConstructorParameters<Type>` 从构造函数的类型生成一个包含所有参数类型的元组类型（如果 `Type` 不是函数，则生成 `never` 类型）。
```ts
type T0 = ConstructorParameters<ErrorConstructor>;
// type T0 = [message?: string]
type T1 = ConstructorParameters<FunctionConstructor>;
// type T1 = string[]
type T2 = ConstructorParameters<RegExpConstructor>;
// type T2 = [pattern: string | RegExp, flags?: string]
type T3 = ConstructorParameters<any>;
// type T3 = unknown[]
 
type T4 = ConstructorParameters<Function>;
// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  // Type 'Function' provides no match for the signature 'new (...args: any): any'.
// type T4 = never
```

#### Exclude
`Exclude<UnionType, ExcludedMembers>` 从联合类型中删除指定类型。
```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
// type T0 = "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
// type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>;
// type T2 = string | number
```

#### Extract
`Extract<Type, Union>` 通过从 `Type` 中提取可分配给 `Union` 的所有联合成员来构造一个类型。
```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
// type T0 = "a"
type T1 = Extract<string | number | (() => void), Function>;
// type T1 = () => void
```

#### InstanceType
`InstanceType<Type>` 构造一个由 `Type` 中构造函数的实例类型组成的类型。
```ts
class C {
  x = 0;
  y = 0;
}
type T0 = InstanceType<typeof C>;
// type T0 = C
type T1 = InstanceType<any>;
// type T1 = any
type T2 = InstanceType<never>;
// type T2 = never
type T3 = InstanceType<string>;
// Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.
// type T3 = any
type T4 = InstanceType<Function>;
// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  // Type 'Function' provides no match for the signature 'new (...args: any): any'.
// type T4 = any
```

#### NonNullable
`NonNullable<Type>` 通过从 `Type` 中排除 `null` 和 `undefined` 来构造一个类型。
```ts
type T0 = NonNullable<string | number | undefined>;
// type T0 = string | number
type T1 = NonNullable<string[] | null | undefined>;
// type T1 = string[]
```

#### Omit
`Omit<Type, Keys>` 从对象类型中删除 keys（字符串文字或字符串文字的并集）来构造一个类型。
```ts
interface Person {
  name: string;
  age: number;
  location?: string;
}
const bob: Omit<Person, 'age' | 'location'> = {
  name: 'Bob'
  // `Omit` 已经从类型中删除了年龄和位置，它们不能在这里定义
};
console.log(bob); // { name: 'Bob' }
```

#### OmitThisParameter
`OmitThisParameter<Type>` 从类型中删除 `this` 参数，创建一个没有 `this` 参数的新函数类型，泛型会被擦除，只有最后一个重载签名可以被传播到新的函数类型中。如果 `Type` 没有显式声明 `this` 参数，则结果只是 `Type`。
```ts
function toHex(this: Number) {
  return this.toString(16);
}
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(16);
console.log(fiveToHex()); // 10
```

#### Parameters
`Parameters<Type>` 根据函数类型 `Type` 的参数中使用的类型构造元组类型。
```ts
declare function f1(arg: { a: number; b: string }): void;
type T0 = Parameters<() => string>;
// type T0 = []
type T1 = Parameters<(s: string) => void>;
// type T1 = [s: string]
type T2 = Parameters<<T>(arg: T) => T>;
// type T2 = [arg: unknown]
type T3 = Parameters<typeof f1>;
// type T3 = [arg: {
    // a: number;
    // b: string;
// }]
type T4 = Parameters<any>;
// type T4 = unknown[]
type T5 = Parameters<never>;
// type T5 = never
type T6 = Parameters<string>;
// Type 'string' does not satisfy the constraint '(...args: any) => any'.
// type T6 = never
type T7 = Parameters<Function>;
// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  // Type 'Function' provides no match for the signature '(...args: any): any'.
// type T7 = never
```

#### Partial
`Partial<Type>` 更改对象中的所有属性为可选。
```ts
interface Point {
  x: number;
  y: number;
}
let pointPart: Partial<Point> = {}; // `Partial` 使得 x 与 y 都变成可选
pointPart.x = 10;
console.log(pointPart); // { x: 10 }
```

#### Pick
`Pick<Type, Keys>` 从对象类型中选择指定 keys（字符串文字或字符串文字的并集）来构造一个类型。
```ts
interface Person {
  name: string;
  age: number;
  location?: string;
}
const bob: Pick<Person, 'name' | 'location'> = {
  name: 'Bob',
  // location: 'Bob',
  // `Pick` 只保留了姓名和位置（可选），年龄已从类型中删除，无法在此处定义
};
console.log(bob); // { name: 'Bob' }
```

#### Readonly
`Readonly<Type>` 构造一个所有属性都设置为 `readonly` 的类型。
```ts
interface Todo {
  title: string;
  description: string;
}
const todo: Readonly<Todo> = {
  title: "Delete inactive users",
  description: "clear clutter",
};
// Readonly将Todo所有属性都设置为只读,它们都无法修改
todo.title = "Hello"; // Cannot assign to 'title' because it is a read-only property.
todo.description = "Hello"; // Cannot assign to 'description' because it is a read-only property.
```

#### Record
`Record` 是定义具有特定键类型和值类型的对象类型的简写方式，用于将一种类型的属性映射到另一种类型。`Record<Keys, Type>` 将构造一个新的对象类型，其属性键为 `Keys`，属性值为 `Type`。
```ts
const nameAgeMap: Record<string, number> = {
  'Alice': 21,
  'Bob': 25
};
```
这里的 `Record<string, number>` 相当于 `{ [key: string]: number }`。

#### Required
`Required<Type>` 更改对象中的所有属性为必须的。
```ts
interface Car {
  make: string;
  model: string;
  mileage?: number;
}
let myCar: Required<Car> = {
  make: 'Ford',
  model: 'Focus',
  mileage: 12000 // `Required` 强制 mileage 必须定义
};
console.log(myCar); // { make: 'Ford', model: 'Focus', mileage: 12000 }
```

#### ReturnType
`ReturnType<Type>` 提取函数类型的返回类型。
```ts
declare function f1(): { a: number; b: string };
type T0 = ReturnType<() => string>;
// type T0 = string
type T1 = ReturnType<(s: string) => void>;
// type T1 = void
type T2 = ReturnType<<T>() => T>;
// type T2 = unknown
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
// type T3 = number[]
type T4 = ReturnType<typeof f1>;
// type T4 = {
    // a: number;
    // b: string;
// }
type T5 = ReturnType<any>;
// type T5 = any
type T6 = ReturnType<never>;
// type T6 = never
type T7 = ReturnType<string>;
// Type 'string' does not satisfy the constraint '(...args: any) => any'.
// type T7 = any
type T8 = ReturnType<Function>;
// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  // Type 'Function' provides no match for the signature '(...args: any): any'.
// type T8 = any
```

#### ThisParameterType
`ThisParameterType<Type>` 提取函数类型的 `this` 参数的类型，如果函数类型没有 `this` 参数，则为 `unknown`。
```ts
function toHex(this: Number) {
  return this.toString(16);
}
function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
console.log(numberToString(16)); // 10
```

#### ThisType
`ThisType<Type>` 用作上下文 `this` 类型的标记，但不返回转换后的类型，必须启用 `noImplicitThis` 标志才能使用。该接口只是一个在 `lib.d.ts` 中声明的空接口，除了在对象字面量的上下文类型中被识别之外，该接口的行为类似于任何空接口。
```ts
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // methods方法中'this'类型是D & M
};
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}
let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      // this类型为{ x: number, y: number } & { moveBy(dx: number, dy: number): number }
      this.x += dx;
      this.y += dy;
    },
  },
});
obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
console.log(obj); // { x: 15, y: 25, moveBy: [Function: moveBy] }
```

### 内部字符串操作类型
为了帮助进行字符串操作，TypeScript 包含一组可用于字符串操作的类型。这些类型内置于编译器中以提高性能，并且无法在 TypeScript 附带的 .d.ts 文件中找到。

#### Uppercase
`Uppercase<StringType>` 将字符串中的每个字符转换为大写版本。
```ts
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
// type ShoutyGreeting = "HELLO, WORLD"
type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
// type MainID = "ID-MY_APP"
```

#### Lowercase
`Lowercase<StringType>` 将字符串中的每个字符转换为等效的小写字母。
```ts
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>
// type QuietGreeting = "hello, world"
type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
// type MainID = "id-my_app"
```

#### Capitalize
`Capitalize<StringType>` 将字符串中的第一个字符转换为等效的大写字母。
```ts
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
// type Greeting = "Hello, world"
```

#### Uncapitalize
`Uncapitalize<StringType>` 将字符串中的第一个字符转换为等效的小写字母。
```ts
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
// type UncomfortableGreeting = "hELLO WORLD"
```

## 装饰器
1. 自从 ES2015 引入 `class`，当我们需要在多个不同的类之间共享或者扩展一些方法或行为的时候，代码会变得错综复杂。
2. 装饰器是一种特殊类型的声明，它能够附加到类声明、方法、访问符、属性、类方法的参数上，以达到扩展类的行为。
3. 装饰器使用 `@expression` 形式，`expression` 表达式求值后必须为一个函数，它会在运行时被调用，它接收三个参数 `target`、 `name` 和 `descriptor` ，然后可选性的返回被装饰之后的 `descriptor` 对象。

### 装饰器工厂
装饰器工厂只是一个函数，它返回装饰器将在运行时调用的表达式。通过装饰器工厂方法，可以额外传参，普通装饰器无法传参。
```ts
function log(param: string) {
  return function(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('target:', target);
    console.log('name:', name);
    console.log('descriptor:', descriptor);

    console.log('param:', param);
  }
}
class Employee {
  @log('with param')
  routine() {
    console.log('Daily routine');
  }
}
const e = new Employee();
e.routine();
```

### 装饰器组合
多个装饰器可以同时应用到一个声明上，它们可以书写在同一行上：
```ts
@f @g x
```
也可以书写在多行上：
```ts
@f
@g
x
```
当多个装饰器应用在一个声明上时会进行如下步骤的操作：
1. 由上至下依次对装饰器表达式求值。
2. 求值的结果会被当作函数，由下至上依次调用。
```ts
function first() {
  console.log("first(): factory evaluated");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}
function second() {
  console.log("second(): factory evaluated");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}
class ExampleClass {
  @first()
  @second()
  method() { }
}
```
这会将以下输出打印到控制台：
```ts
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

### 类装饰器
通过类装饰器扩展类的属性和方法，类装饰器表达式会在运行时当作函数被调用，装饰类的构造函数作为其唯一的参数。

> 如果类装饰器返回一个值，它将用提供的构造函数替换类声明。如果你选择返回一个新的构造函数，则必须注意维护原始 `prototype`，在运行时应用装饰器的逻辑不会为你做这件事。

下面一个示例，说明了如何覆盖构造函数以设置新的默认值。
```ts
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www...";
    // 函数重载
    meeting() {
      console.log('重载：Daily meeting!')
    }
  };
}
@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;
  constructor(t: string) {
    this.title = t;
  }
  meeting() {
    console.log('Every Monday!')
  }
}
const bug = new BugReport("Needs dark mode");
console.log(bug.title);
console.log(bug.type);
// 装饰器不会更改TypeScript类型，因此类型系统不知道新属性reportingURL
// bug.reportingURL; // Property 'reportingURL' does not exist on type 'BugReport'.
console.log(bug);
bug.meeting(); // 重载：Daily meeting!
```

### 方法装饰器
方法装饰器的表达式会在运行时当作函数被调用，不能用于声明文件、重载或任何其他环境上下文（例如在 `declare` 类中）。具有以下三个参数：
1. `target`: 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. `name`: 成员的名字。
3. `descriptor`: 成员的属性描述符。

如果你熟悉 `Object.defineProperty`，你会立刻发现这正是 `Object.defineProperty` 的三个参数。比如通过装饰器完成一个方法只读功能，其实就是修改数据描述符中的 `writable` 的值 ：
```ts
function readonly(value: boolean = true) {
  return function(target: any, name: string, descriptor: PropertyDescriptor) {
    descriptor.writable = !value;
  };
}
class Employee {
  @readonly()
  salary() {
    console.log('这是个秘密');
  }
}
const e = new Employee();
e.salary = () => { // 不可写
  console.log('change');
};
e.salary(); // 这是个秘密
```

### 访问器装饰器
访问器装饰器应用于访问器的属性描述符，可用于观察、修改或替换访问器的定义。访问器装饰器不能在声明文件或任何其他环境上下文（例如在 `declare` 类中）中使用，不允许同时装饰单个成员的 `get` 和 `set` 访问器。访问器装饰器的表达式将在运行时作为函数调用，参数与方法装饰器相同。
```ts
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  @configurable(false)
  get x() {
    return this._x;
  }
  @configurable(false)
  get y() {
    return this._y;
  }
}
```

### 属性装饰器
属性装饰器的表达式将在运行时作为函数调用，参数与方法装饰器相同，但它的第三个参数为 `undefined`，因为此刻的属性还没有初始化，所以没有配置项。属性装饰器不能在声明文件或任何其他环境上下文（例如在 `declare` 类中）中使用。

例如我们可以使用属性装饰器来记录有关属性的元数据：
```ts
import "reflect-metadata";
const formatMetadataKey = Symbol("format");
function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}
function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
class Greeter {
  @format("Hello, %s")
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}
console.log(new Greeter('abc').greet()); // Hello, abc
```
我们使用函数声明定义了 `@format` 装饰器和 `getFormat` 函数，这里的 `@format("Hello, %s")` 装饰器是一个装饰器工厂。当调用 `@format("Hello, %s")` 时，它使用 `reflect-metadata` 库中的 `Reflect.metadata` 函数为属性添加元数据条目。当调用 `getFormat` 时，它会读取元数据值。

### 参数装饰器
参数装饰器应用于类构造函数或方法声明的函数，只能用于观察参数是否已在方法上声明。参数装饰器不能在声明文件、重载或任何其他环境上下文（例如在 `declare` 类中）中使用。

参数装饰器的表达式将在运行时作为函数调用，具有以下三个参数：
1. 静态成员的类的构造函数，或实例成员的类的原型。
2. 成员的名称。
3. 参数在函数参数列表中的序号索引。

下面示例，`@required` 装饰器添加一个元数据条目，将参数标记为必需。然后 `@validate` 装饰器将现有的 `greet` 方法包装在一个函数中，该函数在调用原始方法之前验证参数。
```ts
import "reflect-metadata";
const requiredMetadataKey = Symbol("required");
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}
function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value!;
  descriptor.value = function() {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error("Missing required argument.");
        }
      }
    }
    return method.apply(this, arguments);
  };
}
class BugReport {
  type = "report";
  title: string;
  constructor(t: string) {
    this.title = t;
  }
  @validate
  print(@required verbose?: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`;
    } else {
      return this.title;
    }
  }
}
console.log(new BugReport('abc').print(false)); // abc
```

### 元数据
TypeScript 包括对为具有装饰器的声明发出某些类型的元数据的实验性支持。要启用此实验性支持，您必须在命令行或 tsconfig.json 中设置 `emitDecoratorMetadata` 编译器选项：
```
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```
```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```
`emitDecoratorMetadata` 标志启用对与模块 `reflect-metadata` 一起使用的装饰器的发射类型元数据的实验性支持。启用后，只要导入了 `reflect-metadata` 库，就会在运行时公开额外的设计时类型信息。
```ts
// @emitDecoratorMetadata
// @experimentalDecorators
// @strictPropertyInitialization: false
import "reflect-metadata";
class Point {
  constructor(public x: number, public y: number) { }
}
class Line {
  private _start: Point;
  private _end: Point;
  @validate
  set start(value: Point) {
    this._start = value;
  }
  get start() {
    return this._start;
  }
  @validate
  set end(value: Point) {
    this._end = value;
  }
  get end() {
    return this._end;
  }
}
function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set!;
  descriptor.set = function(value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);
    if (!(value instanceof type)) {
      throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`);
    }
    set.call(this, value);
  };
}
const line = new Line();
line.start = new Point(0, 0);
// @ts-ignore
line.end = {}; // Invalid type, got object not Point.
```

### 装饰器执行顺序
对于如何应用应用于类内部各种声明的装饰器，有一个明确定义的顺序：
1. 对每个实例成员应用属性装饰器、访问器、参数装饰器、方法。
2. 对每个静态成员应用属性装饰器、访问器、参数装饰器、方法。
3. 构造方法参数装饰器。
4. 类装饰器。
```ts
function extension(params: string) {
  return function(target: any) {
    console.log(params);
  }
}
function method(params: string) {
  return function(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log(params);
  }
}
function attribute(params: string) {
  return function(target: any, name: string) {
    console.log(params);
  }
}
function argument(params: string) {
  return function(target: any, name: string, index: number) {
    console.log(params, index);
  }
}
@extension('类装饰器')
class Employee {
  constructor(@argument('构造方法参数装饰器') n: string) {
    this.name = n;
  }
  @attribute('静态属性装饰器')
  static id: number;
  @attribute('属性装饰器')
  name!: string;
  @method('set 方法装饰器')
  set age(@argument('set 方法参数装饰器') n: number){}
  @method('静态方法装饰器')
  static work(@argument('静态方法参数装饰器') name: string, @argument('静态方法参数装饰器') department: string) {}
  @method('方法装饰器')
  salary(@argument('参数装饰器') name: string, @argument('参数装饰器') department: string) {}
}
```
打印顺序为：
```
属性装饰器
set 方法参数装饰器 0
set 方法装饰器
参数装饰器 1
参数装饰器 0
方法装饰器
静态属性装饰器
静态方法参数装饰器 1
静态方法参数装饰器 0
静态方法装饰器
构造方法参数装饰器 0
类装饰器
```

## 混入(Mixins)
1. 在 TypeScript 中，`implements` 只会继承属性的类型，而不会继承实际的逻辑，所以需要根据不同的功能定义多个可复用的类，将它们作为 `mixins`。
2. 因为 `extends` 只支持继承一个父类，我们可以通过 `implements` 来连接多个 `mixins`，并且使用原型链将父类的方法实现复制到子类。
3. 这就像组件拼合一样，由一堆细粒度的 `mixins` 快速搭建起一个功能强大的类。
```ts
// @strict: false
// Each mixin is a traditional ES class
class Jumpable {
  jump(this) {
    this.x++;
  }
}
class Duckable {
  duck(this) {
    this.y--;
  }
}
// 在基类上实现期望的 mixins
// class Sprite implements Jumpable, Duckable {
//   x = 0;
//   y = 0;
//   jump: () => void;
//   duck: () => void;
// }
// 或创建一个与基类同名的接口，合并期望的 mixins
class Sprite {
  x = 0;
  y = 0;
}
interface Sprite extends Jumpable, Duckable {}
// 第一个参数是要混合的主体，第二个参数是要混入的构造函数数组，主要逻辑就是把原型链上面的方法拷贝到要混合的主体上面
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      );
    });
  });
}
// 在运行时通过 JS 将 mixins 应用到基类中
applyMixins(Sprite, [Jumpable, Duckable]);
let player = new Sprite();
player.jump();
player.duck();
console.log(player.x, player.y); // 1, -1
```
1. 没有使用 `extends` 而是使用了 `implements`，把类当成了接口，仅使用它们的类型而非其实现。我们也没有在类里面实现接口，因为这是我们在用 mixin 时想避免的。
2. 为将要 mixin 进来的属性方法创建出占位属性，这告诉编译器这些成员在运行时是可用的，这样就能使用 mixin 带来的便利，虽说需要提前定义一些占位属性。
3. 最后，创建了一个帮助函数，帮我们做混入操作。它会遍历 mixins 上的所有属性，并复制到目标上去，把之前的占位属性替换成真正的实现代码。