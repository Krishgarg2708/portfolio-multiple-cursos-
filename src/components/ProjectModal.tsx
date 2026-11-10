import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, Github, X } from 'lucide-react';
import { Project, projects } from '../data/projects';
import { ProjectPreview } from './ProjectPreview';

function LinkBtn({ href, label, icon }: { href: string | null; label: string; icon: React.ReactNode }) {
  if (!href)
    return (
      <span className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-line px-5 text-[14px] font-medium text-faint" title="Add this URL in src/data/projects.ts">
        {icon} {label} · coming soon
      </span>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-bg hover:opacity-90">
      {icon} {label}
    </a>
  );
}

/** Project details. URL hash (#project/<id>) makes each one linkable. */
export function ProjectModal({ project, onClose, onNav }: { project: Project | null; onClose: () => void; onNav: (p: Project) => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => closeBtn.current?.focus(), 60);
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      const i = projects.findIndex(p => p.id === project.id);
      if (e.key === 'ArrowRight') onNav(projects[(i + 1) % projects.length]);
      if (e.key === 'ArrowLeft') onNav(projects[(i - 1 + projects.length) % projects.length]);
    };
    window.addEventListener('keydown', key);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', key);
      lastFocus.current?.focus?.();
    };
  }, [project?.id]);

  const i = project ? projects.findIndex(p => p.id === project.id) : 0;
  const next = projects[(i + 1) % projects.length];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            role="dialog" aria-modal="true" aria-labelledby="pm-title"
            className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-surface shadow-2xl sm:rounded-[28px]"
            initial={{ y: 80, opacity: 0, rotate: -1 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-[16/8] overflow-hidden">
              <ProjectPreview p={project} />
              <button ref={closeBtn} onClick={onClose} aria-label="Close project" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-surface/90 text-ink shadow-lg backdrop-blur hover:bg-surface">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 sm:p-10">
              <div className="t-eyebrow mb-3 flex flex-wrap gap-x-3">
                <span style={{ color: project.accent }}>{project.category}</span><span>{project.year}</span>
                <span>{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
              </div>
              <h2 id="pm-title" className="text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold leading-[.95] tracking-[-0.045em]">{project.title}</h2>
              <p className="mt-3 font-serif text-[clamp(1.25rem,2.6vw,1.6rem)] italic leading-snug text-muted">{project.tagline}</p>
              <p className="mt-6 text-[16px] leading-relaxed text-muted">{project.description}</p>

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="t-eyebrow mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {project.highlights.map(h => (
                      <li key={h} className="flex gap-2.5 text-[15px]"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: project.accent }} />{h}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="t-eyebrow mb-3">Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map(t => <span key={t} className="rounded-full border border-line px-3 py-1 text-[13px] font-medium">{t}</span>)}
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <LinkBtn href={project.live} label="Live demo" icon={<ArrowUpRight size={16} />} />
                <LinkBtn href={project.github} label="GitHub" icon={<Github size={16} />} />
              </div>

              <button onClick={() => onNav(next)} className="group mt-10 flex w-full items-center justify-between border-t border-line pt-6 text-left">
                <span>
                  <span className="t-eyebrow block">Next project</span>
                  <span className="text-[22px] font-bold tracking-tight">{next.title}</span>
                </span>
                <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
