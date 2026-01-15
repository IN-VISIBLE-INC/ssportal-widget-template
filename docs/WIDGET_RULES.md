# SSポータル ウィジェット制作ルール

**バージョン**: 1.4
**最終更新**: 2026-01-15

> **このドキュメントはウィジェット実装の完全な仕様書です。**
> Claude Code がこのファイルを読めば、正しくウィジェットを実装できるレベルを目指しています。

---

## 🚀 クイックスタート

### ウィジェット作成5ステップ

```
1. フォルダ作成
   └── widgets/base/ または widgets/plugins/ に作成

2. 必須ファイル作成
   ├── manifest.json  - メタデータ（サイズ、カテゴリ等）
   ├── index.tsx      - ウィジェット本体
   └── config.tsx     - 設定パネルUI

3. レジストリ登録
   ├── WidgetRegistry.tsx       - コンポーネント登録
   ├── WidgetConfigRegistry.tsx - 設定UI登録
   └── widgetManifests.ts       - manifest import追加

4. 動作確認
   ├── ライト/ダークモード両方で確認
   └── 全サイズパターンで確認

5. バージョン管理
   ├── manifest.json の version を設定
   └── git tag 付けて push（例: v1.0.0）
```

---

## 📁 ディレクトリ構造

```
widgets/
├── base/                    # 公式ウィジェット
│   ├── digital_clock/
│   ├── date_calendar/
│   ├── weather/
│   ├── rss_news/
│   ├── news_ticker/
│   ├── exchange_rate/
│   └── quote/
├── plugins/                 # サードパーティウィジェット
│   └── countdown_timer/
├── WidgetRegistry.tsx       # コンポーネント登録
├── WidgetConfigRegistry.tsx # 設定UI登録
├── widgetManifests.ts       # メタデータ集約
├── WidgetWrapper.tsx        # 共通ラッパー
└── WIDGET_RULES.md          # このファイル
```

### Base vs Plugins

| 項目 | base/ | plugins/ |
|------|-------|----------|
| **用途** | 公式標準ウィジェット | サードパーティ/外部製 |
| **開発者** | SSPortalチーム | 他ユーザー、コミュニティ |
| **リポジトリ命名** | `ssportal-widget-base-*` | `ssportal-widget-*` |
| **品質保証** | SSPortalチームが保守 | 作者が保守 |
| **採用方法** | 標準搭載 | PRまたはサブモジュール追加 |

---

## 📋 必須ファイル構成

```
widgets/[widget_name]/
├── manifest.json      # 必須: メタデータ
├── index.tsx          # 必須: ウィジェット本体
├── config.tsx         # 必須: 設定パネルUI
└── README.md          # 推奨: ドキュメント
```

---

## 📝 manifest.json 詳細

### 必須項目

```json
{
  "manifestVersion": "1.0",
  "id": "widget_id",
  "name": "表示名",
  "description": "説明",
  "version": "1.0.0",
  "author": { "name": "作者名" },
  "category": "time | weather | news | finance | misc",
  "defaultSize": { "width": 2, "height": 2 },
  "availableSizes": [
    { "width": 2, "height": 2 },
    { "width": 4, "height": 2 }
  ],
  "defaultConfig": { "theme": "dark" }
}
```

### フィールド説明

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `id` | ✅ | ウィジェット識別子（フォルダ名と同一） |
| `name` | ✅ | 表示名（日本語OK） |
| `description` | ✅ | 簡潔な説明 |
| `version` | ✅ | セマンティックバージョン（git tagと同期） |
| `category` | ✅ | `time` / `weather` / `news` / `finance` / `misc` |
| `defaultSize` | ✅ | 初期配置サイズ |
| `availableSizes` | ✅ | 選択可能なサイズ一覧 |
| `defaultConfig` | ✅ | 初期設定値（theme必須） |

---

## 💡 実装のコツ

### 参照すべき実装例

**新規ウィジェット作成時は、まず `base/digital_clock/` を読んで実装パターンを理解すること。**

```
web/src/components/widgets/base/digital_clock/
├── index.tsx      ← 時刻更新、Hydration対策、サイズ分岐の参考
├── config.tsx     ← 設定UIの参考
└── manifest.json  ← メタデータの参考
```

