# SecretScanning のプッシュ保護でシークレット流出を防ぐ

## Secret Scanning とは

- 2023/5 に GA。
- Public or Private (Enterprise Cloud の GHAS ライセンスが適応されているレポジトリ)
- レポジトリの全てのブランチ上の Git 履歴全体をスキャンして、シークレットが検出されるとそのシークレットを提供するプロバイダへ通知する。
- レポジトリに push する前に検出する場合は、**Push protection** を利用する。

[プッシュ保護の一般提供(GA)を開始、すべてのパブリックリポジトリで無料利用が可能に - GitHub ブログ](https://github.blog/jp/2023-05-16-push-protection-is-generally-available-and-free-for-all-public-repositories/)

[GitHub の Secret scanning’s push protection を試してみる](https://zenn.dev/kou_pg_0131/articles/gh-secret-scannings-push-protection)
