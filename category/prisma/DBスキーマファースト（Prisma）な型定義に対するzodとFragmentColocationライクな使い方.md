# DB スキーマファースト（Prisma）な型定義に対する zod と Fragment colocation ライクな使い方

## はじめに

REST API のような既存の型情報がない場合は、zod のスキーマを正とした実装が可能です。それに対して Prisma は DB ソリューションと型生成が一つになっています。

そのため Prisma のスキーマ を正（Single Source Of Truth）とする設計に対して、**Prisma スキーマから生成される型情報に沿っている事を担保する** zod の schema を実装します。

## 結論

TypeScript における機能である`satisfies` 演算子を使う事で、型の Widening を抑えつつ簡単に zod のスキーマが既存型情報に沿っていることを担保 & コロケーションが実現できます。

```prisma
model User {
  id String @id @default(uuid())
  name String
  imageUrl String @db.Text
  email String @db.Text
  isPremium Boolean @default(false)
  servers Server[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

上記の prisma のスキーマがある場合における User を新しく作成する場合の zod スキーマは、以下のように実装できます。

```ts
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// OK
const UserCreateSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  email: z.string(),
  isPremium: z.boolean().optional(),
}) satisfies z.ZodType<Prisma.UserCreateInput>;

// Error
const UserCreateSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  email: z.number(), // error : 型 'number' を型 'string' に割り当てることはできません。
  isPremium: z.boolean().optional(),
}) satisfies z.ZodType<Prisma.UserCreateInput>;
```

ご存知の方は多いかと思いますが、ここで出てきている`ProfileCreateInput`という型は、Prisma Client のヘルパー型を使用して動的に生成されている型情報になります。

## Fragment colocation ライクな使い方をしてみる

zod の話題から離れますが、`satisfies` 演算子を用いて GraphQL の Fragment colocation のように、クエリを共通化して再利用することも可能です。

```ts
// Userテーブルに対するクエリを別ファイルに共通化

export const userWhereQuery = {
  isPremium: () => ({ isPremium: true }),
  byUserName: (name: string) => ({ name }),
  byServerName: (name: string) => ({ servers: { some: { name } } }),
} satisfies Record<string, (...args: any) => Prisma.UserWhereInput>;
```

```tsx
// 子コンポーネント（ex : 特定のユーザーが参加しているサーバーの招待コード一覧を表示するコンポーネント）
import { Prisma } from '@prisma/client';

export const InviteComponentFragment = {
  name: true,
  servers: {
    select: {
      id: true,
      name: true,
      inviteCode: true,
    },
  },
} satisfies Prisma.UserSelect;

type UserPayload = Prisma.UserGetPayload<{
  select: typeof InviteComponentFragment;
}>;

type InviteComponentProps = {
  user: UserPayload;
};

export const InviteComponent = ({ user }: InviteComponentProps) => {
  return (
    <div>
      <h1>user invitation codes for server!</h1>
      <div>login user : {user.name}</div>
      <ul>
        {user.servers.map((server) => (
          <li key={server.id}>
            {server.name}:{server.inviteCode}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

```tsx
// 親コンポーネント

import { userWhereQuery } from '..';
import { InviteComponentFragment } from '../invite-component';

export default async function Home() {
  const user = await prisma.user.findUnique({
    where: {
      AND: [
        userWhereQuery.isPremium(),
        userWhereQuery.byUserName('太郎'),
        userWhereQuery.byServerName('TestServer1'),
      ],
    },
    select: InviteComponentFragment,
  });

  return (
    <div>
      <InviteComponent user={user} />
    </div>
  );
}
```

## 終わり

TypeScript4.9 にて追加された`satisfies` 演算子を使うことで、Prisma スキーマから生成される型情報に zod のスキーマが沿っている事を担保する事や、クエリの再利用を実装する事が出来ました。

「実際 Prisma でこのような運用をしているぜ！」という訳ではないので、記載している内容に間違いがある可能性があります。何か間違いがありましたら、コメント頂ければと思います。

しょーもない話題でしたが、少しでもどなたかのお役に立てれば何よりです。ではまた〜。

## 参考文献

[How TypeScript 4.9 `satisfies` Your Prisma Workflows](https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb)
