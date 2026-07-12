# ✨ Rafid Hossain — Portfolio Website

> A custom-built, motion-first portfolio site crafted from scratch — no frameworks, no templates, just handwritten HTML, CSS & JS engineered to feel alive.

**🔗 Live site:** [mirrafidhossain.com](https://mirrafidhossain.com)

---

## 🧭 About This Project

This is the personal portfolio website of **Rafid Hossain**, built for him as a client project — converted from a Framer design concept into a fully custom, framework-free HTML/CSS/JS build. Every interaction, from the navbar to the project gallery, was hand-coded for performance, polish, and personality.

No React. No Vue. No bloated UI library. Just clean, deliberate front-end engineering.

---

## 🎨 Highlights

| Feature | Description |
|---|---|
| 🧊 **Sticky Direction-Aware Image Card** | A pinned image panel on the About page that crossfades/slides between photos *based on scroll direction* — up or down — using a custom two-layer animation system |
| 🎠 **Infinite Projects Carousel** | Auto-generated, data-driven project grid with pagination, a featured project spotlight, and a smooth in-page lightbox for viewing work |
| 🌗 **Dark / Light Theme Engine** | Instant, flicker-free theme switching with `localStorage` persistence and full dark-mode token overrides |
| 📱 **Expanding Pill Navbar** | A navbar that morphs into an animated mobile menu panel, complete with flip-text nav links and an "Available for Work" pulse indicator |
| ⚡ **Scroll Reveal System** | IntersectionObserver-powered fade/slide-in animations across sections, staggered for visual rhythm |
| 🖼️ **Achievements & Journey Timeline** | A structured, scannable timeline of experience, tools, and accomplishments |

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
- **CSS3** — Custom properties (design tokens), Grid/Flexbox layouts, fluid `clamp()` typography
- **Vanilla JavaScript** — Zero dependencies, powered by `IntersectionObserver`, `requestAnimationFrame`, and thoughtful DOM choreography
- **Font Awesome** & **Google Fonts** (Anton + Inter)

---

## 💡 Engineering Notes

A few of the trickier problems solved in this build:

- **Direction-aware transitions** — the sticky image card tracks scroll direction in real time so images enter from the top when scrolling up and from the bottom when scrolling down, mimicking native app-like motion.
- **Fixed-position pin/park system** — the sticky card intelligently switches between `fixed` (pinned mid-scroll) and `absolute` (parked at section end) positioning, recalculated on scroll/resize for pixel-perfect anchoring.
- **Config-driven content** — both the Projects gallery and About page images are managed through simple JS config objects (`PROJECTS[]`, `CARD_IMAGES{}`), so content updates never require touching markup or animation logic.

---

## 👨‍💻 Credits

Designed & developed by **[MD Touhidul Islam Kanon](https://github.com/tislamkanon)**
Client: Rafid Hossain

---

<p align="center">Made with care, caffeine, and a lot of scroll-testing ☕</p>