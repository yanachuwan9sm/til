# forEach()におけるループを止めることはできるか？

Playground
<https://playcode.io/1558151>

```js
const array = [ -3, -2, -1, 0, 1, 2, 3 ]

array.forEach((it) => {
  if (it >= 0) {
    console.log(it)
    return // or break
  }
})

// output:
// 0
// 1
// 2
// 3
```

## 回答

**ループを止める(早期終了)処理が必要な場合は、forEach()メソッドは適切ではない。**

例外をスローする以外に、forEach()ループを止めたり中断したりする方法はない。
もしそのような動作が必要なら、
そもそもforEach()メソッドを使うことは間違っている。

### 早期終了を実現する場合は？

`for`、`for...of`、`for...in`のようなループ文を使う。

### 反復を直ちに停止するには？

`every()`、`some()`、`find()`、`findIndex()`のような配列メソッドを使うことで、
それ以上の反復が必要ない場合は、即座に処理を終了することができる。

>参考:
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach>

```js
const array = [ -3, -2, -1, 0, 1, 2, 3 ]

try {
  array.forEach((it) => {
    if (it >= 0) {
      console.log(it)
      throw Error(`We've found the target element.`)
    }
  })
} catch (err) {
  
}

// output:
// 0
```

こんなやり方でもできるらしい。が、絶対にやらない方が良い。（公式にもどこにも推奨されていない）

```js
const array = [ -3, -2, -1, 0, 1, 2, 3 ]

array.forEach((it) => {
  if (it >= 0) {
    console.log(it)
    array.length = 0
  }
})
```
