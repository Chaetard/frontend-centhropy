import React, { useState } from 'react';
import { Plus, Save, X, User, Edit, Trash2 } from 'lucide-react';
import { T } from './SharedUI';

// ── CLIENT-SIDE IMAGE COMPRESSION (same as PostEditor) ──────────
const compressAndResizeImage = (file, maxWidth = 400, quality = 0.75) => {
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
                            resolve(event.target.result);
                            return;
                        }
                        const readerBlob = new FileReader();
                        readerBlob.readAsDataURL(blob);
                        readerBlob.onloadend = () => resolve(readerBlob.result);
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

const AuthorsManager = ({ authors, posts, addAuthor, updateAuthor, deleteAuthor, onRequestNew, onNewHandled }) => {
    const [editing, setEditing] = useState(null);
    const emptyForm = { name: '', role: '', bio: '', avatar: null };
    const [form, setForm] = useState(emptyForm);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [isCompressing, setIsCompressing] = useState(false);

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

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsCompressing(true);
        try {
            const compressed = await compressAndResizeImage(file);
            setForm(f => ({ ...f, avatar: compressed }));
            setAvatarPreview(compressed);
        } catch (err) {
            console.error('Error compressing avatar:', err);
            // Fallback: read the raw file
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, avatar: reader.result }));
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } finally {
            setIsCompressing(false);
        }
    };

    const handleSave = () => {
        if (!form.name.trim()) return;
        editing === 'new' ? addAuthor(form) : updateAuthor(editing.id, form);
        handleCancel();
    };

    const getPostCount = (id) => posts.filter(p => p.authorId === id).length;

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="flex justify-end items-center mb-6">
                <button
                    id="new-author-btn"
                    onClick={handleNew}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-funnel font-medium tracking-wider uppercase ${T.btnPrimary}`}
                >
                    <Plus className="w-3.5 h-3.5" /> Nuevo Autor
                </button>
            </div>

            {/* Form */}
            {editing && (
                <div className={`${T.card} border ${T.borderMd} p-6 mb-6`}>
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-[10px] font-funnel text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest">
                            {editing === 'new' ? 'Nuevo Autor' : 'Editar Autor'}
                        </span>
                        <button onClick={handleCancel} className="text-[#222944]/30 dark:text-[#BCC5DC]/50 hover:text-[#222944] dark:hover:text-[#BCC5DC]">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-[auto_1fr] gap-6 mb-4">
                        {/* Avatar */}
                        <div>
                            {avatarPreview ? (
                                <div className="relative w-16 h-16">
                                    <img src={avatarPreview} alt="" className="w-16 h-16 rounded-full object-cover border border-[#222944]/10 dark:border-[#BCC5DC]/10" />
                                    <button
                                        onClick={() => { setForm(f => ({ ...f, avatar: null })); setAvatarPreview(''); }}
                                        className="absolute -top-1 -right-1 bg-white dark:bg-[#222944] border border-[#222944]/10 dark:border-[#BCC5DC]/10 rounded-full p-0.5 text-[#222944]/40 dark:text-[#BCC5DC]/60 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-16 h-16 border border-dashed border-[#222944]/15 dark:border-[#BCC5DC]/15 cursor-pointer hover:border-[#222944]/30 dark:hover:border-[#BCC5DC]/30 rounded-full bg-gray-50 transition-colors ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isCompressing ? (
                                        <div className="w-4 h-4 border-2 border-[#222944]/30 border-t-[#222944] rounded-full animate-spin" />
                                    ) : (
                                        <User className="w-5 h-5 text-[#222944]/20 dark:text-[#BCC5DC]/40" />
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                </label>
                            )}
                            {isCompressing && (
                                <p className="text-[9px] text-[#222944]/30 mt-1 text-center">Comprimiendo...</p>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block mb-1">Nombre *</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Nombre del autor"
                                    className={`w-full px-3 py-2 text-sm ${T.input}`}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block mb-1">Rol</label>
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
                        <label className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block mb-1">Bio</label>
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
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-funnel font-medium tracking-wider uppercase ${T.btnPrimary}`}
                        >
                            <Save className="w-3.5 h-3.5" />
                            {editing === 'new' ? 'Crear Autor' : 'Guardar Cambios'}
                        </button>
                        <button onClick={handleCancel} className={`px-4 py-2 text-xs font-funnel font-medium tracking-wider uppercase ${T.btnGhost}`}>
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
                        <div className="w-10 h-10 rounded-full border border-[#222944]/8 dark:border-[#BCC5DC]/8 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                            {author.avatar
                                ? <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                                : <User className="w-4 h-4 text-[#222944]/20 dark:text-[#BCC5DC]/40" />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#222944] dark:text-[#BCC5DC]">{author.name}</div>
                            <div className="text-[11px] text-[#222944]/40 dark:text-[#BCC5DC]/60">{author.role}</div>
                            <div className="text-[10px] text-[#222944]/25 dark:text-[#BCC5DC]/45 font-funnel">{getPostCount(author.id)} publicaciones</div>
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

                {/* Right Column: Tutorial Box */}
                <div className="space-y-6">
                    <div className="bg-[#222944]/5 dark:bg-[#BCC5DC]/5 border border-[#222944]/10 dark:border-[#BCC5DC]/10 p-5 space-y-4">
                        <h4 className="text-[11px] font-bold font-funnel uppercase tracking-widest text-[#222944] dark:text-[#BCC5DC] flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Gestión de Autores
                        </h4>
                        <div className="text-[11px] leading-relaxed text-[#222944]/60 dark:text-[#BCC5DC]/80 space-y-3 font-funnel">
                            <p><strong>1. Perfiles Públicos:</strong> Los autores que agregues aparecerán en los artículos publicados, mejorando la credibilidad.</p>
                            <p><strong>2. Avatar y Bio:</strong> Un perfil completo con foto y biografía ayuda a conectar mejor con tus lectores.</p>
                            <p><strong>3. Gestión Centralizada:</strong> Al actualizar los datos de un autor, se actualizarán automáticamente en todos los artículos pasados y futuros que haya escrito.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorsManager;
