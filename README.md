# ✨ Rafid Hossain — Portfolio Website

> A custom-built, motion-first portfolio site engineered from the ground up — no frameworks, no templates, just handwritten HTML, CSS & JavaScript designed to feel alive.

**🔗 Live site:** [mirrafidhossain.com](https://mirrafidhossain.com)

---

## 🧭 About This Project

This is the personal portfolio website of **Rafid Hossain**, designed and developed as a client project for his professional brand and creative work showcase. The entire site — from layout to motion to content structure — was built completely from scratch in raw HTML, CSS, and JavaScript.

No React. No Vue. No page builder. No third-party UI kit. Every animation, transition, and interaction was hand-coded and hand-tuned, giving full control over performance, accessibility, and feel.

The site is structured as a multi-page experience:
- **Home** — hero introduction, services overview, project previews, and contact
- **About** — an extended narrative page covering journey, tools, and achievements
- **Projects Archive** — a full, paginated gallery of past work with a featured spotlight

---

## 🎨 Highlights

| Feature | Description |
|---|---|
| 🧊 **Sticky Direction-Aware Image Card** | A pinned image panel on the About page that slides between photos *based on live scroll direction* — entering from the bottom when scrolling down, from the top when scrolling up — powered by a custom two-layer crossfade animation system |
| 📌 **Smart Pin/Park Positioning** | The sticky image dynamically switches between `fixed` (pinned mid-scroll) and `absolute` (parked at section end) positioning, recalculated live on scroll and resize for pixel-perfect placement at every breakpoint |
| 🎠 **Data-Driven Projects Gallery** | A fully dynamic project grid with pagination, a featured project spotlight, and an in-page lightbox for viewing full project images — no page reloads |
| 🌗 **Dark / Light Theme Engine** | Instant, flicker-free theme switching using an inline pre-paint script, `localStorage` persistence, and complete dark-mode token overrides across every component |
| 📱 **Expanding Pill Navbar** | A collapsible navbar that morphs into an animated mobile menu panel, complete with flip-text hover effects on nav links and a live "Available for Work" pulse indicator |
| ⚡ **Scroll Reveal System** | `IntersectionObserver`-powered fade/slide-in animations across every section, staggered for a natural, cascading rhythm |
| 🖼️ **Achievements & Journey Timeline** | A structured, scannable timeline layout presenting experience, tools used, and key milestones |
| ♿ **Accessibility Considerations** | Semantic markup, ARIA labels on interactive controls, keyboard-dismissible lightbox (Escape key), and focus management on modal open/close |

---

## 🗂️ Project Structure

```
├── index.html                # Main landing page (hero, services, projects, contact)
├── about.html                 # Extended "story" page — journey, tools, achievements
├── projects_list.html         # Full projects archive with pagination & lightbox
│
├── css/
│   ├── styles.css             # Core design system — tokens, navbar, global layout
│   ├── about.css               # About/story page specific styles
│   └── projects_list.css       # Projects archive & lightbox styles
│
├── js/
│   ├── script.js               # Shared site-wide interactions (navbar, theme, reveals)
│   ├── about-page.js           # Sticky image pin logic + scroll-direction transitions
│   └── projects_list.js        # Data-driven project rendering, pagination, lightbox
│
└── assets/                     # Images, icons, and media
```

---

## 🛠️ Built With

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties (design tokens), Grid/Flexbox layouts, fluid `clamp()`-based responsive typography
- **Vanilla JavaScript (ES6+)** — Zero external dependencies, built on `IntersectionObserver`, `requestAnimationFrame`, and precise DOM choreography
- **Font Awesome** & **Google Fonts** (Anton + Inter) for iconography and typography

---

## 💡 Engineering Notes

A few of the trickier problems solved in this build:

- **Direction-aware transitions** — the sticky image card tracks live scroll direction so incoming images always animate in from the correct side, mimicking native app-like motion rather than a generic fade.
- **Fixed-position pin/park system** — rather than relying on native `position: sticky` (which breaks down across multi-section layouts), the card's position, width, and offset are recalculated in real time on scroll and resize, so it stays pinned exactly where intended and "parks" cleanly at the section boundary.
- **Config-driven content** — both the Projects gallery and About page imagery are managed through simple JavaScript config objects (`PROJECTS[]`, `CARD_IMAGES{}`), so future content updates never require touching markup or animation logic.
- **Theme persistence without flicker** — an inline script runs before first paint to apply the saved theme, preventing the light/dark "flash" common in client-side theme toggles.

---

## 👨‍💻 Credits

Designed & developed by **[MD Touhidul Islam Kanon](https://github.com/tislamkanon)**
Client: Rafid Hossain

---

## 📜 License & Copyright

© 2025–2026 MD Touhidul Islam Kanon. All rights reserved.

This repository and its contents — including all source code, design, layout, and custom animation logic — are shared publicly **for portfolio and demonstration purposes only**.

**This project is NOT open source and is not licensed for reuse, redistribution, modification, or commercial use.** No permission is granted to copy, fork, deploy, resell, or repurpose any part of this codebase or design without explicit written consent from the author.

If you're interested in similar work or would like to collaborate, please reach out directly.

---

<p align="center">Made with care, caffeine, and a lot of scroll-testing ☕</p>