### import パス（重要）

**base/ または plugins/ 配下からの正しい import パス:**

```tsx
// index.tsx での import
import { WidgetWrapper, getThemeColors } from '../../WidgetWrapper';  // ← ../../ に注意
import { WidgetProps } from '../../WidgetRegistry';
import { WidgetTheme } from '@/types';

// config.tsx での import
import { useConfigStore } from '@/stores/configStore';
import { WidgetInstance, WidgetTheme } from '@/types';
import { WidgetThemeConfig } from '../../WidgetThemeConfig';  // ← ../../ に注意
```

### Next.js Hydrationエラー対策

**時刻やランダム値など、サーバーとクライアントで異なる値を扱う場合の必須パターン:**

```tsx
'use client';

import { useState, useEffect } from 'react';

export function MyWidget({ widget }: WidgetProps) {
  // 1. 初期値を null にする（サーバー/クライアント一致）
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // 2. クライアントサイドでのみ値を設定
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. null の間はプレースホルダー表示
  if (!time) {
    return (
      <WidgetWrapper theme={theme}>
        <div className={textMuted}>--:--</div>
      </WidgetWrapper>
    );
  }

  // 4. 値がセットされたら本来の表示
  return (
    <WidgetWrapper theme={theme}>
      <div className={textPrimary}>{time.toLocaleTimeString()}</div>
    </WidgetWrapper>
  );
}
```

### よくあるミスと対処法

| ミス | 症状 | 対処法 |
|-----|------|-------|
| `text-white` 直書き | ライトモードで見えない | `getThemeColors(theme)` を使う |
| import パス `../` | モジュール見つからない | base/配下からは `../../` を使う |
| useState初期値に動的値 | Hydrationエラー | null初期化 → useEffectで設定 |
| `'use client'` 忘れ | useState等が使えない | ファイル先頭に追加 |
| WidgetWrapper忘れ | スタイル崩れ | 必ずWidgetWrapperで囲む |
| theme prop忘れ | テーマ切替が効かない | `<WidgetWrapper theme={theme}>` |

---

## 📦 型定義

### 型定義の場所

型定義は `web/src/types/index.ts` に集約されています。

### 使用する主な型

```tsx
import { WidgetTheme, WidgetInstance, Size, Position } from '@/types';
```

| 型名 | 説明 | 定義 |
|------|------|------|
| `WidgetTheme` | テーマ | `'light' \| 'dark'` |
| `WidgetInstance` | ウィジェットインスタンス | `{ id, type, position, size, config }` |
| `Size` | サイズ | `{ width: number, height: number }` |
| `Position` | 位置 | `{ x: number, y: number }` |
| `WidgetCategory` | カテゴリ | `'time' \| 'weather' \| 'news' \| 'finance' \| 'misc'` |

### WidgetProps（WidgetRegistry.tsx で定義）

```tsx
import { WidgetProps } from '../../WidgetRegistry';

// WidgetProps の定義
interface WidgetProps {
  widget: WidgetInstance;
  isEditing?: boolean;
}
```

### config の型定義パターン

```tsx
// config.tsx で config の型を明示的に定義
const config = widget.config as {
  theme?: WidgetTheme;
  myOption1?: string;
  myOption2?: number;
  // ... ウィジェット固有の設定
};
```

---

## 🎨 実装ルール

### 1. テーマ対応（ライトモード / ダークモード）

**すべてのウィジェットは必ずライト/ダーク両モードに対応すること。**

テーマ設定はウィジェット単位で行う（グローバル設定ではない）。

#### index.tsx の実装方法

```tsx
import { WidgetWrapper, getThemeColors } from '../../WidgetWrapper';
import { WidgetProps } from '../../WidgetRegistry';
import { WidgetTheme } from '@/types';

export function MyWidget({ widget }: WidgetProps) {
  // ウィジェット単位のテーマを取得
  const theme = (widget.config.theme as WidgetTheme) || 'dark';
  const { textPrimary, textSecondary, textMuted, textAccent } = getThemeColors(theme);

  return (
    <WidgetWrapper theme={theme}>
      <div className={textPrimary}>メインテキスト</div>
      <div className={textSecondary}>セカンダリテキスト</div>
      <div className={textMuted}>控えめなテキスト</div>
    </WidgetWrapper>
  );
}
```

