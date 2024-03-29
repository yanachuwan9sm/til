# React における大原則・思想

- 0 : React におけるライフサイクル
- 1 : View に特化したライブラリ
- 2 : レンダリング結果はブラウザに描画される & 描画結果は不変なもの（コンポーネント = (state) => DOM）
- 3 : 宣言的 UI （UI = f(state)）であり、コンポーネントは純粋なもの
- 4 : 何かを「変える」必要がある場合、通常はイベントハンドラで行う。最終手段として useEffect を検討する
- 5 : 入力値が変化しない場合、レンダーをスキップすることができる（memo 化）

## 0 : React におけるライフサイクル

![](assets/20231128235115.png)

### コンポーネントとしてのライフサイクル（マウント -> 更新 -> アンマウント）

1. 画面に追加されたとき、コンポーネントはマウントされる。
2. （大抵はインタラクションに応じて）新しい props や state を受け取ったとき、コンポーネントは更新（再レンダリングにより結果が DOM に描画）される。
3. 画面から削除されたとき、コンポーネントはアンマウントされる。

### エフェクトとしてのライフサイクル

エフェクトは**周囲のコンポーネントとは別のライフサイクルを持つと同時に、開始と停止が可能な独立した同期プロセスを表す。**

1. コンポーネントが**マウント時された後に初回のエフェクトが発火**され、**アンマウント時 に最後のクリーンアップが実行**される。
2. 再レンダリング時 に、前回のエフェクトをクリーンアップしたあと、エフェクトが再び発火される（依存配列を指定することによって、この「クリーンアップ → 再発火」が不要なときに省略できる）

> エフェクトの開始/終了という 1 サイクルのみにフォーカスしてください。コンポーネントがマウント中なのか、更新中なのか、はたまたアンマウント中なのかは問題ではありません。**どのように同期を開始し、どのように同期を終了するのか、これを記述すれば良い**のです。このことを意識するだけで、開始・終了が何度も繰り返されても、柔軟に対応できるエフェクトとなります。

