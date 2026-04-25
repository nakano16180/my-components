import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink } from "lucide-react"

const serverCode = `import { createUIResource } from '@mcp-ui/server';
import { registerAppTool, registerAppResource } from '@modelcontextprotocol/ext-apps/server';

const widgetUI = createUIResource({
  uri: 'ui://my-server/widget',
  content: { type: 'rawHtml', htmlString: '<h1>Interactive Widget</h1>' },
  encoding: 'text',
});

registerAppResource(server, 'widget_ui', widgetUI.resource.uri, {}, async () => ({
  contents: [widgetUI.resource]
}));

registerAppTool(server, 'show_widget', {
  description: 'Show interactive widget',
  inputSchema: { query: z.string() },
  _meta: { ui: { resourceUri: widgetUI.resource.uri } }
}, async ({ query }) => {
  return { content: [{ type: 'text', text: \`Query: \${query}\` }] };
});`

const clientCode = `import { AppRenderer } from '@mcp-ui/client';

function ToolUI({ client, toolName, toolInput, toolResult }) {
  return (
    <AppRenderer
      client={client}
      toolName={toolName}
      sandbox={{ url: sandboxUrl }}
      toolInput={toolInput}
      toolResult={toolResult}
      onOpenLink={async ({ url }) => { window.open(url); }}
      onMessage={async (params) => console.log('Message:', params)}
    />
  );
}`

export function McpUiPage() {
  return (
    <div className="mx-auto w-full max-w-[860px] space-y-8 p-6 md:p-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">MCP-UI</h1>
          <Badge variant="secondary">MCP Apps Standard</Badge>
        </div>
        <p className="text-muted-foreground text-base leading-relaxed">
          MCP-UI は MCP（Model Context Protocol）ツールコールに
          <strong className="text-foreground"> インタラクティブな UI </strong>
          を追加するための標準仕様（MCP Apps Standard）と、そのリファレンス SDK 実装です。
          AI ツールの結果をリッチな HTML ウィジェットとしてホスト側に表示できます。
        </p>
        <a
          href="https://github.com/modelcontextprotocol/mcp-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
        >
          公式リポジトリ (github.com/modelcontextprotocol/mcp-ui)
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <Separator />

      {/* 概要 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">概要</h2>
        <p className="text-muted-foreground leading-relaxed">
          通常、MCP ツールコールの結果はテキストや JSON として返されます。MCP-UI はこれを拡張し、
          ツールの結果に対応する HTML ウィジェット（UI リソース）をサーバー側で用意し、
          クライアント側がそれをサンドボックス化された iframe 内で安全にレンダリングできる仕組みを提供します。
        </p>
        <p className="text-muted-foreground leading-relaxed">
          UI は <code className="bg-muted rounded px-1 py-0.5 text-sm font-mono">postMessage</code> 経由でホストと双方向通信でき、
          ツール呼び出し・メッセージ送信・リンク開封といったアクションをセキュアに実行できます。
        </p>
      </section>

      {/* SDK パッケージ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">SDK パッケージ</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">@mcp-ui/client</code>
              </CardTitle>
              <CardDescription>クライアント側 SDK</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              <code className="bg-muted rounded px-1 py-0.5 font-mono">AppRenderer</code> コンポーネントを提供。
              サンドボックス化された iframe 内でツール UI を安全にレンダリングし、
              ホストとの通信ブリッジを担います。
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">@mcp-ui/server</code>
              </CardTitle>
              <CardDescription>サーバー側 SDK</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              <code className="bg-muted rounded px-1 py-0.5 font-mono">createUIResource</code> で HTML ウィジェットを生成。
              <code className="bg-muted rounded px-1 py-0.5 font-mono">@modelcontextprotocol/ext-apps/server</code> の
              <code className="bg-muted rounded px-1 py-0.5 font-mono">registerAppTool</code> /
              <code className="bg-muted rounded px-1 py-0.5 font-mono">registerAppResource</code> と組み合わせて使います。
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 仕組み */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">仕組み</h2>
        <ol className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <li className="flex gap-3">
            <Badge className="mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs">1</Badge>
            <span>
              サーバー側でツールに{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono">_meta.ui.resourceUri</code> を指定し、
              HTML ウィジェット（UI リソース）を紐付ける。
            </span>
          </li>
          <li className="flex gap-3">
            <Badge className="mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs">2</Badge>
            <span>
              クライアント側の{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono">&lt;AppRenderer&gt;</code> が
              サンドボックス化された iframe 内で HTML ウィジェットを安全にレンダリングする。
            </span>
          </li>
          <li className="flex gap-3">
            <Badge className="mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs">3</Badge>
            <span>
              UI は{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono">postMessage</code> 経由でホストと通信し、
              ツール呼び出し・メッセージ送信・リンク開封などのアクションを実行する。
            </span>
          </li>
        </ol>
      </section>

      {/* コードサンプル */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">コードサンプル</h2>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">サーバー側</h3>
            <Badge variant="outline" className="text-xs">TypeScript</Badge>
          </div>
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
            <code className="font-mono leading-relaxed">{serverCode}</code>
          </pre>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">クライアント側</h3>
            <Badge variant="outline" className="text-xs">TSX</Badge>
          </div>
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
            <code className="font-mono leading-relaxed">{clientCode}</code>
          </pre>
        </div>
      </section>

      {/* このプロジェクトとの関係 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">このプロジェクトとの関係</h2>
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground space-y-3 pt-6 text-sm leading-relaxed">
            <p>
              このアプリ自体は MCP サーバーではないため、現時点で MCP-UI を直接組み込む必要はありません。
              しかし、将来的に AI エージェントとのインテグレーションを検討する際に、
              以下のような活用が考えられます。
            </p>
            <ul className="list-inside list-disc space-y-1.5">
              <li>
                このアプリのコンポーネント（Chart, Widgets など）を MCP ツールの UI リソースとして公開し、
                AI が結果をリッチな形で表示する
              </li>
              <li>
                <code className="bg-muted rounded px-1 py-0.5 font-mono">AppRenderer</code> を組み込み、
                外部 MCP サーバーが返す HTML ウィジェットをこのアプリ内に埋め込む
              </li>
              <li>
                MCP Apps Standard の成熟に合わせて、標準化された UI プロトコルを採用する
              </li>
            </ul>
            <p>
              MCP Apps Standard はまだコミュニティプレイグラウンド段階であり、
              レガシー MCP-UI と MCP Apps（JSON-RPC）の 2 系統が存在します。
              アダプター経由で相互互換性が提供されていますが、仕様の安定化を見極めてから導入を検討するのが現実的です。
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