#### config.tsx の実装方法

```tsx
import { useConfigStore } from '@/stores/configStore';
import { WidgetInstance, WidgetTheme } from '@/types';
import { WidgetThemeConfig } from '../../WidgetThemeConfig';

interface MyWidgetConfigProps {
  widget: WidgetInstance;
}

export function MyWidgetConfig({ widget }: MyWidgetConfigProps) {
  const { updateWidgetConfig } = useConfigStore();
  const config = widget.config as {
    theme?: WidgetTheme;
    // ... 他の設定
  };

  return (
    <div className="space-y-4">
      {/* テーマ設定は必ず最初に配置 */}
      <WidgetThemeConfig widgetId={widget.id} theme={config.theme || 'dark'} />

      {/* 他の設定項目 */}
    </div>
  );
}
```

#### テーマカラー一覧

| 変数名 | ライトモード | ダークモード | 用途 |
|--------|-------------|-------------|------|
| `textPrimary` | `text-gray-900` | `text-white` | メインテキスト |
| `textSecondary` | `text-gray-600` | `text-white/70` | サブテキスト |
| `textMuted` | `text-gray-400` | `text-white/50` | 控えめなテキスト |
| `textAccent` | `text-gray-500` | `text-white/30` | アクセント・装飾 |

#### WidgetWrapperの自動スタイル

| テーマ | 背景 | ボーダー |
|--------|------|---------|
| ライト | `bg-white/80` | `border-black/10` |
| ダーク | `bg-black/60` | `border-white/10` |

#### 色の直接指定について

**NG例（ハードコードされた色）:**
```tsx
// 絶対に避ける
<div className="text-white">...</div>
<div className="text-black">...</div>
<div style={{ color: '#ffffff' }}>...</div>
```

**OK例（テーマ対応）:**
```tsx
const theme = (widget.config.theme as WidgetTheme) || 'dark';
const { textPrimary, textSecondary } = getThemeColors(theme);
<div className={textPrimary}>...</div>
<div className={textSecondary}>...</div>
```

#### 特殊な色（曜日カラー等）

曜日など特殊な意味を持つ色は、テーマに応じて濃度を調整：

```tsx
const theme = (widget.config.theme as WidgetTheme) || 'dark';
const sundayColor = theme === 'light' ? 'text-red-600' : 'text-red-400';
const saturdayColor = theme === 'light' ? 'text-blue-600' : 'text-blue-400';
```

---

### 2. WidgetWrapper必須

すべてのウィジェットは `WidgetWrapper` で囲み、`theme` propを渡すこと。

```tsx
import { WidgetWrapper, getThemeColors } from '../../WidgetWrapper';
import { WidgetTheme } from '@/types';

export function MyWidget({ widget }: WidgetProps) {
  const theme = (widget.config.theme as WidgetTheme) || 'dark';

  return (
    <WidgetWrapper theme={theme}>
      {/* ウィジェットコンテンツ */}
    </WidgetWrapper>
  );
}
```

**WidgetWrapperが提供する機能:**
- 統一されたデザイン（角丸、ブラー、ボーダー）
- テーマ対応の背景色
- オーバーフロー制御

---

### 3. 設定コンポーネント必須

すべてのウィジェットは `config.tsx` を用意し、`WidgetThemeConfig` を含めること。

---

### 4. サイズ対応

ウィジェットは `availableSizes` で定義した複数サイズでの表示に対応すること。

```tsx
export function MyWidget({ widget }: WidgetProps) {
  const theme = (widget.config.theme as WidgetTheme) || 'dark';
  const isLarge = widget.size.width >= 4;
  const isSmall = widget.size.width < 3;

  return (
    <WidgetWrapper theme={theme}>
      {isLarge ? (
        <LargeLayout />
      ) : isSmall ? (
        <SmallLayout />
      ) : (
        <MediumLayout />
      )}
    </WidgetWrapper>
  );
}
```

---

### 5. 命名規則

| 項目 | 規則 | 例 |
|------|------|-----|
| フォルダ名 | スネークケース | `digital_clock`, `rss_news` |
| コンポーネント名 | パスカルケース + Widget | `DigitalClockWidget` |
| 設定コンポーネント名 | パスカルケース + Config | `DigitalClockConfig` |
| ウィジェットID | フォルダ名と同一 | `digital_clock` |

