import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Layers, LogOut, Plus, Trash2,
    Eye, EyeOff, Edit, CheckCircle2, AlertCircle,
    User, X, Save, Search, Image as ImageIcon
} from 'lucide-react';
import { useEditorial } from '../hooks/useEditorial';
import PostEditor from './PostEditor';

// ─── SHARED STYLES (light theme tokens) ───────────────────────
const T = {
    // surfaces
    page: 'bg-[#f5f5f3]',
    sidebar: 'bg-white',
    card: 'bg-white',
    cardHover: 'hover:bg-gray-50',
    header: 'bg-white/90 backdrop-blur-md',
    // borders
    border: 'border-black/8',
    borderMd: 'border-black/12',
    // text
    label: 'text-black/40',
    body: 'text-black/70',
    title: 'text-black',
    // inputs
    input: 'bg-gray-50 border border-black/10 text-black placeholder:text-black/25 outline-none focus:border-black/40 focus:bg-white transition-colors',
    select: 'bg-gray-50 border border-black/10 text-black outline-none focus:border-black/40 transition-colors',
    // buttons
    btnPrimary: 'bg-black text-white hover:bg-black/80 transition-all active:scale-95',
    btnGhost: 'bg-black/5 hover:bg-black/10 text-black/70 transition-all border border-black/8',
    btnDanger: 'bg-black/5 hover:bg-red-500 hover:text-white transition-all border border-black/8 hover:border-red-500',
    // status dots
    dotActive: 'bg-emerald-500',
    dotDraft: 'bg-amber-400',
    dotOff: 'bg-black/20',
};

