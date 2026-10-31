# AGENTS.md

AI エージェント向けの作業ガイドです。クラウド上の Linux VM でも、オーナーのローカル WSL2 でも、この手順でデザインページを追加します。WSL2 と Windows Chrome の話は、末尾の「ローカル環境（WSL2）」だけにまとめてあります。

## プロジェクト概要

このリポジトリは Kaito（GitHub: nakano16180）個人の、shadcn ベースの UI ページ集です。X で見たデザインをエージェントが集め、候補の issue を立て、PR で再実装し、レビューしてマージする流れで育てます。

公開リポジトリです。ライセンスは MIT（`LICENSE`）です。扱い方は「出典とライセンス」に従ってください。

1 つの PR では 1 つのデザインだけを扱います。デザインと無関係な機能変更や依存関係の更新は混ぜません。

## 技術スタック

| | |
|---|---|
| UI | React 19 + TypeScript |
| ビルド | Vite 7（`tsc -b && vite build`） |
| スタイル | Tailwind CSS v4（CSS-first。`tailwind.config.js` は無い） |
| コンポーネント | shadcn/ui（new-york。設定は `components.json`） |
| アイコン | lucide-react |
| チャート | Recharts（shadcn の Chart 経由） |
| フロー | `@xyflow/react` |
| トースト | `gooey-toast` |
| Node.js | 22（Vite 7 は `^20.19.0 \|\| >=22.12.0`。CI も Node 22） |
| パッケージマネージャ | npm（`package-lock.json`。インストールは `npm ci`） |

## ディレクトリ構成

```
src/
  main.tsx                 # エントリ。App を mount する
  App.tsx                  # dashboard の Page を描画するだけのラッパ
  index.css                # Tailwind v4 のトークンとグローバル CSS
  app/
    dashboard/page.tsx     # シェル。activeView を持ち、表示ページを切り替える
    widgets/page.tsx       # WidgetsContent
    flow/page.tsx          # React Flow
    gooey-toast/page.tsx   # Gooey Toast
  components/
    app-sidebar.tsx        # サイドバー。Pages がビュー切替
    search-form.tsx
    version-switcher.tsx
    ui/                    # shadcn プリミティブ（CLI が配置する）
  hooks/
    use-mobile.ts
  lib/
    utils.ts               # cn()
components.json            # shadcn CLI の設定
knip.jsonc                 # 未使用 export の例外（ui プリミティブ）
.github/workflows/ci.yml   # lint / build / knip / screenshots
```

import は `@/`（`src/`）を使います。`../../` のような相対パスは使いません。

## ルーティング

URL ルーターはありません。`react-router` も入っていません。画面遷移は次の通りです。

1. `src/main.tsx` が `App` を描画する。
2. `src/App.tsx` は `@/app/dashboard/page` の default export を返すだけ。
3. 表示中のビューは `src/app/dashboard/page.tsx` の `useState` で切り替える。
4. `src/components/app-sidebar.tsx` が `activeView` と `onViewChange` を受け取り、Pages グループのボタンでビューを変える。

ビュー ID は dashboard と sidebar の両方に、同じ文字列ユニオンで書きます。

```ts
type ActiveView = "dashboard" | "chart" | "widgets" | "flow" | "gooey-toast"
```

| ID | サイドバー | 中身 |
|---|---|---|
| `dashboard` | Dashboard | `dashboard/page.tsx` 内のプレースホルダー |
| `chart` | Chart Demo | `dashboard/page.tsx` 内の `HighlightedBarChart` |
| `widgets` | Wigggle Widgets | `WidgetsContent`（`src/app/widgets/page.tsx`） |
| `flow` | React Flow | `src/app/flow/page.tsx` の default export |
| `gooey-toast` | Gooey Toast | `GooeyToastPage`（`src/app/gooey-toast/page.tsx`） |

`chart` は歴史的にページファイルを持たず、シェルの中へ直接描いています。新しいデザインは `src/app/<name>/page.tsx` に切り出します。

## 新しいデザインページの追加

次の 3 箇所を揃えます。どれか一つだと、ナビに出ないか型がずれます。

1. **`src/app/<name>/page.tsx` を作る。**  
   シェルから描画するコンポーネントを export する。既存に合わせ、named export（`GooeyToastPage`、`WidgetsContent`）か default export（flow）のどちらかにします。

2. **`src/app/dashboard/page.tsx` を更新する。**  
   - `activeView` のユニオンに `<name>` を足す  
   - ページを import する  
   - 条件分岐に描画を足す  
   - ヘッダーのパンくず（親ラベルと現在のページ名）を足す