---

## 🔗 登録方法

ウィジェットを追加したら、以下の3ファイルに登録すること。

### 1. WidgetRegistry.tsx（コンポーネント登録）

```tsx
import { MyWidget } from './base/my_widget';

const WIDGET_COMPONENTS: Record<string, ComponentType<WidgetProps>> = {
  // ... 既存ウィジェット
  my_widget: MyWidget,
};
```

### 2. WidgetConfigRegistry.tsx（設定UI登録）

```tsx
import { MyWidgetConfig } from './base/my_widget/config';

const CONFIG_COMPONENTS: Record<string, ComponentType<WidgetConfigProps>> = {
  // ... 既存ウィジェット
  my_widget: MyWidgetConfig,
};
```

### 3. widgetManifests.ts（メタデータ登録）

manifest.json を import すると、自動的にウィジェット一覧に反映されます。

```tsx
// Base widgets
import myWidgetManifest from './base/my_widget/manifest.json';

const allManifests = [
  // ... 既存
  myWidgetManifest,
];
```

---

## 🔀 Git サブモジュール管理

### 概要

すべてのウィジェット（Base/Plugin両方）は独立したGitリポジトリとして管理し、
メインプロジェクトからgit submoduleとして参照する。

### リポジトリ命名規則

| 種別 | パターン | 例 |
|------|---------|-----|
| Base | `ssportal-widget-base-[id]` | `ssportal-widget-base-digital-clock` |
| Plugin | `ssportal-widget-[id]` | `ssportal-widget-countdown-timer` |

### バージョン管理ルール（必須）

1. **タグ必須**: リリース時は必ずセマンティックバージョンでタグを付ける
   - 例: `v1.0.0`, `v1.1.0`, `v2.0.0`

2. **manifest.jsonとタグの同期**: manifest.jsonのversionとタグは一致させる

3. **メインプロジェクトでの参照**: 特定タグを指定してサブモジュール追加
   ```bash
   git submodule add -b v1.0.0 https://github.com/org/ssportal-widget-xxx.git web/src/components/widgets/base/xxx
   ```

### 新規ウィジェット追加手順

1. 新規リポジトリ作成（命名規則に従う）
2. manifest.json, index.tsx, config.tsx を実装
3. タグを付けてpush
   ```bash
   git tag v1.0.0 && git push --tags
   ```
4. メインプロジェクトにサブモジュール追加
5. WidgetRegistry.tsx に登録
6. WidgetConfigRegistry.tsx に登録
7. widgetManifests.ts に manifest import 追加

### サブモジュール更新手順

```bash
# 特定ウィジェットを最新タグに更新
cd web/src/components/widgets/base/digital_clock
git fetch --tags
git checkout v1.1.0
cd ../../../../..
git add web/src/components/widgets/base/digital_clock
git commit -m "feat: digital_clock v1.1.0に更新"
```

---

## ✅ チェックリスト

新しいウィジェットを作成する際のチェックリスト：

### ファイル作成
- [ ] `manifest.json` を作成し、必須項目を記入したか
- [ ] `index.tsx` を作成したか
- [ ] `config.tsx` を作成したか

### 実装
- [ ] `WidgetWrapper` で囲み、`theme` propを渡しているか
- [ ] `widget.config.theme` からテーマを取得しているか
- [ ] `getThemeColors(theme)` でテーマ色を取得しているか
- [ ] ハードコードされた色（`text-white`, `#ffffff` 等）を使用していないか
- [ ] ライトモードで視認性を確認したか
- [ ] ダークモードで視認性を確認したか
- [ ] `availableSizes` の全サイズパターンで表示を確認したか
- [ ] `config.tsx` に `WidgetThemeConfig` を含めたか

### 登録
- [ ] `WidgetRegistry.tsx` にコンポーネント登録したか
- [ ] `WidgetConfigRegistry.tsx` に設定UI登録したか
- [ ] `widgetManifests.ts` に manifest import 追加したか

### バージョン管理
- [ ] `manifest.json` の `version` を設定したか
- [ ] git tag を付けたか（例: `v1.0.0`）

