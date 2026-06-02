import React, { useState, useCallback, useMemo } from 'react';
import {
    Plus, Save, X, Trash2, Edit, ChevronUp, ChevronDown,
    FileText, BookOpen, Layers, Cpu, PenTool, Layout,
    Terminal, Activity, Hash, Box, Globe, Eye, EyeOff,
    AlertCircle, CheckCircle2, ArrowLeft, ClipboardPaste,
    Bold, Italic, List, Link as LinkIcon, Link2Off,
    Minus, Quote, Image as ImageIcon, Undo, Redo
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { T } from './SharedUI';
import { generateSlug } from '../../hooks/useEditorial';

// ── ICON OPTIONS ────────────────────────────────────────────────
const ICON_OPTIONS = [
    { id: 'BookOpen', label: 'Libro', Icon: BookOpen },
    { id: 'FileText', label: 'Documento', Icon: FileText },
    { id: 'Layers', label: 'Capas', Icon: Layers },
    { id: 'Cpu', label: 'CPU', Icon: Cpu },
    { id: 'PenTool', label: 'Lápiz', Icon: PenTool },
    { id: 'Layout', label: 'Layout', Icon: Layout },
    { id: 'Terminal', label: 'Terminal', Icon: Terminal },
    { id: 'Activity', label: 'Actividad', Icon: Activity },
    { id: 'Hash', label: 'Hash', Icon: Hash },
    { id: 'Box', label: 'Caja', Icon: Box },
    { id: 'Globe', label: 'Globo', Icon: Globe },
    { id: 'AlertCircle', label: 'Alerta', Icon: AlertCircle },
    { id: 'CheckCircle2', label: 'Check', Icon: CheckCircle2 },
];

export const getIconComponent = (id) => {
    const found = ICON_OPTIONS.find(o => o.id === id);
    return found ? found.Icon : FileText;
};

// ── MARKDOWN → HTML CONVERTER ───────────────────────────────────
const markdownToHtml = (md) => {
    if (!md) return '';
    const lines = md.split('\n');
    const output = [];
    let inCodeBlock = false;
    let codeLines = [];
    let inList = false;
    let listTag = '';
    let tableBuffer = [];
    let inTable = false;

    const flushList = () => {
        if (inList) {
            output.push(`</${listTag}>`);
            inList = false;
            listTag = '';
        }
    };
    const flushTable = () => {
        if (inTable && tableBuffer.length > 0) {
            const [header, , ...rows] = tableBuffer;
            const thCells = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
            const bodyRows = rows.map(r => {
                const cells = r.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
                return `<tr>${cells}</tr>`;
            }).join('');
            output.push(`<table><thead><tr>${thCells}</tr></thead><tbody>${bodyRows}</tbody></table>`);
            tableBuffer = [];
            inTable = false;
        }
    };

    const inline = (text) => text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code blocks
        if (line.startsWith('```')) {
            if (!inCodeBlock) { inCodeBlock = true; codeLines = []; continue; }
            else { output.push(`<pre><code>${codeLines.join('\n')}</code></pre>`); inCodeBlock = false; codeLines = []; continue; }
        }
        if (inCodeBlock) { codeLines.push(line); continue; }

        // Tables
        if (line.startsWith('|')) {
            flushList();
            if (!inTable) inTable = true;
            tableBuffer.push(line);
            continue;
        } else if (inTable) { flushTable(); }

        // Headings
        if (line.startsWith('#### ')) { flushList(); output.push(`<h4>${inline(line.slice(5))}</h4>`); continue; }
        if (line.startsWith('### ')) { flushList(); output.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
        if (line.startsWith('## ')) { flushList(); output.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
        if (line.startsWith('# ')) { flushList(); output.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }

        // HR
        if (/^---+$/.test(line.trim())) { flushList(); output.push('<hr />'); continue; }

        // Blockquote
        if (line.startsWith('> ')) { flushList(); output.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`); continue; }

        // Ordered list
        if (/^\d+\.\s/.test(line)) {
            if (!inList || listTag !== 'ol') { flushList(); output.push('<ol>'); inList = true; listTag = 'ol'; }
            output.push(`<li>${inline(line.replace(/^\d+\.\s/, ''))}</li>`);
            continue;
        }

        // Unordered list
        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (!inList || listTag !== 'ul') { flushList(); output.push('<ul>'); inList = true; listTag = 'ul'; }
            output.push(`<li>${inline(line.slice(2))}</li>`);
            continue;
        }

        // Empty line
        if (line.trim() === '') { flushList(); output.push('<p></p>'); continue; }

        // Normal paragraph
        flushList();
        output.push(`<p>${inline(line)}</p>`);
    }

    flushList();
    flushTable();
    return output.join('\n');
};

// ── TIPTAP TOOLBAR (reusable, same as PostEditor) ───────────────
const DocMenuBar = ({ editor }) => {
    if (!editor) return null;

    const setLink = () => {
        const prev = editor.getAttributes('link').href;
        const url = window.prompt('URL del enlace:', prev);
        if (url === null) return;
        if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const btn = (active) => `p-2 transition-all text-xs ${active
        ? 'bg-black text-white dark:bg-[#BCC5DC] dark:text-[#222944]'
        : 'text-[#222944]/60 dark:text-[#BCC5DC]/70 hover:bg-[#222944]/10 dark:hover:bg-[#BCC5DC]/10'}`;

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-[#222944]/8 dark:border-[#BCC5DC]/8 bg-[#f5f5f3] dark:bg-[#1a2035] sticky top-0 z-10">
            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false) + ' disabled:opacity-30'} title="Deshacer"><Undo className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false) + ' disabled:opacity-30'} title="Rehacer"><Redo className="w-3.5 h-3.5" /></button>

            <div className="w-px h-4 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mx-1.5" />

            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Negrita"><Bold className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Cursiva"><Italic className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={setLink} className={btn(editor.isActive('link'))} title="Enlace"><LinkIcon className="w-3.5 h-3.5" /></button>
            {editor.isActive('link') && (
                <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className={btn(false)} title="Quitar enlace"><Link2Off className="w-3.5 h-3.5" /></button>
            )}

            <div className="w-px h-4 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mx-1.5" />

            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))} title="H1">H1</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="H2">H2</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="H3">H3</button>
            <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={btn(editor.isActive('paragraph'))} title="Párrafo">P</button>

            <div className="w-px h-4 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mx-1.5" />

            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Lista"><List className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Lista numerada">1.</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Cita"><Quote className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive('codeBlock'))} title="Código">{`</>`}</button>
            <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Separador"><Minus className="w-3.5 h-3.5" /></button>
        </div>
    );
};

// ── DOC EDITOR VIEW ─────────────────────────────────────────────
const DocEditor = ({ doc, onSave, onCancel }) => {
    const isNew = !doc?.id;
    const [title, setTitle] = useState(doc?.title || '');
    const [iconId, setIconId] = useState(doc?.icon || 'FileText');
    const [status, setStatus] = useState(doc?.status || 'draft');
    const [showMarkdownImport, setShowMarkdownImport] = useState(false);
    const [markdownText, setMarkdownText] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'underline text-[#222944] dark:text-[#BCC5DC]' } }),
            Image,
            Placeholder.configure({ placeholder: 'Escribe el contenido de la documentación aquí, o usa el botón "Importar Markdown" para pegar desde Google Docs...' }),
        ],
        content: doc?.content || '<p></p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none outline-none min-h-[500px] px-8 py-6 font-funnel text-[#222944] dark:text-[#BCC5DC] docs-editor-content',
            },
        },
    });

    const handleMarkdownImport = useCallback(() => {
        if (!markdownText.trim() || !editor) return;
        const html = markdownToHtml(markdownText);
        editor.commands.setContent(html);
        setMarkdownText('');
        setShowMarkdownImport(false);
    }, [markdownText, editor]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result;
            if (typeof text === 'string') {
                const lines = text.split('\n');
                const firstLine = lines.find(l => l.trim().startsWith('# '));
                if (firstLine) {
                    const extractedTitle = firstLine.replace('# ', '').trim();
                    if (!title.trim()) {
                        setTitle(extractedTitle);
                    }
                }
                const html = markdownToHtml(text);
                editor.commands.setContent(html);
                setShowMarkdownImport(false);
            }
        };
        reader.readAsText(file);
    };

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({
            title: title.trim(),
            icon: iconId,
            status,
            content: editor?.getHTML() || '<p></p>',
            slug: generateSlug(title),
        });
    };

    const SelectedIcon = getIconComponent(iconId);

    return (
        <div className="flex flex-col h-full">
            {/* Editor Header */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${T.border} bg-white dark:bg-[#222944] shrink-0`}>
                <button onClick={onCancel} className={`p-2 ${T.btnGhost} shrink-0`} title="Volver">
                    <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Título del documento..."
                        className="flex-1 text-base font-semibold text-[#222944] dark:text-[#BCC5DC] bg-transparent border-none outline-none placeholder:text-[#222944]/20 dark:placeholder:text-[#BCC5DC]/30"
                    />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {/* Status toggle */}
                    <button
                        onClick={() => setStatus(s => s === 'published' ? 'draft' : 'published')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider transition-all ${
                            status === 'published'
                                ? T.btnPrimary
                                : T.btnGhost
                        }`}
                        title="Cambiar estado"
                    >
                        {status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {status === 'published' ? 'Publicado' : 'Borrador'}
                    </button>
                    {/* Save */}
                    <button
                        onClick={handleSave}
                        disabled={!title.trim()}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider disabled:opacity-30 ${T.btnPrimary}`}
                    >
                        <Save className="w-3.5 h-3.5" />
                        {isNew ? 'Crear' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Icon & Meta Row */}
            <div className={`flex items-center gap-4 px-6 py-3 border-b ${T.border} bg-[#f5f5f3] dark:bg-[#1a2035] shrink-0`}>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-funnel text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest">Ícono:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                        {ICON_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setIconId(opt.id)}
                                title={opt.label}
                                className={`p-1.5 border transition-all ${iconId === opt.id
                                    ? 'bg-black text-white dark:bg-[#BCC5DC] dark:text-[#222944] border-black dark:border-[#BCC5DC]'
                                    : `${T.border} text-[#222944]/40 dark:text-[#BCC5DC]/60 hover:border-[#222944]/30`}`}
                            >
                                <opt.Icon className="w-3 h-3" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => setShowMarkdownImport(v => !v)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider transition-all ${
                            showMarkdownImport ? T.btnPrimary : T.btnGhost
                        }`}
                    >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        Importar Markdown
                    </button>
                </div>
            </div>

            {/* Markdown Import Panel */}
            {showMarkdownImport && (
                <div className={`px-6 py-4 border-b ${T.border} bg-[#f5f5f3] dark:bg-[#1a2035] shrink-0`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option A: Paste */}
                        <div className="flex flex-col">
                            <p className="text-[10px] text-[#222944]/60 dark:text-[#BCC5DC]/70 font-funnel uppercase tracking-widest mb-2 font-bold">
                                Opción A: Pegar Markdown
                            </p>
                            <textarea
                                value={markdownText}
                                onChange={e => setMarkdownText(e.target.value)}
                                placeholder="# Título del documento&#10;&#10;## Sección 1&#10;&#10;Texto aquí..."
                                className={`flex-1 min-h-[120px] w-full px-4 py-3 text-[13px] font-funnel resize-none ${T.input}`}
                            />
                            <div className="flex items-center gap-2 mt-3">
                                <button
                                    onClick={handleMarkdownImport}
                                    disabled={!markdownText.trim()}
                                    className={`flex items-center justify-center flex-1 gap-1.5 px-4 py-2 text-xs font-funnel font-medium uppercase tracking-wider disabled:opacity-30 ${T.btnPrimary}`}
                                >
                                    Convertir e Importar
                                </button>
                                <button onClick={() => { setShowMarkdownImport(false); setMarkdownText(''); }} className={`px-4 py-2 text-xs font-funnel uppercase tracking-wider ${T.btnGhost}`}>
                                    Cancelar
                                </button>
                            </div>
                        </div>

                        {/* Option B: Upload file */}
                        <div className="flex flex-col">
                            <p className="text-[10px] text-[#222944]/60 dark:text-[#BCC5DC]/70 font-funnel uppercase tracking-widest mb-2 font-bold">
                                Opción B: Subir Archivo .md
                            </p>
                            <label className={`flex-1 flex flex-col items-center justify-center min-h-[120px] border-2 border-dashed ${T.border} bg-white dark:bg-[#222944] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-all`}>
                                <FileText className="w-6 h-6 text-[#222944]/35 dark:text-[#BCC5DC]/45 mb-2" />
                                <span className="text-[11px] font-funnel font-bold uppercase tracking-widest text-[#222944]/60 dark:text-[#BCC5DC]/70">Seleccionar archivo .md</span>
                                <span className="text-[10px] font-funnel text-[#222944]/30 dark:text-[#BCC5DC]/40 mt-1">O arrastra el archivo aquí</span>
                                <input
                                    type="file"
                                    accept=".md"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/50 font-funnel leading-relaxed mt-3 block text-center">
                                * Nota: Importar Markdown reemplazará el contenido actual.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* TipTap Editor */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-[#222944]">
                <DocMenuBar editor={editor} />
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

// ── DOCS MANAGER (LIST VIEW) ────────────────────────────────────
const DocsManager = ({ docs, addDoc, updateDoc, deleteDoc, reorderDocs, onRequestNew, onNewHandled }) => {
    const [editing, setEditing] = useState(null); // null = list, 'new' = new, doc = edit

    React.useEffect(() => {
        if (onRequestNew) {
            setEditing('new');
            onNewHandled();
        }
    }, [onRequestNew, onNewHandled]);

    const sortedDocs = useMemo(() => [...docs].sort((a, b) => a.order - b.order), [docs]);

    const handleSave = (data) => {
        if (editing === 'new') {
            addDoc(data);
        } else {
            updateDoc(editing.id, data);
        }
        setEditing(null);
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const ids = sortedDocs.map(d => d.id);
        [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
        reorderDocs(ids);
    };

    const handleMoveDown = (index) => {
        if (index === sortedDocs.length - 1) return;
        const ids = sortedDocs.map(d => d.id);
        [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
        reorderDocs(ids);
    };

    // Editor view
    if (editing !== null) {
        return (
            <div className="h-[calc(100vh-4rem)] -m-8 overflow-hidden">
                <DocEditor
                    doc={editing === 'new' ? null : editing}
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                />
            </div>
        );
    }

    // List view
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left/Main Column: Docs List or Empty State */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Empty state */}
                    {sortedDocs.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-[#222944]/15 dark:border-[#BCC5DC]/15 bg-white dark:bg-[#222944] flex flex-col justify-center items-center h-[350px]">
                            <BookOpen className="w-10 h-10 text-[#222944]/10 dark:text-[#BCC5DC]/25 mb-4 animate-pulse" />
                            <p className="text-[#222944]/40 dark:text-[#BCC5DC]/60 text-sm font-semibold mb-2">No hay documentos todavía</p>
                            <p className="text-[#222944]/20 dark:text-[#BCC5DC]/45 text-[11px] font-funnel uppercase tracking-widest mb-6 max-w-xs leading-relaxed">
                                Tu base de conocimientos está vacía. Crea el primer artículo para empezar.
                            </p>
                            <button
                                onClick={() => setEditing('new')}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-funnel font-medium tracking-wider uppercase ${T.btnPrimary}`}
                            >
                                <Plus className="w-3.5 h-3.5" /> Crear Primer Documento
                            </button>
                        </div>
                    )}

                    {/* Doc list */}
                    {sortedDocs.length > 0 && (
                        <div className="space-y-2">
                            {sortedDocs.map((doc, index) => {
                                const IconComp = getIconComponent(doc.icon);
                                return (
                                    <div
                                        key={doc.id}
                                        className={`group flex items-center gap-4 p-4 border ${T.border} ${T.card} ${T.cardHover} transition-all`}
                                    >
                                        {/* Order controls */}
                                        <div className="flex flex-col gap-0.5 shrink-0">
                                            <button
                                                onClick={() => handleMoveUp(index)}
                                                disabled={index === 0}
                                                className="p-0.5 text-[#222944]/20 dark:text-[#BCC5DC]/30 hover:text-[#222944] dark:hover:text-[#BCC5DC] disabled:opacity-0 transition-colors"
                                            >
                                                <ChevronUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleMoveDown(index)}
                                                disabled={index === sortedDocs.length - 1}
                                                className="p-0.5 text-[#222944]/20 dark:text-[#BCC5DC]/30 hover:text-[#222944] dark:hover:text-[#BCC5DC] disabled:opacity-0 transition-colors"
                                            >
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Order number */}
                                        <span className="text-[10px] font-funnel text-[#222944]/20 dark:text-[#BCC5DC]/35 w-5 text-center shrink-0">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        {/* Icon */}
                                        <div className={`w-8 h-8 flex items-center justify-center border ${T.border} shrink-0`}>
                                            <IconComp className="w-3.5 h-3.5 text-[#222944]/40 dark:text-[#BCC5DC]/60" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-[8px] font-funnel px-1.5 py-0.5 uppercase tracking-wider ${
                                                    doc.status === 'published'
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {doc.status === 'published' ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-[#222944] dark:text-[#BCC5DC] truncate">{doc.title}</h3>
                                            <p className="text-[10px] text-[#222944]/30 dark:text-[#BCC5DC]/50 font-funnel">
                                                Actualizado: {new Date(doc.updatedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <button
                                                onClick={() => updateDoc(doc.id, { status: doc.status === 'published' ? 'draft' : 'published' })}
                                                className={`p-2 ${T.btnGhost}`}
                                                title={doc.status === 'published' ? 'Pasar a Borrador' : 'Publicar'}
                                            >
                                                {doc.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                            <button
                                                onClick={() => setEditing(doc)}
                                                className={`p-2 ${T.btnGhost}`}
                                                title="Editar"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => { if (window.confirm(`¿Eliminar "${doc.title}"?`)) deleteDoc(doc.id); }}
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

                {/* Right Column: Information & Guidelines */}
                <div className="space-y-6">
                    {/* Flow guide */}
                    <div className={`p-6 border ${T.border} bg-white dark:bg-[#222944]`}>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#222944] dark:text-[#BCC5DC] border-b pb-3 border-[#222944]/10 dark:border-[#BCC5DC]/10 mb-4">
                            Flujo Google Docs
                        </h4>
                        <p className="text-[11px] leading-relaxed text-[#222944]/55 dark:text-[#BCC5DC]/70 font-light mb-4">
                            Gestiona tu documentación de forma profesional redactando en Google Docs e importando el contenido en segundos.
                        </p>
                        <ol className="space-y-4 pl-0 list-none">
                            {[
                                { step: '01', title: 'Redacta en Docs', desc: 'Usa formatos estándar, listas, tablas y títulos (H2, H3).' },
                                { step: '02', title: 'Exporta a Markdown', desc: 'Usa el complemento gratuito "Docs to Markdown" para copiar tu texto.' },
                                { step: '03', title: 'Pega e Importa', desc: 'Haz clic en "Importar Markdown" en el editor y conviértelo en 1 clic.' }
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3">
                                    <span className="text-[10px] font-mono font-bold text-[#222944]/35 dark:text-[#BCC5DC]/45 mt-0.5 shrink-0">{item.step}</span>
                                    <div>
                                        <h5 className="text-[11px] font-bold text-[#222944] dark:text-[#BCC5DC] mb-0.5">{item.title}</h5>
                                        <p className="text-[10px] leading-relaxed text-[#222944]/40 dark:text-[#BCC5DC]/55">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Format tips */}
                    <div className={`p-6 border ${T.border} bg-[#f5f5f3] dark:bg-[#1a2035] space-y-3`}>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#222944] dark:text-[#BCC5DC]">
                            Consejos de Formato
                        </h4>
                        <ul className="space-y-2.5 pl-0 list-none text-[10px] text-[#222944]/50 dark:text-[#BCC5DC]/70 leading-relaxed font-light">
                            <li className="flex gap-2 items-start">
                                <span className="w-1 h-1 rounded-full bg-[#222944]/30 dark:bg-[#BCC5DC]/40 mt-1.5 shrink-0" />
                                <span>Usa <strong>Título 2 (H2)</strong> en Google Docs para crear las secciones interactivas principales del sidebar.</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <span className="w-1 h-1 rounded-full bg-[#222944]/30 dark:bg-[#BCC5DC]/40 mt-1.5 shrink-0" />
                                <span>El <strong>Scroll-Spy</strong> rastreará tus títulos H2 para iluminar la posición de lectura del usuario automáticamente.</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <span className="w-1 h-1 rounded-full bg-[#222944]/30 dark:bg-[#BCC5DC]/40 mt-1.5 shrink-0" />
                                <span>Los borradores no se mostrarán al público general en el menú principal.</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DocsManager;
