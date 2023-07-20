# useId

## useId is 何？

```tsx
const id = useId()
```

React18のリリースで追加されたフックAPIのひとつ。
useIdは、アクセシビリティ属性に渡す一意のIDを生成するためのReact Hookのこと。

<https://react.dev/reference/react/useId>

**⚠️ リストのキーを生成するためにuseIdを使用するのはNG!!**
👉 [Keyはデータから生成する必要がある。](https://react.dev/learn/rendering-lists#where-to-get-your-key)

## useIdを用いるユースケースとは。

一意のID属性でふたつの異なる要素が互いに関連していることを指定する場合。（`aria-describedby`のようなHTMLアクセシビリティ属性。他にも、`aria-controls`や`aria-errormessage`などが挙げられる。）

↓以下参考動画
[a11y aria describedby](https://www.youtube.com/watch?v=0dNzNcuEuOo)

下記は、ある要素（入力のような）が別の要素（段落のような）によって記述される悪い例と良い例。

### ❌ BADな例

```tsx
<label>
  Password:<input type="password"aria-describedby="password-hint"/>
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

- IDのハードコーディングはReact的にはよろしくない。
- コンポーネントはページ上で複数回レンダリングされる可能性があり、**IDは一意（ユニークなもの）でなければならない。**

### 🙆‍♂️ GOODな例

```tsx
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

- PasswordFieldが画面上に複数回表示されても、生成されたIDが衝突することはない
- ハイドレーション時の不整合を防ぎつつクライアントとサーバで一意なIDを生成できる。

### 生成されるすべてのIDに共有プレフィックスを指定するには？

複数の独立したReactアプリケーションを単一のページにレンダリングする場合
👉 createRootまたはhydrateRoot呼び出しのオプションとして`identifierPrefix`を渡す。
これにより、`useId`で生成されるすべての識別子が指定したプレフィックスで始まるため、
2つの異なるアプリケーションで生成されるIDの衝突は回避できる。

```tsx
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);

```

<https://zenn.dev/takepepe/articles/useid-for-a11y>
