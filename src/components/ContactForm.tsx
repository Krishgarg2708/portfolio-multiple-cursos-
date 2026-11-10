import { FormEvent, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { site } from '../config/site';

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (f.message.trim().length < 10) e.message = 'A little more detail, please (10+ characters).';
  return e;
}

/**
 * Real behaviour only: with VITE_FORM_ENDPOINT set it POSTs to that service;
 * otherwise it opens the visitor's email app with the message filled in, and says so up front.
 */
export function ContactForm() {
  const [f, setF] = useState<Fields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [trap, setTrap] = useState('');

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => { setTouched(t => ({ ...t, [k]: true })); setErrors(validate(f)); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length) {
      document.getElementById(`cf-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    if (trap) return; // bot
    if (site.formEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(site.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sent');
        setF({ name: '', email: '', message: '' });
        setTouched({});
      } catch {
        setStatus('error');
      }
      return;
    }
    const subject = encodeURIComponent(`Portfolio enquiry from ${f.name.trim()}`);
    const body = encodeURIComponent(`${f.message.trim()}\n\n— ${f.name.trim()} (${f.email.trim()})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus('mailto');
  };

  const field = (k: keyof Fields, label: string, type = 'text', area = false) => {
    const err = touched[k] && errors[k];
    const common = {
      id: `cf-${k}`, name: k, value: f[k], onChange: set(k), onBlur: blur(k),
      'aria-invalid': !!err, 'aria-describedby': err ? `cf-${k}-err` : undefined,
      className: `peer w-full rounded-2xl border bg-bg px-4 pb-3 pt-7 text-[16px] text-ink outline-none transition-colors placeholder:text-transparent focus:border-ink ${err ? 'border-[#F04438]' : 'border-line'}`,
      placeholder: label,
    };
    return (
      <div className="relative">
        {area ? <textarea {...common} rows={5} className={`${common.className} resize-none`} /> : <input {...common} type={type} autoComplete={k === 'email' ? 'email' : k === 'name' ? 'name' : undefined} />}
        <label htmlFor={`cf-${k}`} className="pointer-events-none absolute left-4 top-2.5 font-mono text-[10.5px] uppercase tracking-wider text-faint">{label}</label>
        {err && <p id={`cf-${k}-err`} role="alert" className="mt-1.5 pl-1 text-[13px] text-[#F04438]">{err}</p>}
      </div>
    );
  };

  if (status === 'sent')
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 text-center" role="status">
        <CheckCircle2 size={40} className="text-[#12B76A]" />
        <p className="text-[22px] font-bold">Message sent — thank you.</p>
        <p className="text-muted">I'll reply to your email soon.</p>
        <button onClick={() => setStatus('idle')} className="mt-2 text-[14px] font-semibold underline underline-offset-4">Send another</button>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-4" aria-label="Contact form">
      <div className="grid gap-4 sm:grid-cols-2">
        {field('name', 'Your name')}
        {field('email', 'Email', 'email')}
      </div>
      {field('message', 'What are you building?', 'text', true)}
      <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} className="hidden" aria-hidden />

      {!site.formEndpoint && status === 'idle' && (
        <p className="flex items-start gap-2 text-[13px] text-faint"><Info size={15} className="mt-0.5 shrink-0" />No form service is connected yet, so sending opens your email app with this message filled in.</p>
      )}
      {status === 'mailto' && <p role="status" className="text-[13px] text-muted">Your email app should have opened with the message ready. If it didn't, write to <a className="font-semibold text-ink underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>}
      {status === 'error' && <p role="alert" className="text-[13px] text-[#F04438]">Couldn't send right now. Please email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> directly.</p>}

      <button type="submit" disabled={status === 'sending'} data-cursor="Send"
        className="group mt-1 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-8 text-[16px] font-semibold text-bg transition hover:opacity-90 disabled:opacity-60">
        {status === 'sending' ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <>{site.formEndpoint ? 'Send message' : 'Send via email app'} <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>}
      </button>
    </form>
  );
}
