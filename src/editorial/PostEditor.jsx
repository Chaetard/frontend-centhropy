import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Upload,
    Image as ImageIcon, AlignLeft, Type, Quote, Minus, List,
    Lightbulb, X, Check, AlertCircle, User, Calendar,
    Globe, Search, Clock, Hash
} from 'lucide-react';
import { generateSlug, generateId, calculateReadTime } from '../hooks/useEditorial';

// ── BLOCK TYPE CONFIG ──────────────────────────────────────────
const BLOCK_TYPES = [
    { type: 'paragraph', label: 'Párrafo', icon: AlignLeft, desc: 'Bloque de texto estándar' },
    { type: 'heading2', label: 'Subtítulo H2', icon: Type, desc: 'Encabezado de sección' },
    { type: 'heading3', label: 'Sub-título H3', icon: Type, desc: 'Encabezado secundario' },
    { type: 'quote', label: 'Cita Destacada', icon: Quote, desc: 'Blockquote editorial' },
    { type: 'image', label: 'Imagen', icon: ImageIcon, desc: 'Imagen con caption' },
    { type: 'callout', label: 'Destacado', icon: Lightbulb, desc: 'Caja de insight o nota' },
    { type: 'list', label: 'Lista', icon: List, desc: 'Lista de puntos' },
    { type: 'divider', label: 'Separador', icon: Minus, desc: 'Línea divisoria' },
];

const createBlock = (type) => {
    const base = { id: generateId(), type };
    if (type === 'paragraph') return { ...base, text: '' };
    if (type === 'heading2') return { ...base, text: '' };
    if (type === 'heading3') return { ...base, text: '' };
    if (type === 'quote') return { ...base, text: '', attribution: '' };
    if (type === 'image') return { ...base, src: '', caption: '', align: 'full' };
    if (type === 'callout') return { ...base, text: '', variant: 'insight' };
    if (type === 'list') return { ...base, items: [''], ordered: false };
    if (type === 'divider') return base;
    return base;
};

// ── BLOCK SELECTOR POPUP ──────────────────────────────────────
const BlockSelector = ({ onSelect, onClose, anchorRef }) => {
    const popupRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (
                popupRef.current && !popupRef.current.contains(e.target) &&
                anchorRef?.current && !anchorRef.current.contains(e.target)
            ) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose, anchorRef]);

    return (
        <div
            ref={popupRef}
            className="absolute left-0 z-[100] mt-1 w-68 bg-white border border-black/10 shadow-xl shadow-black/8 py-1"
            style={{ top: '100%', minWidth: '260px' }}
        >
            <div className="text-[9px] font-mono text-black/35 uppercase tracking-widest px-3 py-2 border-b border-black/8 mb-1">
                Seleccionar bloque
            </div>
            {BLOCK_TYPES.map(bt => (
                <button
                    key={bt.type}
                    onMouseDown={(e) => { e.preventDefault(); onSelect(bt.type); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                >
                    <bt.icon className="w-4 h-4 text-black/30 group-hover:text-black shrink-0 transition-colors" />
                    <div>
                        <div className="text-xs font-medium text-black">{bt.label}</div>
                        <div className="text-[10px] text-black/40">{bt.desc}</div>
                    </div>
                </button>
            ))}
        </div>
    );
};

// ── ADD BLOCK BUTTON ──────────────────────────────────────────
const AddBlockButton = ({ onAdd, label = '+ Bloque' }) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);

    return (
        <div className="relative my-0.5">
            <button
                ref={triggerRef}
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 text-[10px] text-black/25 hover:text-black/60 uppercase tracking-widest transition-colors px-1 py-0.5"
            >
                <Plus className="w-3 h-3" /> {label}
            </button>
            {open && (
                <BlockSelector
                    onSelect={(type) => { onAdd(type); setOpen(false); }}
                    onClose={() => setOpen(false)}
                    anchorRef={triggerRef}
                />
            )}
        </div>
    );
};

