'use client';

/**
 * マイウィジェット
 *
 * TODO: このファイルを編集してウィジェットを実装してください。
 * 実装ルールは docs/WIDGET_RULES.md を参照してください。
 */

import { WidgetWrapper, getThemeColors } from '@ssportal/WidgetWrapper';
import { WidgetProps, WidgetTheme } from '@ssportal/types';

export function MyWidget({ widget }: WidgetProps) {
  // テーマを取得
  const theme = (widget.config.theme as WidgetTheme) || 'dark';
  const { textPrimary, textSecondary, textMuted } = getThemeColors(theme);

  // サイズに応じたレイアウト
  const isLarge = widget.size.width >= 4;

  return (
    <WidgetWrapper theme={theme}>
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        {/* メインコンテンツ */}
        <div className={`${textPrimary} ${isLarge ? 'text-2xl' : 'text-lg'} font-bold`}>
          ウィジェット名
        </div>

        {/* サブテキスト */}
        <div className={`${textSecondary} text-sm mt-2`}>
          サブテキスト
        </div>

        {/* 大サイズ時のみ表示 */}
        {isLarge && (
          <div className={`${textMuted} text-xs mt-4`}>
            追加情報
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
