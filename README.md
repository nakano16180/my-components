# my-components

React + shadcn/ui のコンポーネントを試作・確認するためのプレイグラウンドです。  
サイドバーのナビゲーションで **Dashboard / Chart Demo / Wigggle Widgets** の3ビューを切り替えられます。

## 技術スタック

| | |
|---|---|
| フレームワーク | React 19 + TypeScript |
| ビルド | Vite |
| スタイル | Tailwind CSS v4（CSS-first 設定） |
| UIコンポーネント | shadcn/ui（new-york スタイル） |
| チャート | Recharts |
| アイコン | lucide-react |

## セットアップ

```bash
npm install
npm run dev
```

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 型チェック + プロダクションビルド
npm run lint     # ESLint
npm run knip     # 未使用エクスポート・依存関係の検出
npm run preview  # プロダクションビルドのプレビュー
```

## ビュー一覧

### Dashboard
プレースホルダーカードを並べたレイアウト確認用ビュー。

### Chart Demo
インタラクティブな棒グラフ（`HighlightedBarChart`）のデモ。
- ホバーしたバーのみ強調表示（他バーは減光）
- カードヘッダーの月・値がホバー対象に追従
- Tooltip に値を表示

### Wigggle Widgets
コピー&ペーストで使えるウィジェット集。
- Live Clock（1秒ごとに更新）
- Monthly Calendar
- Weather Snapshot
- Stock Pulse
