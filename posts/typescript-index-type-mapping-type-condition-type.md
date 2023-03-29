---
date: 14:38 2023/3/29
title: TypeScript 索引类型、映射类型、条件类型 ｜ 青训营笔记
tags:
- TypeScript
description: 通过索引访问操作符 T[K] 和索引类型查询 keyof T 使用索引类型。在映射类型中，新类型以相同的方式转换旧类型中的每个属性。例如，你可以令每个属性成为 readonly 类型或可选的。条件类型的形式为 T extends U ? X : Y，类似于 JavaScript 中的条件表达式。
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

## keyof
1. 用于从对象类型中生成其键的字符串或数字字面量的联合类型。
```ts
type Point = { x: number; y: number };
type P = keyof Point; // 相当于 type P = 'x' | 'y'
```
2. 如果对象类型具有字符串或数字索引签名，则 `keyof` 将返回这些类型：
```ts
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // 相当于 type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // 相当于 type M = string | number
```
`M` 是类型 `string | number`，因为 JavaScript 对象键总是被强制转换为字符串，所以 `obj[0]` 总是与 `obj["0"]` 相同。

3. `keyof` 还可以与索引签名一起使用，以提取索引类型。
```ts
type StringMap = { [key: string]: unknown };
// 这里 keyof StringMap 解析为 string | number
function createStringPair(property: keyof StringMap, value: string): StringMap {
  return { [property]: value };
}
```

## 索引访问类型
1. 我们可以使用索引访问类型来查找一种类型的特定属性：
```ts
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // type Age = number
type I1 = Person["age" | "name"]; // type I1 = string | number
type I2 = Person[keyof Person]; // type I2 = string | number | boolean
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName]; // type I3 = string | boolean
```
2. 使用 `number` 来获取数组元素的类型，然后将其与 `typeof` 结合起来，可以方便地捕获数组字面量的元素类型。
```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
type Person = typeof MyArray[number];
// type Person = {
//   name: string;
//   age: number;
// }
type Age = typeof MyArray[number]["age"]; // type Age = number
// Or
type Age2 = Person["age"]; // type Age2 = number
```
3. 索引时只能使用类型，这意味着不能使用常量来生成变量引用：
```ts
const key = "age";
type Age = Person[key]; // Type 'key' cannot be used as an index type.
```
但可以使用类型别名进行类似的类型重构：
```ts
type key = "age";
type Age = Person[key]; // type Age = number
```

## 索引签名
1. 有时你并不能提前知道类型属性的所有名称，但你确实知道值的类型。在这些情况下，可以使用索引签名来描述可能值的类型，例如：
```ts
function getStringArray(): StringArray {
  return {} as StringArray;
}
interface StringArray {
  [index: number]: string;
}
const myArray: StringArray = getStringArray();
const secondItem = myArray[1]; // const secondItem: string
```
索引签名属性只允许使用某些类型：`string`、`number`、`symbol`、模板字符串以及仅包含这些的联合类型。

2. 可以支持两种类型的索引器，但从数字索引器返回的类型必须是从字符串索引器返回的类型的子类型。这是因为当使用数字进行索引时，JavaScript 实际上会在索引到对象之前将其转换为字符串。这意味着使用 `100`（数字）进行索引与使用 `"100"`（字符串）进行索引是一样的，因此两者需要保持一致。
```ts
class Animal {
  name: string;
}
class Dog extends Animal {
  breed: string;
}
interface NotOkay {
  [x: number]: Animal; // 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
  [x: string]: Dog;
}
```
3. 虽然字符串索引签名是描述“字典”模式的强大方式，但它还强制所有属性与其返回类型相匹配，因为字符串索引声明 `obj.property` 也可写作 `obj["property"]`。在下面的示例中，`name` 的类型与字符串索引的类型不匹配，所以类型检查器报错：
```ts
interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，name的类型与索引类型返回值的类型不匹配
}
```
但是，如果索引签名是属性类型的联合，则可以接受不同类型的属性：
```ts
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok
  name: string; // ok
}
```

