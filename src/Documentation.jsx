import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Menu, X, FileText, Layout, Cpu, PenTool, Layers, BookOpen, Terminal, Activity, Hash, Box, ChevronDown, Filter } from 'lucide-react';
import Logo from './components/Logo';

const docsContent = [
    {
        id: 'overview',
        title: '01 — Project Overview',
        icon: <BookOpen className="w-4 h-4" />,
        content: `# 01 — Project Overview

## What is Centhropy?

**Centhropy** is a data-driven technology company positioned in the **eCommerce and Retail** sector. The company provides advanced data infrastructure, business intelligence, and growth systems under its proprietary ecosystem, **Unify**.

The website functions as a **digital flagship** — a high-end, premium web experience that communicates Centhropy's brand identity, technical sophistication, and service offering to potential enterprise clients.

---

## Brand Identity

| Property | Value |
|---|---|
| **Brand Name** | Centhropy |
| **Tagline** | Unified Data Engine |
| **Core Message** | "Ecosistema que optimiza decisiones en tiempo real en organizaciones de alto valor, potenciadas con inteligencia de datos avanzada." |
| **Target Market** | Enterprise eCommerce & Retail organizations |
| **Tone** | Technical, precise, premium, minimalist |

---

## Visual Philosophy

The site employs a dual-aesthetic approach:

1. **Tactical Dark (Main Site)**: Inspired by NASA control rooms and high-end military tactical interfaces. Monochromatic, ultra-bold typography, and data-heavy HUDs.
2. **Editorial Clear (CMS & Blog)**: A modern, light-theme aesthetic inspired by Notion and Linear. Focuses on legibility, clean spacing, and professional content management.

---

## Business Products (Unify Ecosystem)

The site documents four core products:

| ID | Name | Short | Description |
|---|---|---|---|
| SYS.01 | Unify Protocol | UP | Business ontology for precision data decoding |
| SYS.02 | Unify Data Center | DC | Business decisions hub. Integrates AI agent and simplified interface. |
| SYS.03 | Unify Agent | UA | AI copilot for data-driven decision making |
| SYS.04 | Unify Team | UT | Elite Data-Driven-Growth specialist team |

---

## Current Development State

The project has transitioned from a single-page marketing site to a content-driven platform with a custom CMS.

### Completed Features:
- **Core UI**: 3D topographic sphere (Three.js), Tactical Sidebars, HUD overlays.
- **Editorial System (CES v5.0)**:
    - Stealth Admin Panel (\`/terminal-x92-core\`).
    - Full Block-based Post Editor (8 block types).
    - SEO Analysis engine (Meta title, desc, keyword, GEO).
    - Author Management system.
- **Dynamic Content Pages**:
    - **Newsroom**, **Impact Studies**, **Announcements** (filtered directory views).
    - **BlogPost Template**: High-legibility rendered blocks with schema.org JSON-LD.
- **Navigation**: Modular menu with 4 dynamic slots controlled from the CMS.`
    },
    {
        id: 'architecture',
        title: '02 — Architecture & Structure',
        icon: <Layers className="w-4 h-4" />,
        content: `# 02 — Architecture & File Structure

## Repository Root

\`\`\`
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
│   │
│   ├── ImpactStudies.jsx       ← Directory Page
│   │
│   ├── CorporateAnnouncements.jsx ← Directory Page
│   │
│   └── BlogPost.jsx            ← Article Renderer
│
└── tailwind.config.js, etc.
\`\`\`

---

## Technical Architecture

The site uses a Hybrid Architecture:

### 1. The Tactical Monolith (CenthropyApp.jsx)
The main landing page is a high-density component that manages the Three.js state and scroll-physics for the hero and core brand sections.

### 2. The Editorial Module
A modular system decoupled from the homepage that handles the lifecycle of content. It relies on the useEditorial hook for centralized state management and localStorage persistence.

### Rendering Layers (Main Site)

- **Canvas (z-0)**: Three.js WebGL background
- **HUDs (z-1000)**: Fixed side panels (Left/Right)
- **Content (z-5000)**: Scrollable info slides

---

## Routing & Page Transitions
Handled in App.jsx using a PageTransitionWrapper.
- Transition: 150ms cover/reveal effect.
- Dynamic Paths: /blog/:id (renders structural blocks).
- Secured Paths: /terminal-x92-core/dashboard (Auth required).`
    },
    {
        id: 'stack',
        title: '03 — Technology Stack',
        icon: <Cpu className="w-4 h-4" />,
        content: `# 03 — Technology Stack

## Core Framework

- **React (^19.2.0)**: UI framework
- **Vite (^7.3.1)**: Build & Dev tool
- **React Router (^7.13.0)**: Client-side routing

## Styling & Typography
- **TailwindCSS**: Utility-first CSS.
- **Lucide React**: Vector icons.
- **Funnel Display**: Primary UI font.
- **Unna**: Serif font used for high-legibility blog body text.

---

## 3D Graphics
- **Three.js**: Custom topographic sphere with dynamic geometry manipulation via noise/sinewaves.

## Content Management (Internal)
- **useEditorial Hook**: Custom state engine for CRUD operations.
- **localStorage (ces_posts_v5)**: Native browser persistence with format migration logic.
- **React Helmet Async**: Dynamic SEO control (Title/Meta).

---

## SEO & SEM
- **Microdata/Schema.org**: JSON-LD generated on-the-fly for articles.
- **GEO Parameters**: Support for AI direct-answer summaries.

## Build Pipeline
Generates /dist via Vite. Deployable to any static hosting (Vercel, Netlify, Cloudflare).`
    },
    {
        id: 'editorial',
        title: '04 — Editorial System',
        icon: <PenTool className="w-4 h-4" />,
        content: `# 04 — Editorial System (CES v5.0)

## Overview
The **Centhropy Editorial System (CES)** is a custom-built content management engine integrated into the project. It provides a professional-grade writing and publishing experience with a "Notion-like" aesthetic.

## Architecture
The system is built on three pillars:
1. **Engine**: useEditorial.js (Centralizes all logic).
2. **Dashboard**: EditorialPanel.jsx (Overview, Slot management, Authors).
3. **Builder**: PostEditor.jsx (Three-column writing experience).

---

## The Block Editor
Articles are composed of discrete content blocks, allowing for flexible layouts.
- **Paragraph**: Standard body text.
- **Heading 2/3**: Section naming.
- **Quote**: High-impact editorial callouts.
- **Image**: Inline media (local or URL).
- **Callout**: Insight boxes with amber highlighting.
- **List**: Bulleted or numbered lists.
- **Divider**: Visual separators.

---

## SEO & Analysis Engine
- **Real-time Word Counter**: Updates as you type.
- **SEO Indicators**: Real-time feedback on title, desc, and keywords.
- **GEO Summary**: Field for AI engines to pull direct answers.
- **Advanced Tags**: Meta-robots, canonical URLs, and OG images.

---

## Slot System
Global navigation menu has **4 dynamic slots** controlled via the CMS. Editors can link any active post to any slot.`
    },
    {
        id: 'pages',
        title: '05 — Page Templates',
        icon: <Layout className="w-4 h-4" />,
        content: `# 05 — Page Templates

## 1. Directory Pages
Newsroom, Impact Studies, and Announcements act as content aggregators.
- **Fetching**: Use useEditorial to filter posts by type.
- **Filtering**: Support for searching by title and sub-category.
- **Cards**: Display post metadata and direct links.

---

## 2. BlogPost Template
Core rendering engine for long-form content.
- **Column-centric**: Strict 720px width.
- **Legibility**: Uses Unna serif font.
- **Reading Progress**: Indicators for scroll depth.

---

## 3. Terminal Core (Dashboard)
Specialized administrative view utilizing a full-width sidebar layout.
- **Theme**: "Editorial Clear" (Light theme).
- **Navigation**: Persistent left sidebar for Posts, Slots, and Authors.`
    }
];

