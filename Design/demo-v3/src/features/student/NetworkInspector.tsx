import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { CHAPTER_THEMES, InspectorLayer } from '../../data/inspectorData';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';

interface NetworkInspectorProps {
  chapterId: string;
}

function renderRecursiveLayers(
  layers: InspectorLayer[],
  index: number,
  activeIdx: number,
  color: string,
  coreTitle: string,
  coreSub: string,
  onSelect: (idx: number) => void,
): React.ReactNode {
  const layer = layers[index];
  const isActive = activeIdx === index;
  const inner =
    index + 1 < layers.length ? (
      renderRecursiveLayers(layers, index + 1, activeIdx, color, coreTitle, coreSub, onSelect)
    ) : (
      <div
        className="min-h-[82px] flex flex-col items-center justify-center gap-1 p-3 rounded border border-dashed text-center bg-[#04080f]/60"
        style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}
      >
        <strong className="display-font text-base sm:text-lg text-[#f3f6fc] tracking-wider">{coreTitle}</strong>
        <small className="mono text-[10px] text-[#94a4ba]">{coreSub}</small>
      </div>
    );

  return (
    <div
      key={layer.name}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onSelect(index);
        }
      }}
      className={`inspect-layer cursor-pointer ${isActive ? 'is-active' : ''}`}
      style={{ '--layer': color } as React.CSSProperties}
    >
      <div className="absolute top-1.5 left-2.5 right-2.5 flex items-baseline justify-between gap-2 pointer-events-none">
        <span className="flex items-baseline gap-2 min-w-0">
          <code className="mono text-[10px] font-extrabold truncate" style={{ color }}>
            {layer.label}
          </code>
          <small className="text-[8px] font-extrabold uppercase tracking-wider text-[#9aa9be] hidden sm:inline">
            {layer.name}
          </small>
        </span>
        <span className="mono text-[9px] text-[#dce5f1] shrink-0">{layer.value}</span>
      </div>
      {inner}
    </div>
  );
}

export const NetworkInspector: React.FC<NetworkInspectorProps> = ({ chapterId }) => {
  const { addToast } = useApp();
  const theme = CHAPTER_THEMES[chapterId] ?? CHAPTER_THEMES['ch-1'];
  const [activeIdx, setActiveIdx] = useState(0);
  const [seenIndices, setSeenIndices] = useState<number[]>([0]);

  const selectLayer = (idx: number) => {
    setActiveIdx(idx);
    setSeenIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  const activeLayer = theme.layers[activeIdx] ?? theme.layers[0];

  return (
    <div
      className="mt-6 overflow-hidden border border-[#2b3951] rounded-2xl bg-[#080e19]"
      style={{ '--hero': theme.color, '--hero-rgb': theme.rgb } as React.CSSProperties}
    >
      {/* Inspector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 border-b border-[#27344b] bg-[#101929]">
        <div className="flex items-center gap-2.5 text-[11px] font-black tracking-[0.1em] uppercase text-[#f3f6fc]">
          <span className="live-dot" aria-hidden="true" />
          <span>{theme.inspectorTitle}</span>
        </div>
        <span className="text-[11px] text-[#98a7bd]">
          Nhấp hoặc dùng phím Tab để khám phá 4 tầng ({seenIndices.length}/4 đã xem)
        </span>
      </div>

      {/* Split Stage + Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 inspector-stage p-5">
          <div className="flex justify-between mb-3 text-[#75859e] text-[9px] font-extrabold tracking-[0.12em] uppercase">
            <span>NETWIZ // Nested Architecture</span>
            <span>4 layers</span>
          </div>
          {renderRecursiveLayers(
            theme.layers,
            0,
            activeIdx,
            theme.color,
            theme.coreTitle,
            theme.coreSub,
            selectLayer,
          )}
        </div>

        <aside className="lg:col-span-5 flex flex-col border-t lg:border-t-0 lg:border-l border-[#2b3951] bg-[#0e1625]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#27344b]">
            <div className="flex gap-1.5" aria-hidden="true">
              <i className="w-2 h-2 rounded-full bg-[#ef6464]" />
              <i className="w-2 h-2 rounded-full bg-[#e5bc4e]" />
              <i className="w-2 h-2 rounded-full bg-[#4acb83]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-[0.08em] text-[#8495ae] mono">
              packet-trace.net
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            <div>
              <p className="text-[11px] font-black tracking-[0.11em] uppercase mb-1" style={{ color: theme.color }}>
                {activeLayer.name}
              </p>
              <p className="mono text-[11px] text-[#9eacc1] mb-3">{activeLayer.label}</p>
              <pre className="p-4 rounded-lg border border-[#26334a] bg-[#080e19] text-[#cbd8ea] mono text-xs leading-[1.7] overflow-x-auto whitespace-pre-wrap">
                <code>{activeLayer.code}</code>
              </pre>
              <p className="text-xs text-[#a9b7cb] leading-relaxed mt-3">{activeLayer.note}</p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#26334a]/70">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => {
                  navigator.clipboard?.writeText(activeLayer.code).catch(() => {});
                  addToast({ type: 'success', title: 'Đã sao chép đoạn cấu hình' });
                }}
              >
                Sao chép
              </Button>

              <div className="flex gap-1.5">
                {theme.layers.map((_, idx) => {
                  const seen = seenIndices.includes(idx);
                  const active = activeIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectLayer(idx)}
                      aria-label={`Xem lớp ${idx + 1}`}
                      className="w-6 h-6 rounded-full border text-[10px] font-black cursor-pointer transition-all"
                      style={{
                        borderColor: seen ? theme.color : '#34435a',
                        background: seen ? theme.color : 'transparent',
                        color: seen ? '#080c16' : '#8494aa',
                        boxShadow: active ? `0 0 0 3px rgba(${theme.rgb}, 0.25)` : undefined,
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
