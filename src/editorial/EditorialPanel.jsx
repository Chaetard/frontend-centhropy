import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Layers, LogOut, Plus, User, BookOpen } from 'lucide-react';
import { useEditorial } from '../hooks/useEditorial';
import PostEditor from './PostEditor';
import PostsList from './components/PostsList';
import MenuSlots from './components/MenuSlots';
import AuthorsManager from './components/AuthorsManager';
import DocsManager from './components/DocsManager';
import AdminErrorBoundary from './components/AdminErrorBoundary';
import { T } from './components/SharedUI';

// ─── MAIN: EDITORIAL PANEL ─────────────────────────────────────
const EditorialPanel = () => {
    const navigate = useNavigate();
    const {
        posts, addPost, updatePost, deletePost, togglePostStatus,
        slots, setSlot,
        authors, addAuthor, updateAuthor, deleteAuthor,
        docs, addDoc, updateDoc, deleteDoc, reorderDocs
    } = useEditorial();

    const [activeTab, setActiveTab] = useState('posts');
    const [editorPost, setEditorPost] = useState(null);
    const [newAuthorRequest, setNewAuthorRequest] = useState(0); // increment to trigger
    const [newDocRequest, setNewDocRequest] = useState(0); // increment to trigger

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
            <AdminErrorBoundary>
                <PostEditor
                    initialData={editorPost === 'new' ? null : editorPost}
                    authors={authors}
                    onSave={handleSave}
                    onCancel={() => setEditorPost(null)}
                />
            </AdminErrorBoundary>
        );
    }

    const NAV_ITEMS = [
        { id: 'posts', label: 'Publicaciones', icon: FileText, count: posts.length },
        { id: 'slots', label: 'Menú Slots', icon: Layers, count: null },
        { id: 'authors', label: 'Autores', icon: User, count: authors.length },
        { id: 'docs', label: 'Documentación', icon: BookOpen, count: docs?.length || 0 },
    ];

    const TAB_HEADERS = {
        posts: 'Publicaciones',
        slots: 'Slots del Sistema',
        authors: 'Autores',
        docs: 'Gestión de Documentación',
    };

    return (
        <div className={`min-h-screen ${T.page} font-funnel flex`}>

            {/* ── SIDEBAR ── */}
            <aside className={`w-56 border-r ${T.border} flex flex-col ${T.sidebar} shrink-0`}>
                {/* Logo */}
                <div className={`h-16 px-5 flex items-center border-b ${T.border}`}>
                    <div className="text-lg font-semibold tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-none">Centhropy News</div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-0.5">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-none transition-all ${activeTab === item.id
                                ? 'bg-black text-white'
                                : 'text-[#222944]/55 dark:text-[#BCC5DC]/55 hover:bg-[#222944]/15 dark:hover:bg-[#BCC5DC]/5 hover:text-[#222944] dark:hover:text-[#BCC5DC]'
                                }`}
                        >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="flex-1 text-left tracking-wide">{item.label}</span>
                            {item.count !== null && (
                                <span className={`text-[9px] font-funnel px-1.5 py-0.5 min-w-[20px] text-center ${activeTab === item.id ? 'bg-white/20 dark:bg-[#222944]/20 text-white' : 'bg-[#222944]/8 dark:bg-[#BCC5DC]/8 text-[#222944]/40 dark:text-[#BCC5DC]/60'
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
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-[#222944]/35 dark:text-[#BCC5DC]/35 hover:text-red-500 hover:bg-red-50 transition-all"
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
                    <h2 className="text-lg font-semibold tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-none">
                        {TAB_HEADERS[activeTab]}
                    </h2>
                    <div className="flex items-center gap-2">
                        {(() => {
                            const actions = {
                                posts: { label: 'Nuevo Post', icon: Plus, onClick: () => setEditorPost('new') },
                                authors: { label: 'Nuevo Autor', icon: User, onClick: () => setNewAuthorRequest(Date.now()) },
                                docs: { label: 'Nuevo Documento', icon: BookOpen, onClick: () => setNewDocRequest(Date.now()) }
                            };
                            const act = actions[activeTab];
                            if (!act) return null;
                            const Icon = act.icon;
                            return (
                                <button
                                    onClick={act.onClick}
                                    className={`flex items-center gap-2 px-4 py-2 text-xs font-funnel font-medium tracking-wider uppercase ${T.btnPrimary}`}
                                >
                                    <Icon className="w-3.5 h-3.5" /> {act.label}
                                </button>
                            );
                        })()}
                    </div>
                </header>

                {/* Content — each tab is wrapped in its own error boundary */}
                <div className="p-8">
                    {activeTab === 'posts' && (
                        <AdminErrorBoundary>
                            <PostsList
                                posts={posts}
                                authors={authors}
                                toggleStatus={togglePostStatus}
                                onDelete={deletePost}
                                onEdit={(post) => setEditorPost(post)}
                                updatePost={updatePost}
                            />
                        </AdminErrorBoundary>
                    )}
                    {activeTab === 'slots' && (
                        <AdminErrorBoundary>
                            <MenuSlots posts={posts} slots={slots} setSlot={setSlot} />
                        </AdminErrorBoundary>
                    )}
                    {activeTab === 'authors' && (
                        <AdminErrorBoundary>
                            <AuthorsManager
                                authors={authors}
                                posts={posts}
                                addAuthor={addAuthor}
                                updateAuthor={updateAuthor}
                                deleteAuthor={deleteAuthor}
                                onRequestNew={newAuthorRequest || undefined}
                                onNewHandled={() => setNewAuthorRequest(0)}
                            />
                        </AdminErrorBoundary>
                    )}
                    {activeTab === 'docs' && (
                        <AdminErrorBoundary>
                            <DocsManager
                                docs={docs}
                                addDoc={addDoc}
                                updateDoc={updateDoc}
                                deleteDoc={deleteDoc}
                                reorderDocs={reorderDocs}
                                onRequestNew={newDocRequest || undefined}
                                onNewHandled={() => setNewDocRequest(0)}
                            />
                        </AdminErrorBoundary>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EditorialPanel;
