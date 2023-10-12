# React の要素の型について理解する

## JSX.Element

- JSX の結果の型として表現される。（JSX としてレンダリング可能であることを型レベルで指定することができる）
- JSX.Element は ReactElement 型を拡張したもの。
- JSX はグローバルネームスペースと呼ばれるもので、グローバルスコープにあるオブジェクトのようになっている。
- コンポーネントの返却値の型として JSX.Element を指定した場合、null を返却することができない。

```ts
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    // ...
  }
}
```

## React.ReactNode

```ts
interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES {}
type ReactNode =
  | ReactElement
  | string
  | number
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined
  | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES];
```

- 非常に柔軟で、文字列や数値といったプリミティブ型から、React コンポーネントまで様々な型を含むことができる。
- ReactElement だけでなく様々な型を含んでいるため、props の children の型として一般的に使用される事が多い。

以下、広範な型を表現することができる。

- boolean
- null（意図的に何もレンダリングしないことを示す）
- undefined（意図的に何もレンダリングしないことを示す）
- number
- string
- ReactChild
  - ReactElement（一般的な JSX 要素）
  - ReactText（文字列 (`string`) または数値 (`number`) のどちらか <= React がテキストノードとしてレンダリングできるものを指す）
- ReactFragment（複数の子要素をまとめる）
- ReactPortal（コンポーネントツリーの外部にレンダリングする）
- 複数の ReactNode 要素のリスト

## 参考

<https://zenn.dev/msy/articles/e21e729eb0727d>
