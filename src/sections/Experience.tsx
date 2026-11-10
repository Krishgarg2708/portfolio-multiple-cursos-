import { useEffect, useRef, useState } from 'react';
import { Plus, Trophy } from 'lucide-react';
import { accomplishments, education, hackathons, internships, leadership } from '../data/profile';
import { CURSORS } from '../engine/cursors';
import { gsap } from '../engine/engine';
import { onPlaced, useAssemble } from '../engine/useAssemble';
import { Eyebrow, FrameName } from '../components/ui';

/** Count up once the Developer has placed the stats row. */
function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const nums = [...el.querySelectorAll<HTMLElement>('[data-num]')];
    return onPlaced(el, () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      nums.forEach(n => {
        const target = parseFloat(n.dataset.num!);
        const suffix = n.dataset.suffix || '';
        const o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.4, ease: 'power3.out', onUpdate: () => (n.textContent = Math.round(o.v) + suffix) });
      });
    });
  }, []);
  return (
    <div ref={ref} data-piece data-by="developer" data-from="0,220,-3" data-label="stats" data-grab="0.5,0.3" className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
      {accomplishments.map((a, i) => (
        <div key={a.label} className={`p-5 sm:p-8 ${i % 2 ? 'border-l border-line' : ''} ${i >= 2 ? 'border-t border-line lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}>
          <div className="text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-none tracking-[-0.05em]" style={{ color: CURSORS[i + 1].color }}>
            <span data-num={parseInt(a.value)} data-suffix={a.value.replace(/[0-9]/g, '')}>{a.value}</span>
          </div>
          <div className="mt-3 text-[16px] font-semibold">{a.label}</div>
          <div className="text-[13px] text-faint">{a.note}</div>
        </div>
      ))}
    </div>
  );
}

function Row({ company, role, period, points, i }: { company: string; role: string; period: string; points: string[]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="group border-b border-line" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="flex w-full items-center gap-4 py-5 text-left">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150" style={{ background: CURSORS[i % CURSORS.length].color }} />
        <span className="flex-1">
          <span className="block text-[19px] font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-1">{company}</span>
          <span className="block text-[14px] text-muted">{role}</span>
        </span>
        <span className="hidden font-mono text-[12px] text-faint sm:block">{period}</span>
        <Plus size={18} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <p className="pb-1 pl-7 font-mono text-[12px] text-faint sm:hidden">{period}</p>
          <ul className="space-y-1.5 pb-5 pl-7">
            {points.map(p => <li key={p} className="text-[15px] leading-relaxed text-muted">— {p}</li>)}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  useAssemble(ref);
  const [lead, ...rest] = hackathons;
  return (
    <section id="experience" ref={ref} className="relative mx-auto max-w-[1440px] scroll-mt-24 px-4 py-24 sm:px-8 md:py-36">
      <FrameName name="Experience · timeline" />
      <Eyebrow n="04">Experience & achievements</Eyebrow>
      <h2 data-piece data-by="architect" data-from="-300,80,-4" data-label="heading" className="t-h2 mb-14">
        Learning by <span className="t-serif">doing</span>
      </h2>

      <Stats />

      <div className="mt-16 grid gap-14 lg:grid-cols-12">
        <div data-piece data-by="architect" data-from="-320,200,-4" data-label="timeline" data-grab="0.2,0.05" className="lg:col-span-7">
          <h3 className="t-eyebrow mb-4">Education</h3>
          <ul className="mb-12">
            {education.map(e => (
              <li key={e.title} className="surface flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
                <div>
                  <div className="text-[19px] font-bold tracking-tight">{e.title}</div>
                  <div className="text-[14px] text-muted">{e.org}</div>
                </div>
                <div className="text-right font-mono text-[12px] text-faint">{e.period}<br />{e.detail}</div>
              </li>
            ))}
          </ul>
          <h3 className="t-eyebrow mb-1">Internships · {internships.length}</h3>
          <ul className="border-t border-line">
            {internships.map((x, i) => <Row key={x.company} {...x} i={i} />)}
          </ul>
          {leadership.length > 0 && (
            <>
              <h3 className="t-eyebrow mb-3 mt-12">Leadership</h3>
              <ul className="space-y-3">
                {leadership.map(l => (
                  <li key={l.title} className="surface p-5"><div className="font-bold">{l.title} · {l.org}</div><div className="text-[14px] text-muted">{l.period} — {l.detail}</div></li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="lg:col-span-5">
          <div data-piece data-by="creator" data-from="320,120,7" data-label="SIH 2025" data-grab="0.5,0.25">
            <h3 className="t-eyebrow mb-4">Hackathons · {hackathons.length}</h3>
            <div className="relative overflow-hidden rounded-[22px] bg-ink p-7 text-bg sm:p-8">
              <Trophy className="absolute -right-4 -top-4 h-36 w-36 rotate-12 opacity-10" />
              <span className="inline-flex rounded-full bg-[#FFD84D] px-3 py-1 text-[12px] font-bold text-[#161616]">🏆 {lead.result}</span>
              <div className="mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-[.95] tracking-[-0.04em]">{lead.name}</div>
              <div className="mt-2 text-[14px] opacity-70">{lead.org} · {lead.level} level</div>
            </div>
          </div>
          <ul data-piece data-by="innovator" data-from="300,260,-5" data-label="hackathon list" data-grab="0.5,0.08" className="mt-4 divide-y divide-line">
            {rest.map(h => (
              <li key={h.name} className="group flex items-center justify-between gap-4 py-3.5">
                <span className="text-[15px] font-semibold transition-transform duration-300 group-hover:translate-x-1">{h.name}</span>
                <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 font-mono text-[10.5px] text-faint">{h.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
