import React, { useState, useMemo } from 'react';
import { ArrowRight, Bell, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import { useEditorial } from './hooks/useEditorial';

// ─── ANNOUNCEMENT CARD ────────────────────────
const AnnouncementCard = ({ post, index }) => {
    const isFeatured = index === 0;
    const image = post.coverImage || post.image;
    const excerpt = post.excerpt || post.description;

    return (
        <Link
            to={`/blog/${post.id}`}
            className={`group block ${isFeatured ? 'md:col-span-2' : ''}`}
        >
            {/* Image */}
            <div className={`w-full overflow-hidden mb-8 border border-black/5 relative bg-gray-100 ${isFeatured ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}>
                {image ? (
                    <img
                        src={image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0 transition-[filter,transform]"
                        loading={isFeatured ? 'eager' : 'lazy'}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-black/10 text-xs uppercase tracking-widest">Sin imagen</span>
                    </div>
                )}
                {/* Category badge over image */}
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-bold uppercase tracking-[0.3em]">
                    {post.category}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-black/30 uppercase tracking-[0.4em]">
                            {post.date
                                ? new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                : ''}
                        </span>
                        {post.readTime && (
                            <>
                                <span className="text-black/20">·</span>
                                <span className="flex items-center gap-1 text-[10px] text-black/30">
                                    <Clock size={9} />
                                    {post.readTime}
                                </span>
                            </>
                        )}
                    </div>
                    <Bell size={12} className="text-black/20 shrink-0" />
                </div>
                <h2 className={`font-medium tracking-tighter uppercase leading-[0.9] group-hover:text-black/50 transition-colors ${isFeatured ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'}`}>
                    {post.title}
                </h2>
                {excerpt && (
                    <p className={`text-black/55 font-light leading-snug ${isFeatured ? 'max-w-2xl text-lg' : 'text-sm line-clamp-2'}`}>
                        {excerpt}
                    </p>
                )}
                <div className="pt-3 flex items-center gap-2 group/btn w-fit">
                    <span className="text-xs font-bold uppercase tracking-widest border-b border-black/20 pb-0.5 group-hover/btn:border-black transition-all">
                        Ver comunicado
                    </span>
                    <ArrowRight size={14} className="translate-y-[-1px] group-hover/btn:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

// ─── EMPTY STATE ─────────────────────────────
const EmptyState = ({ category }) => (
    <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-black/10">
        <div className="w-8 h-8 border border-black/10 flex items-center justify-center mb-4">
            <Bell size={14} className="text-black/20" />
        </div>
        <p className="text-black/30 text-sm uppercase tracking-widest">
            {category === 'Todos'
                ? 'No hay anuncios disponibles'
                : `No hay anuncios en "${category}"`}
        </p>
        <p className="text-black/20 text-xs mt-2">Vuelve pronto o selecciona otra categoría</p>
    </div>
);

// ─── MAIN: CORPORATE ANNOUNCEMENTS ───────────
const CorporateAnnouncements = () => {
    const { getPostsByType } = useEditorial();
    const [activeCategory, setActiveCategory] = useState('Todos');

    // Get all active announcement posts
    const allPosts = useMemo(() => getPostsByType('announcement'), [getPostsByType]);

    // Dynamic categories from actual posts
    const categories = useMemo(() => {
        const cats = ['Todos'];
        allPosts.forEach(p => {
            if (p.category && !cats.includes(p.category)) cats.push(p.category);
        });
        return cats;
    }, [allPosts]);

    const getCategoryCount = (cat) =>
        cat === 'Todos' ? allPosts.length : allPosts.filter(p => p.category === cat).length;

    const filtered = useMemo(() =>
        activeCategory === 'Todos'
            ? allPosts
            : allPosts.filter(p => p.category === activeCategory),
        [allPosts, activeCategory]
    );

    return (
        <>
            <Helmet>
                <title>Anuncios Corporativos | Centhropy</title>
                <meta name="description" content="Notas oficiales, actualizaciones de estructura y comunicaciones institucionales de Centhropy." />
            </Helmet>

            <div className="font-funnel no-select w-full bg-white text-black min-h-screen relative overflow-x-hidden">
                <Navbar subtitle="Anuncios Corporativos" />

                <main className="pt-[140px] md:pt-[200px] px-5 md:px-10 max-w-[1800px] mx-auto">

                    {/* HERO */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
                        <div className="md:col-span-8">
                            <h1 className="text-7xl md:text-[120px] font-medium tracking-tighter leading-[0.85] uppercase">
                                Anuncios <br /> Corporativos
                            </h1>
                        </div>
                        <div className="md:col-span-4 flex items-end">
                            <p className="text-xl md:text-2xl font-light leading-snug text-black/80">
                                Notas oficiales, actualizaciones de estructura y comunicaciones institucionales de Centhropy.
                            </p>
                        </div>
                    </div>

                    {/* CATEGORY NAV */}
                    <div className="border-t border-black/10 py-6 mb-16 overflow-x-auto no-scrollbar">
                        <div className="flex gap-1 whitespace-nowrap">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                                            ? 'bg-black text-white'
                                            : 'text-black/40 hover:text-black hover:bg-black/5'
                                        }`}
                                >
                                    {cat}
                                    {getCategoryCount(cat) > 0 && (
                                        <span className={`ml-2 text-[9px] font-mono ${activeCategory === cat ? 'text-white/60' : 'text-black/20'}`}>
                                            {getCategoryCount(cat)}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 pb-32">
                        {filtered.length === 0
                            ? <EmptyState category={activeCategory} />
                            : filtered.map((post, i) => (
                                <AnnouncementCard key={post.id} post={post} index={i} />
                            ))
                        }
                    </div>
                </main>

                <footer className="bg-white border-t border-black/5 px-5 md:px-10 py-20 max-w-[1800px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                        <div>
                            <Logo className="text-black mb-4" />
                            <p className="text-sm text-black/40 max-w-xs">Transparencia y rigor en la comunicación de nuestra infraestructura global.</p>
                        </div>
                        <div className="flex flex-col gap-2 items-start md:items-end">
                            <span className="text-[10px] font-bold text-black/30 uppercase tracking-[0.3em]">© {new Date().getFullYear()} Centhropy</span>
                            <span className="text-[10px] font-bold text-black/30 uppercase tracking-[0.3em]">Corporate Relations Department</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default CorporateAnnouncements;
