import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { CHAPTER_THEMES, ChapterVisualTheme } from '../../data/inspectorData';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';

interface NetworkInspectorProps {
  chapterId: string;
}

/* Ch.1: End-to-End Packet Switching & Delay Pipeline */
const PipelineVisualizer: React.FC<{
  theme: ChapterVisualTheme;
  activeIdx: number;
  onSelect: (idx: number) => void;
}> = ({ theme, activeIdx, onSelect }) => {
  const color = theme.color;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--stage-bg)] p-4">
        <svg viewBox="0 0 560 118" className="w-full h-auto" role="img" aria-label="Sơ đồ truyền gói tin từ Host nguồn qua Router đến Host đích">
          {/* Links */}
          <line
            x1="96" y1="54" x2="245" y2="54"
            stroke={activeIdx === 1 ? color : 'var(--line-strong)'}
            strokeWidth={activeIdx === 1 ? 3 : 2}
            className="net-flow-dash"
          />
          <line
            x1="325" y1="54" x2="464" y2="54"
            stroke={activeIdx === 3 ? 'var(--red)' : 'var(--line-strong)'}
            strokeWidth={activeIdx === 3 ? 3.5 : 2}
            className="net-flow-dash"
          />

          {/* Link Labels */}
          <text x="170" y="38" textAnchor="middle" fill={activeIdx === 1 ? color : 'var(--muted)'} fontSize="10" fontFamily="JetBrains Mono, monospace">
            6 Mbps (L/R = 2ms)
          </text>
          <text x="395" y="38" textAnchor="middle" fill={activeIdx === 3 ? 'var(--red-fg)' : 'var(--muted)'} fontSize="10" fontFamily="JetBrains Mono, monospace">
            10 Mbps Bottleneck
          </text>

          {/* Source Host */}
          <g onClick={() => onSelect(0)} className="cursor-pointer">
            <rect
              x="14" y="28" width="84" height="52" rx="8"
              fill={activeIdx === 0 ? `rgba(${theme.rgb}, 0.16)` : 'var(--stage-node)'}
              stroke={activeIdx === 0 ? color : 'var(--line-strong)'} strokeWidth={activeIdx === 0 ? 2 : 1.2}
            />
            <text x="56" y="50" textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="700">HOST A</text>
            <text x="56" y="66" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="JetBrains Mono, monospace">10.0.1.5</text>
          </g>

          {/* Router R1 + Queue */}
          <g onClick={() => onSelect(2)} className="cursor-pointer">
            <rect
              x="245" y="22" width="82" height="64" rx="10"
              fill={activeIdx === 2 ? `rgba(${theme.rgb}, 0.16)` : 'var(--stage-node)'}
              stroke={activeIdx === 2 ? color : 'var(--line-strong)'} strokeWidth={activeIdx === 2 ? 2 : 1.2}
            />
            <text x="286" y="42" textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="700">ROUTER R1</text>
            {/* Queue bar slots */}
            <rect x="258" y="52" width="12" height="10" rx="2" fill={color} />
            <rect x="273" y="52" width="12" height="10" rx="2" fill={color} />
            <rect x="288" y="52" width="12" height="10" rx="2" fill={color} opacity="0.55" />
            <rect x="303" y="52" width="12" height="10" rx="2" fill="var(--track)" />
            <text x="286" y="76" textAnchor="middle" fill="var(--muted)" fontSize="8.5" fontFamily="JetBrains Mono, monospace">Queue 48/64</text>
          </g>

          {/* Dest Host */}
          <g onClick={() => onSelect(3)} className="cursor-pointer">
            <rect
              x="462" y="28" width="84" height="52" rx="8"
              fill={activeIdx === 3 ? `rgba(${theme.rgb}, 0.16)` : 'var(--stage-node)'}
              stroke={activeIdx === 3 ? color : 'var(--line-strong)'} strokeWidth={activeIdx === 3 ? 2 : 1.2}
            />
            <text x="504" y="50" textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="700">HOST B</text>
            <text x="504" y="66" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="JetBrains Mono, monospace">10.0.9.8</text>
          </g>

          <text x="280" y="108" textAnchor="middle" fill="var(--muted)" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
            {theme.coreSub}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {theme.layers.map((layer, idx) => {
          const active = activeIdx === idx;
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(idx)}
              className={`net-stage-btn rounded-xl p-3 text-left cursor-pointer ${active ? 'is-active' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-[10px] font-extrabold uppercase tracking-wider" style={{ color }}>
                  0{idx + 1} · {layer.shortTag}
                </span>
                <span className="mono text-[10px] text-[var(--text)]">{layer.value}</span>
              </div>
              <div className="text-xs font-bold text-[var(--text)] mt-1">{layer.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* Ch.2: Interactive Topology Schematic */
const TopologyVisualizer: React.FC<{
  theme: ChapterVisualTheme;
  activeIdx: number;
  onSelect: (idx: number) => void;
}> = ({ theme, activeIdx, onSelect }) => {
  const color = theme.color;
  const activeId = theme.layers[activeIdx]?.id ?? 'bus';

  const renderGraph = () => {
    if (activeId === 'bus') {
      return (
        <svg viewBox="0 0 460 155" className="w-full h-auto" role="img" aria-label="Bus Topology">
          <line x1="50" y1="78" x2="410" y2="78" stroke={color} strokeWidth="3.5" />
          <rect x="34" y="70" width="16" height="16" rx="2" fill="var(--red)" />
          <rect x="410" y="70" width="16" height="16" rx="2" fill="var(--red)" />
          {[105, 195, 285, 365].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="78" x2={x} y2={i % 2 === 0 ? 36 : 120} stroke="var(--line-strong)" strokeWidth="2" />
              <circle cx={x} cy={i % 2 === 0 ? 28 : 128} r="15" fill="var(--stage-node)" stroke={color} strokeWidth="2" />
              <text x={x} y={i % 2 === 0 ? 32 : 132} textAnchor="middle" fill="var(--text)" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                N{i + 1}
              </text>
            </g>
          ))}
          <text x="230" y="100" textAnchor="middle" fill="var(--red-fg)" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
            Shared Coax Trunk (1 đứt gãy = sập toàn tuyến)
          </text>
        </svg>
      );
    }
    if (activeId === 'star') {
      const nodes = [
        { x: 110, y: 34, label: 'PC-1' },
        { x: 350, y: 34, label: 'PC-2' },
        { x: 110, y: 126, label: 'PC-3' },
        { x: 350, y: 126, label: 'PC-4' },
      ];
      return (
        <svg viewBox="0 0 460 155" className="w-full h-auto" role="img" aria-label="Star Topology">
          {nodes.map((n) => (
            <g key={n.label}>
              <line x1="230" y1="80" x2={n.x} y2={n.y} stroke={color} strokeWidth="2" className="net-flow-dash" />
              <rect x={n.x - 24} y={n.y - 14} width="48" height="28" rx="6" fill="var(--stage-node)" stroke="var(--line-strong)" strokeWidth="1.5" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill="var(--text)" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                {n.label}
              </text>
            </g>
          ))}
          <rect x="190" y="58" width="80" height="44" rx="8" fill={`rgba(${theme.rgb}, 0.2)`} stroke={color} strokeWidth="2" />
          <text x="230" y="78" textAnchor="middle" fill="var(--text)" fontSize="10" fontWeight="700">SWITCH</text>
          <text x="230" y="92" textAnchor="middle" fill={color} fontSize="8.5" fontFamily="JetBrains Mono, monospace">Central Hub</text>
        </svg>
      );
    }
    if (activeId === 'full-mesh') {
      const pts = [
        { x: 140, y: 30, label: 'R1' },
        { x: 320, y: 30, label: 'R2' },
        { x: 320, y: 125, label: 'R3' },
        { x: 140, y: 125, label: 'R4' },
      ];
      const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
      return (
        <svg viewBox="0 0 460 155" className="w-full h-auto" role="img" aria-label="Full Mesh Topology">
          {edges.map(([a, b], i) => (
            <line key={i} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} stroke={color} strokeWidth="1.8" opacity="0.85" />
          ))}
          {pts.map((p) => (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y} r="17" fill="var(--stage-node)" stroke={color} strokeWidth="2" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fill="var(--text)" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                {p.label}
              </text>
            </g>
          ))}
          <text x="230" y="149" textAnchor="middle" fill="var(--muted)" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
            N = 4 Router · 4(4-1)/2 = 6 Direct Links
          </text>
        </svg>
      );
    }
    /* spine-leaf */
    const spines = [165, 295];
    const leafs = [100, 230, 360];
    return (
      <svg viewBox="0 0 460 155" className="w-full h-auto" role="img" aria-label="Spine-Leaf Topology">
        {spines.map((sx) =>
          leafs.map((lx) => (
            <line key={`${sx}-${lx}`} x1={sx} y1="42" x2={lx} y2="112" stroke={color} strokeWidth="1.8" opacity="0.8" />
          )),
        )}
        {spines.map((sx, i) => (
          <g key={sx}>
            <rect x={sx - 38} y="16" width="76" height="28" rx="6" fill={`rgba(${theme.rgb}, 0.2)`} stroke={color} strokeWidth="1.8" />
            <text x={sx} y="34" textAnchor="middle" fill="var(--text)" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono, monospace">
              SPINE-{i + 1}
            </text>
          </g>
        ))}
        {leafs.map((lx, i) => (
          <g key={lx}>
            <rect x={lx - 34} y="110" width="68" height="28" rx="6" fill="var(--stage-node)" stroke="var(--green)" strokeWidth="1.6" />
            <text x={lx} y="128" textAnchor="middle" fill="var(--text)" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono, monospace">
              LEAF-{i + 1}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {theme.layers.map((layer, idx) => {
          const active = activeIdx === idx;
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(idx)}
              className={`net-stage-btn rounded-lg px-2.5 py-2 text-center cursor-pointer ${active ? 'is-active' : ''}`}
            >
              <div className="mono text-[10px] font-extrabold" style={{ color }}>{layer.shortTag}</div>
              <div className="text-[11px] text-[var(--text)] truncate mt-0.5">{layer.value}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--stage-bg)] p-4">
        {renderGraph()}
      </div>
    </div>
  );
};

/* Ch.3: OSI Encapsulation Flow + Horizontal Wire Frame Dissector */
const EncapsulationVisualizer: React.FC<{
  theme: ChapterVisualTheme;
  activeIdx: number;
  onSelect: (idx: number) => void;
}> = ({ theme, activeIdx, onSelect }) => {
  const color = theme.color;
  const wireSegments = [
    { idx: 3, title: 'L2 MAC Hdr', sub: '14B', basis: 'w-[18%]' },
    { idx: 2, title: 'L3 IP Hdr', sub: '20B', basis: 'w-[20%]' },
    { idx: 1, title: 'L4 TCP Hdr', sub: '20B', basis: 'w-[20%]' },
    { idx: 0, title: 'L7 HTTP / TLS Data', sub: 'Payload', basis: 'flex-1' },
    { idx: 3, title: 'FCS', sub: '4B', basis: 'w-[10%]' },
  ];

  return (
    <div className="space-y-4">
      {/* Vertical Encapsulation Stack */}
      <div className="space-y-2">
        {theme.layers.map((layer, idx) => {
          const active = activeIdx === idx;
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(idx)}
              className={`net-stage-btn w-full rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-left cursor-pointer ${active ? 'is-active' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="mono text-[10px] font-black px-2 py-0.5 rounded border shrink-0"
                  style={{ borderColor: `rgba(${theme.rgb}, 0.5)`, color }}
                >
                  {layer.shortTag}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text)] truncate">{layer.name}</div>
                  <div className="text-[11px] text-[var(--muted)] truncate">{layer.label}</div>
                </div>
              </div>
              <span className="mono text-[11px] font-bold text-[var(--text)] shrink-0">{layer.value}</span>
            </button>
          );
        })}
      </div>

      {/* Synchronized Horizontal Wire Frame */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--stage-bg)] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[10px] mono text-[var(--muted)]">
          <span>ON-THE-WIRE ETHERNET FRAME</span>
          <span>Click slice to inspect header</span>
        </div>
        <div className="flex items-stretch gap-1.5 overflow-x-auto pb-1">
          {wireSegments.map((seg, i) => {
            const active = activeIdx === seg.idx;
            return (
              <button
                key={`${seg.title}-${i}`}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(seg.idx)}
                className={`net-wire-seg ${seg.basis} min-w-[74px] rounded-lg px-2 py-2.5 text-center cursor-pointer ${active ? 'is-active' : ''}`}
              >
                <div className="mono text-[10px] font-extrabold text-[var(--text)] truncate">{seg.title}</div>
                <div className="mono text-[9px] mt-0.5" style={{ color: active ? color : '#8fa0b8' }}>{seg.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* Ch.4: TCP 3-Way Sequence Ladder + IPv4 /26 CIDR Address Block */
const HandshakeCidrVisualizer: React.FC<{
  theme: ChapterVisualTheme;
  activeIdx: number;
  onSelect: (idx: number) => void;
}> = ({ theme, activeIdx, onSelect }) => {
  const color = theme.color;
  const steps = [
    { idx: 0, dir: 'right', label: '1. [SYN] seq=1000', sub: 'Client → Server' },
    { idx: 1, dir: 'left', label: '2. [SYN-ACK] seq=5000, ack=1001', sub: 'Server → Client' },
    { idx: 2, dir: 'right', label: '3. [ACK] ack=5001 (ESTABLISHED)', sub: 'Client → Server' },
  ];

  return (
    <div className="space-y-4">
      {/* Sequence Diagram */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--stage-bg)] p-4 space-y-3">
        <div className="flex items-center justify-between text-[11px] mono font-bold text-[var(--text)] px-2">
          <span className="px-2.5 py-1 rounded bg-[var(--panel-2)] border border-[var(--line-strong)]">Client :51422</span>
          <span className="text-[var(--muted)] text-[10px]">TCP 3-WAY HANDSHAKE</span>
          <span className="px-2.5 py-1 rounded bg-[var(--panel-2)] border border-[var(--line-strong)]">Server :443</span>
        </div>

        <div className="space-y-2">
          {steps.map((st) => {
            const active = activeIdx === st.idx;
            return (
              <button
                key={st.idx}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(st.idx)}
                className={`net-stage-btn w-full rounded-lg px-3 py-2 flex items-center justify-between gap-2 cursor-pointer ${active ? 'is-active' : ''}`}
              >
                <span className="mono text-[10px] text-[var(--muted)]">{st.dir === 'right' ? '──▶' : '◀──'}</span>
                <span className="mono text-xs font-bold" style={{ color: active ? color : '#f3f6fc' }}>
                  {st.label}
                </span>
                <span className="mono text-[10px] text-[var(--muted)] hidden sm:inline">{st.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* IPv4 /26 CIDR Partition Bar */}
      <button
        type="button"
        aria-pressed={activeIdx === 3}
        onClick={() => onSelect(3)}
        className={`net-stage-btn w-full rounded-xl p-3.5 text-left space-y-2.5 cursor-pointer ${activeIdx === 3 ? 'is-active' : ''}`}
      >
        <div className="flex items-center justify-between text-[10px] mono">
          <span className="font-extrabold" style={{ color }}>CIDR BLOCK // 192.168.10.0/26</span>
          <span className="text-[var(--text)]">Mask 255.255.255.192</span>
        </div>
        <div className="flex gap-1.5 text-center mono text-[10px]">
          <div className="w-[18%] rounded bg-[var(--red-soft)] border border-[var(--red-border)] py-2 px-1 text-[var(--red-fg)]">
            .0<br /><span className="text-[9px]">Network</span>
          </div>
          <div className="flex-1 rounded bg-[var(--green-soft)] border border-[var(--green-border)] py-2 px-2 text-[var(--green-fg)] font-bold">
            .1 — .62<br /><span className="text-[9px] font-normal">62 Usable Hosts (2⁶ − 2)</span>
          </div>
          <div className="w-[18%] rounded bg-[var(--yellow-soft)] border border-[var(--yellow-border)] py-2 px-1 text-[var(--yellow-fg)]">
            .63<br /><span className="text-[9px]">Broadcast</span>
          </div>
        </div>
      </button>
    </div>
  );
};

/* Ch.5: Defense-in-Depth Security Gateway */
const SecurityPerimeterVisualizer: React.FC<{
  theme: ChapterVisualTheme;
  activeIdx: number;
  onSelect: (idx: number) => void;
}> = ({ theme, activeIdx, onSelect }) => {
  const color = theme.color;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--red-border)] bg-[var(--red-soft)] text-[11px] mono">
        <span className="text-[var(--red-fg)] font-bold">UNTRUSTED TRAFFIC</span>
        <span className="text-[var(--red-fg)]">MitM · SYN Flood · ARP Spoof ──▶</span>
      </div>

      <div className="space-y-2">
        {theme.layers.map((layer, idx) => {
          const active = activeIdx === idx;
          const isCore = idx === theme.layers.length - 1;
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(idx)}
              className={`net-stage-btn w-full rounded-xl p-3 flex items-center justify-between gap-3 text-left cursor-pointer ${active ? 'is-active' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: isCore ? '#45d483' : color }} />
                <div className="min-w-0">
                  <div className="mono text-[10px] font-extrabold uppercase" style={{ color }}>{layer.shortTag}</div>
                  <div className="text-xs font-bold text-[var(--text)] truncate">{layer.label}</div>
                </div>
              </div>
              <span className="mono text-[10px] px-2 py-1 rounded bg-[var(--panel-deep)] border border-[var(--line)] text-[var(--text)] shrink-0">
                {layer.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const NetworkInspector: React.FC<NetworkInspectorProps> = ({ chapterId }) => {
  const { addToast } = useApp();
  const theme = CHAPTER_THEMES[chapterId] ?? CHAPTER_THEMES['ch-1'];
  const [activeIdx, setActiveIdx] = useState(0);
  const [seenIndices, setSeenIndices] = useState<number[]>([0]);

  useEffect(() => {
    setActiveIdx(0);
    setSeenIndices([0]);
  }, [chapterId]);

  const selectLayer = (idx: number) => {
    setActiveIdx(idx);
    setSeenIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  const activeLayer = theme.layers[activeIdx] ?? theme.layers[0];
  const totalSteps = theme.layers.length;

  const renderStage = () => {
    switch (theme.mode) {
      case 'pipeline':
        return <PipelineVisualizer theme={theme} activeIdx={activeIdx} onSelect={selectLayer} />;
      case 'topology':
        return <TopologyVisualizer theme={theme} activeIdx={activeIdx} onSelect={selectLayer} />;
      case 'encapsulation':
        return <EncapsulationVisualizer theme={theme} activeIdx={activeIdx} onSelect={selectLayer} />;
      case 'handshake-cidr':
        return <HandshakeCidrVisualizer theme={theme} activeIdx={activeIdx} onSelect={selectLayer} />;
      case 'security-perimeter':
        return <SecurityPerimeterVisualizer theme={theme} activeIdx={activeIdx} onSelect={selectLayer} />;
    }
  };

  return (
    <div
      className="mt-6 overflow-hidden border border-[var(--line)] rounded-2xl bg-[var(--stage-bg)]"
      style={{ '--hero': theme.color, '--hero-rgb': theme.rgb } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 border-b border-[var(--line)] bg-[var(--panel-2)]">
        <div className="flex items-center gap-2.5 text-[11px] font-black tracking-[0.1em] uppercase text-[var(--text)]">
          <span className="live-dot" aria-hidden="true" />
          <span>{theme.inspectorTitle}</span>
        </div>
        <span className="text-[11px] text-[var(--muted)]">
          Chọn từng thành phần mạng để xem gói tin & CLI ({seenIndices.length}/{totalSteps} đã xem)
        </span>
      </div>

      {/* Split Schematic Stage + Protocol Telemetry Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 inspector-stage p-5">
          <div className="flex justify-between mb-3 text-[var(--muted)] text-[9px] font-extrabold tracking-[0.12em] uppercase mono">
            <span>{theme.stageBadge}</span>
            <span>{totalSteps} CHECKPOINTS</span>
          </div>
          {renderStage()}
        </div>

        <aside className="lg:col-span-5 flex flex-col border-t lg:border-t-0 lg:border-l border-[var(--line)] bg-[var(--panel-deep)]">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--line)] bg-[var(--panel-deep)]">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold text-[var(--muted)] mono truncate">
              <Terminal className="w-3.5 h-3.5 shrink-0" style={{ color: theme.color }} />
              <span className="truncate">{activeLayer.protocolPrompt}</span>
            </span>
            <span className="text-[10px] font-extrabold tracking-[0.08em] text-[var(--muted)] mono shrink-0">
              STEP 0{activeIdx + 1}/0{totalSteps}
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-black tracking-[0.11em] uppercase" style={{ color: theme.color }}>
                  {activeLayer.name}
                </p>
                <p className="mono text-[11px] text-[var(--muted)] mt-0.5">{activeLayer.label}</p>
              </div>

              {/* Telemetry Key-Value Strip */}
              <div className="grid grid-cols-3 gap-2">
                {activeLayer.telemetry.map((item) => (
                  <div key={item.key} className="rounded-lg border border-[var(--line)] bg-[var(--stage-bg)] px-2.5 py-2">
                    <div className="mono text-[9px] text-[var(--muted)] uppercase truncate">{item.key}</div>
                    <div className="mono text-[11px] font-bold text-[var(--text)] truncate mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>

              <pre className="p-3.5 rounded-lg border border-[var(--line)] bg-[var(--code-bg)] text-[var(--code-text)] mono text-xs leading-[1.65] overflow-x-auto whitespace-pre-wrap">
                <code>{activeLayer.code}</code>
              </pre>

              <p className="text-[13px] sm:text-sm text-[var(--text-body)] leading-relaxed">{activeLayer.note}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--line)]">
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={activeIdx === 0}
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={() => selectLayer(Math.max(0, activeIdx - 1))}
                >
                  Trước
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={activeIdx === totalSteps - 1}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => selectLayer(Math.min(totalSteps - 1, activeIdx + 1))}
                >
                  Tiếp
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                  onClick={() => {
                    navigator.clipboard?.writeText(activeLayer.code).catch(() => {});
                    addToast({ type: 'success', title: 'Đã sao chép lệnh & thông số mạng' });
                  }}
                >
                  Sao chép
                </Button>
                <div className="flex gap-1">
                  {theme.layers.map((_, idx) => {
                    const seen = seenIndices.includes(idx);
                    const active = activeIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectLayer(idx)}
                        aria-label={`Xem bước ${idx + 1}`}
                        className="w-6 h-6 rounded-full border text-[10px] font-black cursor-pointer transition-all"
                        style={{
                          borderColor: seen ? theme.color : 'var(--line-strong)',
                          background: seen ? theme.color : 'transparent',
                          color: seen ? 'var(--yellow-on)' : 'var(--muted)',
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
          </div>
        </aside>
      </div>
    </div>
  );
};