## 索引类型
使用索引类型，编译器就能够检查使用了动态属性名的代码。例如，一个常见的 JavaScript 场景是从对象中选取属性的子集。
```ts
function pluck(o, names) {
  return names.map(n => o[n]);
}
```
在 TypeScript 中通过**索引访问操作符 T[K]** 和**索引类型查询 keyof T** 使用它：
```ts
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}
interface Person {
  name: string;
  age: number;
}
let person: Person = {
  name: 'Jarid',
  age: 35
};
let strings: string[] = pluck(person, ['name']); // string[]
pluck(person, ['age', 'unknown']); // error, 'unknown' is not in 'name' | 'age'
```
这里编译器会检查 `name` 是否是 `Person` 的一个属性。类型语法也反映了表达式语法，所以 `person['name']` 具有类型 `Person['name']`：
```ts
let personName: Person['name'] = person['name']; // string
```
像索引类型查询一样，可以在普通的上下文里使用索引访问 `T[K]`，这正是它的强大所在。
```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o: T, name: K所以o[name]: T[K]
}
```
当返回 `T[K]` 的结果时，编译器会实例化键的真实类型，因此 `getProperty` 的返回值类型会随着传入的属性名而改变。
```ts
let name: string = getProperty(person, 'name');
let age: number = getProperty(person, 'age');
let unknown = getProperty(person, 'unknown'); // error, 'unknown' is not in 'name' | 'age'
```
### 索引类型和索引签名
`keyof` 和 `T[K]` 可以与索引签名交互。索引签名参数类型必须是“字符串”或“数字”。如果你有一个带有字符串索引签名的类型，则 `keyof T` 将为 `string | number`（不仅仅是字符串，因为在 JavaScript 中，可以同时使用字符串 `object["42"]` 或数字 `object[42]` 访问对象属性），而 `T["someString"]` 是索引签名的类型。
```ts
interface Dictionary<T> {
  [key: string]: T;
}
let keys: keyof Dictionary<number>; // let keys: string | number
let value: Dictionary<number>["foo"]; // let value: number
```
一个带有数字索引签名的类型，`keyof T` 将只是数字。
```ts
interface Dictionary2<T> {
  [key: number]: T;
}
let keys2: keyof Dictionary2<number>; // let keys2: number
let numberValue: Dictionary2<number>[42]; // let numberValue: number
let value2: Dictionary2<number>["foo"]; // Property 'foo' does not exist on type 'Dictionary2<number>'.
```

## 映射类型
有时一种类型需要基于另一种类型的属性列表。

1. 让我们看一下最简单的映射类型及其部分：
```ts
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
```
语法类似于带有 `for .. in` 内部索引签名的语法。分为三部分：
- 类型变量 `K`，它会依次绑定到每个属性。
- 字符串字面量联合的 `Keys`，它包含了要迭代的属性名的集合。
- 属性的结果类型。

