# Object メソッドを用いた Object 操作

## Object.entries()

- 与えられたオブジェクトの列挙可能なプロパティを **[key, value] の形式**の配列にして返す。
- `Object.entries()` で返される配列の順序は、`for...in` ループによる順序（オブジェクト内のプロパティに対してループさせた時）と同じ。

```js
const object = { a: 1, b: 2, c: 3, undefined };

for (const property in object) {
  console.log(`${property}: ${object[property]}`);
}

// OUTPUT
// > "a: 1"
// > "b: 2"
// > "c: 3"
// > "undefined: undefined"

const entries = Object.entries(obj);
// [ ["a", 1], ["b", 2], ["c", 3], ["undefined", undefined] ]
for (const [key, value] of entries) {
  console.log(`${key}: ${value}`);
}

// OUTPUT
// > "a: 1"
// > "b: 2"
// > "c: 3"
// > "undefined: undefined"
```

<https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/entries>

## Object.fromEntries()

- [key, value] 形式の反復処理可能なリスト（配列、Map）を受け取り、それらをキーと値のペアとして持つ新しいオブジェクトを作成する。

```js
// Example1
const entries = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
];
const obj = Object.fromEntries(entries);
console.log(obj); // { a: 1, b: 2, c: 3 }

// Example2
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42],
]);

const obj = Object.fromEntries(entries);

console.log(obj);
// Expected output: Object { foo: "bar", baz: 42 }
```

<https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries>

## Object.assign()

- すべての列挙可能な自身のプロパティの値を、 1 つ以上のコピー元オブジェクトからコピー先オブジェクトにコピーするために使用（変更されたコピー先オブジェクトを返す）
- **コピー先オブジェクトのプロパティは、コピー元に同じキーのプロパティがあると上書き**される。
- コピー元が複数ある場合、より後のコピー元のプロパティが、より前のものを同様に上書き。

```js
Object.assign(target, ...sources);

// <引数>
// target -> コピー先オブジェクト — コピー元のプロパティを適用するもので、変更後に返されます。
// sources -> コピー元オブジェクト (単数または複数) — 適用したいプロパティを含むオブジェクト
//
// <返り値>
// コピー先オブジェクト(target)
```

```js
const target = { a: 1, b: 2 };
const returnedTarget = Object.assign(
  target,
  { a: 2 },
  { a: 3, c: 3, d: 3 },
  { e: 4 }
);

console.log(target); // output: Object { a: 3, b: 2, c: 3, c: 3, e: 4 }
console.log(returnedTarget === target); // output: true
```

<https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/assign>

<https://zenn.dev/tommykw/articles/8867a9b765a3c2>
