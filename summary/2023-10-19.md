# 仕様書から理解する fetch における json()

## 標準の仕様書、および標準化団体 WHATWG とは

WHATWG とは、Web 技術の標準仕様の検討や策定を行う業界団体。
HTML5 や DOM など Web 開発に必要な技術の標準規格を発行していることでよく知られる。

WHATWG が策定している仕様の一覧は以下にて確認できる。
<https://spec.whatwg.org/>

### HTML 標準

HTML Living Standard : <https://html.spec.whatwg.org/>

(ちなみに)
W3C は HTML4 の後継として XML 化された HTML である XHTML を推進するのに対して、
WHATWG は HTML5 を独自に策定し、加盟各社のブラウザに実装した。
しばらくは XHTML と HTML5 が併存していたが、次第に Web 開発者らも HTML5 支持が大勢となり、W3C は XHTML を凍結、WHATWG との HTML5 共同策定に合意した。
**2019 年には W3C が実質的に HTML 標準策定から撤退し、WHATWG が随時更新する「HTML Living Standard」が唯一の HTML 標準となった。（今現在も同様）**

### CSS 標準

CSS の仕様は W3C が策定

### JavaScript

JavaScript においては大きく **ECMAScript と ブラウザ API の二種類の仕様**が存在する。

**ECMAScript（言語仕様など Web ブラウザでも Node.js でも変わらないもの）**
👉 Ecma International という団体の TC39 と呼ばれる委員会で標準化が進められている。プロポーザルとステージに基づく策定プロセスが特徴で、年に一度 ES20XX としてまとめてリリースされる。

**ブラウザ API （Web ブラウザ環境が提供する API）**
👉 HTML と同じく WHATWG によって Living Standard として策定されている。API ごとに DOM Standard、Fetch Standard などといった形でまとめられており、Location や History など HTML Standard に含まれているものもあります。WHATWG のウェブサイトから仕様の一覧が確認できます。

DOM Standard : <https://dom.spec.whatwg.org/>
Fetch Standard : <https://fetch.spec.whatwg.org/>

### Node.js における fetch

Node.js v18 より標準ライブラリとして Fetch API がやってきた。モチロン、先ほど記述した WHATWG の Fetch Standard に準じたもの。（17.5 からいたけどフラグ無しでは使えなかった）

また、`fetch()` に関連して、`FormData`、 `Headers` 、 `Request` 、 `Response` も追加されています。これらもグローバルに定義されています。

<https://github.com/nodejs/node/pull/41811>

`fetch()` は `undici` という Node.js とは別のソフトウェアを内部では利用して実装。
undici では `llhttp` という次世代の HTTP パーサーを利用。（ Node.js 本体の HTTP パーサーとしても利用。nodejs organization でメンテナンス。）

<https://github.com/nodejs/undici>
