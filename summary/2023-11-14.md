# GA のデバッグをローカルで行う

## act とは

github/workflows/ ファイルに加えた変更 (あるいは GitHub のアクションに組み込まれた変更) をテストするために
毎回 commit/push をする必要がなく、act を使ってローカルでアクションを実行できるもの。
（環境変数とファイルシステムはすべて、GitHub が提供するものと一致するように設定されている。）

<https://github.com/nektos/act#secrets>

## 注意点

- ubuntu-\* のみサポート
- ソフトウェアは指定する Docker イメージ依存、デフォルトのイメージだと色々足りないので -P で指定
- secrets.GITHUB_TOKEN が未定義なので Personal Access Token を発行し設定が必要
- サービスコンテナ services が使えない
- $ACT を使うと本番との差異が大きくなる

## 環境変数について

<https://www.memory-lovers.blog/entry/2022/11/13/120000>

## 詰まった点

実際の Github Actions 環境とは異なり、Docker イメージで動いている事から、正常な動作を確認できない場合があった。
👉 GA とローカル用に yml ファイルを 2 種類用意することで解消しそうだが、あまり好ましい解決法ではない。ローカルで軽く動かしたい、一部分だけ実行する用途で使うのが良さそう。

`zip`コマンドがないと怒られたので、Docker Image を `node:16-buster-slim(micro)` -> `catthehacker/ubuntu:act-latest(medium)` すると、そうすると `node`やら`npm`やら`yarn`がないため、怒られた、、、
<https://github.com/nektos/act#runners>

## 参考サイト

<https://zenn.dev/snowcait/articles/2b4a903b9fd584>