---

## ⌨️ キーボードショートカット

設定画面（/config）では以下のキーボードショートカットが使用可能：

| ショートカット | 動作 |
|--------------|------|
| Delete / Backspace | 選択中ウィジェット削除 |
| Cmd/Ctrl + D | ウィジェット複製 |
| 矢印キー | グリッド移動（1セル単位） |
| Cmd/Ctrl + Z | 元に戻す |
| Cmd/Ctrl + Shift + Z | やり直す |

**注意**: 入力フィールド（input/textarea/select）にフォーカス中はショートカット無効

---

## 📚 サンプルコード

### 完全なウィジェット実装例

```tsx
// widgets/base/sample_widget/index.tsx
'use client';

import { WidgetWrapper, getThemeColors } from '../../WidgetWrapper';
import { WidgetProps } from '../../WidgetRegistry';
import { WidgetTheme } from '@/types';

export function SampleWidget({ widget }: WidgetProps) {
  const theme = (widget.config.theme as WidgetTheme) || 'dark';
  const { textPrimary, textSecondary, textMuted } = getThemeColors(theme);

  const isLarge = widget.size.width >= 4;

  return (
    <WidgetWrapper theme={theme}>
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className={`${textPrimary} ${isLarge ? 'text-2xl' : 'text-lg'} font-bold`}>
          タイトル
        </div>
        <div className={`${textSecondary} text-sm mt-2`}>
          サブテキスト
        </div>
        {isLarge && (
          <div className={`${textMuted} text-xs mt-4`}>
            追加情報（大サイズ時のみ表示）
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
```

```tsx
// widgets/base/sample_widget/config.tsx
'use client';

import { useConfigStore } from '@/stores/configStore';
import { WidgetInstance, WidgetTheme } from '@/types';
import { WidgetThemeConfig } from '../../WidgetThemeConfig';

interface SampleWidgetConfigProps {
  widget: WidgetInstance;
}

export function SampleWidgetConfig({ widget }: SampleWidgetConfigProps) {
  const { updateWidgetConfig } = useConfigStore();
  const config = widget.config as {
    option1?: string;
    option2?: boolean;
    theme?: WidgetTheme;
  };

  return (
    <div className="space-y-4">
      {/* テーマ設定は必ず最初に配置 */}
      <WidgetThemeConfig widgetId={widget.id} theme={config.theme || 'dark'} />

      <div>
        <label className="text-sm text-gray-400">オプション1</label>
        <input
          type="text"
          className="w-full mt-1 p-2 bg-gray-700 rounded-lg"
          value={config.option1 || ''}
          onChange={(e) => updateWidgetConfig(widget.id, { option1: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">オプション2</label>
        <input
          type="checkbox"
          checked={config.option2 || false}
          onChange={(e) => updateWidgetConfig(widget.id, { option2: e.target.checked })}
        />
      </div>
    </div>
  );
}
```

```json
// widgets/base/sample_widget/manifest.json
{
  "manifestVersion": "1.0",
  "id": "sample_widget",
  "name": "サンプルウィジェット",
  "description": "ウィジェット作成のサンプル",
  "version": "1.0.0",
  "author": { "name": "SSPortal Team" },
  "category": "misc",
  "defaultSize": { "width": 2, "height": 2 },
  "availableSizes": [
    { "width": 2, "height": 2 },
    { "width": 4, "height": 2 }
  ],
  "defaultConfig": {
    "theme": "dark",
    "option1": "",
    "option2": false
  }
}
```

---

## 更新履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.4 | 2026-01-15 | 「実装のコツ」「型定義」セクション追加、importパス修正、Hydrationエラー対策追加、よくあるミス一覧追加 |
| 1.3 | 2026-01-15 | クイックスタート追加、base vs plugins説明追加、登録方法をwidgetManifests.ts対応に更新、チェックリスト充実 |
| 1.2 | 2026-01-15 | Gitサブモジュール管理ルール追加、manifest.json必須化、キーボードショートカット追加 |
| 1.1 | 2026-01-14 | テーマをウィジェット単位に変更。`getThemeColors(theme)` と `WidgetThemeConfig` を使用 |
| 1.0 | 2025-01-15 | 初版作成。テーマ対応ルールを追加 |
