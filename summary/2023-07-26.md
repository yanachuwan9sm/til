# 「Storybook: "invariant expected app router to be mounted" in stories with useRouter...」の解消

## 原因

ストーリーが`app`ディレクトリのコンポーネントを使用 & `next/navigation`からモジュールをインポートしている場合で、Storybookに正しいモックルーターコンテキストを使用するよう設定されていないため。

## 解消

`nextjs.appDirectory`パラメーターを`true`に設定し、Storybookに正しいモックルーターコンテキストを使用するように指示する必要がある。

```tsx
export const Example = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
```

### Pageディレクトリでは？

ルーティングのために`next/router`からのインポートを使用し続ける必要がある。
そのため、`Router`プロバイダーを設定したい場合は、`nextjs.router`パラメーターを設定する。

```tsx
export const Example = {
  parameters: {
    nextjs: {
      router: {
        basePath: '/profile',
      },
    }
  },
};
```

## 参考文献

<https://storybook.js.org/blog/integrate-nextjs-and-storybook-automatically/>

<https://github.com/vercel/next.js/discussions/50068>
