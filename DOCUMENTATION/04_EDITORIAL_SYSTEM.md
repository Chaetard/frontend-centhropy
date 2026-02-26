# 04 — Editorial System (CES v5.0)

## Overview
The **Centhropy Editorial System (CES)** is a custom-built content management engine integrated into the project. It provides a professional-grade writing and publishing experience with a "Notion-like" aesthetic.

## Architecture
The system is built on three pillars:
1. **Engine**: `useEditorial.js` (Centralizes all logic).
2. **Dashboard**: `EditorialPanel.jsx` (Overview, Slot management, Authors).
3. **Builder**: `PostEditor.jsx` (Three-column writing experience).

---

## The Block Editor
Articles are composed of discrete content blocks, allowing for flexible layouts.
- **Paragraph**: Standard body text.
- **Heading 2/3**: Section naming.
- **Quote**: High-impact editorial callouts.
- **Image**: Inline media with captions (Local upload or URLs).
- **Callout**: Insight boxes with amber highlighting.
- **List**: Bulleted or numbered lists with enter/backspace handling.
- **Divider**: Visual separators.

---

## SEO & Analysis Engine
Located in the right sidebar of the editor:
- **Real-time Word Counter**: Updates as you type.
- **SEO Indicators**: Green/Amber feedback on title length, excerpt presence, and keyword density.
- **GEO Summary**: A dedicated field for LLMs and AI search engines to pull direct answers.
- **Advanced Tags**: Meta-robots (noIndex), canonical URLs, and OG images.

---

## Slot System
The website's global navigation menu has **4 dynamic slots** controlled via the CMS:
1. Slot 01 — Main News (featured)
2. Slot 02 — Secondary News
3. Slot 03 — Corporate Announcement
4. Slot 04 — Impact Study / Case Study

Editors can link any `active` post to any slot with a single click in the **"Menú Slots"** tab.

---

## Author Management
A complete directory of editorial staff.
- Centralized avatars.
- Auto-assignment of "Engineering Team" or "Strategy" defaults.
- One-click reassignment of posts when an author is removed.

---

## Security
Access is gated at `/terminal-x92-core`.
- Auth is persisted via `ces_authorized` in localStorage.
- Unauthorized access attempts are redirected to the core login.
