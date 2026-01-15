'use client';

/**
 * マイウィジェット - 設定パネル
 *
 * TODO: このファイルを編集して設定UIを実装してください。
 * 実装ルールは docs/WIDGET_RULES.md を参照してください。
 */

import { useConfigStore } from '@ssportal/hooks';
import { WidgetConfigProps, WidgetTheme } from '@ssportal/types';
import { WidgetThemeConfig } from '@ssportal/WidgetThemeConfig';

export function MyWidgetConfig({ widget }: WidgetConfigProps) {
  const { updateWidgetConfig } = useConfigStore();

  // 設定の型を定義
  const config = widget.config as {
    theme?: WidgetTheme;
    // TODO: ウィジェット固有の設定を追加
    // myOption?: string;
  };

  return (
    <div className="space-y-4">
      {/* テーマ設定（必須） */}
      <WidgetThemeConfig widgetId={widget.id} theme={config.theme || 'dark'} />

      {/* TODO: ウィジェット固有の設定を追加 */}
      {/*
      <div>
        <label className="text-sm text-gray-400">オプション</label>
        <input
          type="text"
          className="w-full mt-1 p-2 bg-gray-700 rounded-lg"
          value={config.myOption || ''}
          onChange={(e) => updateWidgetConfig(widget.id, { myOption: e.target.value })}
        />
      </div>
      */}
    </div>
  );
}