[リアクティブなエフェクトのライフサイクル – React](https://ja.react.dev/learn/lifecycle-of-reactive-effects)

[React の useEffect とクリーンアップ関数の実行タイミングがこれだけで分かる](https://zenn.dev/yumemi_inc/articles/react-effect-simply-explained)

## 1 : View に特化したライブラリ

ルーター、データフェッチ、ステート管理、フォーム管理、etc.は
その他の 3rd パーティーライブラリ、またはフレームワークである Next.js 等が担う。

## 2 : レンダリング結果はブラウザに描画される & 描画結果は不変なもの（コンポーネント = (state) => DOM）

[よくある間違い]
❌ UI とはクリックなどのユーザイベントに直接反応して更新されるもの
◯ インターフェースがイベントに応答するためには、state を更新する必要がある

**レンダリング** 👉 React があなたのコンポーネント（関数）を呼び出すこと。

react のレンダリングは基本的に、**state が変化（setter 関数を実行する） -> 再レンダリングが発生する -> 結果（コンポーネント = (state) => DOM）をブラウザへ反映** の繰り返しである。

関数から返される JSX は、その時点での UI のスナップショットのようなもの
（その JSX 内の props、イベントハンドラ、ローカル変数はすべて、レンダー時の state を使用して計算されます）

## 3 : 宣言的 UI （UI = f(state)）であり、コンポーネントは純粋なもの

状態に対して**一意に**定まる UI を定義する。
👉 **コンポーネント（レンダリングフェーズ）は純粋である必要がある。**（同じ入力に対しては、常に同じ 出力（JSX） を返す）

また、レンダリングフェーズで読み取ることができる 3 種類の入力値 (props、state、context)は読み取り専用として扱う。（ユーザ入力に応じて何かを変更したい場合は、変数に書き込む代わりに、state を設定することが適切）

[コンポーネントを純粋に保つ – React](https://ja.react.dev/learn/keeping-components-pure)

## 4 : 何かを「変える」必要がある場合、通常はイベントハンドラで行う。最終手段として useEffect を検討する

副作用 -> スクリーンの更新、アニメーションの開始、データの変更など。

```jsx
export default function Button() {
  function handleClick() {
    // このイベントハンドラはレンダー中に実行されるものではない。（＝純粋である必要性はない）
    alert('You clicked me!');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

> React では、副作用は通常、イベントハンドラの中に属します。イベントハンドラは、ボタンがクリックされたといった何らかのアクションが実行されたときに React が実行する関数です。イベントハンドラは、コンポーネントの「内側」で定義されているものではありますが、レンダーの「最中」に実行されるわけではありません！ つまり、**イベントハンドラは純粋である必要はありません。**

### 副作用を書くのに適切なイベントハンドラがどうしても見つからない場合、、、

最終手段としてコンポーネントから返された JSX に useEffect 呼び出しを付加することで副作用を付随させる。
（👉 React に、その関数をレンダーの後（その時点なら副作用が許されるため）で呼ぶように指示できる）

```tsx
// 実はこの関数は、、、、
const App = () => {
  const [num, setNum] = useState(0);
  useEffect(() => {
    setNum(Math.floor(Math.random() * 10));
  }, []);
  return <div>{num}</div>;
};

// レンダリングフェーズの react ではコメントアウトした部分（副作用の部分）は実行されていない。
// => react はレンダリング結果をブラウザへ反映した後に useEffect を呼び出すから
const App = () => {
  const [num] = useState(0);
  // useEffect(() => {
  //   setNum(Math.floor(Math.random() * 10));
  // }, []);
  return <div>{num}</div>;
};
```

上記より、prop と state が同じであれば再レンダリングを何度行っても同じ結果になる状態にできる (レンダリングが冪等)
⇨ 副作用フェーズとレンダリングフェーズを分けることでレンダリングを冪等（純粋な関数）にしている。

### 何度も言うけど、出来る限り、useEffect は使わないても良い方向で考える（useEffect 乱用ダメ、絶対）

[エフェクトは必要ないかもしれない – React](https://ja.react.dev/learn/you-might-not-need-an-effect)

```tsx
// case : Xの値の変更に対して、Yの値が同期的に変更されて欲しい場合

// NG
const { data: X } = useQuery({ queryKey: ["something"] , queryFn: fetchSomething });
const [Y, setY] = useState();
useEffect(()=> setY(X.toUpperCase()));

// OK （Xの値が変わったら、Xを使用している X.toUpperCase() も強制的に再実行されるから、わざわざuseStateやuseEffectを使う必要が無い）
const { data: X } = useQuery({ queryKey: ["something"] , queryFn: fetchSomething });
const Y = X.toUpperCase();
（必要であればメモ化）const Y = useMemo(()=> X.toUpperCase(),[X])
```

<https://ja.react.dev/learn/keeping-components-pure>

<https://zenn.dev/pandanoir/articles/19dea2fb3daadb>

## 5 : 入力値が変化しない場合、レンダーをスキップすることができる（memo 化）

**入力値(props)が変化しない（同じ出力を返す純関数である）場合にパフォーマンスを上げるため**には memo 化を使う。
また、**useMemo でラップする関数はレンダー中に実行されるため、純粋 (pure) な計算に対してのみ機能**する。
👉 つまり、**無理矢理レンダリングを抑えるため or 純関数 ではない場合に memo 化 を使用するのは NG。**

### メモ化の種類

- useMemo: useMemo で囲まれた処理は**レンダリング時に再計算（関数の実行結果）をスキップ**する。（存配列に含まれた変数が変更されている場合のみ再計算）
- useCallback: useMemo とほぼ同じ。**レンダリング時に関数の生成をスキップ**する。（依存配列に含まれた変数が変更されている場合のみ再計算）
- memo: コンポーネントを囲む。useMemo のコンポーネント版。**props 全てに変更がなければ再レンダリングをスキップ**する。👉 **シャローコピーである点に注意。よくある例だと props に object を渡した場合再レンダリングのたび、同一の内容であったとしてもメモリ上の場所が違うため違う内容であると判定される。([参考](https://stackoverflow.com/questions/59280319/react-memo-rerendering-with-the-same-props))**

### メモ化が（計算コストが高い）必要かどうかを確認するポイント

- ① 全体のログ時間が api 通信を省いた場合でも、かなりの量（例えば 1ms 以上）になる場合（その計算をメモ化する意味があるかも）
  👉 実験として useMemo で計算をラップしてみて、その操作に対する合計時間が減少したかどうかをログで確認できる。

  ```tsx
  console.time('filter array');
  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
  }, [todos, filter]);
  console.timeEnd('filter array');
  ```

- ② 意図的に処理速度を低下させてパフォーマンスをテストする（ex : Chrome の CPU スロットリングオプション）
  👉 開発で使っているマシンは、ユーザのマシンより高速に動作するで可能性が高いため。
- ③ 最も正確にパフォーマンスを計測するために、アプリを本番環境用にビルドし、ユーザが持っているようなデバイスでテストする
  👉 開発環境でのパフォーマンス測定では完全に正確な結果は得られない（Strict Mode がオンの場合、各コンポーネントが 1 度ではなく 2 度レンダーされるため）

[エフェクトは必要ないかもしれない – React](https://ja.react.dev/learn/you-might-not-need-an-effect#how-to-tell-if-a-calculation-is-expensive)

[じゃあさ、いつメモ化したらいいか具体的に言語化できんの？](https://zenn.dev/shun_kominato/articles/3f0ff878c646a7)
