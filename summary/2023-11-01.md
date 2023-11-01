# Slot コンポーネント便利だよね

## Slot コンポーネントとは

```tsx
// your-button.jsx
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
}

import { Button } from './your-button';

export default () => (
  <Button asChild>
    // Buttonコンポーネントで走る処理は、`a`要素の中で走らせる事ができる
    <a href="/contact">Contact</a>
  </Button>
);
```

Radix UI のベースである Primitive コンポーネントの 1 つに Slot コンポーネントがある。
Slot コンポーネントを使うことで親コンポーネントにある処理を子コンポーネントの中で走らせることができるもの。

<https://www.radix-ui.com/primitives/docs/utilities/slot>

## next/link も同様

<https://nextjs-ja-translation-docs.vercel.app/docs/api-reference/next/link>

## Render Props Pattern の省略形である

Render Props パターン
描画に関わる Props を子に渡すことで、ロジックを再利用可能な形に分割できるようにするもの。

```js
function Anchor({ children, ...props }) {
  return children(props);
}

export default function App() {
  return (
    <div className="App">
      <Anchor href="/about">{(props) => <a {...props}>Link</a>}</Anchor>
    </div>
  );
}
```

```js
// Render props pattern
<Anchor href="/about">
  {(props) => <a {...props}>Link</a>}
</Anchor>

// Slot pattern
<Anchor href="/about">
  <a>Link</a>
</Anchor>
```

<https://zenn.dev/kobayang/articles/e6bd567a8cbee3>
