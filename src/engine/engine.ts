import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { CURSORS, CursorId, cursorById } from './cursors';

gsap.registerPlugin(ScrollTrigger, Draggable);

/**
 * The multiplayer cursor engine.
 *
 * Pieces are declared in markup:
 *   data-piece                 – element that gets placed by a collaborator
 *   data-by="designer"         – which cursor places it
 *   data-from="x,y,rotation"   – where it starts (offset from its real position, px / deg)
 *   data-grab="0.3,0.4"        – where the cursor grabs it (fraction of width / height)
 *   data-action="marquee"      – the cursor draws a frame, then the [data-line] children reveal
 *   data-label="Heading"       – layer name shown in the cursor's label
 *   data-drag                  – the visitor can drag it afterwards
 *
 * Cursors live in a document-space layer (they scroll with the page, like on a design canvas)
 * and are moved with GSAP transforms only — React never re-renders during the choreography.
 */

export type Mode = 'full' | 'touch' | 'off';
export type AssembleHandle = { skip: () => void };
type AssembleOpts = { stagger?: number; order?: CursorId[]; onComplete?: () => void };
type Refs = { root: HTMLElement; label: HTMLElement; action: HTMLElement; bubble: HTMLElement; trails: HTMLElement[] };

/** Deterministic PRNG so every visit plays the same choreography. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const parse = (s: string | undefined, fallback: number[]) => (s ? s.split(',').map(Number) : fallback);

function docRect(el: HTMLElement, ignoreTransform: boolean) {
  const prev = el.style.transform;
  if (ignoreTransform) el.style.transform = 'none';
  const r = el.getBoundingClientRect();
  if (ignoreTransform) el.style.transform = prev;
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}

class CursorEngine {
  mode: Mode = 'full';
  layer: HTMLElement | null = null;
  heroDone = false;
  onDragged: (() => void) | null = null;

  private refs = new Map<CursorId, Refs>();
  private running = new Map<CursorId, gsap.core.Timeline>();
  private roamTw = new Map<CursorId, gsap.core.Tween>();
  private leaveTw = new Map<CursorId, gsap.core.Tween>();
  private rng = new Map<CursorId, () => number>();
  private hist = new Map<CursorId, { x: number; y: number }[]>();
  private still = new Map<CursorId, number>();
  private waved = new Map<CursorId, number>();
  private visible = new Set<CursorId>();
  private frames = new Map<CursorId, HTMLElement>();
  private draggables: Draggable[] = [];
  private pointer = { x: -9999, y: -9999 };
  private ticking = false;

  /* ───────── setup ───────── */
  detectMode(): Mode {
    if (typeof window === 'undefined') return 'off';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) return 'touch';
    return 'full';
  }

  setLayer(el: HTMLElement | null) { this.layer = el; }

  register(id: CursorId, refs: Refs) {
    this.refs.set(id, refs);
    this.rng.set(id, mulberry32(CURSORS.findIndex(c => c.id === id) * 977 + 13));
    this.hist.set(id, []);
    gsap.set(refs.root, { x: -200, y: -200, opacity: 0 });
    this.startTicker();
  }

  unregister(id: CursorId) {
    this.stopRoam(id);
    this.leaveTw.get(id)?.kill();
    this.running.get(id)?.kill();
    this.visible.delete(id);
    this.refs.delete(id);
    if (!this.refs.size) this.stopTicker();
  }

  /** Offsets shrink on small screens so pieces never start far outside the viewport. */
  private scale() { return window.innerWidth < 640 ? 0.35 : window.innerWidth < 1100 ? 0.6 : 1; }

  /** Hide every piece in `root` at its starting offset. Call before first paint. */
  prep(root: HTMLElement) {
    if (this.mode === 'off') return;
    const s = this.scale();
    root.querySelectorAll<HTMLElement>('[data-piece]').forEach(p => {
      if (p.dataset.placed || p.dataset.queued) return;
      if (p.dataset.action === 'marquee') {
        gsap.set(p.querySelectorAll('[data-line]'), { yPercent: 115 });
        return;
      }
      const [fx, fy, fr] = parse(p.dataset.from, [-160, 80, -6]);
      gsap.set(p, { x: fx * s, y: fy * s, rotation: fr, opacity: 0 });
    });
  }

  /* ───────── cursor primitives ───────── */
  private pos(id: CursorId) {
    const r = this.refs.get(id)!.root;
    return { x: gsap.getProperty(r, 'x') as number, y: gsap.getProperty(r, 'y') as number };
  }

  /** Bring a cursor on stage near (x, y). If it is hidden or far away it enters from its home edge. */
  private enter(id: CursorId, x: number, y: number) {
    const c = this.refs.get(id);
    if (!c) return;
    this.leaveTw.get(id)?.kill();
    const p = this.pos(id);
    const far = !this.visible.has(id) || Math.abs(p.y - y) > window.innerHeight * 1.1;
    if (far) {
      const vx = window.scrollX, vy = window.scrollY, W = window.innerWidth, H = window.innerHeight;
      const edge = cursorById[id].edge;
      const clampX = (v: number) => Math.min(Math.max(v, vx + 40), vx + W - 120);
      const clampY = (v: number) => Math.min(Math.max(v, vy + 90), vy + H - 80);
      const ex = edge === 'left' ? vx - 80 : edge === 'right' ? vx + W + 30 : clampX(x + (edge === 'top' ? -140 : 160));
      const ey = edge === 'top' ? vy - 90 : edge === 'bottom' ? vy + H + 30 : clampY(y + 110);
      gsap.set(c.root, { x: ex, y: ey, scale: 1 });
      this.hist.set(id, []);
    }
    this.visible.add(id);
    gsap.to(c.root, { opacity: 1, duration: 0.25, overwrite: 'auto' });
  }

  private hide(id: CursorId) {
    this.visible.delete(id);
    this.refs.get(id)?.trails.forEach(t => (t.style.opacity = '0'));
  }

  private say(id: CursorId, text: string | null) {
    const c = this.refs.get(id);
    if (!c) return;
    c.action.textContent = text ? `· ${text}` : '';
    gsap.fromTo(c.label, { scale: 0.88 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', overwrite: true });
  }

  /** Click feedback: an expanding ring in the cursor's colour. */
  private ripple(id: CursorId) {
    if (!this.refs.has(id) || !this.layer) return;
    const { x, y } = this.pos(id);
    const r = document.createElement('span');
    r.className = 'mc-ripple';
    r.style.color = cursorById[id].color;
    this.layer.appendChild(r);
    gsap.fromTo(r, { x, y, scale: 0.2, opacity: 0.9 }, { scale: 1.5, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => r.remove() });
  }

  private frame(id: CursorId) {
    let f = this.frames.get(id);
    if (!f || !f.isConnected) {
      f = document.createElement('div');
      f.className = 'mc-frame';
      const col = cursorById[id].color;
      f.style.borderColor = col;
      f.innerHTML =
        ['-4px,-4px', 'calc(100% - 4px),-4px', '-4px,calc(100% - 4px)', 'calc(100% - 4px),calc(100% - 4px)']
          .map(p => { const [l, t] = p.split(','); return `<i style="left:${l};top:${t};border-color:${col}"></i>`; })
          .join('') + `<b style="background:${col}">Frame · Heading</b>`;
      this.layer?.appendChild(f);
      this.frames.set(id, f);
    }
    return f;
  }

  /* ───────── steps ───────── */

  /** Fly to a piece, hover it, grab it, drag it home, let go. */
  private dragStep(tl: gsap.core.Timeline, id: CursorId, piece: HTMLElement, n: number) {
    const c = this.refs.get(id)!;
    const s = this.scale();
    const [fx, fy] = parse(piece.dataset.from, [-160, 80, -6]).map(v => v * s);
    const [ax, ay] = parse(piece.dataset.grab, [0.3, 0.4]);
    const t = { gx: 0, gy: 0, sx: 0, sy: 0 };
    const L = `step${n}`;

    tl.addLabel(L);
    tl.call(() => {
      const r = docRect(piece, true);
      t.gx = r.x + r.w * ax; t.gy = r.y + r.h * ay; t.sx = t.gx + fx; t.sy = t.gy + fy;
      piece.style.setProperty('--sel', cursorById[id].color);
      this.enter(id, t.sx, t.sy);
      this.say(id, `moving ${piece.dataset.label || 'layer'}`);
    }, undefined, L);
    tl.to(c.root, { x: () => t.sx, y: () => t.sy, duration: 0.75, ease: 'power2.inOut' }, L);
    tl.to(piece, { opacity: 1, duration: 0.3 }, `${L}+=0.3`);
    tl.call(() => piece.classList.add('is-hovered'), undefined, `${L}+=0.55`);
    tl.call(() => { piece.classList.replace('is-hovered', 'is-held'); this.ripple(id); }, undefined, `${L}+=0.75`);
    tl.to(c.root, { scale: 0.84, duration: 0.12 }, `${L}+=0.75`);
    tl.to(piece, { x: 0, y: 0, rotation: 0, duration: 0.85, ease: 'power3.inOut' }, `${L}+=0.87`);
    tl.to(c.root, { x: () => t.gx, y: () => t.gy, duration: 0.85, ease: 'power3.inOut' }, `${L}+=0.87`);
    tl.to(c.root, { scale: 1, duration: 0.2, ease: 'back.out(3)' }, `${L}+=1.72`);
    tl.call(() => { piece.classList.remove('is-held', 'is-hovered'); this.placed(piece); }, undefined, `${L}+=1.8`);
  }

  /** Draw a frame with the cursor, then reveal the text lines inside it. */
  private marqueeStep(tl: gsap.core.Timeline, id: CursorId, piece: HTMLElement, n: number) {
    const c = this.refs.get(id)!;
    const r = { x: 0, y: 0, w: 0, h: 0 };
    const lines = piece.querySelectorAll('[data-line]');
    const prog = { v: 0 };
    const L = `step${n}`;
    let f: HTMLElement | null = null;

    tl.addLabel(L);
    tl.call(() => {
      Object.assign(r, docRect(piece, false));
      r.x -= 10; r.y -= 6; r.w += 20; r.h += 12;
      f = this.frame(id);
      gsap.set(f, { left: r.x, top: r.y, width: 0, height: 0, opacity: 1 });
      this.enter(id, r.x, r.y);
      this.say(id, `creating ${piece.dataset.label || 'frame'}`);
    }, undefined, L);
    tl.to(c.root, { x: () => r.x, y: () => r.y, duration: 0.8, ease: 'power2.inOut' }, L);
    tl.call(() => this.ripple(id), undefined, `${L}+=0.8`);
    tl.to(c.root, { scale: 0.84, duration: 0.12 }, `${L}+=0.8`);
    tl.to(prog, { v: 1, duration: 1, ease: 'power2.inOut', onUpdate: () => { if (f) gsap.set(f, { width: r.w * prog.v, height: r.h * prog.v }); } }, `${L}+=0.92`);
    tl.to(c.root, { x: () => r.x + r.w, y: () => r.y + r.h, duration: 1, ease: 'power2.inOut' }, `${L}+=0.92`);
    tl.to(c.root, { scale: 1, duration: 0.2, ease: 'back.out(3)' }, `${L}+=1.92`);
    tl.to(lines, { yPercent: 0, duration: 0.95, stagger: 0.09, ease: 'power4.out' }, `${L}+=1.75`);
    tl.call(() => { if (f) gsap.to(f, { opacity: 0, duration: 0.5 }); this.placed(piece); }, undefined, `${L}+=2.6`);
  }

  private placed(piece: HTMLElement) {
    if (piece.dataset.placed) return;
    piece.dataset.placed = '1';
    piece.dispatchEvent(new CustomEvent('placed'));
  }

  /* ───────── scripts ───────── */
  private script(id: CursorId, pieces: HTMLElement[], delay: number, done: () => void) {
    this.stopRoam(id);
    const prev = this.running.get(id);
    if (prev && prev.progress() < 1) prev.progress(1, false);
    const tl = gsap.timeline({ delay, onComplete: () => { this.idle(id); done(); } });
    pieces.forEach((p, n) => (p.dataset.action === 'marquee' ? this.marqueeStep(tl, id, p, n) : this.dragStep(tl, id, p, n)));
    this.running.set(id, tl);
    return tl;
  }

  /** Touch devices (and any piece without a cursor): no pointers, just a tap ring and a name chip. */
  private touchScript(pieces: HTMLElement[], done: () => void) {
    const tl = gsap.timeline({ onComplete: done });
    pieces.forEach((p, i) => {
      const at = i * 0.13;
      tl.call(() => this.tapChip(p), undefined, at);
      if (p.dataset.action === 'marquee') {
        tl.to(p.querySelectorAll('[data-line]'), { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out' }, at);
      } else {
        tl.to(p, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.85, ease: 'expo.out' }, at);
      }
      tl.call(() => this.placed(p), undefined, at + 0.55);
    });
    return tl;
  }

  private tapChip(p: HTMLElement) {
    if (!this.layer) return;
    const def = cursorById[(p.dataset.by as CursorId) || 'designer'];
    const r = docRect(p, true);
    const el = document.createElement('div');
    el.className = 'mc-tap';
    el.innerHTML = `<span class="mc-ripple" style="color:${def.color}"></span><span class="mc-label" style="background:${def.color}">${def.name}</span>`;
    this.layer.appendChild(el);
    gsap.set(el, { x: r.x + Math.min(r.w * 0.5, 110), y: r.y + Math.min(r.h * 0.5, 28) });
    gsap.fromTo(el.firstElementChild, { scale: 0.2, opacity: 0.9 }, { scale: 1.4, opacity: 0, duration: 0.7, ease: 'power2.out' });
    gsap.fromTo(el.lastElementChild, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25 });
    gsap.to(el, { opacity: 0, duration: 0.35, delay: 1, onComplete: () => el.remove() });
  }

  /** Play the placement choreography for every unplaced piece inside `root`. */
  assemble(root: HTMLElement, opts: AssembleOpts = {}): AssembleHandle {
    const pieces = this.mode === 'off' ? [] : [...root.querySelectorAll<HTMLElement>('[data-piece]')].filter(p => !p.dataset.placed && !p.dataset.queued);
    if (!pieces.length) { opts.onComplete?.(); return { skip: () => {} }; }
    pieces.forEach(p => (p.dataset.queued = '1'));

    const tls: gsap.core.Timeline[] = [];
    let left = 0;
    const done = () => { if (--left === 0) opts.onComplete?.(); };

    if (this.mode === 'touch') {
      left = 1;
      tls.push(this.touchScript(pieces, done));
    } else {
      const groups = new Map<CursorId, HTMLElement[]>();
      const orphans: HTMLElement[] = [];
      pieces.forEach(p => {
        const id = (p.dataset.by as CursorId) || 'designer';
        if (!this.refs.has(id)) { orphans.push(p); return; }
        groups.set(id, [...(groups.get(id) || []), p]);
      });
      const ids = [...groups.keys()];
      if (opts.order) ids.sort((a, b) => opts.order!.indexOf(a) - opts.order!.indexOf(b));
      left = ids.length + (orphans.length ? 1 : 0);
      ids.forEach((id, i) => tls.push(this.script(id, groups.get(id)!, i * (opts.stagger ?? 0.2), done)));
      if (orphans.length) tls.push(this.touchScript(orphans, done));
    }
    return { skip: () => tls.forEach(t => t.progress(1, false)) };
  }

  /** After a script: roamers hold position (and wander once the hero is done), the rest step away. */
  private idle(id: CursorId) {
    const c = this.refs.get(id);
    if (!c) return;
    this.say(id, null);
    if (cursorById[id].roams) { if (this.heroDone) this.roam(id); return; }
    const p = this.pos(id);
    this.leaveTw.set(id, gsap.to(c.root, {
      x: p.x + 70, y: p.y + 50, opacity: 0, duration: 0.8, delay: 0.35, ease: 'power2.in',
      onComplete: () => this.hide(id),
    }));
  }

  /* ───────── ambient presence ───────── */
  startPresence() {
    this.heroDone = true;
    if (this.mode !== 'full') return;
    const roamers = CURSORS.filter(c => c.roams).slice(0, window.innerWidth < 1100 ? 2 : 3);
    CURSORS.forEach(c => {
      if (roamers.includes(c)) this.roam(c.id);
      else if (c.roams) this.leave(c.id);
    });
  }

  private leave(id: CursorId) {
    const c = this.refs.get(id);
    if (c) this.leaveTw.set(id, gsap.to(c.root, { opacity: 0, duration: 0.6, onComplete: () => this.hide(id) }));
  }

  private roam(id: CursorId) {
    const c = this.refs.get(id);
    if (!c || this.mode !== 'full') return;
    const rnd = this.rng.get(id)!;
    const def = cursorById[id];
    const step = () => {
      const x = window.scrollX + window.innerWidth * (0.05 + rnd() * 0.84);
      const y = window.scrollY + window.innerHeight * (0.16 + rnd() * 0.68);
      this.enter(id, x, y);
      if (rnd() < 0.3) this.chat(id, def.chatter[Math.floor(rnd() * def.chatter.length)]);
      this.roamTw.set(id, gsap.to(c.root, { x, y, duration: 2.2 + rnd() * 1.8, delay: 1 + rnd() * 2.6, ease: 'sine.inOut', onComplete: step }));
    };
    step();
  }

  private stopRoam(id: CursorId) {
    this.roamTw.get(id)?.kill();
    this.roamTw.delete(id);
  }

  private chat(id: CursorId, msg: string) {
    const c = this.refs.get(id);
    if (!c) return;
    c.bubble.textContent = msg;
    gsap.timeline()
      .fromTo(c.bubble, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', overwrite: true })
      .to(c.bubble, { opacity: 0, scale: 0.9, duration: 0.3, delay: 2.2 });
  }

  /* ───────── shared ticker: trails + greeting the visitor (no React involved) ───────── */
  private onPointer = (e: PointerEvent) => { this.pointer.x = e.pageX; this.pointer.y = e.pageY; };

  private startTicker() {
    if (this.ticking) return;
    this.ticking = true;
    gsap.ticker.add(this.tick);
    window.addEventListener('pointermove', this.onPointer, { passive: true });
  }

  private stopTicker() {
    this.ticking = false;
    gsap.ticker.remove(this.tick);
    window.removeEventListener('pointermove', this.onPointer);
  }

  private tick = () => {
    const now = performance.now();
    this.refs.forEach((c, id) => {
      if (!this.visible.has(id)) return;
      const h = this.hist.get(id)!;
      const p = this.pos(id);
      const last = h[h.length - 1];

      // a roaming collaborator says hi when the visitor's pointer comes close
      if (this.roamTw.has(id) && now - (this.waved.get(id) || 0) > 9000 && Math.hypot(p.x - this.pointer.x, p.y - this.pointer.y) < 80) {
        this.waved.set(id, now);
        this.chat(id, 'hey 👋');
      }

      if (last && last.x === p.x && last.y === p.y) {
        const s = (this.still.get(id) || 0) + 1;
        this.still.set(id, s);
        if (s > 16) return; // parked: nothing to update
      } else this.still.set(id, 0);

      h.push(p);
      if (h.length > 14) h.shift();
      const speed = Math.min(1, Math.hypot(p.x - h[0].x, p.y - h[0].y) / 200);
      c.trails.forEach((t, i) => {
        const q = h[Math.max(0, h.length - 2 - i * 2)];
        t.style.transform = `translate3d(${q.x - 3.5}px, ${q.y - 3.5}px, 0) scale(${1 - i * 0.15})`;
        t.style.opacity = String(speed * (0.6 - i * 0.1));
      });
    });
  };

  /* ───────── visitor drag & drop ───────── */
  enableDrag(root: HTMLElement, bounds?: HTMLElement) {
    if (this.mode !== 'full') return () => {};
    const made = [...root.querySelectorAll<HTMLElement>('[data-drag]')].map(el =>
      Draggable.create(el, {
        type: 'x,y',
        bounds,
        zIndexBoost: true,
        onPress() { gsap.to(el, { scale: 1.04, rotation: -1.5, duration: 0.2, overwrite: 'auto' }); },
        onRelease() { gsap.to(el, { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' }); },
        onDragStart: () => this.onDragged?.(),
      })[0],
    );
    this.draggables.push(...made);
    return () => made.forEach(d => d.kill());
  }

  resetLayout(root: HTMLElement) {
    gsap.to(root.querySelectorAll('[data-drag]'), { x: 0, y: 0, rotation: 0, duration: 0.7, ease: 'power3.inOut', stagger: 0.03 });
  }
}

export const engine = new CursorEngine();
export { gsap, ScrollTrigger, Draggable };
