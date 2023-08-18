# Array.prototype.forEach() と Array.forEach はどのように違うのか？

<https://ja.stackoverflow.com/questions/6848/array-prototype-foreach-%E3%81%A8-array-foreach%E3%81%AE%E9%81%95%E3%81%84>

[ECMAScript](https://262.ecma-international.org/5.1/#sec-15.4.4.18)の定義の範囲では、
 `Array.forEach` は未定義（undefined）なので、`Array.forEach()` を実行するとエラーになる場合がある。

何も気にせずに `Array.forEach()` だけで実行可能なのは、
環境や利用しているライブラリ・ブラウザなどが
**独自に `Array.prototype.forEach` に対して関数を定義しているため、
配列XXXXに対して `XXXX.forEach()` として呼び出すことができる。**

```js
// 参照:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

Array.prototype.forEach = function (callback, thisCtx) {
  if (typeof callback !== 'function') {
    throw `${callback} is not a function!!`
  }
  const length = this.length
  let i = 0
  while (i < length) {
    if (this.hasOwnProperty(i)) {
      // Note here：Each callback function will be executed once
      callback.call(thisCtx, this[ i ], i, this)
    }
    i++
  }
}
```
