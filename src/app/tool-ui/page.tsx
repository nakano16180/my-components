import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink } from "lucide-react"

const components = [
  {
    category: "Progress",
    items: ["Plan", "Progress Tracker"],
  },
  {
    category: "Input",
    items: ["Option List", "Parameter Slider", "Preferences Panel", "Question Flow"],
  },
  {
    category: "Display",
    items: ["Citation", "Geo Map", "Item Carousel", "Link Preview", "Stats Display", "Terminal", "Weather Widget"],
  },
  {
    category: "Artifacts",
    items: ["Chart", "Code Block", "Code Diff", "Data Table", "Instagram Post", "LinkedIn Post", "Message Draft", "X Post"],
  },
  {
    category: "Confirmation",
    items: ["Approval Card", "Order Summary"],
  },
  {
    category: "Media",
    items: ["Audio", "Image", "Image Gallery", "Video"],
  },
]

const categoryColors: Record<string, string> = {
  Progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Input: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Display: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Artifacts: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Confirmation: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Media: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
}

const serverCode = `import { streamText, tool } from "ai";
import { SerializableLinkPreviewSchema } from "@/components/tool-ui/link-preview/schema";

const result = streamText({
  model: openai("gpt-4o"),
  tools: {
    previewLink: tool({
      description: "Show a preview card for a URL",
      inputSchema: z.object({ url: z.url() }),
      outputSchema: SerializableLinkPreviewSchema,
      async execute({ url }) {
        return { id: "link-preview-1", href: url, title: "...", description: "..." };
      },
    }),
  },
});`

const clientCode = `import { AssistantRuntimeProvider, Tools, useAui } from "@assistant-ui/react";
import { LinkPreview } from "@/components/tool-ui/link-preview";
import { safeParseSerializableLinkPreview } from "@/components/tool-ui/link-preview/schema";

const toolkit = {
  previewLink: {
    type: "backend",
    render: ({ result }) => {
      const parsed = safeParseSerializableLinkPreview(result);
      if (!parsed) return null;
      return <LinkPreview {...parsed} />;
    },
  },
};`

export default function ToolUiPage() {
  return (
    <div className="mx-auto w-full max-w-[900px] space-y-8 p-4 md:p-8">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-xs tracking-[0.08em] uppercase">
          AI Tool Components
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Tool UI</h1>
        <p className="text-muted-foreground mt-2 max-w-[600px] text-sm leading-relaxed">
          AIチャット内のツールコール結果をリッチなUIとして表示するための、コピペ型コンポーネントライブラリ。
          shadcn/ui モデルを採用し、Radix primitives + Tailwind で構築されている。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://tool-ui.com/docs/overview"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <ExternalLink className="size-3" />
            公式ドキュメント
          </a>
          <span className="text-muted-foreground/40">·</span>
          <a
            href="https://github.com/assistant-ui/tool-ui"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <ExternalLink className="size-3" />
            GitHub
          </a>
          <span className="text-muted-foreground/40">·</span>
          <a
            href="https://tool-ui.com/docs/gallery"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <ExternalLink className="size-3" />
            ギャラリー
          </a>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-muted-foreground text-xs">MIT License</span>
        </div>
      </div>

      <Separator />

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">概要</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          LLMがツールを呼び出した結果は通常、生のJSONやテキストとして表示される。
          Tool UI はその結果を用途に合ったUIコンポーネント（カード・テーブル・チャート・フォームなど）として
          会話内にインラインで描画し、ユーザーが追加操作できるようにする。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">解決する課題</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              AI SDKでツールを呼ぶと結果はJSONのまま表示される。
              Tool UI はそれをリッチなUIとしてインラインレンダリングし、
              ユーザーの操作（選択・承認など）をAIへフィードバックできる。
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">対象ユースケース</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              チャットUI内でのリンクプレビュー、注文確認、コードブロック表示、
              データテーブル、承認フロー、メディアギャラリーなど。
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">特徴</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "コピペ型（shadcn モデル）",
              desc: "NPMパッケージではなくコードを自分のリポジトリにコピーして使う。依存ロックインがなく、自由にカスタマイズできる。",
            },
            {
              title: "Zod スキーマ検証",
              desc: "各コンポーネントに対応するZodスキーマが付属。入力データがスキーマにマッチしない場合は安全にnullを返す。",
            },
            {
              title: "インタラクティブ + レシート",
              desc: "ユーザーが選択したアクションがアシスタントにフィードバックされ、選択履歴がレシートとして会話に残る。",
            },
            {
              title: "shadcn/ui ベース",
              desc: "Radix primitives + Tailwind styling で構築。既存のshadcn/uiテーマと統一しやすく、デザインの一貫性を保てる。",
            },
          ].map((f) => (
            <Card key={f.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Component list */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">コンポーネント一覧</h2>
        <p className="text-muted-foreground text-sm">
          全{components.reduce((acc, c) => acc + c.items.length, 0)}コンポーネント、6カテゴリ。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {components.map((cat) => (
            <Card key={cat.category}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${categoryColors[cat.category]}`}
                  >
                    {cat.category}
                  </span>
                  <span className="text-muted-foreground font-normal">
                    {cat.items.length} items
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Architecture */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">アーキテクチャ</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 font-mono text-sm">
              {[
                { label: "Radix / shadcn", desc: "デザインプリミティブ・UIの基礎レイヤー" },
                { label: "Tool UI", desc: "会話ネイティブコンポーネント（カード・テーブル・フォームなど）", highlight: true },
                { label: "AI SDK / LangGraph", desc: "LLMオーケストレーション・ツール定義" },
              ].map((layer, i, arr) => (
                <div key={layer.label}>
                  <div
                    className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                      layer.highlight
                        ? "border-primary/30 bg-primary/5 text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="font-semibold">{layer.label}</span>
                    <span className="text-xs font-normal">{layer.desc}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="text-muted-foreground py-1 text-center text-lg">↓</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Code examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">最小実装例</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">サーバー側（ツール定義）</CardTitle>
              <CardDescription className="text-xs">
                outputSchema にTool UIのスキーマを渡してAI SDKのツールを定義する。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs leading-relaxed">
                <code>{serverCode}</code>
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">クライアント側（レンダリング）</CardTitle>
              <CardDescription className="text-xs">
                ツール結果をパースして対応コンポーネントにレンダリングする。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs leading-relaxed">
                <code>{clientCode}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Compatibility */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">このプロジェクトとの相性</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              status: "✅",
              title: "shadcn/ui 互換",
              desc: "new-york スタイル + Tailwind v4 環境にそのままコピーして使える。テーマも統一しやすい。",
            },
            {
              status: "⚠️",
              title: "assistant-ui が前提",
              desc: "インタラクティブ機能はassistant-uiとの統合が前提。チャットUIなしでも個別コンポーネントのデモは可能。",
            },
            {
              status: "✅",
              title: "段階的導入が可能",
              desc: "コピペ型のため、必要なコンポーネントだけを選んで取り込める。ロックインなし。",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {item.status} {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
