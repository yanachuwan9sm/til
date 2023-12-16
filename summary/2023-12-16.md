# SWR のキャッシュの生存期間

（比較対象としてはデータフェッチライブラリとしての選択肢の一つである TanStack Query）

## SWR の主なキャッシュの特徴

> “SWR” という名前は、 HTTP RFC 5861 で提唱された HTTP キャッシュ無効化戦略である stale-while-revalidate に由来しています。 **SWR は、まずキャッシュからデータを返し（stale）、次にフェッチリクエストを送り（revalidate）、最後に最新のデータを持ってくる**という戦略です。
>
> <https://swr.vercel.app/ja>

- 最低限でシンプルな非同期処理にはドンピシャなヤツ。
- Query Hooks（useSWR）による返り値の種類は[5 つのみ](https://swr.vercel.app/ja/docs/api)である。（必要最低限の機能である）
- **cache (staled) の生存期間は設定できない。TanStack でいう Stale time という概念はない。まずは必ずキャッシュからデータが返る**（revalidate されるまで）
- staled cache の有効期限が設定できない & cache time とかのオプションがない（TanStack にはある）
- SWR のキーが API パスなのは直感的にわかりやすいかつルールが明確（悪くいうと自由度が低い）

複雑な非同期処理であったり、そもそもキャッシュさせたくないデータがある場合など、様々な要件が必要である場合は依然 TanStack Query の方が優勢かな？

## revalidate のタイミングに関するオプション

revalidateIfStale // 古いデータがある場合でも自動再検証
revalidateOnFocus // ウィンドウがフォーカスされたときに自動的に再検証
revalidateOnReconnect // ブラウザがネットワーク接続を回復すると自動的に再検証
dedupingInterval // この期間内における同じキーのリクエストは重複排除
focusThrottleInterval // この期間中に一度だけ再検証を実行（この期間中は `useSWR` が実行されても `revaridate` はしない）

## 参考文献

[React のさまざまなデータフェッチ方法を比較して理解して正しく使用する - SWR・TanStack Query 編](https://zenn.dev/cybozu_frontend/articles/a735baacc09c6a)

[【2023 年】SWR & TanStack Query 比較](https://zenn.dev/aishift/articles/288e4470cfc45e)

[SWR を理解する – SWR](https://swr.vercel.app/ja/docs/advanced/understanding)
