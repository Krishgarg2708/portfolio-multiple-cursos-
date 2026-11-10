import { memo, useEffect, useRef } from 'react';
import { CURSORS, CursorDef, TIP } from './cursors';
import { engine } from './engine';

const SIZE = 34;

export function CursorArrow({ color, size = SIZE }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ filter: 'drop-shadow(0 3px 5px rgb(0 0 0 / .28))', display: 'block' }}>
      <path d="M4.2 2.6 L4.2 20.4 L9.1 15.8 L12.4 22.6 L15.6 21.1 L12.4 14.4 L19.2 14.4 Z" fill={color} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** One collaborator. Rendered once; the engine drives it through refs. */
const Cursor = memo(function Cursor({ def }: { def: CursorDef }) {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const trails = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    engine.register(def.id, { root: root.current!, label: label.current!, action: action.current!, bubble: bubble.current!, trails: trails.current });
    return () => engine.unregister(def.id);
  }, [def.id]);

  const off = { left: -(TIP.x / 24) * SIZE, top: -(TIP.y / 24) * SIZE };
  return (
    <>
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} ref={el => { if (el) trails.current[i] = el; }} className="mc-trail" style={{ background: def.color }} />
      ))}
      <div ref={root} className="mc-cursor" aria-hidden>
        <div style={{ position: 'absolute', ...off }}>
          <CursorArrow color={def.color} />
          <div ref={label} className="mc-label" style={{ background: def.color, left: SIZE * 0.6, top: SIZE * 0.82 }}>
            {def.name}
            <small ref={action} />
          </div>
          <div
            ref={bubble}
            className="absolute whitespace-nowrap rounded-2xl rounded-tl-[4px] bg-surface px-3 py-1.5 text-[13px] font-medium text-ink shadow-xl ring-1 ring-line"
            style={{ left: SIZE * 0.7, top: SIZE * 1.85, opacity: 0, transformOrigin: '0 0' }}
          />
        </div>
      </div>
    </>
  );
});

export function CursorLayer({ showCursors }: { showCursors: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    engine.setLayer(layer.current);
    return () => engine.setLayer(null);
  }, []);
  return (
    <div ref={layer} className="mc-layer" aria-hidden>
      {showCursors && CURSORS.map(c => <Cursor key={c.id} def={c} />)}
    </div>
  );
}
