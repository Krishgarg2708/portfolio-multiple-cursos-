import { ReactNode, useId } from 'react';
import { Project } from '../data/projects';

/** Drawn previews — no image files, so nothing can break and they follow the theme. */
export function ProjectPreview({ p, className = '' }: { p: Project; className?: string }) {
  const a = p.accent;
  const ink = 'var(--ink)';
  const line = 'var(--line)';
  const s = 'var(--surface)';
  const pid = useId().replace(/:/g, '');
  const art: Record<Project['preview'], ReactNode> = {
    retail: (
      <g>
        <rect x="40" y="40" width="200" height="180" rx="14" fill={s} stroke={line} />
        {[70, 110, 50, 130, 95, 150].map((h, i) => <rect key={i} x={62 + i * 28} y={200 - h} width="16" height={h} rx="4" fill={i === 5 ? a : ink} opacity={i === 5 ? 1 : 0.14} className="pv-bar" style={{ transformOrigin: `${70 + i * 28}px 200px`, transitionDelay: `${i * 40}ms` }} />)}
        <rect x="262" y="58" width="100" height="150" rx="10" fill={s} stroke={line} />
        {[0, 1, 2, 3].map(i => <rect key={i} x="276" y={78 + i * 22} width={i % 2 ? 56 : 72} height="7" rx="3.5" fill={ink} opacity=".15" />)}
        <rect x="276" y="174" width="72" height="18" rx="9" fill={a} />
      </g>
    ),
    shield: (
      <g>
        {[110, 80, 50].map((r, i) => <circle key={r} cx="200" cy="130" r={r} fill="none" stroke={a} opacity={0.12 + i * 0.12} strokeDasharray={i === 0 ? '4 6' : undefined} className={i === 0 ? 'pv-spin' : ''} style={{ transformOrigin: '200px 130px' }} />)}
        <path d="M200 82 L240 98 V132 C240 158 222 174 200 182 C178 174 160 158 160 132 V98 Z" fill={a} />
        <path d="M184 132 L196 144 L218 120" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ),
    vision: (
      <g>
        <rect x="50" y="40" width="300" height="180" rx="14" fill={ink} opacity=".9" />
        {[[70, 60], [330, 60], [70, 200], [330, 200]].map(([x, y], i) => <path key={i} d={`M${x} ${y + (y < 100 ? 18 : -18)} V${y} H${x + (x < 200 ? 18 : -18)}`} stroke="#fff" strokeWidth="3" fill="none" opacity=".6" />)}
        <rect x="120" y="88" width="70" height="90" rx="6" fill="none" stroke={a} strokeWidth="2.5" className="pv-pulse" />
        <rect x="120" y="76" width="54" height="12" rx="3" fill={a} />
        <rect x="230" y="110" width="62" height="60" rx="6" fill="none" stroke="#12B76A" strokeWidth="2.5" />
        <circle cx="76" cy="206" r="5" fill={a} className="pv-pulse" />
      </g>
    ),
    flow: (
      <g>
        {[[70, 130], [175, 80], [175, 180], [290, 130]].map(([x, y], i, arr) => (
          <g key={i}>
            {i > 0 && i < 3 && <path d={`M${arr[0][0] + 40} ${arr[0][1]} C 120 ${arr[0][1]}, 120 ${y}, ${x - 40} ${y}`} stroke={ink} opacity=".25" strokeWidth="2" fill="none" />}
            {i > 0 && i < 3 && <path d={`M${x + 40} ${y} C 245 ${y}, 245 130, 250 130`} stroke={ink} opacity=".25" strokeWidth="2" fill="none" />}
            <rect x={x - 40} y={y - 22} width="80" height="44" rx="12" fill={i === 3 ? a : s} stroke={i === 3 ? a : line} />
            <rect x={x - 26} y={y - 4} width={i === 0 ? 52 : 40} height="8" rx="4" fill={i === 3 ? '#fff' : ink} opacity={i === 3 ? 0.9 : 0.2} />
          </g>
        ))}
        <circle r="5" fill={a}><animateMotion dur="2.6s" repeatCount="indefinite" path="M110 130 C 120 130, 120 80, 135 80 L215 80 C 245 80, 245 130, 250 130" /></circle>
      </g>
    ),
    map: (
      <g>
        <rect x="40" y="36" width="320" height="188" rx="14" fill={s} stroke={line} />
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M40 ${70 + i * 34} Q 200 ${50 + i * 40} 360 ${80 + i * 30}`} stroke={ink} opacity=".07" strokeWidth="10" fill="none" />)}
        <circle cx="200" cy="130" r="62" fill={a} opacity=".1" className="pv-pulse" />
        {[[150, 100], [250, 110], [180, 170], [235, 160]].map(([x, y], i) => <path key={i} d={`M${x} ${y} c-9 -14 -9 -24 0 -24 s9 10 0 24z`} fill={ink} opacity=".75" />)}
        <circle cx="200" cy="130" r="9" fill={a} stroke="#fff" strokeWidth="3" />
      </g>
    ),
    network: (
      <g>
        {[[90, 80], [160, 150], [240, 70], [300, 160], [120, 200], [230, 200]].map(([x, y], i, arr) => (
          <g key={i}>
            {arr.slice(i + 1).filter((_, j) => (i + j) % 2 === 0).map(([x2, y2], j) => <line key={j} x1={x} y1={y} x2={x2} y2={y2} stroke={ink} opacity=".15" strokeWidth="1.5" />)}
          </g>
        ))}
        {[[90, 80], [160, 150], [240, 70], [300, 160], [120, 200], [230, 200]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 3 ? 12 : 8} fill={i === 3 ? '#F04438' : a} opacity={i === 3 ? 1 : 0.85} className={i === 3 ? 'pv-pulse' : ''} style={{ transformOrigin: `${x}px ${y}px` }} />)}
        <polyline points="40,240 90,232 140,236 190,228 240,234 280,206 320,232 360,226" stroke={a} strokeWidth="2.5" fill="none" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 400 260" className={`pv h-full w-full ${className}`} role="img" aria-label={`${p.title} preview illustration`} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="260" fill={a} opacity=".09" />
      <rect width="400" height="260" fill={`url(#d${pid})`} />
      <defs><pattern id={`d${pid}`} width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill={ink} opacity=".08" /></pattern></defs>
      {art[p.preview]}
    </svg>
  );
}