`Keys` 是硬编码的的属性名列表，并且属性类型永远是 `boolean`，因此这个映射类型等同于：
```ts
type Flags = {
  option1: boolean;
  option2: boolean;
};
```
2. 一个常见的任务是将一个已知的类型每个属性设为可选。
```ts
interface PersonSubset {
  name?: string;
  age?: number;
}
```
或者我们可能想要一个只读版本：
```ts
interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
```
这种情况在 JavaScript 中经常发生，以至于 TypeScript 提供了一种基于旧类型创建新类型的方法——**映射类型**。在映射类型中，新类型以相同的方式转换旧类型中的每个属性。例如，你可以令每个属性成为 `readonly` 类型或可选的。
```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type Person = {
  name: string;
  age: number;
};
type PersonPartial = Partial<Person>;
// type PersonPartial = {
//   name?: string | undefined;
//   age?: number | undefined;
// }
type ReadonlyPerson = Readonly<Person>;
// type ReadonlyPerson = {
//   readonly name: string;
//   readonly age: number;
// }
```
3. 映射类型描述的是类型而不是成员。如果要添加成员，可以使用交叉类型：
```ts
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }
type WrongPartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean; // A mapped type may not declare properties or methods.
}
```
4. 实际应用中，可能不同于上面的 `Readonly` 或 `Partial`。它们会基于一些现有的类型，按照一定的方式转换属性字段。这就是 `keyof` 索引访问类型的用武之地：
```ts
type Person = {
  name: string;
  age: number;
};
// 基于一些已存在的类型，且按照一定的方式转换字段
type NullablePerson = { [P in keyof Person]: Person[P] | null };
// 相当于
// type NullablePerson = {
//   name: string | null;
//   age: number | null;
// }
type PartialPerson = { [P in keyof Person]?: Person[P] };
// 相当于
// type PartialPerson = {
//   name?: string | undefined;
//   age?: number | undefined;
// }

```
但它更有用的地方是可以有一些通用版本。
```ts
// 通用版本
type Nullable<T> = { [P in keyof T]: T[P] | null };
type MyPartial<T> = { [P in keyof T]?: T[P] };
```
上述转换中，属性列表是 `keyof T`，且结果类型是 `T[P]` 的变体，所以它们是**同态**的，即映射只作用于 `T` 的属性。而且，编译器知道在添加任何新属性之前可以拷贝所有存在的属性修饰符，例如 `Person.name` 是只读的，`Partial<Person>.name` 则将是只读的和可选的。

要注意的是，`keyof any` 表示可用作对象索引的任何类型，即 `keyof any` 等于 `string | number | symbol`。

由于 `Readonly` 和 `Partial` 非常有用，所以它们和 `Pick`、`Record` 被一起包含进了 TypeScript 的标准库中。

非同态类型本质上是在创建新属性，因此它们无法从任何地方复制属性修饰符。`Readonly`、`Partial` 和 `Pick` 是同态的，但 `Record` 不是，因为 `Record` 并不需要输入类型来拷贝属性：
```ts
type ThreeStringProps = Record<"prop1" | "prop2" | "prop3", string>;
```

下面是另一个例子， `T[P]` 被包装在 `Proxy<T>` 代理中：
```ts
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};
type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};
function proxify<T>(o: T): Proxify<T> {
  return {} as Proxify<T>;
}
let props = { rooms: 4 };
let proxyProps = proxify(props);
// 相当于
// let proxyProps: Proxify<{
//   rooms: number;
// }>
```
5. 了解了如何包装一个类型的属性，接下来就是如何拆包：从映射类型推断。
```ts
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}
let props = { rooms: 4 };
let proxyProps = proxify(props);
// let proxyProps: Proxify<{
//   rooms: number;
// }>
let originalProps = unproxify(proxyProps);
// let originalProps: {
//   rooms: number;
// }
```
注意这个拆包推断只适用于同态的映射类型。如果映射类型不是同态的，那么需要给拆包函数提供一个显式类型参数。

6. 映射类型可以建立在索引签名的语法之上，声明未声明的属性类型。
```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};
type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//   darkMode: boolean;
//   newUserProfile: boolean;
// }
```
在此示例中，`OptionsFlags` 将从类型中获取所有属性类型并将它们更改为布尔。

