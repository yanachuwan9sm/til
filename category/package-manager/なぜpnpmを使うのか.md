# なぜ pnpm を使うのか

## what`s pnpm?

- performant npm の略。2017 年に OSS として リリースされたもの。
- ディスク使用量の効率化が[pnpm のモチベーション](https://pnpm.io/motivation#saving-disk-space)であり、dedupe や パッケージの巻き上げ(hoisting) の代わりに **シンボリックリンクに基づく node_modules 構造** を採用。
  - install した node モジュールの実態は global な.pnpm_store 内（content-addressable store）で一元管理され、ハードリンクされる。（ディスク容量をセーブ）
  - シンボリックリンクを用い独自の node_modules 構造を使用して、package.json にあるものしかアクセスできない（厳格）
  - 木構造内の重複パッケージはシンボリックリンクで使い回す。（モジュールの重複を防ぐ）

---

**直接インストールしたもの**
👉 `node_modules` 配下にパッケージのシンボリックが作成される。（つまり、アプリケーションコードから直接アクセスできるパッケージは 直接インストールしたもの だけ）

**プロジェクトで使われているすべてのパッケージの依存関係**
👉 `node_modules/.pnpm` 配下に `.pnpm/<name>@<version>/node_modules/<name>`という命名規則で配置される。

**実体となるファイル**
👉 すべてグローバルに管理される Content-addressable store（コンテンツ探索可能なストア）に配置。（MacOS では `~/Library/pnpm/store/v3` がデフォルトの配置場所）
node_modules に存在するすべてのパッケージに含まれるファイルは、コンテンツ探索可能なストアへのハードリンクになっている。

## なぜ pnpm を選ぶのか？

npm、yarn と比較した際に pnpm を選ぶ大きな利点は、
**node モジュールの実体を同一ディレクトリー配下で一元管理し、複数プロジェクト横断でこれを参照（シンボリックリンク）する**仕組みを持っている事である。

1. マシンのディスク容量を節約 & インストールが非常に高速
2. 明示的にインストールされた node モジュール以外を暗黙的に使えなくなる

### 明示的にインストールされた node モジュール以外を暗黙的に使えなくなる

**🤔 npm や yarn の場合**
芋づる式にインストールされた package をアプリケーションコードから参照・使用できてしまう。（プロジェクト下の node_modules ディレクトリーに実体があるから）
**要するに、package.json に書いていないパッケージでもアクセスできちゃう問題**。

**👍 pnpm の場合**
プロジェクト配下の node_modules ディレクトリーには package.json に明記されたモジュールのシンボリックリンクしかないため、peerDeps 等で依存するモジュールは暗黙的に参照できず、誤って利用する事がない。

## Example

ex1: 以下の図のような依存関係のパッケージが存在する場合

```json
"dependencies": {
    "mod-a": "^1.0.0", // mob-b@1.0.0に依存
    "mod-c": "^1.0.0" // // mob-b@2.0.0に依存
}
```

上記の依存関係を pnpm で実行すると、node_modules は以下のようになる。

```json
node_modules/
|-- .pnpm
|   |-- mod-a@1.0.0
|   |   `-- node_modules
|   |       |-- mod-a
|   |       `-- mod-b -> ../../mod-b@1.0.0/node_modules/mod-b
|   |-- mod-b@1.0.0
|   |   `-- node_modules
|   |       `-- mod-b
|   |-- mod-b@2.0.0
|   |   `-- node_modules
|   |       `-- mod-b
|   |-- mod-c@1.0.0
|   |   `-- node_modules
|   |       |-- mod-b -> ../../mod-b@2.0.0/node_modules/mod-b
|   |       `-- mod-c
|   `-- node_modules
|       `-- mod-b -> ../mod-b@1.0.0/node_modules/mod-b
|-- mod-a -> .pnpm/mod-a@1.0.0/node_modules/mod-a
`-- mod-c -> .pnpm/mod-c@1.0.0/node_modules/mod-c
```

ex2: 以下の図のような依存関係のパッケージが存在する場合

```json
"dependencies": {
    "foo": "^1.0.0", // lodash@1.0.0に依存
    "bar": "^1.0.0", // lodash@1.0.1に依存
}
```

上記の依存関係を pnpm で実行すると、node_modules は以下のようになる。

```json
node_modules/
|-- .pnpm <-プロジェクトで使われている全てのパッケージの依存関係
|   |-- foo@1.0.0
|   |   `-- node_modules
|   |       |-- foo -> <store>/foo <= コンテンツストアへのハードリンク）
|   |       |-- bar -> ../../bar@1.0.0/node_modules/bar
|   |       `-- lodash -> ../../lodash@1.0.0/node_modules/lodash
|   |-- bar@1.0.0
|   |   `-- node_modules
|   |       |-- bar -> <store>/bar
|   |       `-- lodash -> ../../lodash@1.0.0/node_modules/lodash
|   |-- lodash@1.0.0
|   |   `-- node_modules
|   |       `-- lodash -> <store>/lodash
|-- foo -> .pnpm/foo@1.0.0/node_modules/foo <- 直接 npm install したもの（コンテンツストアへのハードリンク）
```

<https://zenn.dev/s_takashi/articles/7358a32b1a6d52>

## パフォーマンス

| action  | cache | lockfile | node_modules | npm   | pnpm  | Yarn  | Yarn PnP |
| :------ | :---- | :------- | :----------- | :---- | :---- | :---- | :------- |
| install |       |          |              | 35.3s | 15.7s | 16.7s | 22.9s    |
| install | ✔     | ✔        | ✔            | 1.8s  | 1.1s  | 2.1s  | n/a      |
| install | ✔     | ✔        |              | 10.3s | 4.1s  | 6.5s  | 1.42     |
| install | ✔     |          |              | 14.9s | 7.2s  | 11.1s | 6.1s     |
| install |       | ✔        |              | 16.8s | 12.6s | 11.5s | 17.2s    |
| install | ✔     |          | ✔            | 2.4s  | 2.7s  | 6.9s  | n/a      |
| install |       | ✔        | ✔            | 1.8s  | 1.2s  | 7.1s  | n/a      |
| install |       |          | ✔            | 2.3s  | 7.8s  | 11.7s | n/a      |
| update  | n/a   | n/a      | n/a          | 1.9s  | 9s    | 15.4s | 28.3s    |

<https://blog.logrocket.com/javascript-package-managers-compared/>

## 参考文献

[npm/yarn の不足点と pnpm を推す理由 | Hello 🎨](https://xingyahao.com/j/pnpm-npm-yarn.html)

[node_modules の問題点とその歴史 npm, yarn と pnpm](https://zenn.dev/saggggo/articles/dbd739508ac212)

[pnpm について調べたのでメモ](https://zenn.dev/s_takashi/articles/7358a32b1a6d52)
