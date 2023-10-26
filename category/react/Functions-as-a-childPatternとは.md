# Functions as a Child pattern とは？

## 特徴

呼び出された関数は式を返すこともできるので、この関数の戻り値を `props` として使用することが出来ます。
`React.ReactNode` 型は特殊であり、子要素（children）として受け入れることができるデータ型を表すものであるため、
以下がレンダリングされると同じ出力になることを意味します。

```jsx
// Hoge.tsx
export const Hoge = ({children}: {children: React.ReactNode}) => {
    <div>{children}</div>
}
// index.tsx
<Hoge>I am a child element</Hoge>
<Hoge children="I am a child element" />
```

この原則を使用して、コンポーネント内の render()中に呼び出される関数を渡すこともできます。
このようにして、あるコンポーネントから次のコンポーネントにデータを渡すことができます。

```jsx
const bold = (word: string) => {
  return <strong>{word}</strong>;
};

const italic = (word: string) => {
  return <em>{word}</em>;
};

const Formatter = ({
  children,
}: {
  children: ({
    bold,
    italic,
  }: {
    bold: (word: string) => JSX.Element;
    italic: (word: string) => JSX.Element;
  }) => React.ReactNode;
}) => {
  return children({ bold, italic });
};
```

```jsx
const Test = () => {
  return (
    <div>
      <p>This text does not know about the Formatter function</p>
      <Formatter>
        {({ bold }) => <p>This text {bold('does though')}</p>}
      </Formatter>
    </div>
  );
};
```

## ユースケース

Functions as a Child パターンの場合は、メモ化して必要な時だけ再描画する事ができる。

```tsx
type PasswordScoreProps = {
  name: keyof Form;
  control: Control<Form>;
  children: (score: ZXCVBNScore) => ReactNode;
};
function PasswordScore({ name, control, children }: PasswordScoreProps) {
  const password = useWatch({ name, control });
  const score = zxcvbn(password).score; // 算出されたスコアを取得
  const childNode = useMemo(() => children(score), [children, score]);
  // メモ化し、スコア変更時にだけ、子コンポーネント再描画
  return <>{childNode}</>;
}
```

```tsx
export const MyForm = () => {
  const { register, control } = useForm<Form>({ defaultValues });
  return (
    <div>
      <div>
        <input {...register('email')} type="email" />
        <Counter name="email" control={control}>
          {(count) => {
            // email 入力時、再描画されるのはここだけ
            return <span>{count}</span>;
          }}
        </Counter>
      </div>
      <div>
        <input {...register('password')} type="password" />
        <PasswordScore name="password" control={control}>
          {(score) => {
            // 強度スコア変更時のみ、再描画される
            return <span>{score}</span>;
          }}
        </PasswordScore>
      </div>
    </div>
  );
};
```

## 参考

<https://zenn.dev/morinokami/books/learning-patterns-1>

<https://learn.react-js.dev/advanced-concepts/render-props-and-functions-as-a-child>
