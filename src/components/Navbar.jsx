import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import useIsMobile from '../hooks/useIsMobile';
import { useEditorial } from '../hooks/useEditorial';

const Navbar = ({ subtitle = "Unified Data Engine" }) => {
    const { posts, slots } = useEditorial();
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const next = !prev;

            // Bloquear transiciones temporalmente para que el cambio de modo sea de golpe
            const style = document.createElement('style');
            style.textContent = `*, *::before, *::after { transition: none !important; }`;
            document.head.appendChild(style);

            if (next) {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
            }

            // Forzar reflujo de CSS para aplicar el estilo inmediatamente
            window.getComputedStyle(document.documentElement).opacity;
            
            // Quitar el bloqueo de transiciones para no romper otras animaciones
            setTimeout(() => {
                document.head.removeChild(style);
            }, 0);

            return next;
        });
    };


    return (
        <header className="fixed top-0 left-0 right-0 h-[72px] md:h-[84px] bg-white/80 dark:bg-[#1B2136]/80 backdrop-blur-[12px]"
            style={{ zIndex: 10000 }}>

            {/* INTERNAL NAVBAR BACKGROUND (SOLID ON OPEN) */}
            <div
                className={`absolute top-0 left-0 right-0 h-[72px] md:h-[84px] bg-white dark:bg-[#1B2136] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ zIndex: 10002 }}
            />

            {/* TOP BAR — always visible, never moves */}
            <div className="flex justify-between items-center w-full max-w-[1800px] mx-auto px-5 md:px-10 h-[72px] md:h-[84px] shrink-0 relative" style={{ zIndex: 10003 }}>
                <Link to="/" className="flex items-center gap-6 pointer-events-auto" onClick={() => setMenuOpen(false)}>
                    <Logo
                        menuOpen={menuOpen}
                        className="text-[#222944] dark:text-[#BCC5DC]"
                    />
                    <div className="hidden md:block h-[34px] w-[1.5px] transition-colors duration-500 bg-[#222944] dark:bg-[#BCC5DC]/20"></div>
                    <span className="hidden sm:block text-[11px] font-funnel font-bold tracking-[0.25em] transition-colors duration-500 uppercase text-[#222944] dark:text-[#BCC5DC]/80">
                        {subtitle}
                    </span>
                </Link>
                <div className="flex items-center gap-6 md:gap-8">
                    <button
                        onClick={toggleDarkMode}
                        className="pointer-events-auto relative w-10 h-5 rounded-full transition-colors duration-300 bg-[#222944]/15 dark:bg-[#BCC5DC]/20 flex items-center cursor-pointer"
                        aria-label="Toggle Dark Mode"
                    >
                        <div className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDarkMode ? 'translate-x-[22px] bg-[#BCC5DC]/40' : 'translate-x-[3px] bg-[#222944]/30'}`} />
                    </button>
                    <div
                        className="flex items-center pointer-events-auto cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <div className="w-8 h-8 flex flex-col items-end justify-center gap-1.5">
                            <span className={`h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'w-6 rotate-45 translate-y-[5.5px]' : 'w-6'} bg-[#222944] dark:bg-[#BCC5DC]`}></span>
                            <span className={`h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'w-6 -rotate-45 -translate-y-[5.5px]' : 'w-4'} bg-[#222944] dark:bg-[#BCC5DC]`}></span>
                        </div>
                    </div>

                    <a
                        href="https://app.centhropy.com/login"
                        className="text-[11px] font-funnel font-bold tracking-[0.25em] transition-colors duration-500 uppercase pointer-events-auto text-[#222944] dark:text-[#BCC5DC]"
                    >
                        Ingresar
                    </a>
                </div>
            </div>

            {/* FULL SCREEN MENU OVERLAY */}
            <div className={`px-5 md:px-10 pt-24 pb-12 transition-all duration-300 ease-out ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'} no-scrollbar bg-white dark:bg-[#1B2136] ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`} style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10001 }}>

                {isMobile ? (
                    /* MOBILE MENU — Optimized for vertical mobile flow */
                    <div className="flex flex-col gap-10 pb-32 no-scrollbar scroll-smooth">
                        {/* NAVIGATION */}
                        <div className={`flex flex-col gap-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[300ms]' : 'opacity-0 translate-y-12'}`}>
                            <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] block text-left">Navegación</span>
                            <nav className="flex flex-col gap-9">
                                <div className="flex flex-col gap-5">
                                    <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tighter flex items-center gap-2">CONECTAR <span className="text-2xl leading-none">→</span></Link>
                                    <div className="flex flex-col gap-5 text-[#222944]/80 dark:text-[#BCC5DC]">
                                        <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-2xl font-light">↳ Unify Data Center</Link>
                                        <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-2xl font-light">↳ TI Outsourcing</Link>
                                        <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-2xl font-light">↳ Growth Engine</Link>
                                    </div>
                                </div>
                                <div className="border-t border-[#222944]/30 dark:border-[#BCC5DC]/30" />
                                <Link to="/impact-studies" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tighter">Estudios de Impacto</Link>
                                <Link to="/newsroom" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tighter">Sala de Prensa</Link>
                                <Link to="/announcements" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tighter">Anuncios Corporativos</Link>
                                <Link to="/docs" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tighter">Documentación</Link>
                                <a href="#" className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tighter">Careers</a>
                            </nav>
                        </div>

                        {/* SCROLL INDICATOR */}
                        <div className={`flex justify-start py-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[400ms]' : 'opacity-0 translate-y-12'}`}>
                            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-slow">
                                <path d="M10 5L30 25L50 5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="square" strokeLinejoin="miter" className="text-[#222944] dark:text-[#BCC5DC]" />
                                <path d="M10 5L30 25L50 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="energy-path text-[#222944] dark:text-[#BCC5DC]" />
                            </svg>
                        </div>

                        {/* NEWS SECTION */}
                        <div className={`flex flex-col gap-10 border-t border-[#222944]/10 dark:border-[#BCC5DC]/10 pt-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[500ms]' : 'opacity-0 translate-y-12'}`}>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] block">Últimas Noticias</span>
                                <Link to="/newsroom" onClick={() => setMenuOpen(false)} className="text-[10px] font-bold text-[#222944] dark:text-[#BCC5DC] uppercase tracking-widest border-b border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-1">Newsroom ↗</Link>
                            </div>
                            <div className="flex flex-col gap-12">
                                {posts.find(p => p.id === slots.news) ? (
                                    <Link to={`/blog/${slots.news}`} onClick={() => setMenuOpen(false)} className="flex flex-col gap-5">
                                        <div className="aspect-video overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10">
                                            <img src={posts.find(p => p.id === slots.news).image} alt="News 1" className="w-full h-full object-cover" />
                                        </div>
                                        <h5 className="text-xl font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight uppercase tracking-tight">{posts.find(p => p.id === slots.news).title}</h5>
                                        <p className="text-sm text-[#222944]/40 dark:text-[#BCC5DC]/60 font-light">{posts.find(p => p.id === slots.news).description}</p>
                                    </Link>
                                ) : (
                                    <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic">-- No hay noticias --</div>
                                )}

                                {posts.find(p => p.id === slots.news2) ? (
                                    <Link to={`/blog/${slots.news2}`} onClick={() => setMenuOpen(false)} className="flex flex-col gap-5 pt-8">
                                        <div className="aspect-video overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10">
                                            <img src={posts.find(p => p.id === slots.news2).image} alt="News 2" className="w-full h-full object-cover" />
                                        </div>
                                        <h5 className="text-xl font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight uppercase tracking-tight">{posts.find(p => p.id === slots.news2).title}</h5>
                                        <p className="text-sm text-[#222944]/40 dark:text-[#BCC5DC]/60 font-light">{posts.find(p => p.id === slots.news2).description}</p>
                                    </Link>
                                ) : (
                                    <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic pt-8">-- No hay noticias secundarias --</div>
                                )}
                            </div>
                        </div>

                        {/* ANNOUNCEMENT SECTION (Missing on mobile) */}
                        <div className={`flex flex-col gap-10 border-t border-[#222944]/10 dark:border-[#BCC5DC]/10 pt-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[550ms]' : 'opacity-0 translate-y-12'}`}>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] block">Anuncio Corporativo</span>
                                <Link to="/announcements" onClick={() => setMenuOpen(false)} className="text-[10px] font-bold text-[#222944] dark:text-[#BCC5DC] uppercase tracking-widest border-b border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-1">Ver todos ↗</Link>
                            </div>
                            <div className="flex flex-col gap-6">
                                {posts.find(p => p.id === slots.announcement) ? (
                                    <Link to={`/blog/${slots.announcement}`} onClick={() => setMenuOpen(false)} className="flex flex-col gap-5">
                                        <div className="aspect-video overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10">
                                            <img src={posts.find(p => p.id === slots.announcement).image} alt="Announcement" className="w-full h-full object-cover" />
                                        </div>
                                        <h5 className="text-xl font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight uppercase tracking-tight">{posts.find(p => p.id === slots.announcement).title}</h5>
                                        <p className="text-sm text-[#222944]/40 dark:text-[#BCC5DC]/60 font-light">{posts.find(p => p.id === slots.announcement).description}</p>
                                    </Link>
                                ) : (
                                    <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic">-- No hay anuncios destacados --</div>
                                )}
                            </div>
                        </div>

                        {/* IMPACT SECTION */}
                        <div className={`flex flex-col gap-10 border-t border-[#222944]/10 dark:border-[#BCC5DC]/10 pt-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[650ms]' : 'opacity-0 translate-y-12'}`}>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] block">Estudio de Impacto</span>
                                <Link to="/impact-studies" onClick={() => setMenuOpen(false)} className="text-[10px] font-bold text-[#222944] dark:text-[#BCC5DC] uppercase tracking-widest border-b border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-1">Ver todos ↗</Link>
                            </div>
                            <div className="flex flex-col gap-6">
                                {posts.find(p => p.id === slots.impact) ? (
                                    <>
                                        <p className="text-2xl font-light text-[#222944]/70 dark:text-[#BCC5DC]/90 leading-snug uppercase tracking-tighter">
                                            {posts.find(p => p.id === slots.impact).description}
                                        </p>
                                        <div className="aspect-[4/3] w-full overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10 grayscale brightness-75">
                                            <img src={posts.find(p => p.id === slots.impact).image} alt="Impact Study" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-[0.2em]">Growth Engine // Core</span>
                                            <span className="text-base font-bold text-[#222944] dark:text-[#BCC5DC] uppercase">{posts.find(p => p.id === slots.impact).title}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic">-- No hay estudios --</div>
                                )}
                            </div>
                        </div>

                        {/* FINAL CTA SECTION */}
                        <div className={`flex flex-col gap-10 border-t border-[#222944]/10 dark:border-[#BCC5DC]/10 pt-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[750ms]' : 'opacity-0 translate-y-12'}`}>
                            <Link
                                to="/waitlist"
                                onClick={() => setMenuOpen(false)}
                                className="group flex justify-between items-center bg-[#222944] dark:bg-[#303A5F] transition-all duration-500 py-4 px-6 rounded-none border border-[#222944]/10 dark:border-transparent"
                            >
                                <span className="text-3xl font-medium uppercase tracking-tighter text-white flex items-center gap-2">CONECTAR <span className="text-2xl leading-none">→</span></span>
                                <div className="w-12 h-12 rounded-none border border-white/20 flex items-center justify-center text-white group-hover:border-white transition-all">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* DESKTOP MENU — 12-column grid layout */
                    <div className="grid grid-cols-12 gap-12 max-w-[1800px] mx-auto pb-12">
                        {/* COLUMN 1: NAVIGATION */}
                        <div className={`col-span-3 flex flex-col gap-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[300ms]' : 'opacity-0 translate-y-12'}`}>
                            <div>
                                <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] mb-6 block">Navegación</span>
                                <nav className="flex flex-col gap-9">
                                    <div className="flex flex-col gap-4">
                                        <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors uppercase tracking-tighter flex items-center gap-2">CONECTAR <span className="text-2xl leading-none">→</span></Link>
                                        <div className="flex flex-col gap-3">
                                            <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-2xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors">↳ Unify Data Center</Link>
                                            <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-2xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors">↳ TI Outsourcing</Link>
                                            <Link to="/waitlist" onClick={() => setMenuOpen(false)} className="text-2xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors">↳ Growth Engine</Link>
                                        </div>
                                    </div>
                                    <div className="border-t border-[#222944]/30 dark:border-[#BCC5DC]/30" />
                                    <Link to="/impact-studies" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors uppercase tracking-tighter">Estudios de Impacto</Link>
                                    <Link to="/newsroom" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors uppercase tracking-tighter">Sala de Prensa</Link>
                                    <Link to="/announcements" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors uppercase tracking-tighter">Anuncios Corporativos</Link>
                                    <Link to="/docs" onClick={() => setMenuOpen(false)} className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors uppercase tracking-tighter">Documentación</Link>
                                    <a href="#" className="text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] hover:text-[#222944]/60 dark:text-[#BCC5DC]/80 transition-colors uppercase tracking-tighter">Careers</a>
                                </nav>
                            </div>
                        </div>

                        {/* COLUMN 2: NEWS */}
                        <div className={`col-span-5 flex flex-col gap-12 border-x border-transparent px-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[450ms]' : 'opacity-0 translate-y-12'}`}>
                            <div>
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] block">Últimas Noticias</span>
                                    <Link to="/newsroom" onClick={() => setMenuOpen(false)} className="text-[10px] font-bold text-[#222944] dark:text-[#BCC5DC] uppercase tracking-widest border-b border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-1 hover:border-[#222944] dark:border-[#BCC5DC] transition-all">Newsroom ↗</Link>
                                </div>
                                <div className="flex flex-col gap-8">
                                    {/* Slot 01: Latest News */}
                                    {posts.find(p => p.id === slots.news) ? (
                                        <Link to={`/blog/${slots.news}`} onClick={() => setMenuOpen(false)} className="grid grid-cols-2 gap-6 group cursor-pointer">
                                            <div className="aspect-video overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10">
                                                <img src={posts.find(p => p.id === slots.news).image} alt="News 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            </div>
                                            <div className="flex flex-col justify-between py-1">
                                                <div>
                                                    <span className="text-[9px] font-bold text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase mb-2 block tracking-widest">{new Date(posts.find(p => p.id === slots.news).date).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                    <h5 className="text-lg font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight mb-2 group-hover:text-[#222944]/70 dark:text-[#BCC5DC]/90 transition-colors uppercase tracking-tight">{posts.find(p => p.id === slots.news).title}</h5>
                                                    <p className="text-xs text-[#222944]/40 dark:text-[#BCC5DC]/60 line-clamp-2 font-funnel font-light">{posts.find(p => p.id === slots.news).description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic">-- No hay noticias destacadas --</div>
                                    )}

                                    {/* Slot 02: Secondary News */}
                                    {posts.find(p => p.id === slots.news2) ? (
                                        <Link to={`/blog/${slots.news2}`} onClick={() => setMenuOpen(false)} className="grid grid-cols-2 gap-6 group cursor-pointer">
                                            <div className="aspect-video overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10">
                                                <img src={posts.find(p => p.id === slots.news2).image} alt="News 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            </div>
                                            <div className="flex flex-col justify-between py-1">
                                                <div>
                                                    <span className="text-[9px] font-bold text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase mb-2 block tracking-widest">{new Date(posts.find(p => p.id === slots.news2).date).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                    <h5 className="text-lg font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight mb-2 group-hover:text-[#222944]/70 dark:text-[#BCC5DC]/90 transition-colors uppercase tracking-tight">{posts.find(p => p.id === slots.news2).title}</h5>
                                                    <p className="text-xs text-[#222944]/40 dark:text-[#BCC5DC]/60 line-clamp-2 font-funnel font-light">{posts.find(p => p.id === slots.news2).description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic">-- No hay noticias secundarias --</div>
                                    )}

                                    {/* Corporate Announcement Section (Slot 03) */}
                                    <div className="border-t border-[#222944]/30 dark:border-[#BCC5DC]/30 my-4" />
                                    <div className="flex flex-col gap-8">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] block">Anuncio Corporativo</span>
                                            <Link to="/announcements" onClick={() => setMenuOpen(false)} className="text-[10px] font-bold text-[#222944] dark:text-[#BCC5DC] uppercase tracking-widest border-b border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-1 hover:border-[#222944] dark:border-[#BCC5DC] transition-all">Ver todos ↗</Link>
                                        </div>
                                        {posts.find(p => p.id === slots.announcement) ? (
                                            <Link to={`/blog/${slots.announcement}`} onClick={() => setMenuOpen(false)} className="grid grid-cols-2 gap-6 group cursor-pointer">
                                                <div className="aspect-video overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10">
                                                    <img src={posts.find(p => p.id === slots.announcement).image} alt="Announcement" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                </div>
                                                <div className="flex flex-col justify-between py-1">
                                                    <div>
                                                        <h5 className="text-lg font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight mb-2 group-hover:text-[#222944]/70 dark:text-[#BCC5DC]/90 transition-colors uppercase tracking-tight">{posts.find(p => p.id === slots.announcement).title}</h5>
                                                        <p className="text-xs text-[#222944]/40 dark:text-[#BCC5DC]/60 line-clamp-2 font-funnel font-light">{posts.find(p => p.id === slots.announcement).description}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic">-- No hay anuncios destacados --</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 3: OFFERINGS & IMPACT (Slot 03) */}
                        <div className={`col-span-4 flex flex-col gap-12 pl-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'opacity-100 translate-y-0 delay-[600ms]' : 'opacity-0 translate-y-12'}`}>
                            <div>
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-[10px] font-bold text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-[0.4em] block">Estudio de Impacto</span>
                                    <Link to="/impact-studies" onClick={() => setMenuOpen(false)} className="text-[10px] font-bold text-[#222944] dark:text-[#BCC5DC] uppercase tracking-widest border-b border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-1 hover:border-[#222944] dark:border-[#BCC5DC] transition-all">Ver todos ↗</Link>
                                </div>
                                {posts.find(p => p.id === slots.impact) ? (
                                    <Link to={`/blog/${slots.impact}`} onClick={() => setMenuOpen(false)} className="group cursor-pointer block">
                                        <p className="text-xl font-light text-[#222944] dark:text-[#BCC5DC] leading-snug mb-8 uppercase tracking-tighter">
                                            {posts.find(p => p.id === slots.impact).description}
                                        </p>
                                        <div className="aspect-[4/3] w-full overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10 mb-6">
                                            <img src={posts.find(p => p.id === slots.impact).image} alt="Impact Study" className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-[0.2em]">Growth Engine // Dynamic_Core</span>
                                            <span className="text-sm font-bold text-[#222944] dark:text-[#BCC5DC] uppercase">{posts.find(p => p.id === slots.impact).title}</span>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="text-[10px] text-[#222944]/20 dark:text-[#BCC5DC]/40 uppercase tracking-widest italic">-- No hay estudios destacados --</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