3. **`src/components/app-sidebar.tsx` を更新する。**  
   - `AppSidebarProps` の `activeView` に同じ `<name>` を足す  
   - Pages グループに `SidebarMenuItem` を足し、`onViewChange("<name>")` を呼ぶ  
   - `lucide-react` のアイコンを 1 つ付ける

置き場所:

- **ページ専用の部品**は `src/app/<name>/` に置き、そのページからだけ import する。
- **複数ページで使う部品**は `src/components/` に置く。
- **shadcn のプリミティブ**は `src/components/ui/`。手でコピーせず、下の CLI で追加する。

### shadcn コンポーネント

リポジトリ直下の `components.json` が CLI の設定です。style は `new-york`、RSC は無効、TSX、CSS は `src/index.css`、アイコンは lucide、エイリアスは `@/components` と `@/components/ui` です。

```bash
npx shadcn@latest add <component>
```

CLI が置いた `src/components/ui/*` は生成物です。`data-slot` を外したり、ファイルの構成を組み替えたりしません。

CVA のバリアントは `button-variants.ts` や `badge-variants.ts` のように、React を import しないファイルへ分けてあります。新しいプリミティブでもこの分け方を維持します。className の結合は `@/lib/utils` の `cn()` を使います。

`npm run knip` は未使用の export で失敗します。`src/components/ui/**` は shadcn の公開 API なので、まだどのページも import していない export（`CardFooter` など）は `knip.jsonc` が見送ります。**ファイル自体がどこからも import されていない場合は失敗します。** 追加したプリミティブは、使うページから import します。

### スタイルと既存ライブラリ

- Tailwind のトークンは `src/index.css` の `@theme inline` と CSS 変数（oklch）です。ダークモードは `.dark` クラスです。
- チャートは `ChartContainer` / `ChartTooltip` と `var(--color-<key>)` を使います。`<key>` は `ChartConfig` のキーと一致させます。見本は `src/components/ui/highlighted-bar-chart.tsx` です。
- `@xyflow/react` の CSS は `src/index.css` で一度だけ import しています。ページから再度 import しません。カスタムノードは `NodeProps` を受け取る React コンポーネントです。
- トーストは `gooey-toast` の `mountToaster` と `toast` です。見本は `src/app/gooey-toast/page.tsx` です。
- `"use client"` は Next.js 向けの記述で、この Vite アプリでは何もしません。同じ種類の既存ファイルに付いている場合はそのままにします。

## PR を開く前に通すコマンド

CI（`.github/workflows/ci.yml`）の必須ジョブと同じです。失敗したまま PR を開きません。

```bash
npm ci
npm run lint     # eslint .
npm run build    # tsc -b && vite build
npm run knip     # 未使用の export・依存・ファイル
```

ジョブ名は `lint`、`build`、`knip` です。Node.js は 22、依存関係は `npm ci`、npm キャッシュ付きです。

開発と画面確認:

```bash
npm run dev       # http://127.0.0.1:5173
npm run preview   # 本番ビルドの確認。既定ポート 4173
```

CI の `screenshots` ジョブは、各ページの PNG を artifact `page-screenshots` として残します。これはレビューの補助です。UI を変えた PR では、下の「PR の規約」どおり、エージェントが本文へ画像を埋め込みます。同じ撮り方を手元で行う場合:

```bash
npx playwright install chromium
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
# 別ターミナル
npm run screenshots   # screenshots/*.png
```

`screenshots` ジョブはそのまま残します。ブランチ保護の必須チェックには `lint` / `build` / `knip` を使います。テストスイートはまだありません。

## PR の規約

- **1 PR につき 1 デザイン。** 関係のないリファクタや依存の更新を混ぜません。
- 対応する issue を本文で閉じます。`Closes #n` と書きます。
- 参照した X の投稿 URL と投稿者（`@handle`）を本文に書きます。
- **UI を変更または追加した PR を開くときも、更新するときも、エージェント自身がスクリーンショットを撮って PR 本文に埋め込む。**
  - 対象は、その PR で変わったページと追加したページ。ページごとに 1 枚、短いキャプションを付ける。
  - 開発サーバー（`npm run dev`、`http://127.0.0.1:5173`）かプレビュー（`npm run preview`、`http://127.0.0.1:4173`）を Playwright で開く。
  - ビューポートはデスクトップ（1280×800）。見出しやチャートなど、そのページの内容が描画されてから撮る。
  - 画像は PR 本文に直接置く。CI の `screenshots` ジョブが残す artifact `page-screenshots` は補助であり、本文の画像の代わりにはしない。
  - UI 以外のファイルだけを変更する PR では、スクリーンショットを省いてよい。
- タイトルは、追加するデザインが分かる名前にします。

## 出典とライセンス

リポジトリは MIT で公開しています。