// ── BLOCK RENDERER ────────────────────────────────────────────
const Block = ({ block, index, total, onChange, onDelete, onMoveUp, onMoveDown }) => {
    const [imgPreview, setImgPreview] = useState(block.src || '');

    const fieldClass = "w-full bg-transparent outline-none text-black placeholder:text-black/20 resize-none";

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => { onChange({ src: reader.result }); setImgPreview(reader.result); };
        reader.readAsDataURL(file);
    };

    const renderInput = () => {
        switch (block.type) {
            case 'paragraph':
                return (
                    <textarea
                        value={block.text}
                        onChange={e => onChange({ text: e.target.value })}
                        placeholder="Escribe tu párrafo aquí..."
                        rows={4}
                        className={`${fieldClass} text-base font-normal leading-relaxed text-black/80`}
                        style={{ minHeight: '80px' }}
                        onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                    />
                );
            case 'heading2':
                return (
                    <input
                        value={block.text}
                        onChange={e => onChange({ text: e.target.value })}
                        placeholder="Subtítulo de sección..."
                        className={`${fieldClass} text-2xl font-black uppercase tracking-tighter text-black`}
                    />
                );
            case 'heading3':
                return (
                    <input
                        value={block.text}
                        onChange={e => onChange({ text: e.target.value })}
                        placeholder="Sub-título..."
                        className={`${fieldClass} text-lg font-bold uppercase tracking-wide text-black`}
                    />
                );
            case 'quote':
                return (
                    <div className="border-l-2 border-black/20 pl-6 space-y-2">
                        <textarea
                            value={block.text}
                            onChange={e => onChange({ text: e.target.value })}
                            placeholder="Escribe la cita aquí..."
                            rows={3}
                            className={`${fieldClass} text-xl italic font-light text-black/70`}
                            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        <input
                            value={block.attribution || ''}
                            onChange={e => onChange({ attribution: e.target.value })}
                            placeholder="— Atribución (opcional)"
                            className={`${fieldClass} text-sm text-black/40`}
                        />
                    </div>
                );
            case 'image':
                return (
                    <div className="space-y-3">
                        {imgPreview ? (
                            <div className="relative group/img">
                                <img src={imgPreview} alt="" className="w-full max-h-64 object-cover border border-black/8" />
                                <button
                                    type="button"
                                    onClick={() => { onChange({ src: '' }); setImgPreview(''); }}
                                    className="absolute top-2 right-2 bg-white/90 text-black p-1 hover:bg-red-500 hover:text-white transition-colors border border-black/10"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-28 border border-dashed border-black/15 hover:border-black/30 hover:bg-gray-50 cursor-pointer transition-colors">
                                <ImageIcon className="w-5 h-5 text-black/25 mb-1" />
                                <span className="text-[10px] text-black/30 uppercase tracking-widest">Cargar imagen</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                        {!imgPreview && (
                            <input
                                value={block.src}
                                onChange={e => { onChange({ src: e.target.value }); setImgPreview(e.target.value); }}
                                placeholder="O pega una URL de imagen..."
                                className="w-full bg-transparent border-b border-black/12 py-2 outline-none text-xs text-black placeholder:text-black/25 focus:border-black/40"
                            />
                        )}
                        <input
                            value={block.caption || ''}
                            onChange={e => onChange({ caption: e.target.value })}
                            placeholder="Caption de la imagen (opcional)..."
                            className="w-full bg-transparent border-b border-black/8 py-2 outline-none text-xs text-black/45 placeholder:text-black/20 focus:border-black/25"
                        />
                    </div>
                );
            case 'callout':
                return (
                    <div className="bg-amber-50 border border-amber-100 p-4 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[9px] font-mono uppercase tracking-widest text-amber-600/70">Destacado</span>
                        </div>
                        <textarea
                            value={block.text}
                            onChange={e => onChange({ text: e.target.value })}
                            placeholder="Escribe el contenido destacado..."
                            rows={3}
                            className={`${fieldClass} text-sm text-black/75`}
                            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                    </div>
                );
            case 'list':
                return (
                    <div className="space-y-2">
                        <div className="flex gap-2 mb-2">
                            <button type="button" onClick={() => onChange({ ordered: false })}
                                className={`text-[9px] font-medium px-2 py-0.5 transition-all ${!block.ordered ? 'bg-black text-white' : 'bg-black/5 text-black/40 hover:bg-black/10'}`}>
                                Bullets
                            </button>
                            <button type="button" onClick={() => onChange({ ordered: true })}
                                className={`text-[9px] font-medium px-2 py-0.5 transition-all ${block.ordered ? 'bg-black text-white' : 'bg-black/5 text-black/40 hover:bg-black/10'}`}>
                                Numerada
                            </button>
                        </div>
                        {(block.items || ['']).map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-black/35 text-sm shrink-0">{block.ordered ? `${i + 1}.` : '•'}</span>
                                <input
                                    value={item}
                                    onChange={e => {
                                        const newItems = [...(block.items || [''])];
                                        newItems[i] = e.target.value;
                                        onChange({ items: newItems });
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const newItems = [...(block.items || [''])];
                                            newItems.splice(i + 1, 0, '');
                                            onChange({ items: newItems });
                                        }
                                        if (e.key === 'Backspace' && item === '' && block.items.length > 1) {
                                            const newItems = [...(block.items || [''])];
                                            newItems.splice(i, 1);
                                            onChange({ items: newItems });
                                        }
                                    }}
                                    placeholder={`Elemento ${i + 1}...`}
                                    className="flex-1 bg-transparent outline-none text-black placeholder:text-black/20 text-sm"
                                />
                                {block.items.length > 1 && (
                                    <button type="button" onClick={() => onChange({ items: block.items.filter((_, idx) => idx !== i) })} className="text-black/20 hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={() => onChange({ items: [...(block.items || ['']), ''] })}
                            className="text-[10px] text-black/30 hover:text-black uppercase tracking-widest flex items-center gap-1 mt-1">
                            <Plus className="w-3 h-3" /> Añadir elemento
                        </button>
                    </div>
                );
            case 'divider':
                return <div className="border-t border-black/12 my-2" />;
            default:
                return null;
        }
    };

    if (block.type === 'divider') {
        return (
            <div className="group relative py-4">
                <div className="border-t border-black/12" />
                <button type="button" onClick={onDelete}
                    className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-black/20 hover:text-red-500 p-1">
                    <X className="w-3 h-3" />
                </button>
            </div>
        );
    }

    return (
        <div className="group relative">
            {/* Move controls */}
            <div className="absolute -left-9 top-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={onMoveUp} disabled={index === 0} className="p-1 text-black/20 hover:text-black disabled:opacity-10 transition-colors">
                    <ChevronUp className="w-3 h-3" />
                </button>
                <button type="button" onClick={onMoveDown} disabled={index === total - 1} className="p-1 text-black/20 hover:text-black disabled:opacity-10 transition-colors">
                    <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            <div className="border border-transparent group-hover:border-black/8 transition-all p-3 -mx-3 rounded-sm">
                {renderInput()}
            </div>

            {/* Delete */}
            <button type="button" onClick={onDelete}
                className="absolute -right-8 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-black/20 hover:text-red-500 p-1">
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

// ── SEO INDICATORS ────────────────────────────────────────────
const SeoIndicator = ({ ok, text }) => (
    <div className={`flex items-center gap-2 text-[10px] ${ok ? 'text-emerald-600' : 'text-amber-500'}`}>
        {ok ? <Check className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
        <span>{text}</span>
    </div>
);

// ── REUSABLE FIELD STYLES ─────────────────────────────────────
const fieldCls = "w-full bg-gray-50 border border-black/10 text-black placeholder:text-black/25 outline-none focus:border-black/40 focus:bg-white transition-colors";
const labelCls = "text-[10px] text-black/40 uppercase tracking-widest block mb-1";

// ─────────────────────────────────────────────────────────────
// MAIN: POST EDITOR
// ─────────────────────────────────────────────────────────────
const PostEditor = ({ initialData, authors, onSave, onCancel }) => {
    const isEditing = !!initialData?.id;

    const buildInitialForm = () => {
        if (initialData) return { ...initialData };
        return {
            type: 'news',
            category: 'Blog',
            title: '',
            slug: '',
            excerpt: '',
            tags: [],
            authorId: authors[0]?.id || '',
            date: new Date().toISOString().split('T')[0],
            coverImage: '',
            coverCaption: '',
            content: [createBlock('paragraph')],
            status: 'draft',
            seo: {
                metaTitle: '', metaDescription: '', focusKeyword: '',
                canonicalUrl: '', ogImage: '', noIndex: false,
                geoSummary: '', entityMentions: [],
            }
        };
    };

    const [form, setForm] = useState(buildInitialForm);
    const [tagInput, setTagInput] = useState('');
    const [slugManual, setSlugManual] = useState(!!initialData?.id);
    const [coverPreview, setCoverPreview] = useState(initialData?.coverImage || initialData?.image || '');

    const updateForm = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), []);
    const updateSeo = useCallback((key, val) => setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } })), []);

    const handleTitleChange = (val) => {
        setForm(f => ({
            ...f,
            title: val,
            slug: slugManual ? f.slug : generateSlug(val),
            seo: { ...f.seo, metaTitle: (!f.seo?.metaTitle || f.seo.metaTitle === f.title) ? val : f.seo.metaTitle }
        }));
    };

    const handleCoverUpload = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const r = reader.result;
            setForm(f => ({ ...f, coverImage: r, seo: { ...f.seo, ogImage: f.seo?.ogImage || r } }));
            setCoverPreview(r);
        };
        reader.readAsDataURL(file);
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !form.tags?.includes(tag)) updateForm('tags', [...(form.tags || []), tag]);
        setTagInput('');
    };
    const removeTag = (tag) => updateForm('tags', (form.tags || []).filter(t => t !== tag));

    const updateBlock = useCallback((id, changes) => {
        setForm(f => ({ ...f, content: f.content.map(b => b.id === id ? { ...b, ...changes } : b) }));
    }, []);
    const deleteBlock = useCallback((id) => {
        setForm(f => f.content.length <= 1 ? f : { ...f, content: f.content.filter(b => b.id !== id) });
    }, []);
    const addBlock = useCallback((type, afterIndex) => {
        const newBlock = createBlock(type);
        setForm(f => {
            const newContent = [...f.content];
            newContent.splice(afterIndex < 0 ? 0 : afterIndex + 1, 0, newBlock);
            return { ...f, content: newContent };
        });
    }, []);
    const moveBlock = useCallback((index, dir) => {
        setForm(f => {
            const nc = [...f.content];
            const ti = index + dir;
            if (ti < 0 || ti >= nc.length) return f;
            [nc[index], nc[ti]] = [nc[ti], nc[index]];
            return { ...f, content: nc };
        });
    }, []);

    const seoChecks = {
        metaTitleOk: (form.seo?.metaTitle || '').length >= 30 && (form.seo?.metaTitle || '').length <= 60,
        metaDescOk: (form.seo?.metaDescription || '').length >= 80 && (form.seo?.metaDescription || '').length <= 160,
        keywordInTitle: !!(form.seo?.focusKeyword && (form.seo?.metaTitle || '').toLowerCase().includes(form.seo.focusKeyword.toLowerCase())),
        hasExcerpt: (form.excerpt || '').length > 30,
        hasTags: (form.tags || []).length > 0,
    };

    const CATEGORIES = {
        news: ['Blog', 'Comunicados de Prensa', 'Cartas del CEO', 'Liderazgo de Pensamiento', 'Cobertura Mediática'],
        announcement: ['Estructura Organizativa', 'Expansión Global', 'Alianzas Estratégicas', 'ESG & Impacto', 'Informes Trimestrales'],
        impact_study: ['Retail Intelligence', 'Supply Chain', 'Predictive Analysis', 'Global Infrastructure', 'Data Sovereignty'],
    };

    const handleSubmit = (statusOverride) => {
        const finalForm = { ...form, status: statusOverride ?? form.status };
        onSave({ ...finalForm, readTime: calculateReadTime(finalForm.content) });
    };

    // Sidebar & right panel shared label style
    const sectionTitle = "text-[9px] font-mono text-black/30 uppercase tracking-[0.3em] mb-4 block";

    return (
        <div className="flex flex-col h-screen bg-[#f5f5f3] font-funnel overflow-hidden">

            {/* ── TOP BAR ── */}
            <header className="h-14 border-b border-black/8 flex items-center justify-between px-5 shrink-0 bg-white z-20">
                <button type="button" onClick={onCancel} className="flex items-center gap-2 text-black/45 hover:text-black transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-xs font-medium">Volver al Panel</span>
                </button>

                <span className="text-[10px] font-mono text-black/30 uppercase tracking-widest">
                    {isEditing ? `Editando · ${form.title || '…'}` : 'Nueva Publicación'}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleSubmit('draft')}
                        className="px-4 py-2 border border-black/15 text-black/60 text-xs font-medium hover:bg-black/5 transition-all"
                    >
                        Guardar Borrador
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit('active')}
                        className="px-4 py-2 bg-black text-white text-xs font-medium hover:bg-black/80 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        {isEditing ? 'Actualizar' : 'Publicar'}
                    </button>
                </div>
            </header>

            {/* ── 3-COLUMN BODY ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT: METADATA */}
                <aside className="w-60 border-r border-black/8 overflow-y-auto bg-white shrink-0">
                    <div className="p-5 space-y-5">
                        <span className={sectionTitle}>Metadata</span>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className={labelCls}>Estado</label>
                            <div className="flex gap-1.5">
                                {[
                                    { val: 'active', label: 'Live', color: 'bg-emerald-500' },
                                    { val: 'draft', label: 'Draft', color: 'bg-amber-400' },
                                    { val: 'inactive', label: 'Off', color: 'bg-black/20' },
                                ].map(s => (
                                    <button
                                        key={s.val}
                                        type="button"
                                        onClick={() => updateForm('status', s.val)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium border transition-all ${form.status === s.val
                                                ? 'bg-black text-white border-black'
                                                : 'border-black/10 text-black/45 hover:border-black/30'
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${form.status === s.val ? 'bg-white' : s.color}`} />
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Sección</label>
                            <select
                                value={form.type}
                                onChange={e => {
                                    const nt = e.target.value;
                                    setForm(f => ({ ...f, type: nt, category: CATEGORIES[nt][0] }));
                                }}
                                className={`w-full p-2 text-xs ${fieldCls}`}
                            >
                                <option value="news">Sala de Prensa</option>
                                <option value="announcement">Anuncio Corporativo</option>
                                <option value="impact_study">Estudio de Impacto</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Categoría</label>
                            <select
                                value={form.category}
                                onChange={e => updateForm('category', e.target.value)}
                                className={`w-full p-2 text-xs ${fieldCls}`}
                            >
                                {(CATEGORIES[form.type] || []).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Author */}
                        <div className="space-y-1.5">
                            <label className={labelCls + ' flex items-center gap-1'}><User className="w-3 h-3" />Autor</label>
                            <select
                                value={form.authorId}
                                onChange={e => updateForm('authorId', e.target.value)}
                                className={`w-full p-2 text-xs ${fieldCls}`}
                            >
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>

                        {/* Date */}
                        <div className="space-y-1.5">
                            <label className={labelCls + ' flex items-center gap-1'}><Calendar className="w-3 h-3" />Fecha</label>
                            <input
                                type="date"
                                value={form.date?.split('T')[0] || ''}
                                onChange={e => updateForm('date', e.target.value)}
                                className={`w-full p-2 text-xs ${fieldCls}`}
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-1.5">
                            <label className={labelCls + ' flex items-center gap-1'}><Hash className="w-3 h-3" />Tags</label>
                            <div className="flex flex-wrap gap-1 mb-1">
                                {(form.tags || []).map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-black/5 text-[10px] text-black">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-black/30 hover:text-black"><X className="w-2.5 h-2.5" /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="Añadir tag..."
                                    className="flex-1 bg-gray-50 border-b border-black/10 py-1 text-[11px] text-black outline-none placeholder:text-black/25 focus:border-black/40"
                                />
                                <button type="button" onClick={addTag} className="text-black/40 hover:text-black"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Excerpt / Resumen</label>
                            <textarea
                                value={form.excerpt || ''}
                                onChange={e => updateForm('excerpt', e.target.value)}
                                placeholder="Resumen breve para listados (máx 200 chars)..."
                                maxLength={200}
                                rows={3}
                                className={`w-full p-2 text-xs resize-none ${fieldCls}`}
                            />
                            <div className="text-right text-[9px] text-black/30">{(form.excerpt || '').length}/200</div>
                        </div>

                        {/* Slug */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Slug URL</label>
                            <input
                                value={form.slug || ''}
                                onChange={e => { setSlugManual(true); updateForm('slug', e.target.value); }}
                                placeholder="url-del-articulo"
                                className="w-full bg-transparent border-b border-black/10 py-1 text-[11px] text-black/60 font-mono outline-none focus:border-black/40 placeholder:text-black/20"
                            />
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Imagen de Portada</label>
                            {coverPreview ? (
                                <div className="relative">
                                    <img src={coverPreview} alt="" className="w-full aspect-video object-cover border border-black/8" />
                                    <button
                                        type="button"
                                        onClick={() => { updateForm('coverImage', ''); setCoverPreview(''); }}
                                        className="absolute top-1 right-1 bg-white/90 border border-black/10 p-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center py-4 border border-dashed border-black/12 hover:border-black/25 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <ImageIcon className="w-4 h-4 text-black/20 mb-1" />
                                    <span className="text-[9px] text-black/25 uppercase tracking-widest">Cargar portada</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                                </label>
                            )}
                            {!coverPreview && (
                                <input
                                    value={form.coverImage || ''}
                                    onChange={e => { updateForm('coverImage', e.target.value); setCoverPreview(e.target.value); }}
                                    placeholder="O pega una URL..."
                                    className="w-full bg-gray-50 border-b border-black/10 py-1 text-[11px] text-black outline-none placeholder:text-black/20 focus:border-black/35"
                                />
                            )}
                            <input
                                value={form.coverCaption || ''}
                                onChange={e => updateForm('coverCaption', e.target.value)}
                                placeholder="Caption de portada..."
                                className="w-full bg-transparent border-b border-black/8 py-1 text-[11px] text-black/40 outline-none placeholder:text-black/15"
                            />
                        </div>
                    </div>
                </aside>

                {/* CENTER: BLOCK EDITOR */}
                <main className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-3xl mx-auto px-14 py-12">
                        {/* Title */}
                        <textarea
                            value={form.title}
                            onChange={e => handleTitleChange(e.target.value)}
                            placeholder="Título de la publicación..."
                            rows={2}
                            className="w-full bg-transparent outline-none text-4xl font-black uppercase tracking-tighter text-black placeholder:text-black/15 resize-none mb-2 leading-tight"
                            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        <div className="text-[10px] font-mono text-black/25 mb-10 flex items-center gap-3">
                            <Clock className="w-3 h-3" />
                            <span>{calculateReadTime(form.content)}</span>
                            <span>·</span>
                            <span>{(form.content || []).filter(b => b.text || b.src || b.items).length} bloque(s)</span>
                        </div>

                        {/* Blocks */}
                        <div className="relative pl-10 space-y-4">
                            <AddBlockButton onAdd={type => addBlock(type, -1)} label="+ Bloque al inicio" />
                            {(form.content || []).map((block, index) => (
                                <div key={block.id} className="relative">
                                    <Block
                                        block={block}
                                        index={index}
                                        total={form.content.length}
                                        onChange={changes => updateBlock(block.id, changes)}
                                        onDelete={() => deleteBlock(block.id)}
                                        onMoveUp={() => moveBlock(index, -1)}
                                        onMoveDown={() => moveBlock(index, 1)}
                                    />
                                    <AddBlockButton onAdd={type => addBlock(type, index)} />
                                </div>
                            ))}
                            {form.content.length === 0 && (
                                <p className="text-sm text-black/25 py-8 text-center border border-dashed border-black/10">
                                    Pulsa "+ Bloque al inicio" para comenzar
                                </p>
                            )}
                        </div>
                    </div>
                </main>

                {/* RIGHT: SEO PANEL */}
                <aside className="w-68 border-l border-black/8 overflow-y-auto bg-white shrink-0" style={{ width: '272px' }}>
                    <div className="p-5 space-y-5">
                        <span className={sectionTitle + ' flex items-center gap-2'}><Search className="w-3 h-3" />SEO / GEO</span>

                        {/* Analysis */}
                        <div className="bg-gray-50 border border-black/8 p-3 space-y-2">
                            <div className="text-[9px] font-mono text-black/35 uppercase tracking-widest mb-2">Análisis</div>
                            <SeoIndicator ok={seoChecks.metaTitleOk} text={`Meta título (${(form.seo?.metaTitle || '').length}/60)`} />
                            <SeoIndicator ok={seoChecks.metaDescOk} text={`Meta desc (${(form.seo?.metaDescription || '').length}/160)`} />
                            <SeoIndicator ok={seoChecks.keywordInTitle} text="Keyword en meta título" />
                            <SeoIndicator ok={seoChecks.hasExcerpt} text="Excerpt definido" />
                            <SeoIndicator ok={seoChecks.hasTags} text="Tags añadidos" />
                        </div>

                        {/* Focus Keyword */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Keyword Principal</label>
                            <input value={form.seo?.focusKeyword || ''} onChange={e => updateSeo('focusKeyword', e.target.value)}
                                placeholder="ej: retail data intelligence"
                                className={`w-full p-2 text-xs ${fieldCls}`} />
                        </div>

                        {/* Meta Title */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Meta Título</label>
                            <textarea value={form.seo?.metaTitle || ''} onChange={e => updateSeo('metaTitle', e.target.value)}
                                placeholder="Título para buscadores (30-60 chars)"
                                maxLength={60} rows={2}
                                className={`w-full p-2 text-xs resize-none ${fieldCls}`} />
                            <div className="text-right text-[9px] text-black/30">{(form.seo?.metaTitle || '').length}/60</div>
                        </div>

                        {/* Meta Description */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Meta Descripción</label>
                            <textarea value={form.seo?.metaDescription || ''} onChange={e => updateSeo('metaDescription', e.target.value)}
                                placeholder="Descripción para resultados de búsqueda (80-160 chars)"
                                maxLength={160} rows={4}
                                className={`w-full p-2 text-xs resize-none ${fieldCls}`} />
                            <div className="text-right text-[9px] text-black/30">{(form.seo?.metaDescription || '').length}/160</div>
                        </div>

                        {/* Canonical URL */}
                        <div className="space-y-1.5">
                            <label className={labelCls + ' flex items-center gap-1'}><Globe className="w-3 h-3" />Canonical URL</label>
                            <input value={form.seo?.canonicalUrl || ''} onChange={e => updateSeo('canonicalUrl', e.target.value)}
                                placeholder="https://centhropy.com/blog/..."
                                className={`w-full p-2 text-xs font-mono ${fieldCls}`} />
                        </div>

                        {/* OG Image */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>OG Image URL</label>
                            <input value={form.seo?.ogImage || ''} onChange={e => updateSeo('ogImage', e.target.value)}
                                placeholder="URL imagen para redes sociales"
                                className={`w-full p-2 text-xs ${fieldCls}`} />
                        </div>

                        {/* GEO Summary */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>GEO Summary (IA)</label>
                            <textarea value={form.seo?.geoSummary || ''} onChange={e => updateSeo('geoSummary', e.target.value)}
                                placeholder="Respuesta directa para LLMs y motores de IA..."
                                rows={4}
                                className={`w-full p-2 text-xs resize-none ${fieldCls}`} />
                        </div>

                        {/* Entity Mentions */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Entidades Mencionadas</label>
                            <input
                                placeholder="Centhropy, Unify, Retail..."
                                className={`w-full p-2 text-xs ${fieldCls}`}
                                value={(form.seo?.entityMentions || []).join(', ')}
                                onChange={e => updateSeo('entityMentions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            />
                        </div>

                        {/* noIndex toggle */}
                        <div className="flex items-center justify-between py-1">
                            <label className={labelCls + ' mb-0'}>No Indexar</label>
                            <button
                                type="button"
                                onClick={() => updateSeo('noIndex', !form.seo?.noIndex)}
                                className={`w-10 h-5 relative transition-colors shrink-0 ${form.seo?.noIndex ? 'bg-red-500' : 'bg-black/10'}`}
                            >
                                <span className={`absolute top-[3px] w-3.5 h-3.5 bg-white border border-black/10 transition-all ${form.seo?.noIndex ? 'left-[22px]' : 'left-[3px]'}`} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PostEditor;
