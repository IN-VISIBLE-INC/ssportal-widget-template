/**
 * SSPortal ウィジェット SDK
 *
 * このパッケージは編集禁止です。
 * ウィジェット開発に必要な型・コンポーネントを提供します。
 */

// 型定義
export * from './types';

// コンポーネント
export { WidgetWrapper, getThemeColors } from './WidgetWrapper';
export { WidgetThemeConfig } from './WidgetThemeConfig';

// Hooks
export { useConfigStore } from './hooks';
