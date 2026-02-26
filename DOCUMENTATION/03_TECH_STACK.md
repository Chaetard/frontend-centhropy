# 03 — Technology Stack

## Core Framework
| Tech | Version | Role |
|---|---|---|
| **React** | `^19.2.0` | UI framework |
| **Vite** | `^7.3.1` | Build & Dev tool |
| **React Router**| `^7.2.0` | Client-side routing |

## Styling & Typography
- **TailwindCSS**: Utility-first CSS.
- **Lucide React**: Vector icons.
- **Funnel Display**: Primary UI font.
- **Unna**: Serif font used for high-legibility blog body text.

## 3D Graphics
- **Three.js**: Custom topographic sphere with dynamic geometry manipulation via noise/sinewaves.

## Content Management (Internal)
- **useEditorial Hook**: Custom state engine for CRUD operations.
- **localStorage (ces_posts_v5)**: Native browser persistence with format migration logic.
- **React Helmet Async**: Dynamic SEO control (Title/Meta).

## SEO & SEM
- **Microdata/Schema.org**: JSON-LD generated on-the-fly for articles.
- **GEO Parameters**: Support for AI direct-answer summaries.

## Build Pipeline
```bash
npm run build # Generates /dist via Vite
```
Deployable to any static hosting (Vercel, Netlify, Cloudflare).
