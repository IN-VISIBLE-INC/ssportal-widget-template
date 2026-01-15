'use client';

import { useConfigStore } from './hooks';
import { WidgetTheme } from './types';

/**
 * SSPortal ウィジェット SDK - テーマ設定コンポーネント
 *
 * このファイルは編集禁止です。
 * メインプロジェクト (ss_portal) の実装と同期しています。
 */

interface WidgetThemeConfigProps {
  widgetId: string;
  theme: WidgetTheme;
}

/**
 * ウィジェット共通テーマ設定コンポーネント
 * すべてのウィジェット設定パネルで使用する
 */
export function WidgetThemeConfig({ widgetId, theme }: WidgetThemeConfigProps) {
  const { updateWidgetConfig } = useConfigStore();

  return (
    <div>
      <label className="text-sm text-gray-400">テーマ</label>
      <div className="flex gap-2 mt-2">
        <button
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-650'
          }`}
          onClick={() => updateWidgetConfig(widgetId, { theme: 'dark' })}
        >
          ダーク
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'bg-white text-gray-900'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-650'
          }`}
          onClick={() => updateWidgetConfig(widgetId, { theme: 'light' })}
        >
          ライト
        </button>
      </div>
    </div>
  );
}
