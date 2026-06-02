import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    ArrowLeft, Clock, Share2, User, Tag,
    ArrowRight, ChevronUp
} from 'lucide-react';
import Logo from './components/Logo';
import { useEditorial } from './hooks/useEditorial';

// ─────────────────────────────────────────────
// BLOCK RENDERER
// ─────────────────────────────────────────────
const BlockRenderer = ({ blocks }) => {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="space-y-8">
            {blocks.map((block, i) => {
                switch (block.type) {

                    case 'paragraph':
                        return block.text ? (
                            <p key={block.id || i}
                                className="font-unna text-xl md:text-[22px] leading-[1.65] text-[#222944]/85 dark:text-[#BCC5DC]/85">
                                {block.text}
                            </p>
                        ) : null;

                    case 'heading2':
                        return block.text ? (
                            <h2 key={block.id || i}
                                className="font-funnel font-black text-2xl md:text-3xl uppercase tracking-tighter text-[#222944] dark:text-[#BCC5DC] pt-6 pb-1">
                                {block.text}
                            </h2>
                        ) : null;

                    case 'heading3':
                        return block.text ? (
                            <h3 key={block.id || i}
                                className="font-funnel font-bold text-xl uppercase tracking-widest text-[#222944] dark:text-[#BCC5DC] pt-4">
                                {block.text}
                            </h3>
                        ) : null;

                    case 'quote':
                        return block.text ? (
                            <blockquote key={block.id || i}
                                className="border-l-[1.5px] border-[#222944] dark:border-[#BCC5DC] pl-8 py-2 my-10">
                                <p className="font-unna italic text-2xl md:text-3xl text-[#222944] dark:text-[#BCC5DC] leading-snug">
                                    "{block.text}"
                                </p>
                                {block.attribution && (
                                    <cite className="block mt-3 text-sm font-funnel font-medium text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest not-italic">
                                        — {block.attribution}
                                    </cite>
                                )}
                            </blockquote>
                        ) : null;

                    case 'image':
                        return block.src ? (
                            <figure key={block.id || i} className="my-12">
                                <div className="overflow-hidden border border-[#222944]/15 dark:border-[#BCC5DC]/5">
                                    <img
                                        src={block.src}
                                        alt={block.caption || ''}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                {block.caption && (
                                    <figcaption className="text-center text-[11px] text-[#222944]/40 dark:text-[#BCC5DC]/60 mt-3 uppercase tracking-widest font-funnel">
                                        {block.caption}
                                    </figcaption>
                                )}
                            </figure>
                        ) : null;

                    case 'callout':
                        return block.text ? (
                            <div key={block.id || i}
                                className="bg-black/[0.03] border border-[#222944]/10 dark:border-[#BCC5DC]/10 px-8 py-6 my-8">
                                <div className="flex items-start gap-4">
                                    <span className="text-lg mt-0.5">💡</span>
                                    <p className="font-funnel text-base text-[#222944]/80 dark:text-[#BCC5DC] leading-relaxed">
                                        {block.text}
                                    </p>
                                </div>
                            </div>
                        ) : null;

                    case 'list':
                        return block.items && block.items.some(item => item.trim()) ? (
                            block.ordered ? (
                                <ol key={block.id || i}
                                    className="font-unna text-xl md:text-[21px] leading-[1.65] text-[#222944]/85 dark:text-[#BCC5DC]/85 list-decimal list-inside space-y-3 pl-2">
                                    {block.items.filter(item => item.trim()).map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ol>
                            ) : (
                                <ul key={block.id || i}
                                    className="font-unna text-xl md:text-[21px] leading-[1.65] text-[#222944]/85 dark:text-[#BCC5DC]/85 space-y-3">
                                    {block.items.filter(item => item.trim()).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="mt-2 w-1.5 h-1.5 bg-black rounded-full shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )
                        ) : null;

                    case 'divider':
                        return (
                            <div key={block.id || i} className="py-4">
                                <div className="border-t border-[#222944]/10 dark:border-[#BCC5DC]/10" />
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

// ─────────────────────────────────────────────
// RELATED POSTS CARD
// ─────────────────────────────────────────────
const RelatedPostCard = ({ post }) => (
    <Link to={`/blog/${post.id}`}
        className="group block border border-[#222944]/15 dark:border-[#BCC5DC]/5 hover:border-[#222944]/20 dark:border-[#BCC5DC]/20 transition-all duration-500">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
            {(post.coverImage || post.image) ? (
                <img
                    src={post.coverImage || post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full bg-[#222944]/15 dark:bg-[#BCC5DC]/5 flex items-center justify-center">
                    <span className="text-[#222944]/20 dark:text-[#BCC5DC]/40 text-xs uppercase tracking-widest">Sin imagen</span>
                </div>
            )}
        </div>
        <div className="p-5">
            <span className="text-[9px] font-bold text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-[0.3em] mb-2 block">{post.category}</span>
            <h4 className="font-funnel font-medium text-lg uppercase tracking-tighter leading-tight text-[#222944] dark:text-[#BCC5DC] group-hover:text-[#222944]/50 dark:text-[#BCC5DC]/70 transition-colors">
                {post.title}
            </h4>
            {(post.excerpt || post.description) && (
                <p className="text-sm text-[#222944]/50 dark:text-[#BCC5DC]/70 mt-2 line-clamp-2 font-light">
                    {post.excerpt || post.description}
                </p>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-widest border-b border-transparent group-hover:border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-0.5 transition-all w-fit">
                Leer más <ArrowRight className="w-3.5 h-3.5" />
            </div>
        </div>
    </Link>
);

// ─────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────
const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const scrollTop = el.scrollTop || document.body.scrollTop;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#222944]/15 dark:bg-[#BCC5DC]/5 z-[9999]">
            <div
                className="h-full bg-black transition-all duration-100"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

// ─────────────────────────────────────────────
// BACK TO TOP BUTTON
// ─────────────────────────────────────────────
const BackToTop = ({ show }) => (
    <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-50 w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-[#222944]/80 dark:bg-[#BCC5DC]/80 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Volver arriba"
    >
        <ChevronUp className="w-5 h-5" />
    </button>
);

// ─────────────────────────────────────────────
// SCHEMA.ORG JSON-LD Builder
// ─────────────────────────────────────────────
const buildJsonLd = (post, author) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seo?.metaTitle || post.title,
    "description": post.seo?.metaDescription || post.excerpt || post.description || '',
    "image": post.seo?.ogImage || post.coverImage || post.image || '',
    "datePublished": post.date || new Date().toISOString(),
    "dateModified": post.updatedAt || post.date || new Date().toISOString(),
    "author": {
        "@type": "Person",
        "name": author?.name || "Centhropy",
        "jobTitle": author?.role || ''
    },
    "publisher": {
        "@type": "Organization",
        "name": "Centhropy",
        "logo": {
            "@type": "ImageObject",
            "url": "https://centhropy.com/logo.png"
        }
    },
    "keywords": (post.tags || []).join(', '),
    "articleSection": post.category || '',
    "about": (post.seo?.entityMentions || []).map(e => ({ "@type": "Thing", "name": e })),
    "speakable": post.seo?.geoSummary ? {
        "@type": "SpeakableSpecification",
        "cssSelector": ["article", "h1", ".article-excerpt"]
    } : undefined
});

// ─────────────────────────────────────────────
// TYPE → SECTION LABELS & BACK LINKS
// ─────────────────────────────────────────────
const SECTION_MAP = {
    news: { label: 'Sala de Prensa', path: '/newsroom', backText: 'Sala de Prensa' },
    announcement: { label: 'Anuncios Corporativos', path: '/announcements', backText: 'Anuncios' },
    impact_study: { label: 'Estudios de Impacto', path: '/impact-studies', backText: 'Impacto' },
};

// ─────────────────────────────────────────────
// MAIN: BlogPost
// ─────────────────────────────────────────────
const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { posts, getAuthorById } = useEditorial();

    const [scrolled, setScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const articleRef = useRef(null);

    // Find post — by ID first, then by slug as fallback
    const post = posts.find(p => p.id === id) || posts.find(p => p.slug === id);
    const author = post ? getAuthorById(post.authorId) : null;
    const section = post ? (SECTION_MAP[post.type] || SECTION_MAP.news) : SECTION_MAP.news;

    // Related posts: same type, active, exclude current
    const relatedPosts = post
        ? posts
            .filter(p => p.status === 'active' && p.id !== post.id && p.type === post.type)
            .slice(0, 3)
        : [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 50);
            setShowBackToTop(y > 600);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ── 404 STATE ──────────────────────────────
    if (!post) {
        return (
            <div className="bg-white dark:bg-[#222944] min-h-screen font-funnel flex flex-col items-center justify-center gap-6">
                <span className="text-[10px] font-funnel text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-[0.4em]">Error 404</span>
                <h1 className="text-5xl font-black uppercase tracking-tighter">Publicación no encontrada</h1>
                <p className="text-[#222944]/50 dark:text-[#BCC5DC]/70 text-lg font-light">El artículo que buscas no existe o fue eliminado.</p>
                <Link to="/newsroom"
                    className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-[#222944] dark:border-[#BCC5DC] pb-1 hover:opacity-50 transition-opacity">
                    <ArrowLeft className="w-4 h-4" /> Sala de Prensa
                </Link>
            </div>
        );
    }

    const jsonLd = buildJsonLd(post, author);
    const hasContent = typeof post.content === 'string'
        ? (post.content.trim().length > 0 && post.content !== '<p></p>')
        : (Array.isArray(post.content) && post.content.length > 0 && post.content.some(b => b.text || b.src));
    // Fallback: if no structured content but has legacy description
    const hasFallbackContent = !hasContent && (post.description || post.excerpt);

    return (
        <>
            {/* ── SEO META TAGS ── */}
            <Helmet>
                <title>{post.seo?.metaTitle ? `${post.seo.metaTitle} | Centhropy` : `${post.title} | Centhropy`}</title>
                <meta name="description" content={post.seo?.metaDescription || post.excerpt || post.description || ''} />
                {post.tags && post.tags.length > 0 && (
                    <meta name="keywords" content={post.tags.join(', ')} />
                )}
                {post.seo?.canonicalUrl && <link rel="canonical" href={post.seo.canonicalUrl} />}
                {post.seo?.noIndex && <meta name="robots" content="noindex, nofollow" />}

                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={post.seo?.metaTitle || post.title} />
                <meta property="og:description" content={post.seo?.metaDescription || post.excerpt || post.description || ''} />
                {(post.seo?.ogImage || post.coverImage || post.image) && (
                    <meta property="og:image" content={post.seo?.ogImage || post.coverImage || post.image} />
                )}
                <meta property="og:site_name" content="Centhropy" />
                <meta property="article:published_time" content={post.date || ''} />
                {post.tags && post.tags.map(tag => (
                    <meta key={tag} property="article:tag" content={tag} />
                ))}

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.seo?.metaTitle || post.title} />
                <meta name="twitter:description" content={post.seo?.metaDescription || post.excerpt || post.description || ''} />
                {(post.seo?.ogImage || post.coverImage || post.image) && (
                    <meta name="twitter:image" content={post.seo?.ogImage || post.coverImage || post.image} />
                )}

                {/* Schema.org JSON-LD */}
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd, null, 2)}
                </script>
            </Helmet>

            {/* ── READING PROGRESS ── */}
            <ReadingProgress />

            {/* ── BACK TO TOP ── */}
            <BackToTop show={showBackToTop} />

            <div className="bg-white dark:bg-[#222944] min-h-screen font-funnel selection:bg-black selection:text-white">

                {/* ── STICKY MINI NAV ── */}
                <nav className={`fixed top-[2px] inset-x-0 z-[1000] transition-all duration-500 px-5 md:px-10 h-[64px] flex items-center justify-between ${scrolled ? 'bg-white/90 dark:bg-[#222944]/90 backdrop-blur-md border-b border-[#222944]/15 dark:border-[#BCC5DC]/5' : 'bg-transparent'}`}>
                    <Link to={section.path} className="flex items-center gap-2 group text-[#222944]/60 dark:text-[#BCC5DC]/80 hover:text-[#222944] dark:text-[#BCC5DC] transition-colors">
                        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:block">
                            {section.backText}
                        </span>
                    </Link>

                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 hover:opacity-60 transition-opacity">
                        <Logo className="h-5 text-[#222944] dark:text-[#BCC5DC]" />
                    </Link>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: post.title, url: window.location.href });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                }
                            }}
                            className="text-[#222944]/30 dark:text-[#BCC5DC]/50 hover:text-[#222944] dark:text-[#BCC5DC] transition-colors"
                            title="Compartir"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                </nav>

                {/* ── MAIN ARTICLE ── */}
                <main className="pt-24 pb-32 px-5">
                    <article ref={articleRef} className="max-w-[720px] mx-auto">

                        {/* ── HEADER ── */}
                        <header className="mb-12">
                            {/* Category + Date */}
                            <div className="flex items-center gap-3 mb-7">
                                <span className="px-2.5 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] leading-none">
                                    {post.category || section.label}
                                </span>
                                <div className="h-[1px] w-6 bg-[#222944]/10 dark:bg-[#BCC5DC]/10" />
                                <span className="text-[11px] font-medium text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest">
                                    {post.date
                                        ? new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : ''}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-[52px] font-black tracking-tighter leading-[1.02] uppercase mb-5">
                                {post.title}
                            </h1>

                            {/* Excerpt / Subtitle */}
                            {(post.excerpt || post.description) && (
                                <p className="article-excerpt text-xl md:text-2xl font-light text-[#222944]/55 dark:text-[#BCC5DC]/55 leading-snug mb-8 uppercase tracking-tight">
                                    {post.excerpt || post.description}
                                </p>
                            )}

                            {/* Author Row */}
                            <div className="flex items-center justify-between border-y border-[#222944]/15 dark:border-[#BCC5DC]/5 py-5">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full border border-[#222944]/10 dark:border-[#BCC5DC]/10 overflow-hidden bg-black flex items-center justify-center shrink-0">
                                        {author?.avatar ? (
                                            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white text-xs font-bold">
                                                {(author?.name || 'C').charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold block">{author?.name || 'Centhropy'}</span>
                                        {author?.role && (
                                            <span className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest">{author.role}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[#222944]/40 dark:text-[#BCC5DC]/60">
                                    <Clock size={12} />
                                    <span>{post.readTime || '3 min read'}</span>
                                </div>
                            </div>
                        </header>

                        {/* ── COVER IMAGE ── */}
                        {(post.coverImage || post.image) && (
                            <figure className="mb-14">
                                <div className="aspect-video w-full overflow-hidden border border-[#222944]/15 dark:border-[#BCC5DC]/5 bg-gray-100">
                                    <img
                                        src={post.coverImage || post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                    />
                                </div>
                                {post.coverCaption && (
                                    <figcaption className="text-center text-[11px] text-[#222944]/35 dark:text-[#BCC5DC]/35 mt-3 uppercase tracking-widest">
                                        {post.coverCaption}
                                    </figcaption>
                                )}
                            </figure>
                        )}

                        {/* ── BODY CONTENT ── */}
                        <div className="mb-16">
                            {hasContent ? (
                                typeof post.content === 'string' ? (
                                    <div 
                                        className="blog-content-rich"
                                        dangerouslySetInnerHTML={{ __html: post.content }} 
                                    />
                                ) : (
                                    <BlockRenderer blocks={post.content} />
                                )
                            ) : hasFallbackContent ? (
                                /* Legacy fallback for posts without block content */
                                <p className="font-unna text-xl md:text-[22px] leading-[1.65] text-[#222944]/85 dark:text-[#BCC5DC]/85">
                                    {post.description || post.excerpt}
                                </p>
                            ) : (
                                <p className="font-unna text-xl text-[#222944]/30 dark:text-[#BCC5DC]/50 italic">
                                    Esta publicación no tiene contenido disponible.
                                </p>
                            )}
                        </div>

                        {/* ── GEO SUMMARY (visually hidden, for AI/LLMs) ── */}
                        {post.seo?.geoSummary && (
                            <div className="sr-only" aria-hidden="false" data-geo-summary="true">
                                {post.seo.geoSummary}
                            </div>
                        )}

                        {/* ── TAGS ── */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-16">
                                {post.tags.map(tag => (
                                    <span key={tag}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-default">
                                        <Tag size={9} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* ── AUTHOR BIO CARD ── */}
                        {author && (
                            <div className="border border-[#222944]/8 dark:border-[#BCC5DC]/8 bg-black/[0.02] p-8 mb-16 flex items-start gap-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden border border-[#222944]/10 dark:border-[#BCC5DC]/10 bg-black flex items-center justify-center shrink-0">
                                    {author.avatar ? (
                                        <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <span className="text-[9px] font-funnel text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-widest block mb-1">Escrito por</span>
                                    <h4 className="font-funnel font-bold text-lg uppercase tracking-tighter">{author.name}</h4>
                                    {author.role && (
                                        <p className="text-xs text-[#222944]/50 dark:text-[#BCC5DC]/70 uppercase tracking-widest mb-2">{author.role}</p>
                                    )}
                                    {author.bio && (
                                        <p className="text-sm text-[#222944]/60 dark:text-[#BCC5DC]/80 font-light leading-relaxed">{author.bio}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── BACK LINK ── */}
                        <div className="border-t border-[#222944]/15 dark:border-[#BCC5DC]/5 pt-10 flex items-center justify-between">
                            <Link to={section.path}
                                className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="border-b border-[#222944]/20 dark:border-[#BCC5DC]/20 pb-0.5">{section.backText}</span>
                            </Link>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-[10px] font-bold uppercase tracking-widest text-[#222944]/30 dark:text-[#BCC5DC]/50 hover:text-[#222944] dark:text-[#BCC5DC] transition-colors flex items-center gap-1.5">
                                <ChevronUp size={12} /> Volver arriba
                            </button>
                        </div>
                    </article>
                </main>

                {/* ── RELATED POSTS ── */}
                {relatedPosts.length > 0 && (
                    <section className="border-t border-[#222944]/15 dark:border-[#BCC5DC]/5 px-5 md:px-10 py-20 max-w-[1400px] mx-auto">
                        <div className="max-w-[720px] mx-auto mb-10">
                            <span className="text-[10px] font-bold text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-[0.4em]">Sigue explorando</span>
                            <h2 className="text-3xl font-black tracking-tighter uppercase mt-1">Más publicaciones</h2>
                        </div>
                        <div className={`grid gap-6 max-w-[1400px] mx-auto ${relatedPosts.length === 1 ? 'grid-cols-1 max-w-sm' : relatedPosts.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                            {relatedPosts.map(p => (
                                <RelatedPostCard key={p.id} post={p} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── FOOTER ── */}
                <footer className="border-t border-[#222944]/15 dark:border-[#BCC5DC]/5 py-16 px-5 md:px-10 bg-black/[0.015]">
                    <div className="max-w-[720px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#222944]/25 dark:text-[#BCC5DC]/45">
                        <Link to="/" className="hover:text-[#222944] dark:text-[#BCC5DC] transition-colors">
                            <Logo className="h-4 text-[#222944]/30 dark:text-[#BCC5DC]/50 hover:text-[#222944] dark:text-[#BCC5DC] transition-colors" />
                        </Link>
                        <div className="flex gap-6">
                            <span>© {new Date().getFullYear()} Centhropy</span>
                            <Link to={section.path} className="hover:text-[#222944] dark:text-[#BCC5DC] transition-colors">
                                {section.backText} ↗
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default BlogPost;
