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

### 2. ドキュメントを読む

```bash
# 必ず読んでください
cat docs/WIDGET_RULES.md
```

### 3. メタデータを編集

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

### 4. ウィジェットを実装

- `src/index.tsx` - ウィジェット本体
- `src/config.tsx` - 設定パネルUI

### 5. バージョン管理

```bash
git add .
git commit -m "feat: 初期実装"
git tag v1.0.0
git remote add origin https://github.com/your-org/your-widget.git
git push -u origin main --tags
```

## ディレクトリ構造

```
.
├── CLAUDE.md           # Claude Code への指示
├── docs/
│   └── WIDGET_RULES.md # 制作ルール（必読）
├── src/                # 編集するファイル
│   ├── index.tsx       # ウィジェット本体
│   ├── config.tsx      # 設定パネルUI
│   └── manifest.json   # メタデータ
├── @ssportal/          # SDK（編集禁止）
├── package.json
└── tsconfig.json
```

## SSPortal への統合

1. ウィジェットリポジトリにタグを付けてプッシュ
2. SSPortal メンテナーに連絡（Issue or PR）
3. サブモジュールとして追加される

## ライセンス

MIT
