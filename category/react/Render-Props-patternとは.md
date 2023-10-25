# Render Props pattern とは？

## 特徴

- React Elements を返す関数を props として受け取って、それを自身のレンダリングに使う特殊なコンポーネントを使った手法
- レンダリングのための関数を props として受け取るため、Render Props パターンと呼ばれている。
- 再利用性とデータ共有の仕組みをコンポーネントに追加する方法を変えたことで、多くの場合、フックはレンダープロップパターンを置き換えることができる。
- render prop にはライフサイクルメソッドを追加することができないため、受け取ったデータを変更する必要のないコンポーネントに対して使う。

```jsx
function Kelvin({ value = 0 }) {
  return <div className="temp">{value + 273.15}K</div>;
}

function Fahrenheit({ value = 0 }) {
  return <div className="temp">{(value * 9) / 5 + 32}°F</div>;
}

function Input({ render }: { render: (value?: number) => React.ReactElement }) {
  const [value, setValue] = React.useState < number > 0;

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Temp in °C"
      />
      {render(value)}
    </>
  );
}

export function App() {
  return (
    <div className="App">
      <h1>☃️ Temperature Converter 🌞</h1>
      <Input
        render={(value) => (
          <>
            <Kelvin value={value} />
            <Fahrenheit value={value} />
          </>
        )}
      />
    </div>
  );
}
```
