export type Edge = 'left' | 'right' | 'top' | 'bottom';

export const CURSORS = [
  { id: 'designer', name: 'Designer', color: '#FF3D8B', edge: 'left', roams: false, chatter: ['tightening the kerning', 'this grid works ✨', 'try the serif?'] },
  { id: 'developer', name: 'Developer', color: '#2F6BFF', edge: 'top', roams: false, chatter: ['build passing ✅', 'shipping to prod', 'types are clean'] },
  { id: 'creator', name: 'Creator', color: '#FF8A00', edge: 'right', roams: true, chatter: ['love this section', 'adding motion here', 'feels premium 🔥'] },
  { id: 'explorer', name: 'Explorer', color: '#12B76A', edge: 'bottom', roams: true, chatter: ['reading the projects', 'SIH finalist 👀', 'scrolling down…'] },
  { id: 'architect', name: 'Architect', color: '#7C5CFF', edge: 'right', roams: false, chatter: ['aligning to the grid', 'structure looks solid'] },
  { id: 'builder', name: 'Builder', color: '#F04438', edge: 'left', roams: false, chatter: ['stacking the tags', 'one more component'] },
  { id: 'innovator', name: 'Innovator', color: '#00A7BD', edge: 'bottom', roams: true, chatter: ['what if it was AI?', 'new idea 💡', 'let’s prototype it'] },
] as const;

export type CursorDef = (typeof CURSORS)[number];
export type CursorId = CursorDef['id'];
export const cursorById = Object.fromEntries(CURSORS.map(c => [c.id, c])) as Record<CursorId, CursorDef>;

/** Arrow tip position inside the 24×24 viewBox; used to align the tip with target points. */
export const TIP = { x: 4.2, y: 2.6 };
