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

`.github/mcp.json` に設定済みです。Windows Chrome を実行ファイルとして利用します。

### Chrome が WSL2 から起動できるか確認

```bash
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --version
```

### 使用上の注意

| 事項 | 内容 |
|---|---|
| Chrome の実行コンテキスト | Windows プロセスとして起動する（Linux バイナリではない） |
| ファイルパス | Chrome に渡すパスは Windows 形式（`C:\...`）が必要な場合がある |
| localhost 疎通 | mirrored モードのため `http://localhost:5173` はそのまま動作する |
| DevTools ポート | Chrome が Windows 側で開くため、WSL2 から mirrored 経由で接続される |

### Playwright ブラウザが未インストールの場合

Windows Chrome を使う設定（`mcp.json` の `--executable-path`）が効かない場合は、WSL2 側に Playwright ブラウザをインストールしてください。

```bash
npx playwright install chromium
```
