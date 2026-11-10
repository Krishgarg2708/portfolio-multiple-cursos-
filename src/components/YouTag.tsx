import { useEffect, useRef } from 'react';

/**
 * The visitor's presence: a "You" tag that trails the real cursor (which stays fully functional)
 * and tells you what an element does. Driven by rAF, never by React state.
 */
export function YouTag() {
  const el = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = -100, ty = -100, x = -100, y = -100, raf = 0, shown = false;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown && el.current) { shown = true; x = tx; y = ty; el.current.style.opacity = '1'; }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], [data-drag], a, button');
      const label = t?.dataset.cursor || (t?.hasAttribute('data-drag') ? 'Drag me' : t ? 'Click' : '');
      if (text.current) text.current.textContent = label ? `You · ${label}` : 'You';
    };
    const leave = () => { if (el.current) { el.current.style.opacity = '0'; shown = false; } };
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      if (el.current) el.current.style.transform = `translate3d(${x + 16}px, ${y + 20}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={el} className="you-tag" style={{ opacity: 0, transition: 'opacity .2s' }} aria-hidden>
      <span ref={text} className="block rounded-full rounded-tl-[5px] bg-ink px-2.5 py-1 text-[12px] font-semibold text-bg shadow-lg">You</span>
    </div>
  );
}
