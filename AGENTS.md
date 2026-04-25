# AGENTS.md

AIエージェント向けの環境情報です。

## 実行環境

- **OS**: WSL2（Linux カーネル）
- **ネットワーク**: `networkingMode=mirrored` — WSL2 と Windows でネットワークインターフェースを共有。  
  WSL2 内の `localhost` は Windows 側の `localhost` と同一のため、ポートをそのまま参照できます。
- **Chrome**: Windows 側にインストール済み。WSL2 interop 経由で実行可能。  
  パス: `/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`

## 開発サーバー

```bash
npm run dev   # http://localhost:5173 で起動
```

mirrored モードのため、WSL2 内で起動したサーバーは Windows ブラウザからも同じ URL でアクセスできます。

## Playwright MCP

`.github/mcp.json` に設定済みです。WSL2 側にインストールされた Linux Chromium を使用します。

### インストール済みブラウザ

`npx playwright install chromium` 実行済み。以下が `~/.cache/ms-playwright/` に存在します。

- `chromium-*` — フル Chromium（MCP サーバーが使用）
- `chromium_headless_shell-*` — ヘッドレスシェル（Node.js スクリプトが使用）
- `mcp-chrome` — Playwright MCP 専用 Chrome

### Playwright MCP の使い方

`.github/mcp.json` に設定済みのため、GitHub Copilot CLI セッション起動時に自動的に MCP サーバーが立ち上がります。
`browser_navigate` / `browser_screenshot` / `browser_click` などのツールとして利用できます。

### Node.js スクリプトからスクリーンショットを撮る

#### 方法 A: Linux Chromium ヘッドレスシェル（シンプル）

```js
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:5173/');  // ※ localhost ではなく 127.0.0.1 を使う
await page.screenshot({ path: 'screenshot.png' });
await browser.close();
```

> ⚠️ `localhost` は Node.js から解決できない場合があるため、**`127.0.0.1` を使うこと**。

#### 方法 B: Windows Chrome（CDP 経由）

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

### 使用上の注意

| 事項 | 内容 |
|---|---|
| `localhost` vs `127.0.0.1` | Node.js から dev server に接続する際は `127.0.0.1` を使う（`localhost` は WSL2 の mirrored 環境で解決できないことがある） |
| Windows Chrome の直接起動 | `--executable-path` による直接 Playwright 起動は ❌。CDP 経由（方法 B）を使うこと |
| MCP サーバー用ブラウザ | Linux Chromium（インストール済み）を自動的に使用するため追加設定不要 |
| Chrome の実行コンテキスト | Windows プロセスとして起動する（Linux バイナリではない） |

