# SSPortal ウィジェット開発

このリポジトリはSSPortalウィジェットを開発するためのテンプレートです。

---

## 必読ドキュメント

**ウィジェット実装前に必ず読むこと:**

- **内部開発（ss_portal内で複製した場合）**: `../WIDGET_RULES.md`
- **外部開発（GitHubからクローンした場合）**: https://github.com/IN-VISIBLE-INC/ss_portal/blob/master/web/src/components/widgets/WIDGET_RULES.md

---

## 開発ルール

### 編集するファイル

```
src/
├── index.tsx       ← ウィジェット本体を実装
├── config.tsx      ← 設定UIを実装
└── manifest.json   ← メタデータを編集
```

### 編集禁止

```
@ssportal/          ← SDK（編集禁止）
app/                ← プレビュー用（編集不要）
```

---

## プレビュー

ウィジェットをブラウザでプレビューできます。

```bash
npm install
npm run dev
# http://localhost:3001 でプレビュー
```

プレビュー画面では:
- 全サイズパターンを同時表示
- ライト/ダークテーマ切り替え
- manifest.json の内容確認

---

## import パス

```tsx
// index.tsx
import { WidgetWrapper, getThemeColors } from '@ssportal/WidgetWrapper';
import { WidgetProps, WidgetTheme } from '@ssportal/types';

// config.tsx
import { useConfigStore } from '@ssportal/hooks';
import { WidgetInstance, WidgetTheme } from '@ssportal/types';
import { WidgetThemeConfig } from '@ssportal/WidgetThemeConfig';
```

---

## 実装フロー

1. WIDGET_RULES.md を読む（上記リンク参照）
2. `src/manifest.json` を編集（id, name, availableSizes等）
3. `src/index.tsx` を実装
4. `npm run dev` でプレビュー確認
5. `src/config.tsx` を実装
6. ライト/ダーク両モードで動作確認

---

## 注意事項

- `'use client'` をファイル先頭に必ず付ける
- `WidgetWrapper` で必ず囲む
- `getThemeColors(theme)` でテーマ色を取得
- ハードコードされた色（`text-white`等）は使用禁止
- ライト/ダークモード両方で視認性を確認