7. 有两个附加的修饰符可以在映射期间应用：`readonly` 和 `?` 它们分别影响可变性和选择性。还可以通过添加 `-` 或 `+` 前缀来删除或添加这些附加的修饰符。如果不添加前缀，则假定为 `+`。
```ts
// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
type UnlockedAccount = CreateMutable<LockedAccount>;
// type UnlockedAccount = {
//   id: string;
//   name: string;
// }

// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};
type User = Concrete<MaybeUser>;
// type User = {
//   id: string;
//   name: string;
//   age: number;
// }
```
8. 在 TypeScript 4.1 及更高版本中，可以在映射类型中使用 `as` 子句**重新映射**映射类型中的键，例如可以利用模板字符串类型等功能，从以前的属性名称创建新的属性名称：
```ts
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
interface Person {
  name: string;
  age: number;
  location: string;
}
type LazyPerson = Getters<Person>;
// type LazyPerson = {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }
```
可以通过条件类型来过滤关键字属性：
```ts
// 删除kind属性
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
interface Circle {
  kind: "circle";
  radius: number;
}
type KindlessCircle = RemoveKindField<Circle>;
// type KindlessCircle = {
//   radius: number;
// }
```
不仅仅是 `string | number | symbol`，可以映射任何类型的联合：
```ts
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
}
type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };
type Config = EventConfig<SquareEvent | CircleEvent>
// type Config = {
//   square: (event: SquareEvent) => void;
//   circle: (event: CircleEvent) => void;
// }
```

## 条件类型
1. 条件类型就是在初始状态并不直接确定具体类型，而是通过一定的类型运算得到最终的变量类型。条件类型的形式为 `T extends U ? X : Y`，类似于 JavaScript 中的条件表达式。
```ts
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";
type T0 = TypeName<string>;
// type T0 = "string"
type T1 = TypeName<"a">;
// type T1 = "string"
type T2 = TypeName<true>;
// type T2 = "boolean"
type T3 = TypeName<() => void>;
// type T3 = "function"
type T4 = TypeName<string[]>;
// type T4 = "object"
type T5 = TypeName<string | (() => void)>;
// type T5 = "string" | "function"
type T6 = TypeName<string | string[] | undefined>;
// type T6 = "string" | "undefined" | "object"
type T7 = TypeName<string[] | number[]>;
// type T7 = "object"
```
2. 条件类型的强大之处在于将它们与泛型一起使用，例如一个基于输入类型进行选择的 `createLabel` 函数：
```ts
interface IdLabel {
  id: number /* 一些字段 */;
}
interface NameLabel {
  name: string /* 其它字段 */;
}
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```
- 如果一个库必须在其 API 中一遍又一遍地做出相同类型的选择，这将变得很麻烦。
- 我们必须创建三个重载：一个用于确定类型的每种情况（一个用于 `string`，一个用于 `number`），一个用于最通用的情况（采用 `string | number`）。对于每个 `createLabel` 可以处理的新类型，重载的数量呈指数增长。

相反，我们可以将该逻辑转换为条件类型：
```ts
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
```
然后，我们可以使用该条件类型将重载简化为没有重载的单个函数。
```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
let a = createLabel("typescript");
// let a: NameLabel
let b = createLabel(2.8);
// let b: IdLabel
let c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel
```
3. 通常，条件类型的检查将为我们提供一些新信息。就像使用类型守卫缩小范围可以给我们提供更具体的类型一样，条件类型的 `true` 分支将根据我们检查的类型进一步约束泛型。
```ts
type MessageOf<T> = T["message"]; // Type '"message"' cannot be used to index type 'T'.
```
在本例中，TypeScript 产生错误是因为不知道 `T` 有一个名为 `message` 的属性。我们可以约束 `T`，TypeScript 也不会再报错了：
```ts
type MessageOf<T extends { message: unknown }> = T["message"];
interface Email {
  message: string;
}
type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string
```
如果我们希望 `MessageOf` 接受任何类型，并且在 `message` 属性不可用的情况下默认为 `never` 之类的类型，我们应该怎么做呢？ 我们可以通过将约束移动到外面，并引入条件类型来实现这一点：
```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
interface Email {
  message: string;
}
interface Dog {
  bark(): void;
}
type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string
type DogMessageContents = MessageOf<Dog>;
// type DogMessageContents = never
```
在 `true` 分支中，TypeScript 知道 `T` 将有一个 `message` 属性。

4. 当传入的类型参数为联合类型时，他们会被分配类型。
```ts
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = string[] | number[]
```
通常，分布性是所需的行为。要避免这种行为，可以用方括号括起 `extends` 关键字的两边。
```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
// 'StrArrOrNumArr'不再是联合
type StrArrOrNumArr2 = ToArrayNonDist<string | number>;
// type StrArrOrNumArr2 = (string | number)[]
```