// ─── POST LIST VIEW ────────────────────────────────────────────
const PostsList = ({ posts, authors, toggleStatus, onDelete, onEdit }) => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const TYPE_LABELS = {
        news: 'Sala de Prensa',
        announcement: 'Anuncio',
        impact_study: 'Impacto'
    };

    const STATUS_CONFIG = {
        active: { dot: T.dotActive, label: 'Live' },
        draft: { dot: T.dotDraft, label: 'Draft' },
        inactive: { dot: T.dotOff, label: 'Off' },
    };

    const filtered = posts.filter(p => {
        const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === 'all' || p.type === filterType;
        return matchSearch && matchType;
    });

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar publicaciones..."
                        className={`w-full pl-9 pr-4 py-2.5 text-xs rounded-none ${T.input}`}
                    />
                </div>
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className={`px-3 py-2.5 text-xs ${T.select}`}
                >
                    <option value="all">Todas las secciones</option>
                    <option value="news">Sala de Prensa</option>
                    <option value="announcement">Anuncios</option>
                    <option value="impact_study">Impacto</option>
                </select>
            </div>

            {/* Stats chips */}
            <div className="flex gap-2 mb-6">
                {[
                    { label: 'Total', count: posts.length, color: 'bg-black/5 text-black' },
                    { label: 'Live', count: posts.filter(p => p.status === 'active').length, color: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Draft', count: posts.filter(p => p.status === 'draft').length, color: 'bg-amber-50 text-amber-700' },
                    { label: 'Off', count: posts.filter(p => p.status === 'inactive').length, color: 'bg-black/5 text-black/40' },
                ].map(chip => (
                    <span key={chip.label} className={`px-3 py-1 text-[10px] font-mono font-medium uppercase tracking-wider ${chip.color}`}>
                        {chip.label} <span className="font-bold">{chip.count}</span>
                    </span>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-black/10 bg-white">
                    <FileText className="w-8 h-8 text-black/10 mx-auto mb-3" />
                    <p className="text-black/30 text-sm">No hay publicaciones{search ? ` para "${search}"` : ''}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map(post => {
                        const author = authors.find(a => a.id === post.authorId);
                        const statusCfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.inactive;
                        return (
                            <div
                                key={post.id}
                                className={`group flex items-center gap-5 p-4 border ${T.border} ${T.card} ${T.cardHover} transition-all`}
                            >
                                {/* Cover */}
                                <div className="w-20 h-14 bg-gray-100 border border-black/5 overflow-hidden shrink-0">
                                    {(post.coverImage || post.image) ? (
                                        <img
                                            src={post.coverImage || post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-4 h-4 text-black/15" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                        <span className="text-[9px] font-mono text-black/35 uppercase tracking-widest">
                                            {TYPE_LABELS[post.type] || post.type}
                                        </span>
                                        <span className="text-black/20">·</span>
                                        <span className="text-[9px] font-mono text-black/35">{post.category}</span>
                                        <span className={`ml-auto text-[8px] font-mono px-1.5 py-0.5 ${post.status === 'active' ? 'bg-emerald-50 text-emerald-600'
                                            : post.status === 'draft' ? 'bg-amber-50 text-amber-600'
                                                : 'bg-black/5 text-black/35'
                                            }`}>
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-black truncate mb-1">{post.title}</h3>
                                    <div className="flex items-center gap-2 text-[10px] text-black/35">
                                        {author && <span>{author.name}</span>}
                                        <span>·</span>
                                        <span>{post.readTime}</span>
                                        {post.tags?.length > 0 && (
                                            <>
                                                <span>·</span>
                                                <span>{post.tags.slice(0, 2).join(', ')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button
                                        onClick={() => onEdit(post)}
                                        className={`p-2 ${T.btnGhost}`}
                                        title="Editar"
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(post.id)}
                                        className={`p-2 ${T.btnGhost}`}
                                        title={post.status === 'active' ? 'Desactivar' : 'Activar'}
                                    >
                                        {post.status === 'active'
                                            ? <EyeOff className="w-3.5 h-3.5" />
                                            : <Eye className="w-3.5 h-3.5" />
                                        }
                                    </button>
                                    <button
                                        onClick={() => { if (window.confirm(`¿Eliminar "${post.title}"?`)) onDelete(post.id); }}
                                        className={`p-2 ${T.btnDanger}`}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── MENU SLOTS VIEW ───────────────────────────────────────────
const MenuSlots = ({ posts, slots, setSlot }) => {
    const slotConfigs = [
        { id: 'news', label: 'Slot 01 — Noticia Principal', icon: FileText, tag: 'news' },
        { id: 'news2', label: 'Slot 02 — Noticia Secundaria', icon: FileText, tag: 'news' },
        { id: 'announcement', label: 'Slot 03 — Anuncio Corporativo', icon: AlertCircle, tag: 'announcement' },
        { id: 'impact', label: 'Slot 04 — Estudio de Impacto', icon: CheckCircle2, tag: 'impact_study' },
    ];
    const activePosts = posts.filter(p => p.status === 'active');

    return (
        <div className="max-w-xl space-y-4">
            {slotConfigs.map(config => {
                const selectedPost = posts.find(p => p.id === slots[config.id]);
                return (
                    <div key={config.id} className={`${T.card} border ${T.border} p-6`}>
                        <div className="flex items-center gap-2 mb-4">
                            <config.icon className="w-3.5 h-3.5 text-black/30" />
                            <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest">{config.label}</span>
                        </div>
                        <select
                            value={slots[config.id] || ''}
                            onChange={e => setSlot(config.id, e.target.value)}
                            className={`w-full p-2.5 text-sm ${T.select}`}
                        >
                            <option value="">— Sin asignar —</option>
                            {activePosts.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                        {selectedPost && (
                            <div className="mt-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-emerald-600 font-mono truncate">
                                    Vinculado: {selectedPost.title}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ─── AUTHORS MANAGER VIEW ──────────────────────────────────────
const AuthorsManager = ({ authors, posts, addAuthor, updateAuthor, deleteAuthor, onRequestNew, onNewHandled }) => {
    const [editing, setEditing] = useState(null);
    const emptyForm = { name: '', role: '', bio: '', avatar: null };
    const [form, setForm] = useState(emptyForm);
    const [avatarPreview, setAvatarPreview] = useState('');

    const handleEdit = (author) => {
        setEditing(author);
        setForm({ name: author.name, role: author.role || '', bio: author.bio || '', avatar: author.avatar });
        setAvatarPreview(author.avatar || '');
    };
    const handleNew = () => { setEditing('new'); setForm(emptyForm); setAvatarPreview(''); };
    const handleCancel = () => { setEditing(null); setForm(emptyForm); onNewHandled?.(); };

    // React to external trigger from header button
    React.useEffect(() => {
        if (onRequestNew) { handleNew(); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onRequestNew]);

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => { setForm(f => ({ ...f, avatar: reader.result })); setAvatarPreview(reader.result); };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!form.name.trim()) return;
        editing === 'new' ? addAuthor(form) : updateAuthor(editing.id, form);
        handleCancel();
    };

    const getPostCount = (id) => posts.filter(p => p.authorId === id).length;

    return (
        <div className="max-w-2xl">
            <div className="flex justify-end items-center mb-6">
                <button
                    id="new-author-btn"
                    onClick={handleNew}
                    className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-widest uppercase ${T.btnPrimary}`}
                >
                    <Plus className="w-3.5 h-3.5" /> Nuevo Autor
                </button>
            </div>

            {/* Form */}
            {editing && (
                <div className={`${T.card} border ${T.borderMd} p-6 mb-6`}>
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest">
                            {editing === 'new' ? 'Nuevo Autor' : 'Editar Autor'}
                        </span>
                        <button onClick={handleCancel} className="text-black/30 hover:text-black">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-[auto_1fr] gap-6 mb-4">
                        {/* Avatar */}
                        <div>
                            {avatarPreview ? (
                                <div className="relative w-16 h-16">
                                    <img src={avatarPreview} alt="" className="w-16 h-16 rounded-full object-cover border border-black/10" />
                                    <button
                                        onClick={() => { setForm(f => ({ ...f, avatar: null })); setAvatarPreview(''); }}
                                        className="absolute -top-1 -right-1 bg-white border border-black/10 rounded-full p-0.5 text-black/40 hover:text-black"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-16 h-16 border border-dashed border-black/15 cursor-pointer hover:border-black/30 rounded-full bg-gray-50">
                                    <User className="w-5 h-5 text-black/20" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                </label>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-black/40 uppercase tracking-widest block mb-1">Nombre *</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Nombre del autor"
                                    className={`w-full px-3 py-2 text-sm ${T.input}`}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-black/40 uppercase tracking-widest block mb-1">Rol</label>
                                <input
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    placeholder="Cargo o rol editorial"
                                    className={`w-full px-3 py-2 text-sm ${T.input}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="text-[10px] text-black/40 uppercase tracking-widest block mb-1">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                            placeholder="Breve descripción del autor..."
                            rows={3}
                            className={`w-full px-3 py-2 text-sm resize-none ${T.input}`}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-widest uppercase ${T.btnPrimary}`}
                        >
                            <Save className="w-3.5 h-3.5" />
                            {editing === 'new' ? 'Crear Autor' : 'Guardar Cambios'}
                        </button>
                        <button onClick={handleCancel} className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase ${T.btnGhost}`}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Authors list */}
            <div className="space-y-2">
                {authors.map(author => (
                    <div
                        key={author.id}
                        className={`group flex items-center gap-4 p-4 border ${T.border} ${T.card} ${T.cardHover} transition-all`}
                    >
                        <div className="w-10 h-10 rounded-full border border-black/8 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                            {author.avatar
                                ? <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                                : <User className="w-4 h-4 text-black/20" />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-black">{author.name}</div>
                            <div className="text-[11px] text-black/40">{author.role}</div>
                            <div className="text-[10px] text-black/25 font-mono">{getPostCount(author.id)} publicaciones</div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(author)} className={`p-2 ${T.btnGhost}`} title="Editar">
                                <Edit className="w-3.5 h-3.5" />
                            </button>
                            {authors.length > 1 && (
                                <button
                                    onClick={() => { if (window.confirm(`¿Eliminar autor "${author.name}"?`)) deleteAuthor(author.id); }}
                                    className={`p-2 ${T.btnDanger}`}
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── MAIN: EDITORIAL PANEL ─────────────────────────────────────
const EditorialPanel = () => {
    const navigate = useNavigate();
    const {
        posts, addPost, updatePost, deletePost, togglePostStatus,
        slots, setSlot,
        authors, addAuthor, updateAuthor, deleteAuthor
    } = useEditorial();

    const [activeTab, setActiveTab] = useState('posts');
    const [editorPost, setEditorPost] = useState(null);
    const [newAuthorRequest, setNewAuthorRequest] = useState(0); // increment to trigger

    React.useEffect(() => {
        if (!localStorage.getItem('ces_authorized')) navigate('/terminal-x92-core');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('ces_authorized');
        navigate('/terminal-x92-core');
    };

    const handleSave = (data) => {
        if (editorPost && editorPost !== 'new') {
            updatePost(editorPost.id, data);
        } else {
            addPost(data);
        }
        setEditorPost(null);
    };

    if (editorPost !== null) {
        return (
            <PostEditor
                initialData={editorPost === 'new' ? null : editorPost}
                authors={authors}
                onSave={handleSave}
                onCancel={() => setEditorPost(null)}
            />
        );
    }

    const NAV_ITEMS = [
        { id: 'posts', label: 'Publicaciones', icon: FileText, count: posts.length },
        { id: 'slots', label: 'Menú Slots', icon: Layers, count: null },
        { id: 'authors', label: 'Autores', icon: User, count: authors.length },
    ];

    const TAB_HEADERS = {
        posts: { sub: 'Directorio de contenido', title: 'Publicaciones' },
        slots: { sub: 'Arquitectura del menú', title: 'Slots del Sistema' },
        authors: { sub: 'Equipo editorial', title: 'Autores' },
    };

    return (
        <div className={`min-h-screen ${T.page} font-funnel flex`}>

            {/* ── SIDEBAR ── */}
            <aside className={`w-56 border-r ${T.border} flex flex-col ${T.sidebar} shrink-0`}>
                {/* Logo */}
                <div className={`h-16 px-5 flex items-center border-b ${T.border}`}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 bg-black rounded-full" />
                        <div>
                            <div className="text-[9px] font-mono text-black/35 uppercase tracking-[0.3em]">CES v5.0</div>
                            <div className="text-xs font-semibold tracking-tight text-black leading-none">Centhropy Core</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-0.5">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-none transition-all ${activeTab === item.id
                                ? 'bg-black text-white'
                                : 'text-black/55 hover:bg-black/5 hover:text-black'
                                }`}
                        >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="flex-1 text-left tracking-wide">{item.label}</span>
                            {item.count !== null && (
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 min-w-[20px] text-center ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-black/8 text-black/40'
                                    }`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className={`p-3 border-t ${T.border}`}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-black/35 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="tracking-wide">Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className={`h-16 px-8 border-b ${T.border} flex justify-between items-center ${T.header} sticky top-0 z-10`}>
                    <div>
                        <div className="text-[9px] font-mono text-black/30 uppercase tracking-widest mb-0.5">
                            {TAB_HEADERS[activeTab]?.sub}
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight text-black leading-none">
                            {TAB_HEADERS[activeTab]?.title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'posts' && (
                            <button
                                onClick={() => setEditorPost('new')}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider uppercase ${T.btnPrimary}`}
                            >
                                <Plus className="w-3.5 h-3.5" /> Nueva Publicación
                            </button>
                        )}
                        {activeTab === 'authors' && (
                            <button
                                onClick={() => setNewAuthorRequest(n => n + 1)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider uppercase ${T.btnPrimary}`}
                            >
                                <Plus className="w-3.5 h-3.5" /> Nuevo Autor
                            </button>
                        )}
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {activeTab === 'posts' && (
                        <PostsList
                            posts={posts}
                            authors={authors}
                            toggleStatus={togglePostStatus}
                            onDelete={deletePost}
                            onEdit={(post) => setEditorPost(post)}
                        />
                    )}
                    {activeTab === 'slots' && (
                        <MenuSlots posts={posts} slots={slots} setSlot={setSlot} />
                    )}
                    {activeTab === 'authors' && (
                        <AuthorsManager
                            authors={authors}
                            posts={posts}
                            addAuthor={addAuthor}
                            updateAuthor={updateAuthor}
                            deleteAuthor={deleteAuthor}
                            onRequestNew={newAuthorRequest || undefined}
                            onNewHandled={() => setNewAuthorRequest(0)}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default EditorialPanel;
