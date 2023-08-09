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
