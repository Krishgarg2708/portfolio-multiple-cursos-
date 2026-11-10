/**
 * Everything personal lives here. Edit this file (and src/data/*) to update the site.
 * Links set to `null` render as disabled "coming soon" controls instead of fake URLs.
 */
export const site = {
  name: 'Krish Garg',
  shortName: 'KG',
  heading: ['Building', 'digital', 'experiences', 'that matter.'],
  subtitle: 'Computer Science Student | Full-Stack Developer | AI & Technology Enthusiast',
  intro:
    'B.Tech student at Manav Rachna University who turns ideas into working software — AI tools, data-driven apps and full-stack products built end to end.',
  location: 'Delhi NCR, India',
  available: true,
  email: 'krish.garg2708@gmail.com',
  resume: '/Krish_Garg_Resume.pdf',
  photo: 'https://lh3.googleusercontent.com/d/1hTaGITAsWJqBQQyfdCe5r4qAKlU2jxHd',
  socials: {
    github: 'https://github.com/Krishgarg2708',
    linkedin: 'https://www.linkedin.com/in/krish-garg-047649330/',
    twitter: null as string | null,
    instagram: null as string | null,
  },
  /**
   * Optional form backend (e.g. a Formspree endpoint). Set VITE_FORM_ENDPOINT in .env.
   * Without it, the contact form opens the visitor's email app with the message pre-filled.
   */
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || null,
};

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;
