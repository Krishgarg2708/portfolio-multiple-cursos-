/** Skills, about, experience and achievements. Carried over from the original portfolio. */

export const skillGroups = [
  { title: 'Languages', note: 'The fundamentals', items: ['C', 'Python', 'Java', 'JavaScript', 'TypeScript'] },
  { title: 'Frontend', note: 'Interfaces people enjoy', items: ['React', 'HTML', 'CSS', 'Tailwind CSS'] },
  { title: 'Backend & Data', note: 'APIs and storage', items: ['FastAPI', 'MySQL', 'MongoDB', 'Firebase'] },
  { title: 'Data & ML', note: 'Making sense of data', items: ['Pandas', 'Scikit-learn'] },
  { title: 'Workflow', note: 'Shipping together', items: ['Git', 'GitHub'] },
];

export const about = {
  lead:
    'I build software at the point where AI, data and good interfaces meet — and I care about the whole thing working, not just the demo.',
  blocks: [
    { k: 'Education', v: 'B.Tech, Computer Science — Manav Rachna University' },
    { k: 'Interests', v: 'AI applications, machine learning, data analysis, intelligent automation, RAG systems' },
    { k: 'Background', v: '20+ projects across Python, ML and full-stack web, plus six industry internships in AI, data and UI/UX' },
    { k: 'Philosophy', v: 'Learn by building. Ship something real, measure it, then make it better.' },
    { k: 'Current focus', v: 'AI agents, retrieval-augmented systems and security-minded full-stack apps' },
  ],
};

export const education = [
  { title: 'B.Tech, Computer Science & Engineering', org: 'Manav Rachna University', period: 'Ongoing', detail: 'CGPA 6.9' },
];

export const internships = [
  { company: 'Codsoft', role: 'Artificial Intelligence Intern', period: 'Jun – Jul 2024', points: ['Built an unbeatable Tic-Tac-Toe AI with Minimax and alpha-beta pruning', 'Rule-based chatbot with intent classification', 'Image captioning with CNN feature extraction', 'Real-time face detection with OpenCV'] },
  { company: 'Bluestock Fintech', role: 'Data Analyst Intern', period: 'Jun – Jul 2024', points: ['Analysed financial datasets and built reporting visuals', 'Cleaned and prepared data for decision-making'] },
  { company: 'CodeIt Tech Solution', role: 'UI/UX Designer', period: 'May – Jul 2024', points: ['Designed user flows and interface prototypes'] },
  { company: 'Future Interns', role: 'UI/UX Designer', period: 'May – Jul 2024', points: ['Wireframes and high-fidelity screens for web products'] },
  { company: 'Skillcraft Technology', role: 'UI/UX Designer', period: 'Jun – Jul 2024', points: ['Designed responsive layouts and components'] },
  { company: 'Oasis Infobyte', role: 'UI/UX Designer', period: 'Apr – May 2024', points: ['Built interface designs for client-style briefs'] },
  { company: 'CodeAlpha', role: 'Frontend Developer Intern', period: 'Internship', points: ['Built responsive frontend projects'] },
];

export const hackathons = [
  { name: 'Smart India Hackathon 2025', org: 'Government of India', level: 'National', result: 'Finalist', highlight: true },
  { name: 'India Innovates 2026', org: 'Municipal Corporation of Delhi', level: 'National', result: 'Participant' },
  { name: 'NASA Space Apps Challenge', org: 'NASA', level: 'Global', result: 'Participant' },
  { name: 'Hackathon @ IIT Kanpur', org: 'IIT Kanpur', level: 'Institute', result: 'Participant' },
  { name: 'GDG Hacker Cup', org: 'KNIT Sultanpur', level: 'Institute', result: 'Participant' },
  { name: 'Hack4Delhi', org: 'NSUT Delhi', level: 'Institute', result: 'Participant' },
  { name: "Opencode'25", org: 'IIIT Allahabad', level: 'Institute', result: 'Participant' },
  { name: 'Hack Energy 2.0', org: 'HackGyan', level: 'Community', result: 'Participant' },
  { name: 'Neuro Knockout', org: 'DTU', level: 'Institute', result: 'Participant' },
  { name: 'Ai-Thon Global Coding Conquest', org: 'Online', level: 'Global', result: 'Participant' },
  { name: 'Code Clash', org: 'IIIT', level: 'Institute', result: 'Participant' },
  { name: 'Nerds Vibeathon', org: 'Online', level: 'Community', result: 'Participant' },
  { name: 'GitHub Portfolio Analyzer Hackathon', org: 'UnsaidTalks Education', level: 'Online', result: 'Participant' },
];

export const accomplishments = [
  { value: '20+', label: 'Projects shipped', note: 'AI, ML and full-stack' },
  { value: '6', label: 'Internships', note: 'AI, data and UI/UX' },
  { value: '14', label: 'Hackathons', note: 'SIH 2025 finalist' },
  { value: '50+', label: 'Certifications', note: 'AI, cloud, databases, Java' },
];

/** Add leadership roles here — the block stays hidden while this list is empty. */
export const leadership: { title: string; org: string; period: string; detail: string }[] = [];
