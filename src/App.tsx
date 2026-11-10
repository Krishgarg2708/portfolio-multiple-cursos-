import { useCallback, useEffect, useState } from 'react';
import { engine } from './engine/engine';
import { CursorLayer } from './engine/CursorLayer';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { YouTag } from './components/YouTag';
import { ProjectModal } from './components/ProjectModal';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { Experience } from './sections/Experience';
import { Contact } from './sections/Contact';
import { Project, projects } from './data/projects';

const fromHash = () => {
  const m = window.location.hash.match(/^#project\/(.+)$/);
  return m ? projects.find(p => p.id === m[1]) ?? null : null;
};

export default function App() {
  // decided once, before any section prepares its pieces
  const [mode] = useState(() => (engine.mode = engine.detectMode()));
  const [loaded, setLoaded] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const open = useCallback((p: Project) => {
    setProject(p);
    history.replaceState(null, '', `#project/${p.id}`);
  }, []);
  const close = useCallback(() => {
    setProject(null);
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const p = fromHash();
    if (p) setProject(p);
    const onHash = () => setProject(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [loaded]);

  return (
    <div className="relative overflow-x-clip">
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Nav />
      <main>
        <Hero started={loaded} onOpen={open} />
        <About />
        <Skills />
        <Projects onOpen={open} />
        <Experience />
        <Contact />
      </main>
      <CursorLayer showCursors={mode === 'full'} />
      <YouTag />
      <ProjectModal project={project} onClose={close} onNav={open} />
    </div>
  );
}
