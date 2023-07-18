# 🕊️ Tooltip って、`<div>` or `<detail>` どっちで実装するべき?

## そもそもDetail要素 is 何？

実装楽ちん & キーボード操作が可能という観点で`<detail>`要素有りかと思ったが、**表示・非表示を行う要素だから、折りたたみ要素とは意味合いが違う**から違和感がある。
やっぱり`<div>`要素🤔？

<https://developer.mozilla.org/ja/docs/Web/HTML/Element/details>

## HTMLにおける`<div>`要素と`<detail>`要素の、CSSのスタイリングの観点における違いとは？

- デフォルトだと要素外をクリックして閉じることもできない
- `<details>`要素は擬似クラスの: hoverを直接サポートしていないから、JSで切り替える必要ある。

<擬似クラス（`:hover`）をサポートしているHTML要素>

- a要素（リンク）
- button要素
- input要素（一部の種類、例：checkboxやradio）
- select要素（ドロップダウンリスト）
- textarea要素
- img要素
- div要素やspan要素など、一般的なコンテナー要素

## 多分、今後の最適解はpopover要素

<https://coliss.com/articles/build-websites/operation/css/about-popover-api.html>
<https://developer.chrome.com/blog/introducing-popover-api/>
