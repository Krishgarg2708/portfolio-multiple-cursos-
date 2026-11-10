import { useRef } from 'react';
import { about } from '../data/profile';
import { site } from '../config/site';
import { useAssemble } from '../engine/useAssemble';
import { Eyebrow, FrameName } from '../components/ui';

export function About() {
  const ref = useRef<HTMLElement>(null);
  useAssemble(ref);
  return (
    <section id="about" ref={ref} className="relative mx-auto max-w-[1440px] scroll-mt-24 px-4 py-24 sm:px-8 md:py-36">
      <FrameName name="About · editorial" />
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow n="01">About</Eyebrow>
          <div data-piece data-by="designer" data-from="-320,120,-4" data-label="intro">
            <p className="text-[clamp(1.9rem,4.4vw,3.9rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
              {about.lead.split('—')[0]}—<span className="t-serif text-muted">{about.lead.split('—')[1]}</span>
            </p>
          </div>

          <dl data-piece data-by="explorer" data-from="-260,220,3" data-label="facts" className="mt-14 divide-y divide-line border-y border-line">
            {about.blocks.map(b => (
              <div key={b.k} className="group grid gap-1 py-5 sm:grid-cols-[180px_1fr] sm:gap-8">
                <dt className="t-eyebrow pt-1 transition-colors group-hover:text-ink">{b.k}</dt>
                <dd className="text-[17px] leading-relaxed transition-transform duration-500 group-hover:translate-x-1.5">{b.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 lg:pl-8">
          <figure data-piece data-by="architect" data-from="300,-160,10" data-label="portrait" data-grab="0.6,0.2" className="lg:sticky lg:top-28">
            <div className="surface rotate-[2deg] p-3 pb-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-sunk">
                <img src={site.photo} alt={`Portrait of ${site.name}`} loading="lazy" decoding="async" referrerPolicy="no-referrer"
                  className="h-full w-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <span className="absolute inset-0 -z-10 grid place-items-center font-serif text-[120px] italic text-faint">{site.shortName}</span>
              </div>
              <figcaption className="mt-4 flex items-center justify-between px-1">
                <span className="font-serif text-[22px] italic">{site.name.split(' ')[0].toLowerCase()}.jpg</span>
                <span className="font-mono text-[11px] text-faint">Manav Rachna University</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
