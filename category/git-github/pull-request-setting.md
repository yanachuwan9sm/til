# Pull Request 設定

## Squash merging で PR のコミットを 1 つにまとめる

Squash merging を有効にする際には、「Default to pull request title」を指定することでプルリクのタイトルが commit message として採用される。（デフォルトだと、最初のコミットメッセージが採用されてしまう）

![](assets/20231120094438.png)

## ベースブランチ更新時に PR ブランチの更新をサジェスト

`Always suggest updating pull request branchs` を有効にすることで、PR のマージ先（base branch）に更新がある場合に、更新するための UI を表示する。

![](assets/20231120094759.png)

## PR マージ後にブランチを自動で削除

`Automatically delete head branches` を有効にすることで、マージと同時にブランチを自動で削除してくれる。
