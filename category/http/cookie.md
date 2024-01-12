# Cookie

## What`s is Cookie?

(set-cookie を)送ったら次から(Cookie として）送り返してくるヤツ。
👉 ブラウザは Set-Cookie してきたサイトを覚えておき、そのサイトにアクセスするたびに Cookie ヘッダで自動で送り返す。
👉 いわゆる画面に表示される URL だけではなく、そのサブリソース（image/JavaScript/iFlame)にも適用される。

一意な値を Cookie として付与すれば、ユーザが 区別 できるが、この時点では 識別 はしてない

最近の EC サービスは、ログインしていなくてもショッピングカートに追加でき、決済直前で認証を挟む実装が多いが、これは先にカートのための 区別 を行い、あとから 識別 していることになる。

> Cookie とは必ずしも認証結果というわけではなく、ユーザ同士が 区別 できれば良いだけのユースケースもあるというのが、 Cookie の使い方を考える上で非常に大事なことだ。
> [3PCA 2 日目: Cookie による区別と識別 | blog.jxck.io](https://blog.jxck.io/entries/2023-12-02/3pca-cookie.html)

## What`s Session?

セッション 👉 サーバー側にデータを保存する仕組み。（サーバーがユーザーの情報や状態をセッション ID（番号）として記憶しておくためのもの）

## Cookie と Session の違い

ヘッダの中に情報を入れて相手を識別する点では全く同じ。
👉 それが Cookie の場合は丸裸の情報になっていて、セッションの場合は受付番号になっているかの違い。

## Cookie の主なユースケース

### クッキーを使ったセッション管理

（HTTP はその時の要求に対しての応答を返すだけで、前回の状態を保持できないステートレスなプロトコルであるため）**クライアントとサーバーの間のセッション状態を保持する方式として Cookie & Session を用いる必要がある**。

↓

**そのセッション情報（セッション ID）をどこ（セッションストレージ）に保存するかで大きく三種類ある（クッキー or Redis or サーバーのメモリ）**

**CookieStore（クッキー方式）**

- セッション情報を全て暗号化してクライアントの Cookie に保存する。（今回のトピックにあたるもの）
- クライアントで完結するため、セッションストレージとしてのサーバーは不要
- クライアントの Cookie に保存されているため、データベースへのアクセスが不要（処理が高速）
- データサイズの制限がある。（Cookie は最大で 4kB までの情報しか保存できない。）
- すべての情報をクッキーに入れるので、クッキーの情報がコピーされて盗まれたら、サーバーとのセッションも偽装されてしまう。

**Redis（インメモリ方式）**

- Redis や他の Key-Value 型のデータベースにセッション ID とセッション情報を保存し、クライアントの Cookie にはセッション ID のみを保存しする（リクエストで受け取ったセッション ID を使用して Redis から情報を取得）
- 処理が高速であり、情報漏洩のリスクが低い
- 容量制限がない & サーバー側でセッションクリアができる。
- リクエストごとに DB アクセスの I/O コストが発生 ＆ メモリを使い果たすと書き込みが全てエラーになる。

**● DB（データベース方式）**

- インメモリ方式と同様にセッション ID とセッション情報を保存しますが、データベースに保存する。
- クライアントの Cookie にはセッション ID のみを保存します。
- クライアントからのリクエストで受け取ったセッション ID を使用してデータベースから情報を取得します。
- **インメモリやクッキーと比べてデータの取得が遅くなる場合がある。**
- セッションの期限付き発行やセッションの永続性に他のソリューションと比較した場合に長けている。

---

以下は Redis（または DB）の場合の処理の一連の流れ。

1. セッションを識別するための ID（セッション ID）を生成する。（このセッション ID は一意の値であり、セッションを識別するためのキーとなる）
2. レスポンス時に、セッション ID（通常、暗号化や署名を行い保護する）をクライアント側の Cookie に保存する（Set-Cookie）。
3. クライアントからの通信リクエストがあると、サーバー側は Cookie からセッション ID を読み取る。
4. 読み取ったセッション ID を使用して、サーバー側のセッションストレージ（データベースやメモリなど）からセッション情報を取得する。（セッション情報にはユーザー情報や処理状況などの様々なデータが紐付いてる）
5. サーバー側は取得したセッション情報を利用してリクエストの処理を行います。必要に応じてセッション情報を更新または保存します。
6. レスポンスがクライアントに返される際には、必要に応じてセッション ID を Cookie に再度設定します。

[Node.js Express での安全なセッション管理](https://viblo.asia/p/nodejs-express%E3%81%A7%E3%81%AE%E5%AE%89%E5%85%A8%E3%81%AA%E3%82%BB%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3%E7%AE%A1%E7%90%86-yZjJYxY64OE)

[ユーザーのセッション情報をスケーラブルに保つ 2 つの方法 #JavaScript - Qiita](https://qiita.com/G-awa/items/ebb6e214ed45f27e5de2)

### 署名付きクッキー

<https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-cookies.html#private-content-how-signed-cookies-work>

<https://zenn.dev/tera_ny/articles/034c2cca6674b3>

### セッション認証とトークン認証について

<https://zenn.dev/oreilly_ota/articles/31d66fab5c184e>

## 3rd Party Cookie

3rd party cookie とは？については以下の記事がめちゃめちゃ分かりやすい。
<https://blog.jxck.io/entries/2023-12-04/3pca-3rd-party-cookie.html>

3rd party Cookie 廃止するね。これで簡単な確認はできそう。