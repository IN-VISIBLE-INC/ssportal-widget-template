# SSPortal ウィジェット開発テンプレート

SSPortalのウィジェットを開発するためのテンプレートリポジトリです。

## クイックスタート

### 1. テンプレートをクローン

```bash
git clone https://github.com/IN-VISIBLE-INC/ssportal-widget-template.git my-widget
cd my-widget
rm -rf .git
git init
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. ドキュメントを読む

制作ルールを確認してください:
https://github.com/IN-VISIBLE-INC/ss_portal/blob/master/web/src/components/widgets/WIDGET_RULES.md

### 4. メタデータを編集

`src/manifest.json` を編集:

```json
{
  "id": "your_widget_id",
  "name": "ウィジェット名",
  "description": "説明",
  "version": "1.0.0",
  "author": { "name": "あなたの名前" },
  "category": "misc",
  "defaultSize": { "width": 2, "height": 2 },
  "availableSizes": [
    { "width": 2, "height": 2 }
  ],
  "defaultConfig": { "theme": "dark" }
}
```

### 5. ウィジェットを実装

- `src/index.tsx` - ウィジェット本体
- `src/config.tsx` - 設定パネルUI

### 6. プレビューで確認

```bash
npm run dev
# http://localhost:3001 でプレビュー
```

プレビュー画面では:
- 全サイズパターンを同時表示
- ライト/ダークテーマ切り替え
- manifest.json の内容確認

### 7. バージョン管理

```bash
git add .
git commit -m "feat: 初期実装"
git tag v1.0.0
git remote add origin https://github.com/your-org/ssportal-widget-your-name.git
git push -u origin main --tags
```

## ディレクトリ構造

```
.
├── CLAUDE.md           # Claude Code への指示
├── app/                # プレビュー用（編集不要）
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/                # 編集するファイル
│   ├── index.tsx       # ウィジェット本体
│   ├── config.tsx      # 設定パネルUI
│   └── manifest.json   # メタデータ
├── @ssportal/          # SDK（編集禁止）
├── package.json
└── tsconfig.json
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | プレビューサーバー起動 (localhost:3001) |
| `npm run build` | ビルド |
| `npm run typecheck` | 型チェック |
| `npm run lint` | Lint実行 |

## SSPortal への統合

1. ウィジェットリポジトリにタグを付けてプッシュ
2. SSPortal メンテナーに連絡（Issue or PR）
3. サブモジュールとして追加される

## ライセンス

MIT