const Documentation = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [activeSubsection, setActiveSubsection] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const contentRef = useRef(null);

    // Scroll Spy Logic for Subsections
    useEffect(() => {
        if (searchQuery) return; // Disable scroll spy during search results

        const observerOptions = {
            root: contentRef.current,
            rootMargin: '-10% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSubsection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Target H2 headers which are our subsection anchors
        const headers = contentRef.current?.querySelectorAll('h2[id]');
        headers?.forEach((header) => observer.observe(header));

        return () => observer.disconnect();
    }, [activeSection, searchQuery]);

    // Get subsections for a specific content string
    const getSubsections = (content) => {
        return content.split('\n')
            .filter(line => line.startsWith('## '))
            .map(line => line.replace('## ', '').trim());
    };

    // Filtered sidebar content
    const sidebarDocs = useMemo(() => {
        if (!sidebarSearch) return docsContent;
        const q = sidebarSearch.toLowerCase();

        return docsContent.filter(doc => {
            const titleMatches = doc.title.toLowerCase().includes(q);
            const subsections = getSubsections(doc.content);
            const subsectionMatches = subsections.some(sub => sub.toLowerCase().includes(q));
            return titleMatches || subsectionMatches;
        });
    }, [sidebarSearch]);

    const filteredDocs = useMemo(() => {
        if (!searchQuery) return docsContent;
        const q = searchQuery.toLowerCase();
        return docsContent.filter(doc =>
            doc.title.toLowerCase().includes(q) ||
            doc.content.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    const scrollToAnchor = (anchorId) => {
        const element = document.getElementById(anchorId);
        if (element && contentRef.current) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSubsection(anchorId);
        }
    };

    const generateId = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const renderMarkdown = (text) => {
        return text.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-6xl font-black uppercase tracking-tighter mb-16 pb-8 border-b-2 border-black/10 text-black text-left">{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) {
                const title = line.replace('## ', '');
                return <h2 key={i} id={generateId(title)} className="text-2xl font-funnel font-bold uppercase tracking-[0.2em] text-black mt-12 mb-4 text-left">{title}</h2>;
            }
            if (line.startsWith('### ')) return <h3 key={i} className="text-3xl font-bold uppercase tracking-widest text-black/80 mt-10 mb-3 text-left">{line.replace('### ', '')}</h3>;
            if (line.startsWith('#### ')) return <h4 key={i} className="text-xl font-bold text-black/60 mt-8 mb-2 text-left">{line.replace('#### ', '')}</h4>;
            if (line.startsWith('---')) return <hr key={i} className="my-10 border-black/5" />;
            if (line.startsWith('> ')) return <blockquote key={i} className="border-l border-black bg-black/[0.02] px-8 py-6 my-10 italic text-black/60 font-funnel">{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-3 text-black/70 list-none flex items-start gap-3"><span className="w-1.5 h-1.5 bg-black/20 rounded-full mt-2 flex-shrink-0" /> {line.replace('- ', '')}</li>;
            if (line.startsWith('|')) {
                const cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf('|') === 0);
                if (line.includes('---')) return null;
                return (
                    <div key={i} className="grid grid-cols-2 md:grid-cols-4 border border-black/10 bg-black/[0.02] p-4 font-funnel">
                        {cells.map((c, j) => <span key={j} className="text-[10px] uppercase tracking-widest text-black/40">{c.trim()}</span>)}
                    </div>
                );
            }
            if (line.startsWith('```')) return null;
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <p key={i} className="mb-6 leading-relaxed text-black/70 font-light text-lg">
                        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-black font-bold">{p}</strong> : p)}
                    </p>
                );
            }
            if (line.trim() === '') return <div key={i} className="h-4" />;
            if (line.startsWith('│') || line.startsWith('├──') || line.startsWith('└──')) return <pre key={i} className="font-funnel text-[11px] text-black/40 leading-tight mb-0">{line}</pre>;

            return <p key={i} className="mb-6 leading-relaxed text-black/70 font-light text-lg">{line}</p>;
        });
    };

    const activeDoc = docsContent.find(d => d.id === activeSection) || docsContent[0];

    return (
        <div className="h-screen bg-white text-black font-funnel flex flex-col selection:bg-black selection:text-white relative overflow-hidden">
            {/* GRID BACKGROUND ACCENT (Light) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* LIGHT TACTICAL HEADER */}
            <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-black/10 z-50 flex items-center justify-between px-0 flex-shrink-0">
                {/* LEFT: Matches Sidebar Left */}
                <div className="w-80 border-r border-white h-full flex items-center px-10 gap-4">
                    <Link to="/" className="hover:opacity-60 transition-opacity">
                        <Logo className="h-4 text-black" />
                    </Link>
                    <div className="hidden lg:flex flex-col border-l border-white pl-4 py-1">
                        <span className="text-[8px] font-funnel font-bold text-black/20 uppercase tracking-[0.2em] leading-tight">DOCUMENTACIÓN</span>
                        <span className="text-[9px] font-funnel font-black text-black tracking-widest leading-tight">V1.0</span>
                    </div>
                </div>

                {/* CENTER: Matches Main Content Area */}
                <div className="flex-1 h-full flex items-center px-6 md:px-16 lg:px-24">
                    <div className="w-full max-w-4xl mx-auto relative group">
                        <div className="absolute inset-0 bg-transparent border border-black/5 group-focus-within:border-black transition-colors" />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none py-3 pl-16 pr-8 text-[11px] font-funnel uppercase tracking-widest focus:ring-0 outline-none placeholder:text-black/20 relative z-10"
                        />
                    </div>
                </div>

                {/* RIGHT: Matches Sidebar Right (Only visible on XL+) */}
                <div className="w-80 border-l border-white h-full hidden xl:flex items-center justify-end px-12">
                    <Link
                        to="/login"
                        className="text-[11px] font-funnel font-bold tracking-[0.25em] text-black uppercase transition-colors hover:text-black/60"
                    >
                        Ingresar
                    </Link>
                </div>

                {/* MOBILE/TABLET MENU BUTTON (Outside XL structure to remain visible) */}
                <div className="xl:hidden px-8 flex items-center gap-6">
                    <Link
                        to="/login"
                        className="text-[11px] font-funnel font-bold tracking-[0.15em] text-black uppercase"
                    >
                        Ingresar
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-black border border-black/10"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* TACTICAL SIDEBAR (Light) */}
                <aside className={`fixed lg:sticky top-0 left-0 h-full w-80 bg-white border-r border-black/10 transform transition-transform duration-500 z-40 flex-shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <nav className="p-8 h-full overflow-y-auto flex flex-col light-scrollbar">
                        <div className="mb-12">
                            <div className="mb-12 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-transparent border border-black/10 group-focus-within:border-black transition-colors" />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-[1.5px] pointer-events-none">
                                        <div className="w-3.5 h-[1.5px] bg-black/40" />
                                        <div className="w-2.5 h-[1.5px] bg-black/40" />
                                        <div className="w-1.5 h-[1.5px] bg-black/40" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Filtrar"
                                        value={sidebarSearch}
                                        onChange={(e) => setSidebarSearch(e.target.value)}
                                        className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-[10px] font-funnel uppercase tracking-widest focus:ring-0 outline-none placeholder:text-black/10 relative z-10"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                {sidebarDocs.map((section) => (
                                    <div key={section.id} className="flex flex-col overflow-hidden">
                                        <button
                                            onClick={() => {
                                                if (activeSection !== section.id) {
                                                    setActiveSection(section.id);
                                                    if (contentRef.current) contentRef.current.scrollTop = 0;
                                                }
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`flex items-center justify-between gap-2 px-6 py-3 text-sm font-funnel font-bold tracking-normal transition-all relative group text-left ${activeSection === section.id ? 'text-black' : 'text-black/30 hover:text-black/60'}`}
                                        >
                                            {activeSection === section.id && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-black" />
                                            )}
                                            <span>{section.title.split(' — ')[1] || section.title}</span>
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeSection === section.id || sidebarSearch ? 'rotate-180 opacity-100' : 'opacity-40'}`} />
                                        </button>

                                        {/* Dropdown for subsections */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSection === section.id || sidebarSearch ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                                            <div className="flex flex-col pl-5 border-l border-black/5 ml-2 gap-2 py-1">
                                                {getSubsections(section.content)
                                                    .filter(sub => !sidebarSearch || sub.toLowerCase().includes(sidebarSearch.toLowerCase()))
                                                    .map((sub, idx) => {
                                                        const id = generateId(sub);
                                                        const isActive = activeSubsection === id;
                                                        return (
                                                            <button
                                                                key={idx}
                                                                onClick={() => scrollToAnchor(id)}
                                                                className={`text-[10px] uppercase font-funnel tracking-widest transition-all duration-300 text-left ${isActive ? 'text-black font-bold' : 'text-black/40 hover:text-black'}`}
                                                            >
                                                                {sub}
                                                            </button>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {sidebarDocs.length === 0 && (
                                    <div className="py-10 text-center border border-dashed border-black/10">
                                        <span className="text-[9px] font-funnel text-black/20 uppercase tracking-[0.3em]">NO_MATCHES_FOUND</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto border-t-2 border-black/10 pt-10">
                            <div className="p-8 bg-black/[0.02] border border-black/10 relative overflow-hidden group">
                                <span className="text-xs font-funnel font-bold tracking-widest block mb-4 text-black/50">Technical Service</span>
                                <p className="text-[10px] font-funnel leading-relaxed text-black/40 mb-10 uppercase tracking-[0.1em]">Advanced integration for global retail networks.</p>
                                <Link to="/waitlist" className="inline-flex items-center gap-2 text-[10px] font-funnel font-black uppercase tracking-[0.3em] text-black border-b-2 border-black/10 pb-1 hover:border-black transition-all">
                                    INIT_CONTACT <ChevronRight size={10} />
                                </Link>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* MAIN HUD CONTENT (Light) - Independent Scroll */}
                <main
                    ref={contentRef}
                    className="flex-1 min-w-0 bg-[#fafafa]/50 h-full overflow-y-auto light-scrollbar scroll-smooth"
                >
                    <div className="max-w-4xl mx-auto px-6 md:px-16 lg:px-24 py-16 md:py-24">
                        {searchQuery ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3 mb-16 text-black/20 font-funnel text-[10px] uppercase tracking-[0.4em]">
                                    <Search size={14} />
                                    <span>Search_Stream / "{searchQuery}"</span>
                                </div>
                                {filteredDocs.length > 0 ? (
                                    <div className="flex flex-col gap-12">
                                        {filteredDocs.map(doc => (
                                            <div key={doc.id} className="group cursor-pointer border border-black/5 bg-white p-10 hover:border-black/20 hover:shadow-2xl transition-all" onClick={() => { setSearchQuery(''); setActiveSection(doc.id); }}>
                                                <div className="flex items-center gap-4 mb-6 text-black/40 group-hover:text-black transition-colors font-funnel">
                                                    {React.cloneElement(doc.icon, { size: 16 })}
                                                    <span className="text-xs font-bold uppercase tracking-[0.3em]">{doc.title}</span>
                                                </div>
                                                <p className="text-xl font-light leading-relaxed text-black/40 group-hover:text-black/80 transition-colors line-clamp-2">
                                                    {doc.content.replace(/#|##|###|---|\*|\[|\]|\(|\)/g, '').substring(0, 350)}...
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-32 border-2 border-dashed border-black/5 bg-white">
                                        <p className="font-funnel text-[10px] uppercase tracking-[0.4em] text-black/20">ERROR_404: NO_RESULTS_FOUND</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <article className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both relative">
                                <div className="docs-content text-black">
                                    {renderMarkdown(activeDoc.content)}
                                </div>
                            </article>
                        )}
                    </div>

                    {/* TACTICAL FOOTER (Light) */}
                    <footer className="border-t border-black/10 py-12 px-6 md:px-24 flex md:flex-row flex-col gap-8 justify-between items-center bg-black/[0.02]">
                        <div className="flex gap-12 font-funnel text-[9px] uppercase tracking-[0.3em] text-black/20">
                            <div className="flex flex-col gap-1">
                                <span className="text-black/10">Architecture</span>
                                <span className="text-black/60 tracking-widest">Hybrid_Modular_v5</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-black/10">Status</span>
                                <span className="text-black/40">Verified_Access</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-funnel text-black/30 uppercase tracking-[0.4em]">
                            © 2026 Centhropy — Tactical_Interface_Root
                        </div>
                    </footer>
                </main>

                {/* TACTICAL RIGHT SIDEBAR (Updates & Context) */}
                <aside className="hidden xl:flex flex-col w-80 bg-white border-l border-black/10 flex-shrink-0 h-full overflow-y-auto light-scrollbar">
                    <div className="p-8 space-y-12">
                        {/* UPDATE LOGS */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Activity size={14} className="text-black/30" />
                                <h3 className="text-[10px] font-funnel font-bold uppercase tracking-[0.3em] text-black/40">Latest_Updates</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { date: '25 FEB', tag: 'CORE', desc: 'V5 Engine optimization release.' },
                                    { date: '22 FEB', tag: 'UI', desc: 'Light Tactical documentation theme.' },
                                    { date: '18 FEB', tag: 'CMS', desc: 'Post Slot Management v2.0.' }
                                ].map((update, idx) => (
                                    <div key={idx} className="group cursor-default border-l border-black/5 pl-4 hover:border-black/20 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-funnel font-bold text-black/20">{update.date}</span>
                                            <span className="text-[8px] font-funnel bg-black/5 px-1.5 py-0.5 text-black/40 rounded-[2px]">{update.tag}</span>
                                        </div>
                                        <p className="text-[11px] font-funnel leading-relaxed text-black/50 group-hover:text-black/70 transition-colors">{update.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QUICK RESOURCES */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Layout size={14} className="text-black/30" />
                                <h3 className="text-[10px] font-funnel font-bold uppercase tracking-[0.3em] text-black/40">System_Assets</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { label: 'Brand_Kit_v5', type: 'PDF' },
                                    { label: 'Api_Reference', type: 'JSON' },
                                    { label: 'Retail_Workflow', type: 'EPUB' }
                                ].map((res, idx) => (
                                    <button key={idx} className="flex items-center justify-between p-3 border border-black/5 hover:border-black/20 hover:bg-black/[0.01] transition-all group">
                                        <span className="text-[10px] font-funnel font-bold text-black/40 group-hover:text-black transition-colors uppercase tracking-widest">{res.label}</span>
                                        <span className="text-[9px] font-funnel text-black/20">{res.type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SUPPORT CTA CARD */}
                        <div className="relative group">
                            <div className="absolute inset-0 border border-black/10 group-hover:border-black/30 transition-colors bg-white z-0" />
                            <div className="relative z-10 p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-black">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-funnel font-bold uppercase tracking-[0.3em]">Support_Active</span>
                                </div>
                                <p className="text-[11px] font-funnel leading-relaxed text-black/40 uppercase tracking-wider">Need elite implementation assistance?</p>
                                <a href="mailto:support@centhropy.com" className="w-full text-center py-3 bg-black text-white text-[10px] font-funnel font-bold uppercase tracking-[0.4em] transition-transform hover:scale-[0.98] active:scale-95">
                                    OPEN_TICKET
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-8 border-t border-black/5">
                        <div className="flex items-center justify-between opacity-30 group grayscale hover:grayscale-0 transition-all cursor-crosshair">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-funnel uppercase tracking-widest">Server_Node</span>
                                <span className="text-[9px] font-funnel font-bold uppercase tracking-widest">CP-X92-GLOBAL</span>
                            </div>
                            <Activity size={16} />
                        </div>
                    </div>
                </aside>
            </div>

            {/* LIGHT MOBILE BACKDROP */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default Documentation;
