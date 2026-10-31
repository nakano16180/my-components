# Copilot Instructions

実装手順、ディレクトリ構成、デザインページの追加方法、PR 規約、ライセンスは [AGENTS.md](../AGENTS.md) にまとめてあります。作業前に読んでください。このファイルには繰り返していません。

PR を開く前に、CI と同じコマンドを通してください。

```bash
npm run lint      # eslint .
npm run build     # tsc -b && vite build
npm run knip      # 未使用の export・依存・ファイル
```

URL ルーターはありません。`src/App.tsx` が `src/app/dashboard/page.tsx` を描画し、その `useState` と `src/components/app-sidebar.tsx` でページを切り替えます。手順は AGENTS.md の「ルーティング」と「新しいデザインページの追加」です。
