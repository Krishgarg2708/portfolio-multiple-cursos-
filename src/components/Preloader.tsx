import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../engine/engine';
import { CURSORS } from '../engine/cursors';
import { site } from '../config/site';

/** Collaborators "join the file", the counter runs, the panel lifts off. Calls onDone once. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('is-loading');
    const finish = () => { document.documentElement.classList.remove('is-loading'); onDone(); };
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.to(root.current, { opacity: 0, duration: 0.3, delay: 0.2, onComplete: finish });
        return;
      }
      const n = { v: 0 };
      gsap.timeline({ onComplete: finish })
        .from('[data-pl-title] > *', { yPercent: 110, duration: 0.7, stagger: 0.06, ease: 'power4.out' })
        .from('[data-pl-avatar]', { scale: 0, duration: 0.4, stagger: 0.09, ease: 'back.out(2.5)' }, 0.15)
        .from('[data-pl-join]', { opacity: 0, y: 8, duration: 0.3, stagger: 0.09 }, 0.2)
        .to(n, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, '0');
          if (bar.current) bar.current.style.transform = `scaleX(${n.v / 100})`;
        } }, 0)
        .to(root.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '+=0.15');
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink p-5 text-bg sm:p-10" role="status" aria-label="Loading portfolio">
      <div className="flex items-center justify-between font-mono text-[12px] opacity-70">
        <span>{site.name.toLowerCase().replace(' ', '-')} / portfolio.fig</span>
        <span>Opening file…</span>
      </div>
      <div>
        <div data-pl-title className="overflow-hidden text-[clamp(2.6rem,9vw,8rem)] font-extrabold uppercase leading-[.9] tracking-[-0.05em]">
          <span className="block">{site.name}</span>
        </div>
        <div className="mt-8 grid max-w-xl gap-1.5 font-mono text-[12px]">
          {CURSORS.map(c => (
            <div key={c.id} data-pl-join className="flex items-center gap-2.5">
              <span data-pl-avatar className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
              <span className="opacity-80">{c.name} joined the file</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-end justify-between">
          <span className="font-mono text-[12px] opacity-70">7 collaborators</span>
          <span ref={count} className="font-mono text-[clamp(2rem,5vw,3.5rem)] font-medium tabular-nums">000</span>
        </div>
        <div className="h-[2px] w-full bg-bg/15"><div ref={bar} className="h-full origin-left bg-bg" style={{ transform: 'scaleX(0)' }} /></div>
      </div>
    </div>
  );
}
