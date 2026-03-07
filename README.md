# Evil Charts Demo

`feat/evil_charts` ブランチ向けの単一ページデモです。  
Recharts と shadcn/ui ベースの `HighlightedBarChart` を表示します。

## セットアップ

```bash
npm install
```

## 実行

```bash
npm run dev
```

ブラウザで表示後、棒グラフをホバーすると次が確認できます。

- 対象バーのみ強調表示（他バーは減光）
- カード上部の月/値がホバー対象に追従
- Tooltip に値が表示

## 品質チェック

```bash
npm run build
npm run lint
```

## 既知の制約

- データはコンポーネント内の固定配列（API 連携なし）
- 現在は単一チャートのみのデモ構成

## 今後の拡張候補

- API または JSON からのデータ注入
- 期間フィルタ・系列切替
- 複数チャート（line/area/pie）への展開
