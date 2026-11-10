# Krish Garg — Multiplayer Cursor Portfolio

A personal portfolio where seven collaborator cursors (Designer, Developer, Creator, Explorer, Architect, Builder, Innovator) assemble the page live, like a shared design file. Every section is built in front of the visitor, and they can grab the pieces themselves.

**Stack:** React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · GSAP 3 (ScrollTrigger and Draggable) · Motion (Framer Motion) · Lucide icons

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # runs the type check, then the production build in dist/
npm run preview    # serves the production build
```

Requires Node 18 or newer.

## Edit your content

| What | Where |
| --- | --- |
| Name, heading, subtitle, email, resume, social links | `src/config/site.ts` |
| Projects (text, stack, GitHub/live links, accent colour) | `src/data/projects.ts` |
| About, skills, education, internships, hackathons, stats, leadership | `src/data/profile.ts` |
| Cursor names, colours, chat lines | `src/engine/cursors.ts` |
| Colours and theme tokens | `src/index.css` (`:root` and `[data-theme=dark]`) |
| Resume PDF / favicon | `public/` |

A link set to `null` shows as a disabled "coming soon" control. The site never shows an invented URL.

### Contact form
- **With a form service:** create a `.env` file containing `VITE_FORM_ENDPOINT=https://formspree.io/f/xxxx` (any endpoint that accepts a JSON POST). The form posts to it and shows a success message.
- **Without one (default):** the form validates the input, then opens the visitor's email app with the message pre-filled. The page tells the visitor this before they press send.

## How the cursor engine works

`src/engine/engine.ts` is one GSAP-driven engine. React renders each cursor once, and every movement after that is a GSAP transform, so the page never re-renders during the animation.

You mark elements in the markup and the engine places them:

```tsx
<div data-piece data-by="creator" data-from="-300,120,-6" data-label="card" data-grab="0.5,0.2" data-drag>…</div>
<h1 data-piece data-by="designer" data-action="marquee">…<span data-line>Word</span>…</h1>
```

| Attribute | What it does |
| --- | --- |
| `data-piece` | The element gets placed by a collaborator |
| `data-by` | Which cursor places it |
| `data-from` | Starting offset: x, y in px, then rotation in degrees |
| `data-grab` | Where the cursor holds it, as a fraction of width and height |
| `data-action="marquee"` | The cursor draws a frame first, then the `[data-line]` children reveal |
| `data-drag` | The visitor can drag it afterwards (GSAP Draggable) |

- **Choreography:** each cursor runs its own GSAP timeline. It flies in from its home edge, hovers the piece (dashed outline), clicks (ripple), drags it into place and lets go. The hero plays after the preloader. Every other section plays when it scrolls into view (`useAssemble`).
- **Presence:** after the hero is built, 2–3 cursors keep wandering, chat now and then, and say hi when your pointer gets close. A seeded random generator makes every visit play the same way.
- **Trails:** one shared GSAP ticker draws the trail dots for all cursors.
- **Visitor:** the real system cursor stays visible and works normally. A "You" tag follows it and names what each element does. Scrolling, pressing a key or clicking "Skip intro" finishes the intro instantly.
- **Modes:**
  - `full`: mouse users.
  - `touch`: phones and tablets. Tap rings and name chips replace the cursors.
  - `off`: `prefers-reduced-motion`. Everything is shown straight away with no animation.

## Features
- Preloader where the collaborators "join the file"
- Interactive dot-grid background that reacts to the pointer and pauses when off-screen
- Draggable hero layers with a "Reset layout" button
- Skill board where the tags fall into place and can be dragged around
- Bento project grid with 3D tilt, a pointer-following sheen and hover reveals
- Project details dialog with focus handling, Esc / arrow-key navigation and shareable `#project/<id>` URLs
- Experience timeline with expandable rows, count-up stats and a hackathon wall
- Magnetic buttons, active-section navigation, dark/light theme without a flash on load, full-screen mobile menu
- Semantic HTML, skip link, visible focus styles, labelled controls, SEO and Open Graph meta tags

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project** and import the repository. Vercel detects Vite on its own: build command `npm run build`, output folder `dist`.
3. If you use a form service, add `VITE_FORM_ENDPOINT` under **Settings → Environment Variables**.
4. Deploy.

Or from the terminal: `npm i -g vercel && vercel --prod`.

## Still to fill in
- `src/data/projects.ts`: project descriptions are short first drafts, and every `github` / `live` link is `null` until you add the real ones.
- `src/data/profile.ts`: `leadership` is empty, so that block stays hidden until you add entries.
- `site.socials.twitter` / `instagram`: `null`, so they are hidden.
- The profile photo loads from Google Drive (`site.photo`). Self-hosting it in `public/` is faster and more reliable.
