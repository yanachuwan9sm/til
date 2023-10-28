# Object のプロパティは実は三種類あった

オブジェクトのプロパティには **writable（書き込み可能）、configurable（設定可能）、enumerable（列挙可能）**という属性がある。

## writable 属性

writable プロパティ属性が false に設定されているとき、そのプロパティは「書き込み不可」になります。代入ができなくなります。

```js
var o = {}; // 新しいオブジェクトの生成

Object.defineProperty(o, 'a', {
  value: 37,
  writable: false,
});

(function () {
  'use strict';
  var o = {};
  Object.defineProperty(o, 'b', {
    value: 2,
    writable: false,
  });
  o.b = 3; // TypeError がスローされます: "b" is read-only
  return o.b; // 上の行は動作せず 2 が返ります(訳注:正しくは「ここに制御は来ません」)
})();
```

## configurable 属性

プロパティをオブジェクトから削除できるかとプロパティの属性 (value と writable 以外) を変更できるかを同時に制御します。

## enumerable 属性

- **そのプロパティが Object.assign() や スプレッド演算子で採り上げられるかどうかを定義**
- （Symbol 以外のプロパティの場合） `for...in` ループや `Object.keys()` に現れるかどうかも定義

```js
var o = {};

Object.defineProperty(o, 'a', {
  value: 1,
  enumerable: true,
});

Object.defineProperty(o, 'b', {
  value: 2,
  enumerable: false,
});

Object.defineProperty(o, 'c', {
  value: 3,
}); // enumerable の既定値は false
o.d = 4; // このようにプロパティを生成するとき、
// enumerable の既定値は true
Object.defineProperty(o, Symbol.for('e'), {
  value: 5,
  enumerable: true,
});
Object.defineProperty(o, Symbol.for('f'), {
  value: 6,
  enumerable: false,
});

// OUTPUT

for (var i in o) {
  console.log(i); // 'a' と 'd' がログされます(順不同)
}

Object.keys(o); // ['a', 'd']

o.propertyIsEnumerable('a'); // true
o.propertyIsEnumerable('b'); // false
o.propertyIsEnumerable('c'); // false
o.propertyIsEnumerable('d'); // true
o.propertyIsEnumerable(Symbol.for('e')); // true
o.propertyIsEnumerable(Symbol.for('f')); // false

var p = { ...o };

p.a; // 1
p.b; // undefined
p.c; // undefined
p.d; // 4
p[Symbol.for('e')]; // 5
p[Symbol.for('f')]; // undefined
```

## よもや話

このオブジェクトのプロパティの性質によるもので身近な例が `Array.prototype.length`

![](assets/20231018091300.png)

上図の通り Enumerable が false のため、`length`プロパティは列挙可能プロパティではない。
そのため、取得する値は反復可能な数を表していない。（[`propertyIsEnumerable`メソッド](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)においても false となる）

列挙可能プロパティに関する詳しい事は [MDN:プロパティの列挙可能性と所有権](https://developer.mozilla.org/ja/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)

```js
const array1 = new Array(5);

array1[0] = 1;
array1[1] = 2;

console.log(array1.length); // output : 5
array1.map((elm) => console.log(elm)); // output : [ 1 2 ] <- 反復可能なプロパティは array1[0] array[1] のみである
console.log(array1.propertyIsEnumerable('length')); // output : false
```

<https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#configurable>
