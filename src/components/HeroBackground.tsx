import { useEffect, useRef } from 'react';

/** Interactive dot grid: dots swell and tint around the pointer. Pauses when off-screen. */
export function HeroBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interactive = window.matchMedia('(pointer: fine)').matches && !reduce;
    const GAP = 24;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let mx = -9999, my = -9999, px = -9999, py = -9999;
    let dot = 'rgba(22,22,22,.16)', hot = '47,107,255';

    const colors = () => {
      const cs = getComputedStyle(document.documentElement);
      dot = cs.getPropertyValue('--dot').trim() || dot;
      hot = document.documentElement.dataset.theme === 'dark' ? '110,149,255' : '47,107,255';
    };
    const size = () => {
      const r = c.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = `${w}px`; c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      px += (mx - px) * 0.14; py += (my - py) * 0.14;
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const d = Math.hypot(x - px, y - py);
          const k = d < 170 ? 1 - d / 170 : 0;
          if (k > 0) {
            ctx.fillStyle = `rgba(${hot},${0.25 + k * 0.6})`;
            ctx.beginPath(); ctx.arc(x, y, 1 + k * 2.2, 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.fillStyle = dot;
            ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
          }
        }
      }
    };
    const loop = () => { if (visible) draw(); raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };

    colors(); size();
    const ro = new ResizeObserver(size); ro.observe(c.parentElement!);
    const mo = new MutationObserver(() => { colors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    if (interactive) { window.addEventListener('pointermove', move, { passive: true }); raf = requestAnimationFrame(loop); }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); io.disconnect(); window.removeEventListener('pointermove', move); };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <canvas ref={canvas} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
