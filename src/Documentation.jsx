import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Menu, X, FileText, Layout, Cpu, PenTool, Layers, BookOpen, Terminal, Activity, Hash, Box, ChevronDown, Filter } from 'lucide-react';
import Logo from './components/Logo';
import { useEditorial } from './hooks/useEditorial';

const ICON_MAP = {
    BookOpen: <BookOpen className="w-4 h-4" />,
    FileText: <FileText className="w-4 h-4" />,
    Layers: <Layers className="w-4 h-4" />,
    Cpu: <Cpu className="w-4 h-4" />,
    PenTool: <PenTool className="w-4 h-4" />,
    Layout: <Layout className="w-4 h-4" />,
    Terminal: <Terminal className="w-4 h-4" />,
    Activity: <Activity className="w-4 h-4" />,
    Hash: <Hash className="w-4 h-4" />,
    Box: <Box className="w-4 h-4" />,
};

const Documentation = () => {
    const { getPublishedDocs } = useEditorial();

    const docsContent = useMemo(() => {
        const published = getPublishedDocs() || [];
        return published.map(d => ({
            id: d.slug || d.id,
            title: d.title,
            icon: ICON_MAP[d.icon] || <FileText className="w-4 h-4" />,
            content: d.content || '',
        }));
    }, [getPublishedDocs]);
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
        if (!content) return [];
        if (content.includes('<h2>') || content.includes('<h2 ')) {
            const matches = [...content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
            return matches.map(m => m[1].replace(/<\/?[^>]+(>|$)/g, "").trim());
        }
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
    }, [sidebarSearch, docsContent]);

    const filteredDocs = useMemo(() => {
        if (!searchQuery) return docsContent;
        const q = searchQuery.toLowerCase();
        return docsContent.filter(doc =>
            doc.title.toLowerCase().includes(q) ||
            doc.content.toLowerCase().includes(q)
        );
    }, [searchQuery, docsContent]);

    const scrollToAnchor = (anchorId) => {
        const element = document.getElementById(anchorId);
        if (element && contentRef.current) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSubsection(anchorId);
        }
    };

    const generateId = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const injectIdsIntoHtml = (html) => {
        if (!html) return '';
        return html.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (match, title) => {
            const text = title.replace(/<\/?[^>]+(>|$)/g, "").trim();
            const id = generateId(text);
            return `<h2 id="${id}">${title}</h2>`;
        });
    };

    const renderMarkdown = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-6xl font-black uppercase tracking-tighter mb-16 pb-8 border-b-2 border-[#222944]/10 dark:border-[#BCC5DC]/10 text-[#222944] dark:text-[#BCC5DC] text-left">{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) {
                const title = line.replace('## ', '');
                return <h2 key={i} id={generateId(title)} className="text-2xl font-funnel font-bold uppercase tracking-[0.2em] text-[#222944] dark:text-[#BCC5DC] mt-12 mb-4 text-left">{title}</h2>;
            }
            if (line.startsWith('### ')) return <h3 key={i} className="text-3xl font-bold uppercase tracking-widest text-[#222944]/80 dark:text-[#BCC5DC] mt-10 mb-3 text-left">{line.replace('### ', '')}</h3>;
            if (line.startsWith('#### ')) return <h4 key={i} className="text-xl font-bold text-[#222944]/60 dark:text-[#BCC5DC]/80 mt-8 mb-2 text-left">{line.replace('#### ', '')}</h4>;
            if (line.startsWith('---')) return <hr key={i} className="my-10 border-[#222944]/15 dark:border-[#BCC5DC]/5" />;
            if (line.startsWith('> ')) return <blockquote key={i} className="border-l border-[#222944] dark:border-[#BCC5DC] bg-black/[0.02] px-8 py-6 my-10 italic text-[#222944]/60 dark:text-[#BCC5DC]/80 font-funnel">{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-3 text-[#222944]/70 dark:text-[#BCC5DC]/90 list-none flex items-start gap-3"><span className="w-1.5 h-1.5 bg-[#222944]/20 dark:bg-[#BCC5DC]/20 rounded-full mt-2 flex-shrink-0" /> {line.replace('- ', '')}</li>;
            if (line.startsWith('|')) {
                const cells = line.split('|').filter(c => c.trim() !== '' || line.indexOf('|') === 0);
                if (line.includes('---')) return null;
                return (
                    <div key={i} className="grid grid-cols-2 md:grid-cols-4 border border-[#222944]/10 dark:border-[#BCC5DC]/10 bg-black/[0.02] p-4 font-funnel">
                        {cells.map((c, j) => <span key={j} className="text-[10px] uppercase tracking-widest text-[#222944]/40 dark:text-[#BCC5DC]/60">{c.trim()}</span>)}
                    </div>
                );
            }
            if (line.startsWith('```')) return null;
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <p key={i} className="mb-6 leading-relaxed text-[#222944]/70 dark:text-[#BCC5DC]/90 font-light text-lg">
                        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-[#222944] dark:text-[#BCC5DC] font-bold">{p}</strong> : p)}
                    </p>
                );
            }
            if (line.trim() === '') return <div key={i} className="h-4" />;
            if (line.startsWith('│') || line.startsWith('├──') || line.startsWith('└──')) return <pre key={i} className="font-funnel text-[11px] text-[#222944]/40 dark:text-[#BCC5DC]/60 leading-tight mb-0">{line}</pre>;

            return <p key={i} className="mb-6 leading-relaxed text-[#222944]/70 dark:text-[#BCC5DC]/90 font-light text-lg">{line}</p>;
        });
    };

    const activeDoc = docsContent.find(d => d.id === activeSection) || docsContent[0] || {
        id: 'empty',
        title: 'Sin Documentación',
        icon: <BookOpen className="w-4 h-4" />,
        content: '<h1>Sin Documentación</h1><p>Por favor, ingresa al panel de administración para agregar nueva documentación.</p>'
    };

    useEffect(() => {
        if (docsContent.length > 0 && !docsContent.some(d => d.id === activeSection)) {
            setActiveSection(docsContent[0].id);
        }
    }, [docsContent, activeSection]);

    return (
        <div className="h-screen bg-white dark:bg-[#222944] text-[#222944] dark:text-[#BCC5DC] font-funnel flex flex-col selection:bg-black selection:text-white relative overflow-hidden">
            {/* GRID BACKGROUND ACCENT (Light) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* LIGHT TACTICAL HEADER */}
            <header className="h-20 bg-white/80 dark:bg-[#222944]/80 backdrop-blur-xl border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 z-50 flex items-center justify-between px-0 flex-shrink-0">
                {/* LEFT: Matches Sidebar Left */}
                <div className="w-80 border-r border-white h-full flex items-center px-10 gap-4">
                    <Link to="/" className="hover:opacity-60 transition-opacity">
                        <Logo className="h-4 text-[#222944] dark:text-[#BCC5DC]" />
                    </Link>
                    <div className="hidden lg:flex flex-col border-l border-white pl-4 py-1">
                        <span className="text-[8px] font-funnel font-bold text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-[0.2em] leading-tight">DOCUMENTACIÓN</span>
                        <span className="text-[9px] font-funnel font-black text-[#222944] dark:text-[#BCC5DC] tracking-widest leading-tight">V1.0</span>
                    </div>
                </div>

                {/* CENTER: Matches Main Content Area */}
                <div className="flex-1 h-full flex items-center px-6 md:px-16 lg:px-24">
                    <div className="w-full max-w-4xl mx-auto relative group">
                        <div className="absolute inset-0 bg-transparent border border-[#222944]/15 dark:border-[#BCC5DC]/5 group-focus-within:border-[#222944] dark:border-[#BCC5DC] transition-colors" />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#222944]/30 dark:text-[#BCC5DC]/50" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none py-3 pl-16 pr-8 text-[11px] font-funnel uppercase tracking-widest focus:ring-0 outline-none placeholder:text-[#222944]/20 dark:text-[#BCC5DC]/40 relative z-10"
                        />
                    </div>
                </div>

                {/* RIGHT: Matches Sidebar Right (Only visible on XL+) */}
                <div className="w-80 border-l border-white h-full hidden xl:flex items-center justify-end px-12">
                    <Link
                        to="/login"
                        className="text-[11px] font-funnel font-bold tracking-[0.25em] text-[#222944] dark:text-[#BCC5DC] uppercase transition-colors hover:text-[#222944]/60 dark:text-[#BCC5DC]/80"
                    >
                        Ingresar
                    </Link>
                </div>

                {/* MOBILE/TABLET MENU BUTTON (Outside XL structure to remain visible) */}
                <div className="xl:hidden px-8 flex items-center gap-6">
                    <Link
                        to="/login"
                        className="text-[11px] font-funnel font-bold tracking-[0.15em] text-[#222944] dark:text-[#BCC5DC] uppercase"
                    >
                        Ingresar
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-[#222944] dark:text-[#BCC5DC] border border-[#222944]/10 dark:border-[#BCC5DC]/10"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* TACTICAL SIDEBAR (Light) */}
                <aside className={`fixed lg:sticky top-0 left-0 h-full w-80 bg-white dark:bg-[#222944] border-r border-[#222944]/10 dark:border-[#BCC5DC]/10 transform transition-transform duration-500 z-40 flex-shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <nav className="p-8 h-full overflow-y-auto flex flex-col light-scrollbar">
                        <div className="mb-12">
                            <div className="mb-12 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-transparent border border-[#222944]/10 dark:border-[#BCC5DC]/10 group-focus-within:border-[#222944] dark:border-[#BCC5DC] transition-colors" />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-[1.5px] pointer-events-none">
                                        <div className="w-3.5 h-[1.5px] bg-[#222944]/40 dark:bg-[#BCC5DC]/40" />
                                        <div className="w-2.5 h-[1.5px] bg-[#222944]/40 dark:bg-[#BCC5DC]/40" />
                                        <div className="w-1.5 h-[1.5px] bg-[#222944]/40 dark:bg-[#BCC5DC]/40" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Filtrar"
                                        value={sidebarSearch}
                                        onChange={(e) => setSidebarSearch(e.target.value)}
                                        className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-[10px] font-funnel uppercase tracking-widest focus:ring-0 outline-none placeholder:text-[#222944]/10 dark:text-[#BCC5DC]/25 relative z-10"
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
                                            className={`flex items-center justify-between gap-2 px-6 py-3 text-sm font-funnel font-bold tracking-normal transition-all relative group text-left ${activeSection === section.id ? 'text-[#222944] dark:text-[#BCC5DC]' : 'text-[#222944]/30 dark:text-[#BCC5DC]/50 hover:text-[#222944]/60 dark:text-[#BCC5DC]/80'}`}
                                        >
                                            {activeSection === section.id && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-black" />
                                            )}
                                            <span>{section.title.split(' — ')[1] || section.title}</span>
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeSection === section.id || sidebarSearch ? 'rotate-180 opacity-100' : 'opacity-40'}`} />
                                        </button>

                                        {/* Dropdown for subsections */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSection === section.id || sidebarSearch ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                                            <div className="flex flex-col pl-5 border-l border-[#222944]/15 dark:border-[#BCC5DC]/5 ml-2 gap-2 py-1">
                                                {getSubsections(section.content)
                                                    .filter(sub => !sidebarSearch || sub.toLowerCase().includes(sidebarSearch.toLowerCase()))
                                                    .map((sub, idx) => {
                                                        const id = generateId(sub);
                                                        const isActive = activeSubsection === id;
                                                        return (
                                                            <button
                                                                key={idx}
                                                                onClick={() => scrollToAnchor(id)}
                                                                className={`text-[10px] uppercase font-funnel tracking-widest transition-all duration-300 text-left ${isActive ? 'text-[#222944] dark:text-[#BCC5DC] font-bold' : 'text-[#222944]/40 dark:text-[#BCC5DC]/60 hover:text-[#222944] dark:text-[#BCC5DC]'}`}
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
                                    <div className="py-10 text-center border border-dashed border-[#222944]/10 dark:border-[#BCC5DC]/10">
                                        <span className="text-[9px] font-funnel text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-[0.3em]">NO_MATCHES_FOUND</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto border-t-2 border-[#222944]/10 dark:border-[#BCC5DC]/10 pt-10">
                            <div className="p-8 bg-black/[0.02] border border-[#222944]/10 dark:border-[#BCC5DC]/10 relative overflow-hidden group">
                                <span className="text-xs font-funnel font-bold tracking-widest block mb-4 text-[#222944]/50 dark:text-[#BCC5DC]/70">Technical Service</span>
                                <p className="text-[10px] font-funnel leading-relaxed text-[#222944]/40 dark:text-[#BCC5DC]/60 mb-10 uppercase tracking-[0.1em]">Advanced integration for global retail networks.</p>
                                <Link to="/waitlist" className="inline-flex items-center gap-2 text-[10px] font-funnel font-black uppercase tracking-[0.3em] text-[#222944] dark:text-[#BCC5DC] border-b-2 border-[#222944]/10 dark:border-[#BCC5DC]/10 pb-1 hover:border-[#222944] dark:border-[#BCC5DC] transition-all">
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
                                <div className="flex items-center gap-3 mb-16 text-[#222944]/20 dark:text-[#BCC5DC]/40 font-funnel text-[10px] uppercase tracking-[0.4em]">
                                    <Search size={14} />
                                    <span>Search_Stream / "{searchQuery}"</span>
                                </div>
                                {filteredDocs.length > 0 ? (
                                    <div className="flex flex-col gap-12">
                                        {filteredDocs.map(doc => (
                                            <div key={doc.id} className="group cursor-pointer border border-[#222944]/15 dark:border-[#BCC5DC]/5 bg-white dark:bg-[#222944] p-10 hover:border-[#222944]/20 dark:border-[#BCC5DC]/20 hover:shadow-2xl transition-all" onClick={() => { setSearchQuery(''); setActiveSection(doc.id); }}>
                                                <div className="flex items-center gap-4 mb-6 text-[#222944]/40 dark:text-[#BCC5DC]/60 group-hover:text-[#222944] dark:text-[#BCC5DC] transition-colors font-funnel">
                                                    {React.cloneElement(doc.icon, { size: 16 })}
                                                    <span className="text-xs font-bold uppercase tracking-[0.3em]">{doc.title}</span>
                                                </div>
                                                <p className="text-xl font-light leading-relaxed text-[#222944]/40 dark:text-[#BCC5DC]/60 group-hover:text-[#222944]/80 dark:text-[#BCC5DC] transition-colors line-clamp-2">
                                                    {doc.content.replace(/#|##|###|---|\*|\[|\]|\(|\)/g, '').substring(0, 350)}...
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-32 border-2 border-dashed border-[#222944]/15 dark:border-[#BCC5DC]/5 bg-white dark:bg-[#222944]">
                                        <p className="font-funnel text-[10px] uppercase tracking-[0.4em] text-[#222944]/20 dark:text-[#BCC5DC]/40">ERROR_404: NO_RESULTS_FOUND</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <article className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both relative">
                                <div className="docs-content docs-content-rich text-[#222944] dark:text-[#BCC5DC]">
                                    {activeDoc.content.trim().startsWith('<') ? (
                                        <div dangerouslySetInnerHTML={{ __html: injectIdsIntoHtml(activeDoc.content) }} />
                                    ) : (
                                        renderMarkdown(activeDoc.content)
                                    )}
                                </div>
                            </article>
                        )}
                    </div>

                    {/* TACTICAL FOOTER (Light) */}
                    <footer className="border-t border-[#222944]/10 dark:border-[#BCC5DC]/10 py-12 px-6 md:px-24 flex md:flex-row flex-col gap-8 justify-between items-center bg-black/[0.02]">
                        <div className="flex gap-12 font-funnel text-[9px] uppercase tracking-[0.3em] text-[#222944]/20 dark:text-[#BCC5DC]/40">
                            <div className="flex flex-col gap-1">
                                <span className="text-[#222944]/10 dark:text-[#BCC5DC]/25">Architecture</span>
                                <span className="text-[#222944]/60 dark:text-[#BCC5DC]/80 tracking-widest">Hybrid_Modular_v5</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[#222944]/10 dark:text-[#BCC5DC]/25">Status</span>
                                <span className="text-[#222944]/40 dark:text-[#BCC5DC]/60">Verified_Access</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-funnel text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-[0.4em]">
                            © 2026 Centhropy — Tactical_Interface_Root
                        </div>
                    </footer>
                </main>

                {/* TACTICAL RIGHT SIDEBAR (Updates & Context) */}
                <aside className="hidden xl:flex flex-col w-80 bg-white dark:bg-[#222944] border-l border-[#222944]/10 dark:border-[#BCC5DC]/10 flex-shrink-0 h-full overflow-y-auto light-scrollbar">
                    <div className="p-8 space-y-12">
                        {/* UPDATE LOGS */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Activity size={14} className="text-[#222944]/30 dark:text-[#BCC5DC]/50" />
                                <h3 className="text-[10px] font-funnel font-bold uppercase tracking-[0.3em] text-[#222944]/40 dark:text-[#BCC5DC]/60">Latest_Updates</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { date: '25 FEB', tag: 'CORE', desc: 'V5 Engine optimization release.' },
                                    { date: '22 FEB', tag: 'UI', desc: 'Light Tactical documentation theme.' },
                                    { date: '18 FEB', tag: 'CMS', desc: 'Post Slot Management v2.0.' }
                                ].map((update, idx) => (
                                    <div key={idx} className="group cursor-default border-l border-[#222944]/15 dark:border-[#BCC5DC]/5 pl-4 hover:border-[#222944]/20 dark:border-[#BCC5DC]/20 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-funnel font-bold text-[#222944]/20 dark:text-[#BCC5DC]/40">{update.date}</span>
                                            <span className="text-[8px] font-funnel bg-[#222944]/15 dark:bg-[#BCC5DC]/5 px-1.5 py-0.5 text-[#222944]/40 dark:text-[#BCC5DC]/60 rounded-[2px]">{update.tag}</span>
                                        </div>
                                        <p className="text-[11px] font-funnel leading-relaxed text-[#222944]/50 dark:text-[#BCC5DC]/70 group-hover:text-[#222944]/70 dark:text-[#BCC5DC]/90 transition-colors">{update.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QUICK RESOURCES */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Layout size={14} className="text-[#222944]/30 dark:text-[#BCC5DC]/50" />
                                <h3 className="text-[10px] font-funnel font-bold uppercase tracking-[0.3em] text-[#222944]/40 dark:text-[#BCC5DC]/60">System_Assets</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { label: 'Brand_Kit_v5', type: 'PDF' },
                                    { label: 'Api_Reference', type: 'JSON' },
                                    { label: 'Retail_Workflow', type: 'EPUB' }
                                ].map((res, idx) => (
                                    <button key={idx} className="flex items-center justify-between p-3 border border-[#222944]/15 dark:border-[#BCC5DC]/5 hover:border-[#222944]/20 dark:border-[#BCC5DC]/20 hover:bg-black/[0.01] transition-all group">
                                        <span className="text-[10px] font-funnel font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 group-hover:text-[#222944] dark:text-[#BCC5DC] transition-colors uppercase tracking-widest">{res.label}</span>
                                        <span className="text-[9px] font-funnel text-[#222944]/20 dark:text-[#BCC5DC]/40">{res.type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SUPPORT CTA CARD */}
                        <div className="relative group">
                            <div className="absolute inset-0 border border-[#222944]/10 dark:border-[#BCC5DC]/10 group-hover:border-[#222944]/30 dark:border-[#BCC5DC]/30 transition-colors bg-white dark:bg-[#222944] z-0" />
                            <div className="relative z-10 p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-[#222944] dark:text-[#BCC5DC]">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-funnel font-bold uppercase tracking-[0.3em]">Support_Active</span>
                                </div>
                                <p className="text-[11px] font-funnel leading-relaxed text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-wider">Need elite implementation assistance?</p>
                                <a href="mailto:support@centhropy.com" className="w-full text-center py-3 bg-black text-white text-[10px] font-funnel font-bold uppercase tracking-[0.4em] transition-transform hover:scale-[0.98] active:scale-95">
                                    OPEN_TICKET
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-8 border-t border-[#222944]/15 dark:border-[#BCC5DC]/5">
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
                    className="fixed inset-0 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default Documentation;
