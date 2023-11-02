# satisfies 演算子による型チェック&型推論の保持

## `satisfies` 演算子とは

一言で言うと、「**型チェックが行われつつも、型推論結果が保持してくれる**」機能。

- 型アノテーションなし（推論） 👉 値の正確な型が複雑 & 明示的に型をアノテーションすると重複したコードが大量に必要になるような場合に便利
- 明示的な型アノテーション 👉 他の開発者にコードの意図を伝えるのに役立つ & TypeScript のエラーを可能な限り実際のエラーの発生源に近づけることが可能

上記 2 つのいいとこ取りをコイツ 1 つで実現することができるという、とてもとても優れもの。

```ts
type ColorList = {
  [key in 'red' | 'blue' | 'green']: unknown;
};

//. satisfies-> 型チェックが行われつつも、型推論結果は失われない
const colorListWithSatisfies = {
  red: '#ff0000',
  green: [0, 255, 0],
  blue: '#0000ff',
  yellow: '#0000ff', // error : Type '{ red: string; green: number[]; blue: string; yellow: string; }' does not satisfy the expected type 'ColorList'.
} satisfies ColorList;

// 型チェックが行われつつも、型推論結果が保持されるため、greenプロパティは number[] であり配列用の関数が使える。
colorListWithSatisfies.green.map((value) => value * 2);

// 型注釈 -> 型推論結果が失われる（ colorListWithAssertion オブジェクトの型情報は ColorList 型になります）
const colorListWithAssertion: ColorList = {
  red: '#ff0000',
  green: [0, 255, 0],
  yellow: '#0000ff',
};

// green プロパティは unknown となり配列用の関数が使えない（開発者が green が配列であることを明らかにわかっていても -> 型推論がないため）
// error : 'colorListWithAssertion.green' is of type 'unknown'.
colorListWithAssertion.green.map((value) => value * 2);
```

### as const satisfies の活用してもっと便利に

そうです。widening しない推論結果を保ったまま型で縛りたいが実現できます。

**型がマッチするかどうかをチェックしつつ（satisfies 型）、型推論は widening させない（as const）との組み合わせは強力！！**

```ts
// myString は string に制限されつつつ、 'バナナ'型 に推論される
export const myString = 'バナナ' as const satisfies string;

// myVersion は number に制限されつつつ、 18型 に推論される
export const myVersion = 18 as const satisfies number;

// urlList は [key: string]: `https://${string}` に制限されつつ、(apple)であれば、"https://www.apple.com/jp/" 型 に推論される
type UrlType = {
  // 値は https:// で始まるURLに限定する
  [key: string]: `https://${string}`;
};

export const urlListNoWidening = {
  apple: 'https://www.apple.com/jp/',
  google: 'https://www.google.com/',
  yahoo: 'http://www.yahoo.co.jp/', // error : Type '"http://www.yahoo.co.jp/"' is not assignable to type '`https://${string}`'
} as const satisfies UrlType;

// urlListNoWidening の型推論
// {
//     readonly apple: "https://www.apple.com/jp/";
//     readonly google: "https://www.google.com/";
//     readonly yahoo: "https://www.yahoo.co.jp/";
// }

export const urlListWithWidening = {
  apple: 'https://www.apple.com/jp/',
  google: 'https://www.google.com/',
  yahoo: 'https://www.yahoo.co.jp/', // error : Type '"http://www.yahoo.co.jp/"' is not assignable to type '`https://${string}`'
} satisfies UrlType;

// urlListWithWidening の型推論
// {
//     readonly apple: "https://www.apple.com/jp/";
//     readonly google: "https://www.google.com/";
//     readonly yahoo: "https://www.yahoo.co.jp/";
// }
```
