# 02 — Architecture & File Structure

## Repository Root

```
CENTHROPY WEBSITE/
│
├── DOCUMENTATION/              ← Tech docs suite
├── PROYECTOS/                  ← Project logs and roadmaps
├── public/                     ← Assets (images, fonts)
│
├── src/
│   ├── main.jsx                ← Vite Entry point
│   ├── App.jsx                 ← Router & Page transitions
│   ├── CenthropyApp.jsx        ← Main Home Experience (Tactical HUD)
│   │
│   ├── editorial/              ← CMS Module
│   │   ├── AdminLogin.jsx      ← Locked portal
│   │   ├── EditorialPanel.jsx  ← Admin Dashboard
│   │   └── PostEditor.jsx      ← Content Builder
│   │
│   ├── hooks/
│   │   └── useEditorial.js     ← Central data engine (State/CRUD)
│   │
│   ├── components/             ← Reusable UI atoms
│   │   └── Logo.jsx, etc.
│   │
│   ├── Newsroom.jsx            ← Directory Page
│   ├── ImpactStudies.jsx       ← Directory Page
│   ├── CorporateAnnouncements.jsx ← Directory Page
│   └── BlogPost.jsx            ← Article Renderer
│
└── tailwind.config.js, etc.
```

---

## Technical Architecture

The site uses a Hybrid Architecture:

### 1. The Tactical Monolith (`CenthropyApp.jsx`)
The main landing page is a high-density component that manages the Three.js state and scroll-physics for the hero and core brand sections.

### 2. The Editorial Module
A modular system decoupled from the homepage that handles the lifecycle of content. It relies on the `useEditorial` hook for centralized state management and `localStorage` persistence.

### Rendering Layers (Main Site)
| Layer | z-index | Behavior |
|---|---|---|
| Canvas | `0` | Three.js WebGL background |
| HUDs | `1000` | Fixed side panels (Left/Right) |
| Content | `5000` | Scrollable info slides |

---

## Routing & Page Transitions
Handled in `App.jsx` using a `PageTransitionWrapper`.
- Transition: 150ms cover/reveal effect.
- Dynamic Paths: `/blog/:id` (renders structural blocks).
- Secured Paths: `/terminal-x92-core/dashboard` (Auth required).