- X で見たデザインは、投稿のコード、SVG、画像、CSS を貼らず、このリポジトリのスタックで見た目を実装し直します。
- 第三者のコードやライブラリを入れるときは、MIT と両立するライセンスのものに限ります。PR 本文にパッケージ名とライセンス名を書きます。
- 元にした投稿をクレジットします。投稿 URL と投稿者を PR 本文に残します。ページ内のコメントに残す場合も、同じ URL と投稿者を書きます。

ライセンスが不明なもの、MIT と両立しないものは依存に追加しません。

## 実行環境

### 共通

- 依存関係は `npm ci` で入れます。`package-lock.json` は手で編集しません。
- Node.js から開発サーバーへ接続するときは `localhost` ではなく **`127.0.0.1`** を使います。
- ブラウザ自動操作は Linux の Chromium（Playwright）で行います。

### クラウド上の Linux VM

- 下記「ローカル環境（WSL2）」の Windows Chrome、`/mnt/c/.../chrome.exe`、mirrored ネットワーク、CDP 手順は使いません。
- 画面確認は `npm run build` のあと `npm run preview -- --host 127.0.0.1 --port 4173` を使い、Playwright の headless Chromium で開きます。CI の `screenshots` ジョブが同じことをします。
- 開発サーバーはポート `5173`、プレビューはポート `4173` です。

### ローカル環境（WSL2）

ここから下は、オーナーの手元（WSL2）だけで使う情報です。クラウド VM では使いません。

#### 実行環境

- **OS**: WSL2（Linux カーネル）
- **ネットワーク**: `networkingMode=mirrored` — WSL2 と Windows でネットワークインターフェースを共有。  
  WSL2 内の `localhost` は Windows 側の `localhost` と同一のため、ポートをそのまま参照できます。
- **Chrome**: Windows 側にインストール済み。WSL2 interop 経由で実行可能。  
  パス: `/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`

#### 開発サーバー

```bash
npm run dev   # http://localhost:5173 で起動
```

mirrored モードのため、WSL2 内で起動したサーバーは Windows ブラウザからも同じ URL でアクセスできます。

#### Playwright MCP

`.github/mcp.json` に設定済みです。WSL2 側にインストールされた Linux Chromium を使用します。

##### インストール済みブラウザ

`npx playwright install chromium` 実行済み。以下が `~/.cache/ms-playwright/` に存在します。

- `chromium-*` — フル Chromium（MCP サーバーが使用）
- `chromium_headless_shell-*` — ヘッドレスシェル（Node.js スクリプトが使用）
- `mcp-chrome` — Playwright MCP 専用 Chrome

##### Playwright MCP の使い方

`.github/mcp.json` に設定済みのため、GitHub Copilot CLI セッション起動時に自動的に MCP サーバーが立ち上がります。
`browser_navigate` / `browser_screenshot` / `browser_click` などのツールとして利用できます。

##### Node.js スクリプトからスクリーンショットを撮る

###### 方法 A: Linux Chromium ヘッドレスシェル（シンプル）

```js
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:5173/');  // ※ localhost ではなく 127.0.0.1 を使う
await page.screenshot({ path: 'screenshot.png' });
await browser.close();
```

> ⚠️ `localhost` は Node.js から解決できない場合があるため、**`127.0.0.1` を使うこと**。

###### 方法 B: Windows Chrome（CDP 経由）

`--executable-path` で Windows Chrome を直接 Playwright から起動しようとすると、
WSL2 とのプロセス境界で `--remote-debugging-pipe` のファイルディスクリプタが共有できず失敗する。
代わりに Chrome を先に CDP ポートで起動し、`connectOverCDP` で接続する。

```bash
# 1. Windows Chrome を CDP ポートで起動（WSL2 から実行可能）
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port=9222 --headless=new --no-first-run &
sleep 3
```

```js
// 2. Node.js から CDP で接続
import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://localhost:9222');
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
await page.goto('http://127.0.0.1:5173/');
await page.screenshot({ path: 'screenshot.png' });
await context.close();
await browser.close();
```

##### 使用上の注意

| 事項 | 内容 |
|---|---|
| `localhost` vs `127.0.0.1` | Node.js から dev server に接続する際は `127.0.0.1` を使う（`localhost` は WSL2 の mirrored 環境で解決できないことがある） |
| Windows Chrome の直接起動 | `--executable-path` による直接 Playwright 起動は ❌。CDP 経由（方法 B）を使うこと |
| MCP サーバー用ブラウザ | Linux Chromium（インストール済み）を自動的に使用するため追加設定不要 |
| Chrome の実行コンテキスト | Windows プロセスとして起動する（Linux バイナリではない） |
