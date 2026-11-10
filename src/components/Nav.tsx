import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { nav, site } from '../config/site';
import { useActiveSection, useTheme } from '../hooks';
import { CURSORS } from '../engine/cursors';
import { CursorArrow } from '../engine/CursorLayer';
import { Magnetic } from './ui';

function Logo() {
  return (
    <a href="#top" className="group relative flex items-center gap-2.5" aria-label={`${site.name} — back to top`}>
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-ink font-serif text-[20px] italic text-bg">
        {site.shortName[0]}
        <span className="logo-cursor absolute -bottom-2 -right-2"><CursorArrow color="#2F6BFF" size={20} /></span>
      </span>
      <span className="hidden whitespace-nowrap text-[14px] font-semibold tracking-tight lg:block">{site.name}</span>
    </a>
  );
}

export function Nav() {
  const active = useActiveSection(nav.map(n => n.id));
  const [theme, toggle] = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  const ThemeBtn = (
    <button onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} data-cursor={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line bg-surface text-ink hover:border-ink/30">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ y: 18, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: -18, rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5">
        <div className={`mx-auto flex h-16 max-w-[1440px] items-center gap-3 rounded-[20px] px-3 transition-[background-color,box-shadow,border-color] duration-500 sm:px-4 ${scrolled || open ? 'border border-line bg-surface/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,.35)] backdrop-blur-xl' : 'border border-transparent'}`}>
          <Logo />
          <nav aria-label="Primary" className="mx-auto hidden md:block">
            <ul className="flex items-center gap-1 rounded-full p-1">
              {nav.map(n => (
                <li key={n.id} className="relative">
                  {active === n.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}
                    className={`relative block rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${active === n.id ? 'text-bg' : 'text-muted hover:text-ink'}`}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <div className="mr-1 hidden -space-x-2 xl:flex" aria-label="7 collaborators online">
              {CURSORS.map(c => (
                <span key={c.id} title={c.name} className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface text-[11px] font-bold text-white" style={{ background: c.color }}>{c.name[0]}</span>
              ))}
            </div>
            {ThemeBtn}
            <Magnetic href={site.resume} download variant="accent" className="hidden !h-10 !px-5 !text-[14px] sm:inline-flex" cursor="Download">Resume</Magnetic>
            <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bg md:hidden">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[95] flex flex-col bg-bg px-6 pb-10 pt-28 md:hidden" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}>
            <nav aria-label="Mobile">
              <ul>
                {nav.map((n, i) => (
                  <motion.li key={n.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }} className="border-b border-line">
                    <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4 text-[44px] font-extrabold uppercase tracking-[-0.05em]">
                      {n.label}<span className="font-mono text-[12px] font-normal text-faint">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto flex gap-3">
              <Magnetic href={site.resume} download variant="accent" className="flex-1">Download resume</Magnetic>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
