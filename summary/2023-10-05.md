# npm パッケージ脆弱性を解消するフロー

前提として、`npm audit fix` や `npm audit fix --force`でも解決しない
手動での介入やレビューが必要となる脆弱性の問題を解消する方法を考える。

## 確認フロー

① 依存パッケージが最新かどうかを確認 (`npm outdated`)

② 最新ではない場合、メジャーバージョンまで最新にする(`ncu -u`)

> （\* ncu -> npm-check-updates : 依存パッケージを見て、アップデート可能なものを一覧にしつつ、package.json の dependencies をメジャーバージョン含めて最新版に書き換えてくれるもの）

② 最新ではない場合、マイナーバージョンまで最新にする(`npm update`)

👉 `npm update` より、`npm-check-updates` を利用し、マイナーバージョンのみアップデートを実施した方が良いかも。（npm update コマンドでは、package.json の書き換えは行ってくれないから）

③ 脆弱性のある依存パッケージを確認する（`npm audit`）

④ （脆弱性がある場合は、）自動修復する（`npm audit fix`）

⑤（なお脆弱性がある場合は、）重複したパッケージの整理・結合を試みる（`npm dedupe`）

⑥（それでも脆弱性があ流場合は、）手動で修復する。

⑦ （メンテが終了・間接的に依存しているライブラリのバージョンが上がらない場合） -> 依存パッケージのバージョンを package.json の overrides フィールド(npm v8.3) or resolutions (yarn v1) で指定

参考:

<https://qiita.com/riversun/items/7f1679509f38b1ae8adb>

<https://developers.play.jp/entry/2023/03/10/144000>

<https://qiita.com/alfe_below/items/1141ec9acbb81b504855>

<https://zenn.dev/yoshii0110/articles/820187fd237b44>

<https://qiita.com/masato_makino/items/20d4fcfc9c05bd3907da>

## npm audit とは

`audit` コマンドは、プロジェクトで設定されている依存関係の説明をデフォルトのレジストリに送信し、既知の脆弱性の報告を求めるもの。
参考 : <https://docs.npmjs.com/cli/v9/commands/npm-audit#description>

### warning の定義

```terminal
42 vulnerabilities (12 moderate, 24 high, 6 critical)
```

![Alt text](image.png)

参考: <https://docs.npmjs.com/about-audit-reports>

## npm dedupe とはなんぞや？

自プロジェクト -> npm パッケージ A と npm パッケージ B に依存
npm パッケージ -> npm パッケージ C @2.1.1 に依存
npm パッケージ B -> npm パッケージ C @2.2.0 に依存

この場合、npm を使うと 1npm パッケージ C @2.1.1 も npm パッケージ C @2.2.0 もインストールされる。パッケージとしては npm パッケージ C で同じなのに、npm パッケージ C @2.1.1 と npm パッケージ C @2.2.0 でバージョンが違いがあるので両方保持されしまう。

だったら、バージョンを新しいほうの@2.2.0 のほうに合わせて、npm パッケージ C @2.2.0 のほうを、npm パッケージ A と npm パッケージ B で共通化して使いましょう、というのが dedupe の発想。

＊dedupe 自身はパッケージの重複排除などはやってくれるが、最新のパッケージを入れてくれるわけではない

＊現在は `npm i` を実行する段階で `dedupe` してくれてるっぽい。試しに `npm ls --depth=3`` を実行すると、deduped の文字が散見される。

## overrides / resolutions する必要って何であるの？

<よくあるケース>

```
yarn add react
```

記事執筆時点での最新バージョンの react がインストールされる。（と同時に react が依存しているパッケージもインストールされる。）

react の package.json の dependencies に prop-types@^15.6.2 と指定されている場合は、
この時点での 15.x の最新バージョンである 15.7.2 (例)がインストールされる。
また、yarn.lock にもそのように記録されるため、これ以降$ yarn を実行すると、yarn.lock の内容に基づいてprop-types@15.7.2がインストールされる。

その後、prop-types@15.7.2に脆弱性が見つかったと仮定すると、package.json の dependencies で指定しているのは react のみであり、prop-types のバージョンを指定することはできない。

<解決策>

① 最も望ましいのは、react が対応を行い、prop-types@^15.7.3 に依存したバージョンをリリースしてくれることである。そうすれば、単に react をバージョンアップすれば済む。

② $ yarn add prop-types@15.6のように、明示的に prop-types をインストールする。
👉 既にインストールされているprop-types@15.7.2とは別に 15.6.x がインストールされるだけであり、prop-types@15.7.2は引き続き使われ続けるため、上手く行かない。
また、直接依存しているわけではないパッケージを package.json の dependencies や devDependencies に記述するのは望ましくない。

①② ではなく、overrides / resolutions を使うことで簡単に解決できる。

参考 : <https://numb86-tech.hatenablog.com/entry/2020/05/26/170627>
