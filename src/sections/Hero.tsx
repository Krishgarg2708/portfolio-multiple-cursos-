import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, RotateCcw } from 'lucide-react';
import { site } from '../config/site';
import { projects, Project } from '../data/projects';
import { engine, AssembleHandle } from '../engine/engine';
import { CURSORS } from '../engine/cursors';
import { HeroBackground } from '../components/HeroBackground';
import { ProjectPreview } from '../components/ProjectPreview';
import { Magnetic } from '../components/ui';

const HERO_TAGS = ['React', 'TypeScript', 'Python', 'FastAPI', 'MongoDB', 'Scikit-learn'];
const ORDER = ['designer', 'developer', 'builder', 'creator', 'architect', 'innovator', 'explorer'] as const;

function Word({ children, serif }: { children: string; serif?: boolean }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.07em] align-top">
      <span data-line className={`inline-block ${serif ? 't-serif' : ''}`}>{children}</span>
    </span>
  );
}

export function Hero({ started, onOpen }: { started: boolean; onOpen: (p: Project) => void }) {
  const root = useRef<HTMLElement>(null);
  const handle = useRef<AssembleHandle | null>(null);
  const [phase, setPhase] = useState<'wait' | 'playing' | 'done'>('wait');
  const [moved, setMoved] = useState(false);

  useLayoutEffect(() => { if (root.current) engine.prep(root.current); }, []);

  useEffect(() => {
    if (!started || !root.current || phase !== 'wait') return;
    const el = root.current;
    setPhase('playing');
    handle.current = engine.assemble(el, {
      order: [...ORDER], stagger: 0.32,
      onComplete: () => {
        setPhase('done');
        engine.startPresence();
      },
    });
    // the visitor takes over: any scroll / key / touch finishes the intro instantly
    const skip = () => handle.current?.skip();
    const opts = { passive: true, once: true } as const;
    window.addEventListener('wheel', skip, opts);
    window.addEventListener('touchmove', skip, opts);
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [started]);

  useEffect(() => {
    if (phase !== 'done' || !root.current) return;
    engine.onDragged = () => setMoved(true);
    const off = engine.enableDrag(root.current);
    return () => { off(); engine.onDragged = null; };
  }, [phase]);

  const fan = [
    { from: '320,-220,14', rot: '-rotate-[5deg]', by: 'creator' },
    { from: '420,120,-10', rot: 'rotate-[2deg]', by: 'architect' },
    { from: '200,260,9', rot: '-rotate-[1.5deg]', by: 'creator' },
  ];

  return (
    <section id="top" ref={root} aria-label="Introduction" className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip px-4 pb-8 pt-28 sm:px-8">
      <HeroBackground />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        {/* meta row */}
        <div data-piece data-by="explorer" data-from="-240,-80,-6" data-label="status" data-drag className="mb-6 inline-flex self-start lg:mb-7">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium shadow-sm">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#12B76A] opacity-60" /><span className="relative h-2 w-2 rounded-full bg-[#12B76A]" /></span>
            {site.available ? 'Available for internships & projects' : 'Currently busy'} · {site.location}
          </span>
        </div>

        {/* the heading the Designer creates */}
        <h1 data-piece data-by="designer" data-action="marquee" data-label="heading" data-drag
          className="t-display text-[clamp(2.6rem,12.6vw,5rem)] md:text-[clamp(4rem,8.3vw,9.6rem)]">
          <span className="sr-only">Building digital experiences that matter.</span>
          <span aria-hidden>
            <Word>Building</Word><br className="md:hidden" />{' '}<Word>digital</Word><br />
            <Word>experiences</Word><br />
            <Word>that</Word>{' '}<Word serif>matter.</Word>
          </span>
        </h1>

        <div className="mt-9 grid flex-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div data-piece data-by="developer" data-from="-300,160,-5" data-label="subtitle" data-drag>
              <p className="text-[clamp(1.05rem,1.6vw,1.3rem)] font-semibold leading-snug">{site.subtitle.split(' | ').map((s, i) => (
                <span key={s}>{i > 0 && <span className="mx-2 text-faint">/</span>}{s}</span>
              ))}</p>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-muted">{site.intro}</p>
            </div>
            <div data-piece data-by="innovator" data-from="260,200,6" data-label="buttons" data-grab="0.25,0.5" className="flex flex-wrap items-center gap-3">
              <Magnetic href="#projects" cursor="See work">View projects <ArrowUpRight size={17} /></Magnetic>
              <Magnetic href="#contact" variant="ghost" cursor="Say hi">Contact me</Magnetic>
            </div>
            <div data-piece data-by="innovator" data-from="-200,140,-8" data-label="socials" className="flex gap-2 lg:-mt-1">
              {[
                { href: site.socials.github, icon: Github, label: 'GitHub' },
                { href: site.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: `mailto:${site.email}`, icon: Mail, label: 'Email' },
              ].filter(s => s.href).map(s => (
                <a key={s.label} href={s.href!} aria-label={s.label} data-cursor={s.label} target={s.href!.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface transition hover:-translate-y-0.5 hover:border-ink/30">
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div data-piece data-by="builder" data-from="-280,-120,7" data-label="tech tags" data-drag className="mb-6 flex flex-wrap gap-2 lg:justify-end">
              {HERO_TAGS.map((t, i) => (
                <span key={t} className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-white" style={{ background: CURSORS[i % CURSORS.length].color, rotate: `${[-2, 1.5, -1, 2, -1.5, 1][i]}deg` }}>{t}</span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-5 lg:pl-10">
              {projects.slice(0, 3).map((p, i) => (
                <div key={p.id} data-piece data-by={fan[i].by} data-from={fan[i].from} data-label={p.title} data-grab="0.5,0.3" className={i === 1 ? 'lg:translate-y-8' : ''}>
                  <button onClick={() => onOpen(p)} data-cursor="Open" className={`surface group block w-full overflow-hidden text-left transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] ${fan[i].rot}`}>
                    <div className="aspect-[4/3] overflow-hidden lg:aspect-[16/10]"><ProjectPreview p={p} /></div>
                    <div className="p-2.5 sm:p-4">
                      <div className="truncate text-[12px] font-bold sm:text-[16px]">{p.title}</div>
                      <div className="hidden truncate text-[12px] text-faint sm:block">{p.category}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4 lg:mt-6">
          <a href="#about" data-piece data-by="explorer" data-from="-120,120,0" data-label="scroll cue" className="group inline-flex items-center gap-3 text-[13px] font-medium text-muted hover:text-ink">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-line">
              <ArrowDown size={16} className="animate-[cue_1.8s_ease-in-out_infinite]" />
            </span>
            Scroll to explore
          </a>
          <div className="flex items-center gap-2">
            {phase === 'playing' && engine.mode !== 'off' && (
              <button onClick={() => handle.current?.skip()} className="rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium hover:border-ink/30">Skip intro</button>
            )}
            {moved && (
              <button onClick={() => { root.current && engine.resetLayout(root.current); setMoved(false); }} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-bg">
                <RotateCcw size={14} /> Reset layout
              </button>
            )}
            {phase === 'done' && !moved && engine.mode === 'full' && (
              <span className="hidden font-mono text-[11px] text-faint md:block">tip — drag the heading, tags or badge around</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
