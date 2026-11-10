/**
 * Centralised project data. Descriptions here are short first drafts —
 * replace them with your own write-ups, and add real URLs to `github` / `live`.
 * A `null` link renders as a disabled "Link coming soon" button.
 */
export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  github: string | null;
  live: string | null;
  accent: string;
  /** which preview illustration to draw */
  preview: 'retail' | 'shield' | 'vision' | 'flow' | 'map' | 'network';
};

export const projects: Project[] = [
  {
    id: 'smartkirana',
    title: 'SmartKirana',
    category: 'Retail · Full-Stack',
    year: '2026',
    tagline: 'Digital inventory and billing for neighbourhood kirana stores.',
    description:
      'A store-management app for small Indian grocery shops: track stock, generate bills and see what sells, from a phone or a counter laptop.',
    highlights: ['Stock tracking with low-stock alerts', 'Quick billing flow', 'Sales overview dashboard'],
    stack: ['React', 'TypeScript', 'FastAPI', 'MySQL', 'Tailwind CSS'],
    github: null,
    live: null,
    accent: '#FF8A00',
    preview: 'retail',
  },
  {
    id: 'zerotrustx',
    title: 'ZeroTrustX',
    category: 'Cybersecurity',
    year: '2026',
    tagline: 'Never trust, always verify — a zero-trust access layer.',
    description:
      'A zero-trust security project that verifies every request on identity, device and context instead of trusting anything inside the network perimeter.',
    highlights: ['Per-request verification', 'Policy-based access decisions', 'Audit trail of access events'],
    stack: ['Python', 'FastAPI', 'React', 'MongoDB'],
    github: null,
    live: null,
    accent: '#7C5CFF',
    preview: 'shield',
  },
  {
    id: 'rakshanetra',
    title: 'RakshaNetra',
    category: 'AI · Computer Vision',
    year: '2025',
    tagline: 'An AI "protective eye" for safety monitoring.',
    description:
      'A safety-monitoring system that uses AI on camera feeds to flag incidents early and surface them to the people who can respond.',
    highlights: ['Camera-feed analysis', 'Incident flagging', 'Responder alerts'],
    stack: ['Python', 'Scikit-learn', 'FastAPI', 'Firebase'],
    github: null,
    live: null,
    accent: '#F04438',
    preview: 'vision',
  },
  {
    id: 'autoflow-ai',
    title: 'AutoFlow AI',
    category: 'AI · Automation',
    year: '2025',
    tagline: 'Describe a workflow, let AI build and run it.',
    description:
      'An automation tool that turns plain-language instructions into multi-step workflows — triggers, actions and AI steps chained together.',
    highlights: ['Natural-language workflow builder', 'Chained AI + API steps', 'Run history'],
    stack: ['TypeScript', 'React', 'FastAPI', 'Python'],
    github: null,
    live: null,
    accent: '#2F6BFF',
    preview: 'flow',
  },
  {
    id: 'nearbuy',
    title: 'NearBuy',
    category: 'Marketplace · Mobile-first',
    year: '2025',
    tagline: 'Find what you need in the shops around you.',
    description:
      'A hyperlocal marketplace that connects people with nearby stores, so they can check availability and order from local sellers.',
    highlights: ['Location-based store discovery', 'Live product availability', 'Seller dashboard'],
    stack: ['React', 'Firebase', 'Tailwind CSS', 'JavaScript'],
    github: null,
    live: null,
    accent: '#12B76A',
    preview: 'map',
  },
  {
    id: 'netsentinel',
    title: 'NetSentinel',
    category: 'Security · Data',
    year: '2025',
    tagline: 'Watches network traffic and flags what looks wrong.',
    description:
      'A network-monitoring tool that analyses traffic data and uses machine learning to highlight unusual activity worth investigating.',
    highlights: ['Traffic analysis pipeline', 'ML-based anomaly detection', 'Readable alert reports'],
    stack: ['Python', 'Pandas', 'Scikit-learn', 'FastAPI'],
    github: null,
    live: null,
    accent: '#00A7BD',
    preview: 'network',
  },
];
