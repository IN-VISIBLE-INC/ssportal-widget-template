'use client';

import { ReactNode } from 'react';
import { WidgetTheme } from './types';

/**
 * SSPortal ウィジェット SDK - 共通ラッパー
 *
 * このファイルは編集禁止です。
 * メインプロジェクト (ss_portal) の実装と同期しています。
 */

interface WidgetWrapperProps {
  children: ReactNode;
  className?: string;
  theme?: WidgetTheme;
}

/**
 * ウィジェット共通ラッパー
 * 全ウィジェットで統一されたスタイルを適用
 * ライトモード/ダークモード対応（ウィジェット単位）
 */
export function WidgetWrapper({ children, className = '', theme = 'dark' }: WidgetWrapperProps) {
  const themeStyles = theme === 'light'
    ? 'bg-white/80 border-black/10'
    : 'bg-black/60 border-white/10';

  return (
    <div
      className={`
        w-full h-full
        ${themeStyles}
        backdrop-blur-md
        rounded-xl
        border
        overflow-hidden
        ${className}
      `}
      data-theme={theme}
    >
      {children}
    </div>
  );
}

/**
 * テーマに応じたテキストカラーを取得
 * @param theme ウィジェットのテーマ（config.themeから取得）
 */
export function getThemeColors(theme: WidgetTheme = 'dark') {
  return {
    theme,
    textPrimary: theme === 'light' ? 'text-gray-900' : 'text-white',
    textSecondary: theme === 'light' ? 'text-gray-600' : 'text-white/70',
    textMuted: theme === 'light' ? 'text-gray-400' : 'text-white/50',
    textAccent: theme === 'light' ? 'text-gray-500' : 'text-white/30',
  };
}
