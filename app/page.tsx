'use client';

import { useState } from 'react';
import { MyWidget } from '@/index';
import manifest from '@/manifest.json';
import type { WidgetInstance, WidgetTheme, Size } from '@ssportal/types';

/** 1グリッドのピクセルサイズ */
const GRID_SIZE = 120;
const GAP = 16;

function createWidgetInstance(
  size: Size,
  theme: WidgetTheme,
  index: number
): WidgetInstance {
  return {
    id: `preview-${index}`,
    type: manifest.id,
    position: { x: 0, y: 0 },
    size,
    config: {
      ...manifest.defaultConfig,
      theme,
    },
  };
}

export default function PreviewPage() {
  const [theme, setTheme] = useState<WidgetTheme>('dark');

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-8`}>
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{manifest.name}</h1>
        <p className="text-sm opacity-70">{manifest.description}</p>
        <p className="text-xs opacity-50 mt-1">
          v{manifest.version} by {manifest.author.name}
        </p>
      </div>

      {/* テーマ切り替え */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setTheme('dark')}
          className={`px-4 py-2 rounded ${
            theme === 'dark'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('light')}
          className={`px-4 py-2 rounded ${
            theme === 'light'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          Light
        </button>
      </div>

      {/* サイズ別プレビュー */}
      <div className="space-y-8">
        {manifest.availableSizes.map((size, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-4">
              {size.width} x {size.height}
            </h2>
            <div
              style={{
                width: size.width * GRID_SIZE + (size.width - 1) * GAP,
                height: size.height * GRID_SIZE + (size.height - 1) * GAP,
              }}
              className="rounded-lg overflow-hidden border border-white/20"
            >
              <MyWidget widget={createWidgetInstance(size, theme, index)} />
            </div>
          </div>
        ))}
      </div>

      {/* 設定プレビュー（将来用） */}
      <div className="mt-12 pt-8 border-t border-white/20">
        <h2 className="text-lg font-semibold mb-4">manifest.json</h2>
        <pre className="text-xs bg-black/30 p-4 rounded overflow-auto">
          {JSON.stringify(manifest, null, 2)}
        </pre>
      </div>
    </div>
  );
}
