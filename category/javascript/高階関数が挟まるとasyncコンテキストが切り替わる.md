# 高階関数が挟まると async コンテキストが切り替わる

```js
async function fetchDummyData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dummyData = [
        { id: 1, name: "データ1" },
        { id: 2, name: "データ2" },
        { id: 3, name: "データ3" },
      ];
      resolve(dummyData);
    }, 1000); 
  });
}

// ここでcallback関数をawaitで実行すれば良い話ではあるが、
// 実際には、forEachを使うことを想定としているので、async/await はつけない。
function processWithAsyncCallback(callback) {
  callback();
}

async function normalFunction(){
  console.log("2 非同期処理を実行中...");
  const data = await fetchDummyData();
  console.log("3 非同期処理が完了しました");
  return data;
}

async function mainA() {
  let dataState = {};
  console.log("=====高階関数======");
  console.log("1 処理を開始しました");

  processWithAsyncCallback(async () => {
    console.log("2 非同期処理を実行中...");
    const data = await fetchDummyData();
    console.log("3 非同期処理が完了しました");
    dataState = data;

  });

  console.log("4 処理を終了しました");
  console.log("5 取得データ:",dataState);
}

async function mainB(){
  let dataState = {};
  console.log("=====通常関数======");
  console.log("1 処理を開始しました");

  dataState = await normalFunction();

  console.log("4 処理を終了しました");
  console.log("5 取得データ:",dataState);

}

(async() => {
  await mainA();
  await mainB();
})();
```

実行結果は以下の通り

```terminal
=====通常関数======
1 処理を開始しました
2 非同期処理を実行中...
3 非同期処理が完了しました
4 処理を終了しました
5 取得データ:
(3) [{...}, {...}, {...}]

=====高階関数======
1 処理を開始しました
2 非同期処理を実行中...
4 処理を終了しました
5 取得データ:
{}
3 非同期処理が完了しました
```

非同期関数の実行が非同期的に行われるため、その結果を待機せずに次の処理が進む。
そのため結果として、main() 関数内と高階関数内の非同期処理のタイミングがズレている。

## awaitとは？

> await 式は async 関数の実行を一時停止し、 Promise が決定される（すなわち履行または拒否される）まで待ち、履行された後に async 関数の実行を再開します。

一時停止する範囲はあくまでasync関数内のみであり、その他の関数スコープに影響は及ぼさない。つまり、**関数スコープ内における後続の処理を「待機」するもの**である。

```js
params.forEach(async v => {
  const res = await testAsync(v);
  // testAsyncが解決したらここに到達するよね（これは正しい）
  console.log(res);
  data.push(res);
});
// awaitしてるから、全て解決するまでここに到達しないよね（これは間違い）
// -> Array.prototype.forEach はコールバック関数をawaitで返さないから。
// つまり、後続の処理を「待機」できない。
console.log(data);
```