5. 条件类型的分配属性可以方便地用于过滤联合类型：
```ts
// 求不同：从 T 中删除可分配给 U 的类型
type Diff<T, U> = T extends U ? never : T;
// 求相同：从 T 中删除不可分配给 U 的类型
type Filter<T, U> = T extends U ? T : never;

type T1 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;
// type T1 = "b" | "d"
type T2 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"
// type T2 = "a" | "c"
type T3 = Diff<string | number | (() => void), Function>; // string | number
// type T3 = string | number
type T4 = Filter<string | number | (() => void), Function>; // () => void
// type T4 = () => void

// 从 T 中删除 null 和 undefined
type NotNullable<T> = Diff<T, null | undefined>;

type T5 = NotNullable<string | number | undefined>;
// type T5 = string | number
type T6 = NotNullable<string | string[] | null | undefined>;
// type T6 = string | string[]
```

7. 下面是一个名为 `Flatten` 的类型，它将数组类型扁平化为它们的元素类型，不是数组类型时返回原类型：
```ts
type Flatten<T> = T extends any[] ? T[number] : T;
// 提取元素类型
type Str = Flatten<string[]>;
// type Str = string
type Num = Flatten<number>;
// type Num = number
```
这里使用了索引访问 `number` 来获取 `string[]` 的元素类型。条件类型还为我们提供了一种使用 `infer` 关键字从 `true` 分支中与之进行比较的类型中进行推断的方法。

### infer
1. `infer` 关键字可以在条件类型的条件内使用，将推断的类型放入变量中，然后可以在条件分支中使用该推断变量。例如，我们可以在 `Flatten` 中推断元素类型，而不是使用索引访问类型“手动”提取它：
```ts
type Flatten<T> = T extends Array<infer Item> ? Item : T;
// type of item1 is `number`
type item1 = Flatten<number[]>;
// type of item2 is `{name: string}`
type item2 = Flatten<{ name: string }>;
```
在这里，我们使用 `infer` 关键字以声明方式引入一个名为 `Item` 的新泛型类型变量，而不是指定如何在 `true` 分支中检索元素类型 `T`。下面是另一种写法：
```ts
type Flatten<T> = T extends (infer E)[] ? E : T;
// type of item1 is `number`
type item1 = Flatten<number[]>;
// type of item2 is `{name: string}`
type item2 = Flatten<{ name: string }>;
```

2. 可以使用 `infer` 关键字编写一些有用的辅助类型别名。例如，对于简单的情况，我们可以从函数类型中提取返回类型：
```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;
type Num = GetReturnType<() => number>;
// type Num = number
type Str = GetReturnType<(x: string) => string>;
// type Str = string
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
// type Bools = boolean[]
```
我们也可以使用内置工具类型 `ReturnType` 获取函数返回值类型。
```ts
type Num = ReturnType<() => number>;
// type Num = number
type Str = ReturnType<(x: string) => string>;
// type Str = string
type Bools = ReturnType<(a: boolean, b: boolean) => boolean[]>;
// type Bools = boolean[]
```
3. 借助 `infer` 可以实现元组转联合类型。
```ts
type Flatten<T> = T extends Array<infer U> ? U : never;
type T0 = [string, number];
type T1 = Flatten<T0>; // string | number
```
4. 可以嵌套条件类型以形成按顺序评估的模式匹配序列。
```ts
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
type T0 = Unpacked<string>;
// type T0 = string
type T1 = Unpacked<string[]>;
// type T1 = string
type T2 = Unpacked<() => string>;
// type T2 = string
type T3 = Unpacked<Promise<string>>;
// type T3 = string
type T4 = Unpacked<Promise<string>[]>;
// type T4 = Promise<string>
type T5 = Unpacked<Unpacked<Promise<string>[]>>;
// type T5 = string
```