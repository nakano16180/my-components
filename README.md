# my-components

配布物のない、shadcn ベースのデモ・調査ページ集（Vite + React SPA）です。npm パッケージや shadcn registry で配布するライブラリではありません。

ページの追加手順、検証コマンド、種類ごとの PR・出典ルールは [AGENTS.md](AGENTS.md) を参照してください。

X のデザイン再現、ライブラリのお試し、技術の調査メモを扱います。サイドバーの Pages から、以下の8ビューを切り替えられます。

## 技術スタック

| | |
|---|---|
| フレームワーク | React 19 + TypeScript |
| ビルド | Vite 7 |
| スタイル | Tailwind CSS v4（CSS-first 設定） |
| UIコンポーネント | shadcn/ui（new-york スタイル） |
| チャート | Recharts |
| フロー | `@xyflow/react` |
| トースト | `gooey-toast` |
| アイコン | lucide-react |

## セットアップ

Node.js 22（22.12.0 以上）を使います。

```bash
npm ci
npm run dev
```

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 型チェック + プロダクションビルド
npm run lint     # ESLint
npm run knip     # 未使用エクスポート・依存関係の検出
npm run preview  # プロダクションビルドのプレビュー
npm run screenshots # プレビューからページのスクリーンショットを撮影
```

CI は `lint` / `build` / `knip` を実行し、`screenshots` ジョブが撮影画像を artifact `page-screenshots` に保存します。撮影に必要な Chromium とプレビューの起動手順は [AGENTS.md](AGENTS.md#pr-を開く前に通すコマンド) を参照してください。

## ビュー一覧

| サイドバー | 内容 |
|---|---|
| Dashboard | プレースホルダーカードを並べたレイアウト確認用ビュー |
| Chart Demo | ホバーした月を強調し、値と Tooltip を表示する棒グラフのデモ |
| Wigggle Widgets | 時計、月間カレンダー、天気、株価のウィジェット |
| React Flow | ノードの追加・移動・接続を試せるフローエディタ |
| Gooey Toast | トーストの種類・位置・表示時間などを試せる Playground |
| MCP-UI | MCP-UI の概要、仕組み、SDK、コード例をまとめた調査ページ |
| Tool UI | Tool UI の特徴、コンポーネント一覧、アーキテクチャ、実装例をまとめた調査ページ |
| MDX Playground | Markdown の説明に React の操作デモを埋め込み、文章と実装の分離を試すページ |
