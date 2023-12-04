# 外部から fetch した画像に対する blur 処理をつける Rehype プラグイン を placeholder プラグインを用いて実装する（App Router）

## next/image 標準の blur ではダメなのか？

> src が静的インポートからのオブジェクトで、インポートされた画像が.jpg、.png、.webp、または.avif の場合、blurDataURL は自動的に入力されます。動的画像の場合は、blurDataURL プロパティを指定する必要があります。Plaiceholder のようなソリューションは、base64 生成に役立ちます。

public 配下のアセットであれば、問題ないけど外部ドメインやら別のストレージサービスから取得した画像の場合は自分で blurDataURL プロパティを指定する必要があるっぽい。

<https://nextjs.org/docs/pages/api-reference/components/image#placeholder>

## placeholder を App Router を用いたプロジェクトに導入する

<https://plaiceholder.co/docs/plugins/next>

```tsx
// @ts-check
import withPlaiceholder from '@plaiceholder/next';

/**
 * @type {import('next').NextConfig}
 */
const config = {
  // your Next.js config
};

export default withPlaiceholder(config);
```

## serverComponentsExternalPackages オプションをつける

App Router の場合、サーバーコンポーネントとルートハンドラの内部で使用される依存関係は、Next.js によって自動的にバンドルされます。
依存関係が Node.js 固有の機能を使用している場合、特定の依存関係を Server Components のバンドルから除外し、ネイティブの Node.js require を使用するように選択できます。

<https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages>

## 実装

```tsx
import { getPlaiceholder } from 'plaiceholder';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';

import type { Element } from 'hast';
import type { Pluggable } from 'unified';
import type { VFileCompatible } from 'vfile';

const rehypeImageOptimum: Pluggable =
  () => async (tree: Node, _file: VFileCompatible) => {
    const promiseFuncs: (() => Promise<void>)[] = [];

    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') {
        return;
      }
      promiseFuncs.push(async () => {
        if (!node.properties) return;
        if (typeof node?.properties?.src !== 'string') return;
        const {
          base64,
          img: { height, src, width },
        } = await getPlaiceholder(`https:${node.properties.src}`);
        node.properties.src = src;
        node.properties.width = width;
        node.properties.height = height;
        node.properties.aspectRatio = `${width} / ${height}`;
        node.properties.blurDataURL = base64;
      });
    });

    await Promise.all(promiseFuncs.map((func) => func()));
  };

export default rehypeImageOptimum;
```

```tsx
const mdxRemoteOption: MDXRemoteProps['options'] = {
  mdxOptions: {
    remarkPlugins: [
      remarkGfm,
      remarkBreaks,
      remarkUnwrapImages,
      remarkLinkCard,
    ],
    rehypePlugins: [
      rehypeImageOptimum,
      rehypeSlug,
      [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOpt],
      [rehypePrettyCode, rehypePrettyCodeOpt],
    ],
    remarkRehypeOptions: {
      handlers: {
        directLink: remarkLinkCardHandler,
      },
    },
    format: 'md',
  },
  parseFrontmatter: false,
};
export default mdxRemoteOption;
```
