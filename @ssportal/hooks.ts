/**
 * SSPortal ウィジェット SDK - Hooks
 *
 * このファイルは編集禁止です。
 * メインプロジェクト (ss_portal) で実際の実装に置き換えられます。
 *
 * 開発時はスタブとして機能します。
 */

/**
 * 設定ストアのインターフェース
 */
interface ConfigStore {
  updateWidgetConfig: (widgetId: string, config: Record<string, unknown>) => void;
}

/**
 * ウィジェット設定を更新するためのフック
 *
 * メインプロジェクトでは Zustand ストアに接続されます。
 * テンプレート開発時はコンソールログを出力するスタブです。
 */
export function useConfigStore(): ConfigStore {
  return {
    updateWidgetConfig: (widgetId: string, config: Record<string, unknown>) => {
      // 開発時スタブ: コンソールに出力
      console.log('[SDK Stub] updateWidgetConfig:', { widgetId, config });
    },
  };
}
