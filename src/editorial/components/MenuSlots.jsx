import React, { useMemo } from 'react';
import { FileText, AlertCircle, CheckCircle2, Layers } from 'lucide-react';
import { T } from './SharedUI';

const slotConfigs = [
    { id: 'news', label: 'Slot 01 — Noticia Principal', icon: FileText, tag: 'news' },
    { id: 'news2', label: 'Slot 02 — Noticia Secundaria', icon: FileText, tag: 'news' },
    { id: 'announcement', label: 'Slot 03 — Anuncio Corporativo', icon: AlertCircle, tag: 'announcement' },
    { id: 'impact', label: 'Slot 04 — Estudio de Impacto', icon: CheckCircle2, tag: 'impact_study' },
    { id: 'pinned', label: 'Slot 05 — Artículo Global Anclado (Header)', icon: Layers, tag: 'all' },
];

const MenuSlots = ({ posts, slots, setSlot }) => {
    const activePosts = useMemo(() => posts.filter(p => p.status === 'active'), [posts]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Slots Distribución */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#222944]/55 dark:text-[#BCC5DC]/60 mb-3 font-funnel">Distribución de Contenidos</h3>
                        <div className="space-y-4">
                            {slotConfigs.map(config => {
                                const selectedPost = posts.find(p => p.id === slots[config.id]);
                                return (
                                    <div key={config.id} className={`${T.card} border ${T.border} p-6`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <config.icon className="w-3.5 h-3.5 text-[#222944]/30 dark:text-[#BCC5DC]/50" />
                                            <span className="text-[10px] font-funnel text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest">{config.label}</span>
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
                                                <span className="text-[10px] text-emerald-600 font-funnel truncate">
                                                    Vinculado: {selectedPost.title}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Banner & Tutorial */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#222944]/55 dark:text-[#BCC5DC]/60 mb-3 font-funnel">Campaña / Banner Superior</h3>
                        <div className={`${T.card} border ${T.border} p-6 space-y-5`}>
                            {/* Active Toggle */}
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-[10px] font-funnel text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block">Mostrar Banner</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSlot('banner_active', slots.banner_active === 'true' ? 'false' : 'true')}
                                    className={`w-10 h-5 relative transition-colors shrink-0 ${slots.banner_active === 'true' ? 'bg-black dark:bg-[#BCC5DC]' : 'bg-[#222944]/10 dark:bg-[#BCC5DC]/10'}`}
                                >
                                    <span className={`absolute top-[3px] w-3.5 h-3.5 bg-white dark:bg-[#222944] border border-[#222944]/10 transition-all ${slots.banner_active === 'true' ? 'left-[22px]' : 'left-[3px]'}`} />
                                </button>
                            </div>

                            {/* Banner Text */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block mb-1">Texto del Banner</label>
                                <input
                                    value={slots.banner_text || ''}
                                    onChange={e => setSlot('banner_text', e.target.value)}
                                    placeholder="ej: ¡Nuevo lanzamiento de Unify Agent 3.0! Lee nuestro artículo"
                                    maxLength={120}
                                    className={`w-full p-2.5 text-sm ${T.input}`}
                                />
                            </div>

                            {/* Banner Link */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block mb-1">Vincular a Publicación</label>
                                <select
                                    value={slots.banner_link || ''}
                                    onChange={e => setSlot('banner_link', e.target.value)}
                                    className={`w-full p-2.5 text-sm ${T.select}`}
                                >
                                    <option value="">— Sin enlace —</option>
                                    {activePosts.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* LIVE PREVIEW */}
                            <div className="space-y-2">
                                <span className="text-[10px] text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest block">Vista Previa</span>
                                <div className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-[10px] font-funnel uppercase tracking-[0.2em] relative overflow-hidden ${
                                    slots.banner_active === 'true' && slots.banner_text
                                        ? 'bg-black text-white'
                                        : 'bg-[#222944]/5 dark:bg-[#BCC5DC]/5 text-[#222944]/25 dark:text-[#BCC5DC]/35 border border-dashed border-[#222944]/10 dark:border-[#BCC5DC]/10'
                                }`}>
                                    {slots.banner_active === 'true' && slots.banner_text ? (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                            <span className="truncate">{slots.banner_text}</span>
                                            {slots.banner_link && <span className="opacity-40 shrink-0">→</span>}
                                        </>
                                    ) : (
                                        <span>Banner inactivo</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tutorial Box */}
                    <div className="bg-[#222944]/5 dark:bg-[#BCC5DC]/5 border border-[#222944]/10 dark:border-[#BCC5DC]/10 p-5 space-y-4">
                        <h4 className="text-[11px] font-bold font-funnel uppercase tracking-widest text-[#222944] dark:text-[#BCC5DC] flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Gestión de Slots
                        </h4>
                        <div className="text-[11px] leading-relaxed text-[#222944]/60 dark:text-[#BCC5DC]/80 space-y-3 font-funnel">
                            <p><strong>1. Slots del Home:</strong> Controla qué publicaciones aparecen en las posiciones clave del portal público. Solo puedes asignar artículos que ya estén publicados.</p>
                            <p><strong>2. Banner de Campaña:</strong> Usa este banner global para avisos importantes. Se mostrará en la parte superior de todas las páginas si lo activas.</p>
                            <p><strong>3. Vínculos:</strong> Puedes enlazar el texto del banner a una publicación específica para enviar tráfico directo al leer.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuSlots;
