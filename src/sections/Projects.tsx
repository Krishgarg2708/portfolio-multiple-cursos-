import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project, projects } from '../data/projects';
import { useAssemble } from '../engine/useAssemble';
import { useTilt } from '../hooks';
import { ProjectPreview } from '../components/ProjectPreview';
import { Eyebrow, FrameName } from '../components/ui';

const LAYOUT = [
  { span: 'md:col-span-2 lg:col-span-7', by: 'creator', from: '-360,140,-7', ratio: 'aspect-[16/10] lg:aspect-[16/8.4]' },
  { span: 'lg:col-span-5', by: 'architect', from: '340,180,8', ratio: 'aspect-[16/10] lg:aspect-auto lg:flex-1' },
  { span: 'lg:col-span-4', by: 'explorer', from: '-280,240,6', ratio: 'aspect-[4/3]' },
  { span: 'lg:col-span-4', by: 'creator', from: '0,300,-5', ratio: 'aspect-[4/3]' },
  { span: 'lg:col-span-4', by: 'architect', from: '300,240,7', ratio: 'aspect-[4/3]' },
  { span: 'md:col-span-2 lg:col-span-12', by: 'explorer', from: '-200,260,-3', ratio: 'aspect-[16/10] lg:aspect-[21/9]', wide: true },
];

function Card({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  const tilt = useRef<HTMLDivElement>(null);
  useTilt(tilt, 5);
  const L = LAYOUT[i % LAYOUT.length];
  return (
    <div data-piece data-by={L.by} data-from={L.from} data-label={`card / ${p.title}`} data-grab="0.5,0.18" className={`${L.span} flex`}>
      <div ref={tilt} className="flex w-full [transform-style:preserve-3d]">
        <button onClick={() => onOpen(p)} data-cursor="View project" aria-label={`Open ${p.title} details`}
          className={`surface group relative flex w-full overflow-hidden text-left ${L.wide ? 'flex-col lg:flex-row' : 'flex-col'}`}>
          {/* pointer-following sheen */}
          <span aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgb(255 255 255 / .14), transparent 60%)' }} />
          <div className={`relative w-full overflow-hidden ${L.ratio} ${L.wide ? 'lg:w-[58%]' : ''}`}>
            <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.04]"><ProjectPreview p={p} /></div>
            {/* hover reveal */}
            <div className="absolute inset-x-3 bottom-3 translate-y-3 rounded-2xl bg-ink/85 p-4 text-bg opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <p className="text-[14px] leading-snug">{p.tagline}</p>
            </div>
          </div>
          <div className={`flex flex-1 flex-col gap-4 p-5 sm:p-6 ${L.wide ? 'lg:justify-between lg:p-10' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="t-eyebrow mb-2 flex gap-3"><span>{String(i + 1).padStart(2, '0')}</span><span style={{ color: p.accent }}>{p.category}</span></div>
                <h3 className={`font-extrabold leading-[.95] tracking-[-0.04em] ${L.wide ? 'text-[clamp(2rem,4.5vw,4rem)]' : 'text-[clamp(1.6rem,2.6vw,2.2rem)]'}`}>{p.title}</h3>
                {L.wide && <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">{p.description}</p>}
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-ink group-hover:text-bg">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.slice(0, 4).map(t => <span key={t} className="rounded-full bg-sunk px-2.5 py-1 font-mono text-[11px] text-muted">{t}</span>)}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const ref = useRef<HTMLElement>(null);
  useAssemble(ref, 'top 70%');
  return (
    <section id="projects" ref={ref} className="relative mx-auto max-w-[1440px] scroll-mt-24 px-4 py-24 sm:px-8 md:py-36">
      <FrameName name={`Projects · ${projects.length} frames`} />
      <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow n="03">Selected projects</Eyebrow>
          <h2 data-piece data-by="creator" data-from="-300,100,-4" data-label="heading" className="t-h2">
            Things I've <span className="t-serif">shipped</span>
          </h2>
        </div>
        <p data-piece data-by="architect" data-from="260,40,5" data-label="note" className="max-w-sm text-[16px] leading-relaxed text-muted lg:col-span-4 lg:justify-self-end">
          Security, AI and everyday-commerce products. Open any frame for the full breakdown.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {projects.map((p, i) => <Card key={p.id} p={p} i={i} onOpen={onOpen} />)}
      </div>
    </section>
  );
}
