# github 上で管理して自動デプロイする

## 既存の GAS のソースコードを github 上で管理

```js
// claspのダウンロード
npm install -g @google/clasp

// ログイン
clasp login

// 既存のgasのプロジェクトIDよりクローン
clasp clone {sprictId}

// 後はいつも通り、リモートレポジトリにpushするだけ
```

## CI で利用する環境変数(シークレット)を取得

```
cat /home/{userName}/.clasprc.json.
```

(github actions の場合)
GitHub のリポジトリの [Settings] => [Secrets and variables] => [Actions] => [New repository secret]

## Github Actions を用いて GAS 上に自動 push する

参考 repo : <https://github.com/Studist/docker-clasp-starter#github-actions-%E7%94%A8%E3%81%AE%E7%92%B0%E5%A2%83%E5%A4%89%E6%95%B0%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B>

```yml
name: clasp_push
on:
  push:
    branches:
      - main
jobs:
  developments:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: |
          npm install -g @google/clasp
      - name: Authorize Clasp
        env:
          CLASP_TOKEN: ${{ secrets.CLASP_TOKEN }}
        run: echo $CLASP_TOKEN > ~/.clasprc.json
      - name: Clasp push
        run: |
          clasp push -f
```
