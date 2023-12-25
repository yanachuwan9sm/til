# HTTP Cache

<!-- TOC -->

- [HTTP Cache](#http-cache)
  - [リクエスト ヘッダーにおけるキャッシュ制御](#リクエスト-ヘッダーにおけるキャッシュ制御)
  - [レスポンスヘッダーにおけるキャッシュ制御](#レスポンスヘッダーにおけるキャッシュ制御)
    - [Cache-Control:](#cache-control)
    - [ETag:](#etag)
    - [Last-Modified:](#last-modified)

<!-- /TOC -->

---

> HTTP キャッシュの動作は、[リクエスト ヘッダー](https://developer.mozilla.org/docs/Glossary/Request_header)と[レスポンス ヘッダー](https://developer.mozilla.org/docs/Glossary/Response_header)の組み合わせで制御されます。ウェブ アプリケーションのコード（リクエスト ヘッダーを決定）とウェブサーバーの構成（レスポンス ヘッダーを決定）の両方を制御するのが理想的

## リクエスト ヘッダーにおけるキャッシュ制御

**デフォルト設定（ブラウザ）のままが一般的。**

ほとんどの場合、ブラウザがリクエストを行う際に、ユーザーに代わってそれらのヘッダーを設定している。

更新頻度のチェックに影響するリクエスト ヘッダー（[If-None-Match](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) や [If-Modified-Since](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since) など）は、HTTP キャッシュ内の現在の値に対するブラウザの認識に基づいて表示されます。

## レスポンスヘッダーにおけるキャッシュ制御

**ウェブサーバーがレスポンスを送信する際に、明示的にヘッダーを追加し、細かく制御する必要がある。**

（ちなみに、ブラウザは、そのコンテンツ タイプに最も適したキャッシュ動作のタイプを[実質的に推測](https://www.mnot.net/blog/2017/03/16/browser-caching#heuristic-freshness)するため、Cache-Control レスポンス ヘッダーを省略しても HTTP キャッシュは無効にならない）

キャッシュを制御する主なヘッダーは以下の 3 通り。また、**考慮するべき優先度は Cache Control > ETag > Last-Modified。**

### [Cache-Control](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control):

Cache-Control ディレクティブをレスポンスヘッダーに含める事で、ブラウザやその他の中間キャッシュが個々のレスポンスをキャッシュに保存する方法と保存期間を指定することができる。

- `Cache-Control: no-cache` 👉 使用前にサーバーで再検証する必要があるリソースに使用。
- `Cache-Control: no-store` 👉 キャッシュに保存しないリソースに使用。
- `Cache-Control: max-age=31536000` 👉 バージョニングされたリソース用。

| Cache-Control  値        | 説明                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| max-age=86400            | レスポンスは、最大 1 日間（60 秒 x 60 分 x 24 時間）ブラウザおよび中継キャッシュでキャッシュに保存できます。  |
| private, max-age=600     | レスポンスはブラウザで最大 10 分（60 秒 x 10 分）キャッシュに保存できますが、中継キャッシュは保存できません。 |
| public, max-age=31536000 | レスポンスは、任意のキャッシュに 1 年間保存できます。                                                         |
| no-store                 | レスポンスをキャッシュに保存することはできず、リクエストごとに完全に取得する必要があります。                  |

[ RFC 5861 - 古いコンテンツ用の HTTP キャッシュコントロール拡張](https://tex2e.github.io/rfc-translater/html/rfc5861.html)にて追加された `stale-while-revalidate`を用いる事で、**キャッシュが古くなった時一旦はそれをユーザーに見せながら裏で最新のデータを取得することで、サーバーへのリクエストにかかる時間をユーザーから隠蔽できる**のが嬉しい。

![image](https://github.com/yanachuwan9sm/til/assets/95360878/e055aa68-928e-4cef-be67-58bc1212c6ba)

しかし、主要ブラウザーにおいて、[全て対応されている訳ではない](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7)ことがマイナスポイント。

ETag と Last-Modified はどちらも同じ目的を果たし、期限切れのキャッシュ ファイルを再ダウンロードする必要があるかどうかをブラウザが判断する。（ETag は、精度が高いため推奨される方法）

### [ETag](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag):

ブラウザは、期限切れのキャッシュされたレスポンスを見つけると、小さなトークン（通常はファイルのコンテンツのハッシュ）をサーバーに送信して、ファイルが変更されたかどうかを確認できます。サーバーから同じトークンが返された場合は、ファイルは同じであるため、再度ダウンロードする必要はありません。

### [Last-Modified](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified):

1999 年当時のキャッシュ保存のデフォルト設定。
このヘッダーの目的は ETag と同じですが、ETag のコンテンツ ベースの戦略ではなく時間ベースの戦略を使用して、リソースが変更されたかどうかを判断します。

---

HTTP キャッシュとは異なるものとして[BF キャッシュ](https://web.dev/articles/bfcache?hl=ja)もある。

---

[HTTP キャッシュ - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Caching)

[キャッシュを大切に ❤️  |  Articles  |  web.dev](https://web.dev/articles/love-your-cache?hl=ja)

[HTTP キャッシュを使用して不要なネットワーク リクエストを防止する  |  Articles  |  web.dev](https://web.dev/articles/http-cache?hl=ja)
