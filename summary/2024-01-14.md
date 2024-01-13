# PC とモバイルにおける擬似クラス hover の挙動の違い

PC とモバイル端末（タッチ端末）では:hover 擬似クラスの挙動が違うよという話。

|        | hover                                          | active                           |
| :----- | :--------------------------------------------- | :------------------------------- |
| PC     | 要素にマウスカーソルが乗っているときのスタイル | 要素をクリックしたときのスタイル |
| スマホ | タップ後、違う要素がタップされるまでのスタイル | タップ中のみのスタイル           |

モバイル端末における`:hover`

👉 タップした要素に装飾があたった後、別の要素に「タップされた」と判定されるまで装飾が残り続ける。（タップして指を離した後も設定した装飾が残り続ける）
そのため、固定ヘッダーなどの画面遷移後も残りづつけるものは画面遷移後も hover 時のスタイルが違う要素がタップされるまで残り続ける。

👉 モバイル端末で PC の`:hover`と同じような挙動を期待する場合は、`:hover`ではなく`:active`の方が近い。

## 結論: マウスのときだけホバースタイルを当てるのが良い

hover メディア特性を使用することで、マウス（正確には、ホバーができる入力手段かどうか）を区別することができる。

[hover - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@media/hover)

```css
@media (hover: hover) {
  /* hover指定できるPCを想定したスタイル */
  a:any-link:hover {
    background-color: red;
  }
}
@media (hover: none) {
  /* hoverが使えないタッチ端末を想定した装飾 */
  a:any-link:active {
    background-color: red;
  }
}
```

## Tailwind だとよしなに対応してくれる

tailwind.config.ts に以下を追加するだけで、デスクトップやノートパソコンなど、ポインターを持つものに対してのみホバー機能が適応される
。[こちらの PR](https://github.com/tailwindlabs/tailwindcss/pull/8394)で適応されたもの。公式ドキュメントには特段記載はなかった。

```ts
export default {
    ・・・
  future: {
    hoverOnlyWhenSupported:
      true /* Disable pseudo-element hover: on mobile devices */,
  },
} satisfies Config
```

## 参考

[【CSS】まだホバー時のスタイルを :hover だけで指定してるの？](https://zenn.dev/kagan/articles/css-hover-style)
