import { ReactNode, useRef } from 'react';
import { useMagnetic } from '../hooks';

type BtnProps = {
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost' | 'accent';
  children: ReactNode;
  className?: string;
  download?: boolean;
  external?: boolean;
  cursor?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
};

const styles = {
  solid: 'bg-ink text-bg hover:opacity-90',
  ghost: 'border border-line bg-surface text-ink hover:border-ink/30',
  accent: 'bg-accent text-white hover:brightness-110',
};

/** Button / link that leans toward the pointer. */
export function Magnetic({ href, onClick, variant = 'solid', children, className = '', download, external, cursor, type = 'button', disabled, ariaLabel }: BtnProps) {
  const ref = useRef<HTMLElement>(null);
  useMagnetic(ref);
  const cls = `group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-[opacity,filter,border-color] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`;
  const inner = <span className="pointer-events-none inline-flex items-center gap-2">{children}</span>;
  if (href)
    return (
      <a ref={ref as any} href={href} download={download} aria-label={ariaLabel} data-cursor={cursor}
        target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cls}>{inner}</a>
    );
  return <button ref={ref as any} type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} data-cursor={cursor} className={cls}>{inner}</button>;
}

export function Eyebrow({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="t-eyebrow mb-6 flex items-center gap-3">
      <span className="text-ink">{n}</span>
      <span className="h-px w-10 bg-line" />
      <span>{children}</span>
    </div>
  );
}

/** Small "layer" caption above sections, like a frame name on a design canvas. */
export function FrameName({ name }: { name: string }) {
  return (
    <div className="mb-10 flex items-center gap-2 font-mono text-[11px] text-faint" aria-hidden>
      <svg width="11" height="11" viewBox="0 0 12 12"><path d="M3 0v12M9 0v12M0 3h12M0 9h12" stroke="currentColor" /></svg>
      {name}
    </div>
  );
}
