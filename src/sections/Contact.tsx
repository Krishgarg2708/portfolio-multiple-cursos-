import { useRef } from 'react';
import { ArrowUp, ArrowUpRight, Github, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import { site } from '../config/site';
import { useAssemble } from '../engine/useAssemble';
import { ContactForm } from '../components/ContactForm';
import { Eyebrow, FrameName } from '../components/ui';

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useAssemble(ref);
  const links = [
    { href: `mailto:${site.email}`, label: site.email, icon: Mail, name: 'Email' },
    { href: site.socials.linkedin, label: 'LinkedIn', icon: Linkedin, name: 'LinkedIn' },
    { href: site.socials.github, label: 'GitHub', icon: Github, name: 'GitHub' },
    { href: site.socials.twitter, label: 'X / Twitter', icon: Twitter, name: 'Twitter' },
    { href: site.socials.instagram, label: 'Instagram', icon: Instagram, name: 'Instagram' },
  ].filter(l => l.href);

  return (
    <section id="contact" ref={ref} className="relative mx-auto max-w-[1440px] scroll-mt-24 px-4 pb-10 pt-24 sm:px-8 md:pt-36">
      <FrameName name="Contact · final frame" />
      <Eyebrow n="05">Contact</Eyebrow>
      <h2 data-piece data-by="designer" data-from="-340,120,-5" data-label="call to action" className="text-[clamp(3rem,10.5vw,10rem)] font-extrabold uppercase leading-[.86] tracking-[-0.055em]">
        Have an idea?<br /><span className="t-serif">Let's build it.</span>
      </h2>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div data-piece data-by="innovator" data-from="320,200,6" data-label="contact form" data-grab="0.5,0.08" className="surface p-5 sm:p-8 lg:col-span-7">
          <ContactForm />
        </div>
        <div data-piece data-by="explorer" data-from="300,-60,-6" data-label="links" className="lg:col-span-5">
          <h3 className="t-eyebrow mb-3">Elsewhere</h3>
          <ul className="border-t border-line">
            {links.map(l => (
              <li key={l.name}>
                <a href={l.href!} target={l.href!.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" data-cursor={l.name}
                  className="group flex items-center gap-4 border-b border-line py-5 transition-colors hover:text-accent">
                  <l.icon size={20} className="shrink-0" />
                  <span className="flex-1 truncate text-[clamp(1.1rem,2vw,1.5rem)] font-semibold tracking-tight">{l.label}</span>
                  <ArrowUpRight size={20} className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">Open to internships, freelance builds and hackathon teams. I usually reply within a day or two.</p>
        </div>
      </div>

      <footer className="mt-28 border-t border-line pt-8">
        <div className="text-[clamp(3.5rem,17vw,16rem)] font-extrabold uppercase leading-[.8] tracking-[-0.06em] text-ink/[.07]" aria-hidden>{site.name}</div>
        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 font-mono text-[12px] text-faint sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {site.name} · built with 7 collaborators who don't exist</span>
          <a href="#top" className="inline-flex items-center gap-2 hover:text-ink">Back to top <ArrowUp size={14} /></a>
        </div>
      </footer>
    </section>
  );
}
