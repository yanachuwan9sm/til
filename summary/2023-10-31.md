# Request・NextRequest・NextApiRequest について

## Request・Response

- ブラウザで実装されている標準的な Web API（Fetch API）インターフェース の Request（Response） オブジェクト

<https://developer.mozilla.org/ja/docs/Web/API/Request>
<https://developer.mozilla.org/ja/docs/Web/API/Response>

## NextRequest・NextResponse

- App Router の [Routes Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#extended-nextrequest-and-nextresponse-apis) にて使用。
- Request を拡張したものであり、いくつかのプロパティとメソッド（Cookie など）が追加されてる。ミドルウェアで使用されます。
- Router Handler では `cookies`、`headers` などの Next.js が提供する Dynamic Funcions（動的関数）を使用することができる。

詳細は[公式 Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#extended-nextrequest-and-nextresponse-apis)参照。

```ts
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // クッキーのインスタンスは読み取り専用
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  // Cookieを設定するには、Set-Cookieヘッダを使用して新しいResponseを返す必要がある
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  });
}
// NextRequest を使えば、cookieを読み込むだけなら以下でOK

import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token');
}
```

## NextApiRequest・NextApiResponse

- Pages Router の API ルートにて使用。
- Node.js の IncomingMessage（node:http 由来）を拡張したものであり、いくつかのヘルパーも追加しているもの。

## 参考

<https://nextjs.org/docs/app/building-your-application/routing/route-handlers#extended-nextrequest-and-nextresponse-apis>

<https://www.reddit.com/r/nextjs/comments/12i224x/request_vs_nextrequest_vs_nextapirequest_and/>
