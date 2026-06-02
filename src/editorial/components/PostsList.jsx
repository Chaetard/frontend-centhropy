import React, { useState } from 'react';
import {
    Search, Eye, Edit, EyeOff, Trash2, Check,
    ChevronLeft, ChevronRight, Image as ImageIcon, FileText
} from 'lucide-react';
import { T } from './SharedUI';

// ── Module-level constants (never re-created on render) ───────────
const TYPE_LABELS = {
    news: 'Sala de Prensa',
    announcement: 'Anuncio',
    impact_study: 'Impacto',
};

const STATUS_CONFIG = {
    active:   { dot: T.dotActive, label: 'Live' },
    draft:    { dot: T.dotDraft,  label: 'Draft' },
    inactive: { dot: T.dotOff,   label: 'Off' },
};

const PostsList = ({ posts, authors, toggleStatus, onDelete, onEdit, updatePost }) => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterAuthor, setFilterAuthor] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState([]);

    // Reset page and selection on filter changes
    React.useEffect(() => {
        setCurrentPage(1);
        setSelectedIds([]);
    }, [search, filterType, filterAuthor, filterStatus, sortBy]);

    // Filtering & Sorting
    const filteredAndSorted = React.useMemo(() => {
        let result = posts.filter(p => {
            const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType === 'all' || p.type === filterType;
            const matchAuthor = filterAuthor === 'all' || p.authorId === filterAuthor;
            const matchStatus = filterStatus === 'all' || p.status === filterStatus;
            return matchSearch && matchType && matchAuthor && matchStatus;
        });

        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
            if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
            if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
            if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
            return 0;
        });

        return result;
    }, [posts, search, filterType, filterAuthor, filterStatus, sortBy]);

    // Paginate
    const paginated = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAndSorted.slice(start, start + itemsPerPage);
    }, [filteredAndSorted, currentPage]);

    const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

    // Bulk action handlers
    const toggleSelectAll = () => {
        if (selectedIds.length === paginated.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginated.map(p => p.id));
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (window.confirm(`¿Eliminar las ${selectedIds.length} publicaciones seleccionadas?`)) {
            selectedIds.forEach(id => onDelete(id));
            setSelectedIds([]);
        }
    };

    const handleBulkStatusChange = (status) => {
        selectedIds.forEach(id => {
            updatePost(id, { status });
        });
        setSelectedIds([]);
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Posts list + toolbar */}
                <div className="lg:col-span-2">
                    {/* Toolbar Filters */}
                    <div className="space-y-3 mb-6">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#222944]/30 dark:text-[#BCC5DC]/50" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Buscar publicaciones..."
                                    className={`w-full pl-9 pr-4 py-2.5 text-xs rounded-none ${T.input}`}
                                />
                            </div>
                            <button
                                onClick={toggleSelectAll}
                                disabled={paginated.length === 0}
                                className={`px-4 py-2.5 text-xs border ${T.border} font-funnel uppercase tracking-wider transition-all disabled:opacity-20 shrink-0 ${
                                    selectedIds.length === paginated.length && paginated.length > 0
                                        ? 'bg-black text-white dark:bg-[#BCC5DC] dark:text-[#222944]'
                                        : 'bg-white dark:bg-[#222944] text-[#222944]/70 dark:text-[#BCC5DC]/95'
                                }`}
                            >
                                {selectedIds.length === paginated.length && paginated.length > 0 ? 'Deseleccionar' : 'Sel. Todo'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                className={`px-3 py-2 text-xs w-full ${T.select}`}
                            >
                                <option value="all">Todas las secciones</option>
                                <option value="news">Sala de Prensa</option>
                                <option value="announcement">Anuncios</option>
                                <option value="impact_study">Impacto</option>
                            </select>
                            <select
                                value={filterAuthor}
                                onChange={e => setFilterAuthor(e.target.value)}
                                className={`px-3 py-2 text-xs w-full ${T.select}`}
                            >
                                <option value="all">Todos los autores</option>
                                {authors.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                className={`px-3 py-2 text-xs w-full ${T.select}`}
                            >
                                <option value="all">Todos los estados</option>
                                <option value="active">Live (Activos)</option>
                                <option value="draft">Draft (Borradores)</option>
                                <option value="inactive">Off (Desactivados)</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className={`px-3 py-2 text-xs w-full ${T.select}`}
                            >
                                <option value="newest">Más recientes</option>
                                <option value="oldest">Más antiguos</option>
                                <option value="title-asc">Título A-Z</option>
                                <option value="title-desc">Título Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Bulk Actions Bar */}
                    {selectedIds.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 mb-4 bg-black text-white dark:bg-[#BCC5DC] dark:text-[#222944] text-[10px] font-funnel uppercase tracking-widest gap-2.5">
                            <div className="flex items-center gap-3">
                                <span className="font-bold">{selectedIds.length} seleccionados</span>
                                <button onClick={() => setSelectedIds([])} className="underline opacity-60 hover:opacity-100 transition-opacity">
                                    Desmarcar todos
                                </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <button onClick={() => handleBulkStatusChange('active')} className="hover:opacity-60 transition-opacity flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" /> Publicar Live
                                </button>
                                <button onClick={() => handleBulkStatusChange('draft')} className="hover:opacity-60 transition-opacity flex items-center gap-1">
                                    <Edit className="w-3.5 h-3.5" /> Poner Borrador
                                </button>
                                <button onClick={() => handleBulkStatusChange('inactive')} className="hover:opacity-60 transition-opacity flex items-center gap-1">
                                    <EyeOff className="w-3.5 h-3.5" /> Desactivar Off
                                </button>
                                <span className="opacity-20 hidden sm:inline">|</span>
                                <button onClick={handleBulkDelete} className="text-red-400 dark:text-red-700 hover:opacity-60 transition-opacity flex items-center gap-1 font-bold">
                                    <Trash2 className="w-3.5 h-3.5" /> Eliminar Selección
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stats chips */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { label: 'Total', count: posts.length, color: 'bg-[#222944]/15 dark:bg-[#BCC5DC]/5 text-[#222944] dark:text-[#BCC5DC]' },
                            { label: 'Live', count: posts.filter(p => p.status === 'active').length, color: 'bg-emerald-50 text-emerald-700' },
                            { label: 'Draft', count: posts.filter(p => p.status === 'draft').length, color: 'bg-amber-50 text-amber-700' },
                            { label: 'Off', count: posts.filter(p => p.status === 'inactive').length, color: 'bg-[#222944]/15 dark:bg-[#BCC5DC]/5 text-[#222944]/40 dark:text-[#BCC5DC]/60' },
                        ].map(chip => (
                            <span key={chip.label} className={`px-3 py-1 text-[10px] font-funnel font-medium uppercase tracking-wider ${chip.color}`}>
                                {chip.label} <span className="font-bold">{chip.count}</span>
                            </span>
                        ))}
                    </div>

                    {/* Posts List */}
                    {filteredAndSorted.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-[#222944]/10 dark:border-[#BCC5DC]/10 bg-white dark:bg-[#222944]">
                            <FileText className="w-8 h-8 text-[#222944]/10 dark:text-[#BCC5DC]/25 mx-auto mb-3" />
                            <p className="text-[#222944]/30 dark:text-[#BCC5DC]/50 text-sm">No hay publicaciones coincidiendo con los filtros</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {paginated.map(post => {
                                const author = authors.find(a => a.id === post.authorId);
                                const statusCfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.inactive;
                                const isSelected = selectedIds.includes(post.id);
                                return (
                                    <div
                                        key={post.id}
                                        className={`group flex items-center gap-4 p-4 border transition-all ${
                                            isSelected
                                                ? 'border-black dark:border-[#BCC5DC] bg-gray-50 dark:bg-[#2c3558]'
                                                : `${T.border} ${T.card} ${T.cardHover}`
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => toggleSelectOne(post.id)}
                                            className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-all ${
                                                isSelected
                                                    ? 'bg-black border-black text-white dark:bg-[#BCC5DC] dark:border-[#BCC5DC] dark:text-[#222944]'
                                                    : 'border-[#222944]/25 dark:border-[#BCC5DC]/35 bg-white dark:bg-[#222944] hover:border-black'
                                            }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3" />}
                                        </button>

                                        {/* Cover */}
                                        <div className="w-20 h-14 bg-gray-100 border border-[#222944]/15 dark:border-[#BCC5DC]/5 overflow-hidden shrink-0">
                                            {(post.coverImage || post.image) ? (
                                                <img src={post.coverImage || post.image} alt={post.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-4 h-4 text-[#222944]/15 dark:text-[#BCC5DC]/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                                <span className="text-[9px] font-funnel text-[#222944]/35 dark:text-[#BCC5DC]/35 uppercase tracking-widest">
                                                    {TYPE_LABELS[post.type] || post.type}
                                                </span>
                                                <span className="text-[#222944]/20 dark:text-[#BCC5DC]/40">·</span>
                                                <span className="text-[9px] font-funnel text-[#222944]/35 dark:text-[#BCC5DC]/35">{post.category}</span>
                                                <span className={`ml-auto text-[8px] font-funnel px-1.5 py-0.5 ${
                                                    post.status === 'active' ? 'bg-emerald-50 text-emerald-600'
                                                    : post.status === 'draft' ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-[#222944]/15 dark:bg-[#BCC5DC]/5 text-[#222944]/35 dark:text-[#BCC5DC]/35'
                                                }`}>
                                                    {statusCfg.label}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-[#222944] dark:text-[#BCC5DC] truncate mb-1">{post.title}</h3>
                                            <div className="flex items-center gap-2 text-[10px] text-[#222944]/35 dark:text-[#BCC5DC]/35">
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
                                            <button onClick={() => onEdit(post)} className={`p-2 ${T.btnGhost}`} title="Editar">
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => toggleStatus(post.id)} className={`p-2 ${T.btnGhost}`} title={post.status === 'active' ? 'Desactivar' : 'Activar'}>
                                                {post.status === 'active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                            <button onClick={() => { if (window.confirm(`¿Eliminar "${post.title}"?`)) onDelete(post.id); }} className={`p-2 ${T.btnDanger}`} title="Eliminar">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-[#222944]/8 dark:border-[#BCC5DC]/8 pt-6 mt-6">
                            <span className="text-[10px] font-funnel text-[#222944]/45 dark:text-[#BCC5DC]/60 uppercase tracking-widest">
                                Página {currentPage} de {totalPages} ({filteredAndSorted.length} artículos)
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className={`p-2 border ${T.border} disabled:opacity-20 transition-all bg-white dark:bg-[#222944] text-[#222944] dark:text-[#BCC5DC] hover:bg-gray-50`}
                                    title="Página Anterior"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    className={`p-2 border ${T.border} disabled:opacity-20 transition-all bg-white dark:bg-[#222944] text-[#222944] dark:text-[#BCC5DC] hover:bg-gray-50`}
                                    title="Página Siguiente"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Tutorial */}
                <div className="space-y-6">
                    <div className="bg-[#222944]/5 dark:bg-[#BCC5DC]/5 border border-[#222944]/10 dark:border-[#BCC5DC]/10 p-5 space-y-4">
                        <h4 className="text-[11px] font-bold font-funnel uppercase tracking-widest text-[#222944] dark:text-[#BCC5DC] flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Gestión de Publicaciones
                        </h4>
                        <div className="text-[11px] leading-relaxed text-[#222944]/60 dark:text-[#BCC5DC]/80 space-y-3 font-funnel">
                            <p><strong>1. Búsqueda y Filtros:</strong> Utiliza la barra superior para encontrar artículos rápidamente por título, autor o estado.</p>
                            <p><strong>2. Acciones en Lote:</strong> Selecciona múltiples publicaciones para cambiar su estado o eliminarlas simultáneamente.</p>
                            <p><strong>3. Organización:</strong> Mantén el portal al día archivando o eliminando artículos obsoletos.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsList;
