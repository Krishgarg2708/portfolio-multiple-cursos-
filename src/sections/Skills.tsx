import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { skillGroups } from '../data/profile';
import { CURSORS } from '../engine/cursors';
import { engine, gsap } from '../engine/engine';
import { onPlaced, useAssemble } from '../engine/useAssemble';
import { Eyebrow, FrameName } from '../components/ui';

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);
  useAssemble(ref);

  // once the Builder drops the board in, the tags fall into place and become draggable
  useEffect(() => {
    const el = board.current;
    if (!el) return;
    const tags = el.querySelectorAll('[data-tag]');
    const motion = engine.mode !== 'off';
    if (motion) gsap.set(tags, { y: -40, opacity: 0, rotation: i => ((i * 37) % 30) - 15 });
    let kill = () => {};
    const down = (e: PointerEvent) => { if ((e.target as HTMLElement).closest('[data-tag]')) setMoved(true); };
    const off = onPlaced(el, () => {
      if (motion) gsap.to(tags, { y: 0, opacity: 1, rotation: 0, duration: 0.9, stagger: 0.035, ease: 'bounce.out' });
      kill = engine.enableDrag(el, el);
      if (engine.mode === 'full') el.addEventListener('pointerdown', down);
    });
    return () => { off(); kill(); el.removeEventListener('pointerdown', down); };
  }, []);

  return (
    <section id="skills" ref={ref} className="relative mx-auto max-w-[1440px] scroll-mt-24 px-4 py-24 sm:px-8 md:py-36">
      <FrameName name="Skills · playground" />
      <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow n="02">Skills & technologies</Eyebrow>
          <h2 data-piece data-by="builder" data-from="-280,80,-5" data-label="heading" className="t-h2">
            Tools I <span className="t-serif">build</span> with
          </h2>
        </div>
        <p data-piece data-by="innovator" data-from="240,60,4" data-label="note" className="max-w-sm text-[16px] leading-relaxed text-muted lg:col-span-4 lg:justify-self-end">
          Seventeen technologies across five areas. {engine.mode === 'full' ? 'Go on — pick them up and rearrange the board.' : 'Grouped by what they help me do.'}
        </p>
      </div>

      <div ref={board} data-piece data-by="builder" data-from="0,260,-3" data-label="skill board" data-grab="0.5,0.06"
        className="surface dot-grid relative overflow-hidden p-5 sm:p-8 md:p-10">
        <div className="grid gap-x-10 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((g, gi) => {
            const color = CURSORS[gi % CURSORS.length].color;
            return (
              <div key={g.title}>
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  <h3 className="text-[19px] font-bold tracking-tight">{g.title}</h3>
                  <span className="font-mono text-[11px] text-faint">{g.note}</span>
                </div>
                <ul className="flex flex-wrap gap-2.5">
                  {g.items.map(t => (
                    <li key={t} data-tag data-drag style={{ ['--c' as string]: color }}
                      className="skill-tag cursor-grab select-none rounded-full border border-line bg-surface px-4 py-2.5 text-[15px] font-semibold shadow-sm active:cursor-grabbing">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {moved && (
          <button onClick={() => { board.current && engine.resetLayout(board.current); setMoved(false); }}
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-bg">
            <RotateCcw size={14} /> Tidy up
          </button>
        )}
      </div>
    </section>
  );
}
