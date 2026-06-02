import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    ArrowLeft, Upload, Image as ImageIcon, Minus, List,
    X, Check, AlertCircle, User, Calendar,
    Globe, Search, Clock, Hash, Bold, Italic, Link as LinkIcon, Link2Off, Eye, Undo, Redo,
    Maximize2, Minimize2, Quote, Plus
} from 'lucide-react';
import { generateSlug, calculateReadTime } from '../hooks/useEditorial';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

// ── UTILS: CLIENT-SIDE IMAGE COMPRESSION ───────────────────────
const compressAndResizeImage = (file, maxWidth = 1200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new window.Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(event.target.result); // Fallback to original Base64
                            return;
                        }
                        const readerBlob = new FileReader();
                        readerBlob.readAsDataURL(blob);
                        readerBlob.onloadend = () => {
                            resolve(readerBlob.result);
                        };
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

// ── TIPTAP TOOLBAR ────────────────────────────────────────────
const MenuBar = ({ editor }) => {
    const fileInputRef = useRef(null);
    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL del enlace:', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleLocalImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const compressedBase64 = await compressAndResizeImage(file);
                editor.chain().focus().setImage({ src: compressedBase64 }).run();
            } catch (err) {
                console.error("Error uploading local image:", err);
            }
        }
    };

    const addImageViaUrl = () => {
        const url = window.prompt('URL de la imagen externa:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const btnClass = (active) =>
        `p-2 transition-all text-xs font-funnel uppercase tracking-widest ${
            active
                ? 'bg-black text-white dark:bg-[#BCC5DC] dark:text-[#222944]'
                : 'text-[#222944]/60 dark:text-[#BCC5DC]/70 hover:bg-[#222944]/10 dark:hover:bg-[#BCC5DC]/10'
        }`;

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-[#222944]/8 dark:border-[#BCC5DC]/8 bg-[#f5f5f3] dark:bg-[#1a2035] sticky top-0 z-10">
            {/* History */}
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className={btnClass(false) + ' disabled:opacity-30'}
                title="Deshacer (Ctrl+Z)"
            >
                <Undo className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className={btnClass(false) + ' disabled:opacity-30'}
                title="Rehacer (Ctrl+Y)"
            >
                <Redo className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mx-2" />

            {/* Formats */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btnClass(editor.isActive('bold'))}
                title="Negrita (Ctrl+B)"
            >
                <Bold className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btnClass(editor.isActive('italic'))}
                title="Cursiva (Ctrl+I)"
            >
                <Italic className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={setLink}
                className={btnClass(editor.isActive('link'))}
                title="Enlace"
            >
                <LinkIcon className="w-3.5 h-3.5" />
            </button>
            {editor.isActive('link') && (
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className={btnClass(false)}
                    title="Quitar Enlace"
                >
                    <Link2Off className="w-3.5 h-3.5" />
                </button>
            )}

            <div className="w-[1px] h-4 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mx-2" />

            {/* Elements */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btnClass(editor.isActive('heading', { level: 2 }))}
                title="Subtítulo H2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={btnClass(editor.isActive('heading', { level: 3 }))}
                title="Subtítulo H3"
            >
                H3
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={btnClass(editor.isActive('paragraph'))}
                title="Párrafo"
            >
                P
            </button>

            <div className="w-[1px] h-4 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mx-2" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btnClass(editor.isActive('bulletList'))}
                title="Lista de viñetas"
            >
                <List className="w-3.5 h-3.5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btnClass(editor.isActive('orderedList'))}
                title="Lista numerada"
            >
                1.
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={btnClass(editor.isActive('blockquote'))}
                title="Cita"
            >
                <Quote className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mx-2" />

            {/* Media */}
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={btnClass(false)}
                title="Cargar Imagen Local"
            >
                <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLocalImageUpload}
            />
            <button
                type="button"
                onClick={addImageViaUrl}
                title="Añadir Imagen por URL"
                className="text-[9px] font-funnel p-2.5 text-[#222944]/50 dark:text-[#BCC5DC]/50 hover:bg-[#222944]/10 transition-all uppercase tracking-widest"
            >
                +URL
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={btnClass(false)}
                title="Separador"
            >
                <Minus className="w-3.5 h-3.5" />
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
const fieldCls = "w-full bg-gray-50 border border-[#222944]/10 dark:border-[#BCC5DC]/10 text-[#222944] dark:text-[#BCC5DC] placeholder:text-[#222944]/25 dark:text-[#BCC5DC]/45 outline-none focus:border-[#222944]/40 dark:border-[#BCC5DC]/40 focus:bg-white dark:bg-[#222944] transition-colors";
const labelCls = "text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block mb-1";

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
            content: '<p></p>',
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
    
    // Autosave State
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
    const [lastSavedTime, setLastSavedTime] = useState('');
    const lastSavedRef = useRef(buildInitialForm());

    // Preview & SEO Panel States
    const [showPreview, setShowPreview] = useState(false);
    const [showSeo, setShowSeo] = useState(true);
    const [zenMode, setZenMode] = useState(false);

    // Toggle Zen Mode (hides both sidebars)
    const toggleZen = useCallback(() => {
        setZenMode(z => {
            const next = !z;
            if (next) {
                // Enter Zen: hide both panels
                setShowSeo(false);
            } else {
                // Exit Zen: restore SEO panel
                setShowSeo(true);
            }
            return next;
        });
    }, []);

    // Keyboard shortcut: Ctrl/Cmd + Shift + Z → Toggle Zen
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
                e.preventDefault();
                toggleZen();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [toggleZen]);

    const updateForm = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), []);
    const updateSeo = useCallback((key, val) => setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } })), []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3]
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-black dark:text-white underline cursor-pointer'
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'w-full max-h-96 object-cover border border-[#222944]/8 dark:border-[#BCC5DC]/8 my-6'
                }
            }),
            Placeholder.configure({
                placeholder: 'Comienza a escribir tu publicación aquí...',
            })
        ],
        content: form.content || '<p></p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            updateForm('content', html);
        }
    });

    useEffect(() => {
        if (editor && initialData?.content && editor.getHTML() !== initialData.content) {
            editor.commands.setContent(initialData.content);
        }
    }, [editor, initialData?.content]);

    // ── DEBOUNCED AUTOSAVE EFFECT ──────────────────────────────────
    useEffect(() => {
        if (!form.id) return; // Only autosave already created posts

        const hasChanges =
            form.title !== lastSavedRef.current.title ||
            form.content !== lastSavedRef.current.content ||
            form.excerpt !== lastSavedRef.current.excerpt ||
            form.status !== lastSavedRef.current.status ||
            form.coverImage !== lastSavedRef.current.coverImage;

        if (!hasChanges) return;

        setSaveStatus('unsaved');

        const timer = setTimeout(() => {
            setSaveStatus('saving');
            onSave(form);
            lastSavedRef.current = form;
            setSaveStatus('saved');
            const now = new Date();
            setLastSavedTime(
                now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            );
        }, 5000); // Trigger 5s after user stops editing

        return () => clearTimeout(timer);
    }, [form, onSave]);

    const handleTitleChange = (val) => {
        setForm(f => ({
            ...f,
            title: val,
            slug: slugManual ? f.slug : generateSlug(val),
            seo: { ...f.seo, metaTitle: (!f.seo?.metaTitle || f.seo.metaTitle === f.title) ? val : f.seo.metaTitle }
        }));
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        try {
            setSaveStatus('saving');
            const compressedBase64 = await compressAndResizeImage(file);
            setForm(f => ({ ...f, coverImage: compressedBase64, seo: { ...f.seo, ogImage: f.seo?.ogImage || compressedBase64 } }));
            setCoverPreview(compressedBase64);
            setSaveStatus('saved');
        } catch (err) {
            console.error("Error compressing cover image:", err);
            setSaveStatus('unsaved');
        }
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !form.tags?.includes(tag)) updateForm('tags', [...(form.tags || []), tag]);
        setTagInput('');
    };
    const removeTag = (tag) => updateForm('tags', (form.tags || []).filter(t => t !== tag));

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

    const sectionTitle = "text-[9px] font-funnel text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-[0.3em] mb-4 block";

    return (
        <div className="flex flex-col h-screen bg-[#f5f5f3] font-funnel overflow-hidden">
            {/* Inline Styles for WYSIWYG match */}
            <style>{`
                .ProseMirror {
                    outline: none;
                    min-height: 450px;
                    padding-bottom: 80px;
                }
                .ProseMirror p {
                    font-family: 'Unna', serif;
                    font-size: 20px;
                    line-height: 1.65;
                    color: #222944;
                    margin-bottom: 1.5rem;
                }
                .dark .ProseMirror p {
                    color: #bcc5dc;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror h2 {
                    font-family: 'Funnel Sans', sans-serif;
                    font-weight: 900;
                    font-size: 28px;
                    text-transform: uppercase;
                    letter-spacing: -0.05em;
                    color: #222944;
                    margin-top: 2rem;
                    margin-bottom: 0.5rem;
                }
                .dark .ProseMirror h2 {
                    color: #bcc5dc;
                }
                .ProseMirror h3 {
                    font-family: 'Funnel Sans', sans-serif;
                    font-weight: 700;
                    font-size: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #222944;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .dark .ProseMirror h3 {
                    color: #bcc5dc;
                }
                .ProseMirror blockquote {
                    border-left: 2px solid #222944;
                    padding-left: 1.5rem;
                    margin: 2.5rem 0;
                }
                .dark .ProseMirror blockquote {
                    border-left-color: #bcc5dc;
                }
                .ProseMirror blockquote p {
                    font-style: italic;
                    font-size: 22px;
                    color: #222944;
                }
                .dark .ProseMirror blockquote p {
                    color: #bcc5dc;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .ProseMirror li {
                    font-family: 'Unna', serif;
                    font-size: 20px;
                    margin-bottom: 0.5rem;
                    color: #222944;
                }
                .dark .ProseMirror li {
                    color: #bcc5dc;
                }
                .ProseMirror hr {
                    border: 0;
                    border-top: 1px solid #222944;
                    opacity: 0.15;
                    margin: 2.5rem 0;
                }
                .dark .ProseMirror hr {
                    border-top-color: #bcc5dc;
                }
            `}</style>

            {/* ── TOP BAR ── */}
            <header className="h-14 border-b border-[#222944]/8 dark:border-[#BCC5DC]/8 flex items-center justify-between px-5 shrink-0 bg-white dark:bg-[#222944] z-20">
                <button type="button" onClick={onCancel} className="flex items-center gap-2 text-[#222944]/45 dark:text-[#BCC5DC]/65 hover:text-[#222944] dark:text-[#BCC5DC] transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-xs font-medium">Volver al Panel</span>
                </button>

                {/* Central Status (including Auto-save alerts) */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-funnel text-[#222944]/30 dark:text-[#BCC5DC]/50 uppercase tracking-widest">
                        {isEditing ? `Editando` : 'Nueva Publicación'}
                    </span>
                    {form.id && (
                        <>
                            <span className="text-[#222944]/20 dark:text-[#BCC5DC]/20">·</span>
                            <span className={`text-[9px] font-funnel uppercase tracking-wider ${
                                saveStatus === 'saving' ? 'text-amber-500 animate-pulse' :
                                saveStatus === 'unsaved' ? 'text-gray-400' : 'text-emerald-500'
                            }`}>
                                {saveStatus === 'saving' ? 'Autoguardando...' :
                                 saveStatus === 'unsaved' ? 'Cambios sin guardar' :
                                 `Guardado local ${lastSavedTime ? `a las ${lastSavedTime}` : ''}`}
                            </span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Toggle SEO Sidebar (solo cuando no está en Zen) */}
                    {!zenMode && (
                        <button
                            type="button"
                            onClick={() => setShowSeo(s => !s)}
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider transition-all ${
                                showSeo ? T.btnPrimary : T.btnGhost
                            }`}
                            title={showSeo ? 'Ocultar panel SEO' : 'Mostrar panel SEO'}
                        >
                            {showSeo ? 'Ocultar SEO' : 'Mostrar SEO'}
                        </button>
                    )}

                    {/* Modo Zen – full focus toggle */}
                    <button
                        type="button"
                        onClick={toggleZen}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider transition-all ${
                            zenMode ? T.btnPrimary : T.btnGhost
                        }`}
                        title={`${zenMode ? 'Salir del' : 'Entrar en'} Modo Zen (Ctrl+Shift+Z)`}
                    >
                        {zenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        {zenMode ? 'Salir Zen' : 'Modo Zen'}
                    </button>

                    {/* Preview Button */}
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider transition-all ${T.btnGhost}`}
                        title="Vista Previa del Post"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Vista Previa
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit('draft')}
                        className={`px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider transition-all ${T.btnGhost}`}
                    >
                        Guardar Borrador
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit('active')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider transition-all ${T.btnPrimary}`}
                    >
                        <Upload className="w-3.5 h-3.5" />
                        {isEditing ? 'Actualizar' : 'Publicar'}
                    </button>
                </div>
            </header>

            {/* ── ZEN MODE HINT ── */}
            {zenMode && (
                <div className="absolute top-[56px] left-0 right-0 flex justify-center z-50 pointer-events-none" style={{ top: '57px' }}>
                    <div className="px-4 py-1.5 bg-black/60 dark:bg-[#BCC5DC]/10 backdrop-blur-sm text-white dark:text-[#BCC5DC] text-[10px] font-funnel tracking-widest uppercase flex items-center gap-3 pointer-events-auto opacity-100 animate-fade-in-down">
                        <Maximize2 className="w-3 h-3 opacity-50" />
                        <span>Modo Zen activado — sin distracciones</span>
                        <span className="opacity-40">|</span>
                        <kbd className="text-[9px] opacity-50">Ctrl+Shift+Z</kbd>
                        <span className="opacity-40">para salir</span>
                    </div>
                </div>
            )}

            {/* ── 3-COLUMN BODY ── */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* LEFT: METADATA */}
                <aside className={`border-r border-[#222944]/8 dark:border-[#BCC5DC]/8 overflow-y-auto bg-white dark:bg-[#222944] shrink-0 transition-all duration-300 ease-in-out ${
                    zenMode ? 'w-0 opacity-0 overflow-hidden border-0' : 'w-60 opacity-100'
                }`}>
                    <div className="p-5 space-y-5">
                        <span className={sectionTitle}>Metadata</span>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className={labelCls}>Estado</label>
                            <div className="flex gap-1.5">
                                {[
                                    { val: 'active', label: 'Live', color: 'bg-emerald-500' },
                                    { val: 'draft', label: 'Draft', color: 'bg-amber-400' },
                                    { val: 'inactive', label: 'Off', color: 'bg-[#222944]/20 dark:bg-[#BCC5DC]/20' },
                                ].map(s => (
                                    <button
                                        key={s.val}
                                        type="button"
                                        onClick={() => updateForm('status', s.val)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium border transition-all ${form.status === s.val
                                                ? 'bg-black text-white border-[#222944] dark:border-[#BCC5DC]'
                                                : 'border-[#222944]/10 dark:border-[#BCC5DC]/10 text-[#222944]/45 dark:text-[#BCC5DC]/65 hover:border-[#222944]/30 dark:border-[#BCC5DC]/30'
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${form.status === s.val ? 'bg-white dark:bg-[#222944]' : s.color}`} />
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
                                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-[#222944]/15 dark:bg-[#BCC5DC]/5 text-[10px] text-[#222944] dark:text-[#BCC5DC]">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-[#222944]/30 dark:text-[#BCC5DC]/50 hover:text-[#222944] dark:text-[#BCC5DC]"><X className="w-2.5 h-2.5" /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="Añadir tag..."
                                    className="flex-1 bg-gray-50 border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 py-1 text-[11px] text-[#222944] dark:text-[#BCC5DC] outline-none placeholder:text-[#222944]/25 dark:text-[#BCC5DC]/45 focus:border-[#222944]/40 dark:border-[#BCC5DC]/40"
                                />
                                <button type="button" onClick={addTag} className="text-[#222944]/40 dark:text-[#BCC5DC]/60 hover:text-[#222944] dark:text-[#BCC5DC]"><Plus className="w-3.5 h-3.5" /></button>
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
                            <div className="text-right text-[9px] text-[#222944]/30 dark:text-[#BCC5DC]/50">{(form.excerpt || '').length}/200</div>
                        </div>

                        {/* Slug */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Slug URL</label>
                            <input
                                value={form.slug || ''}
                                onChange={e => { setSlugManual(true); updateForm('slug', e.target.value); }}
                                placeholder="url-del-articulo"
                                className="w-full bg-transparent border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 py-1 text-[11px] text-[#222944]/60 dark:text-[#BCC5DC]/80 font-funnel outline-none focus:border-[#222944]/40 dark:border-[#BCC5DC]/40 placeholder:text-[#222944]/20 dark:text-[#BCC5DC]/40"
                            />
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Imagen de Portada</label>
                            {coverPreview ? (
                                <div className="relative">
                                    <img src={coverPreview} alt="" className="w-full aspect-video object-cover border border-[#222944]/8 dark:border-[#BCC5DC]/8" />
                                    <button
                                        type="button"
                                        onClick={() => { updateForm('coverImage', ''); setCoverPreview(''); }}
                                        className="absolute top-1 right-1 bg-white/90 dark:bg-[#222944]/90 border border-[#222944]/10 dark:border-[#BCC5DC]/10 p-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center py-4 border border-dashed border-[#222944]/12 dark:border-[#BCC5DC]/12 hover:border-[#222944]/25 dark:border-[#BCC5DC]/25 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <ImageIcon className="w-4 h-4 text-[#222944]/20 dark:text-[#BCC5DC]/40 mb-1" />
                                    <span className="text-[9px] text-[#222944]/25 dark:text-[#BCC5DC]/45 uppercase tracking-widest">Cargar portada</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                                </label>
                            )}
                            {!coverPreview && (
                                <input
                                    value={form.coverImage || ''}
                                    onChange={e => { updateForm('coverImage', e.target.value); setCoverPreview(e.target.value); }}
                                    placeholder="O pega una URL..."
                                    className="w-full bg-gray-50 border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 py-1 text-[11px] text-[#222944] dark:text-[#BCC5DC] outline-none placeholder:text-[#222944]/20 dark:text-[#BCC5DC]/40 focus:border-[#222944]/35 dark:border-[#BCC5DC]/35"
                                />
                            )}
                            <input
                                value={form.coverCaption || ''}
                                onChange={e => updateForm('coverCaption', e.target.value)}
                                placeholder="Caption de portada..."
                                className="w-full bg-transparent border-b border-[#222944]/8 dark:border-[#BCC5DC]/8 py-1 text-[11px] text-[#222944]/40 dark:text-[#BCC5DC]/60 outline-none placeholder:text-[#222944]/15 dark:text-[#BCC5DC]/30"
                            />
                        </div>
                    </div>
                </aside>

                {/* CENTER: TIPTAP EDITOR */}
                <main className="flex-1 overflow-y-auto bg-white dark:bg-[#222944] flex flex-col">
                    <MenuBar editor={editor} />
                    <div className="flex-1 max-w-3xl w-full mx-auto px-14 py-12">
                        {/* Title */}
                        <textarea
                            value={form.title}
                            onChange={e => handleTitleChange(e.target.value)}
                            placeholder="Título de la publicación..."
                            rows={2}
                            className="w-full bg-transparent outline-none text-4xl font-black tracking-tighter text-[#222944] dark:text-[#BCC5DC] placeholder:text-[#222944]/15 dark:text-[#BCC5DC]/30 resize-none mb-2 leading-tight"
                            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        <div className="text-[10px] font-funnel text-[#222944]/25 dark:text-[#BCC5DC]/45 mb-10 flex items-center gap-3">
                            <Clock className="w-3 h-3" />
                            <span>{calculateReadTime(form.content)}</span>
                        </div>

                        {/* Editor Canvas */}
                        <div className="mt-4">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </main>

                {/* RIGHT: SEO PANEL */}
                {showSeo && (
                    <aside className="w-68 border-l border-[#222944]/8 dark:border-[#BCC5DC]/8 overflow-y-auto bg-white dark:bg-[#222944] shrink-0" style={{ width: '272px' }}>
                        <div className="p-5 space-y-5">
                            <span className={sectionTitle + ' flex items-center gap-2'}><Search className="w-3 h-3" />SEO / GEO</span>

                            {/* Analysis */}
                            <div className="bg-gray-50 border border-[#222944]/8 dark:border-[#BCC5DC]/8 p-3 space-y-2">
                                <div className="text-[9px] font-funnel text-[#222944]/35 dark:text-[#BCC5DC]/35 uppercase tracking-widest mb-2">Análisis</div>
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
                                <div className="text-right text-[9px] text-[#222944]/30 dark:text-[#BCC5DC]/50">{(form.seo?.metaTitle || '').length}/60</div>
                            </div>

                            {/* Meta Description */}
                            <div className="space-y-1.5">
                                <label className={labelCls}>Meta Descripción</label>
                                <textarea value={form.seo?.metaDescription || ''} onChange={e => updateSeo('metaDescription', e.target.value)}
                                    placeholder="Descripción para resultados de búsqueda (80-160 chars)"
                                    maxLength={160} rows={4}
                                    className={`w-full p-2 text-xs resize-none ${fieldCls}`} />
                                <div className="text-right text-[9px] text-[#222944]/30 dark:text-[#BCC5DC]/50">{(form.seo?.metaDescription || '').length}/160</div>
                            </div>

                            {/* Canonical URL */}
                            <div className="space-y-1.5">
                                <label className={labelCls + ' flex items-center gap-1'}><Globe className="w-3 h-3" />Canonical URL</label>
                                <input value={form.seo?.canonicalUrl || ''} onChange={e => updateSeo('canonicalUrl', e.target.value)}
                                    placeholder="https://centhropy.com/blog/..."
                                    className={`w-full p-2 text-xs font-funnel ${fieldCls}`} />
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
                                    className={`w-10 h-5 relative transition-colors shrink-0 ${form.seo?.noIndex ? 'bg-red-500' : 'bg-[#222944]/10 dark:bg-[#BCC5DC]/10'}`}
                                >
                                    <span className={`absolute top-[3px] w-3.5 h-3.5 bg-white dark:bg-[#222944] border border-[#222944]/10 dark:border-[#BCC5DC]/10 transition-all ${form.seo?.noIndex ? 'left-[22px]' : 'left-[3px]'}`} />
                                </button>
                            </div>
                        </div>
                    </aside>
                )}
            </div>

            {/* ── HIGH FIDELITY PREVIEW MODAL ── */}
            {showPreview && (
                <div className="fixed inset-0 bg-white dark:bg-[#222944] z-[1000] overflow-y-auto px-5 py-24 selection:bg-black selection:text-white">
                    {/* Floating controls */}
                    <div className="fixed top-4 right-4 z-[1010] flex gap-2">
                        <button
                            type="button"
                            onClick={() => setShowPreview(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-funnel uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-4 h-4" /> Cerrar Vista Previa
                        </button>
                    </div>

                    <article className="max-w-[720px] mx-auto font-funnel">
                        {/* Header */}
                        <header className="mb-12">
                            <div className="flex items-center gap-3 mb-7">
                                <span className="px-2.5 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] leading-none">
                                    {form.category}
                                </span>
                                <div className="h-[1px] w-6 bg-[#222944]/10 dark:bg-[#BCC5DC]/10" />
                                <span className="text-[11px] font-medium text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest">
                                    {form.date
                                        ? new Date(form.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : ''}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-[52px] font-black tracking-tighter leading-[1.02] uppercase mb-5 text-[#222944] dark:text-[#BCC5DC]">
                                {form.title || 'SIN TÍTULO'}
                            </h1>

                            {form.excerpt && (
                                <p className="text-xl md:text-2xl font-light text-[#222944]/55 dark:text-[#BCC5DC]/55 leading-snug mb-8 uppercase tracking-tight">
                                    {form.excerpt}
                                </p>
                            )}

                            <div className="flex items-center justify-between border-y border-[#222944]/15 dark:border-[#BCC5DC]/5 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border border-[#222944]/10 dark:border-[#BCC5DC]/10 overflow-hidden bg-black flex items-center justify-center shrink-0">
                                        <span className="text-white text-xs font-bold">C</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold block text-[#222944] dark:text-[#BCC5DC]">
                                            {authors.find(a => a.id === form.authorId)?.name || 'Centhropy'}
                                        </span>
                                        <span className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest">
                                            {authors.find(a => a.id === form.authorId)?.role || ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[#222944]/40 dark:text-[#BCC5DC]/60">
                                    <Clock size={12} />
                                    <span>{calculateReadTime(form.content)}</span>
                                </div>
                            </div>
                        </header>

                        {/* Cover image */}
                        {coverPreview && (
                            <figure className="mb-14">
                                <div className="aspect-video w-full overflow-hidden border border-[#222944]/15 dark:border-[#BCC5DC]/5 bg-gray-100">
                                    <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                                </div>
                                {form.coverCaption && (
                                    <figcaption className="text-center text-[11px] text-[#222944]/35 dark:text-[#BCC5DC]/35 mt-3 uppercase tracking-widest">
                                        {form.coverCaption}
                                    </figcaption>
                                )}
                            </figure>
                        )}

                        {/* Rich HTML rendered body */}
                        <div
                            className="blog-content-rich mb-24"
                            dangerouslySetInnerHTML={{ __html: form.content }}
                        />
                    </article>
                </div>
            )}
        </div>
    );
};

export default PostEditor;
