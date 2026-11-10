import { RefObject, useLayoutEffect } from 'react';
import { engine, ScrollTrigger } from './engine';

/** Hide a section's pieces, then let the collaborators assemble it when it scrolls into view. */
export function useAssemble(ref: RefObject<HTMLElement | null>, start = 'top 72%') {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || engine.mode === 'off') return;
    engine.prep(el);
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => engine.assemble(el),
    });
    return () => st.kill();
  }, []);
}

/** Run a callback once a piece has been placed (or immediately when motion is off). */
export function onPlaced(el: HTMLElement | null, fn: () => void) {
  if (!el) return () => {};
  if (engine.mode === 'off' || el.dataset.placed) { fn(); return () => {}; }
  el.addEventListener('placed', fn, { once: true });
  return () => el.removeEventListener('placed', fn);
}
