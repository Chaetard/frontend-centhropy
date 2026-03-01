import { useState, useEffect } from 'react';

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

export const generateSlug = (title) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

export const calculateReadTime = (content) => {
    if (!Array.isArray(content) || content.length === 0) return '1 min read';
    let wordCount = 0;
    content.forEach(block => {
        if (block.text) wordCount += block.text.trim().split(/\s+/).filter(Boolean).length;
        if (block.attribution) wordCount += block.attribution.trim().split(/\s+/).filter(Boolean).length;
        if (block.items && Array.isArray(block.items)) {
            wordCount += block.items.join(' ').trim().split(/\s+/).filter(Boolean).length;
        }
    });
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
};

export const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ─────────────────────────────────────────────
// INITIAL DATA: AUTHORS
// ─────────────────────────────────────────────

const INITIAL_AUTHORS = [
    {
        id: 'author_ce_1',
        name: 'Centhropy Engineering',
        role: 'Engineering Team',
        bio: 'El equipo de ingeniería de Centhropy, especialistas en data intelligence, AI y arquitecturas de datos globales.',
        avatar: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 'author_ce_2',
        name: 'Centhropy Strategy',
        role: 'Strategic Intelligence',
        bio: 'División de inteligencia estratégica de Centhropy. Análisis, visión de mercado y liderazgo de pensamiento.',
        avatar: null,
        createdAt: new Date().toISOString()
    }
];

// ─────────────────────────────────────────────
// MIGRATION: Old post format → New format
// ─────────────────────────────────────────────

const migratePost = (post) => {
    // Already migrated if `content` array exists
    if (Array.isArray(post.content)) return post;

    const slug = generateSlug(post.title);
    const descriptionBlock = post.description
        ? [{ id: generateId(), type: 'paragraph', text: post.description }]
        : [];

    return {
        ...post,
        slug: slug || post.id,
        category: post.type === 'news'
            ? 'Blog'
            : post.type === 'announcement'
                ? 'Estructura Organizativa'
                : 'Retail Intelligence',
        tags: [],
        authorId: 'author_ce_1',
        readTime: '3 min read',
        coverImage: post.image || '',
        coverCaption: '',
        excerpt: post.description || '',
        content: descriptionBlock,
        seo: {
            metaTitle: post.title || '',
            metaDescription: post.description || '',
            focusKeyword: '',
            canonicalUrl: '',
            ogImage: post.image || '',
            noIndex: false,
            geoSummary: '',
            entityMentions: [],
        },
        // keep legacy fields for backward compat with existing public pages
        image: post.image || '',
        description: post.description || '',
    };
};

// ─────────────────────────────────────────────
// INITIAL DATA: POSTS (v5 format)
// ─────────────────────────────────────────────

const INITIAL_POSTS = [
    // --- NEWS / BLOG ---
    {
        id: '1',
        slug: 'blockchain-integration-supply-chain',
        type: 'news',
        category: 'Blog',
        title: 'Blockchain Integration in Supply Chain',
        excerpt: 'Exploring how blockchain is revolutionizing transparency in global logistics.',
        description: 'Exploring how blockchain is revolutionizing transparency in global logistics.',
        tags: ['Blockchain', 'Supply Chain', 'Datos'],
        authorId: 'author_ce_1',
        readTime: '3 min read',
        coverImage: 'https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date().toISOString()
    },
    {
        id: '4',
        slug: 'ai-governance-ethics-2026',
        type: 'news',
        category: 'Liderazgo de pensamiento',
        title: 'AI Governance and Ethics in 2026',
        excerpt: 'New frameworks for responsible AI deployment are being adopted worldwide.',
        description: 'New frameworks for responsible AI deployment are being adopted worldwide.',
        tags: ['AI', 'Governance', 'Ética'],
        authorId: 'author_ce_2',
        readTime: '3 min read',
        coverImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: '5',
        slug: 'future-of-autonomous-data',
        type: 'news',
        category: 'Tecnología',
        title: 'The Future of Autonomous Data Intelligence',
        excerpt: 'How self-correcting data pipelines are changing the landscape of enterprise AI.',
        description: 'How self-correcting data pipelines are changing the landscape of enterprise AI.',
        tags: ['Data', 'AI', 'Automation'],
        authorId: 'author_ce_1',
        readTime: '5 min read',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: '6',
        slug: 'unify-agent-capabilities',
        type: 'news',
        category: 'Producto',
        title: 'Deep Dive: Unify Agent 3.0 Capabilities',
        excerpt: 'An inside look at the cognitive architecture of our most advanced data assistant.',
        description: 'An inside look at the cognitive architecture of our most advanced data assistant.',
        tags: ['Unify', 'Agent', 'Product'],
        authorId: 'author_ce_1',
        readTime: '4 min read',
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 259200000).toISOString()
    },

    // --- ANNOUNCEMENTS ---
    {
        id: '2',
        slug: 'new-strategic-partnership-tech-giants',
        type: 'announcement',
        category: 'Alianzas Estratégicas',
        title: 'New Strategic Partnership with Tech Giants',
        excerpt: 'Centhropy announces a major collaboration to scale AI infrastructure.',
        description: 'Centhropy announces a major collaboration to scale AI infrastructure.',
        tags: ['Alianza', 'AI', 'Estrategia'],
        authorId: 'author_ce_2',
        readTime: '2 min read',
        coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date().toISOString()
    },
    {
        id: '7',
        slug: 'expansion-into-european-market',
        type: 'announcement',
        category: 'Estructura Organizativa',
        title: 'Expansion into the European Market',
        excerpt: 'Centhropy opens new data center hubs in Berlin and Madrid.',
        description: 'Centhropy opens new data center hubs in Berlin and Madrid.',
        tags: ['Expansión', 'Global', 'Infraestructura'],
        authorId: 'author_ce_1',
        readTime: '2 min read',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 432000000).toISOString()
    },
    {
        id: '8',
        slug: 'sustainability-report-2025',
        type: 'announcement',
        category: 'Gobierno Corporativo',
        title: '2025 Sustainability & Impact Report',
        excerpt: 'Our commitment to carbon-neutral data processing and ethical computing.',
        description: 'Our commitment to carbon-neutral data processing and ethical computing.',
        tags: ['Sustainability', 'ESG', 'Ethics'],
        authorId: 'author_ce_2',
        readTime: '3 min read',
        coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 604800000).toISOString()
    },
    {
        id: '9',
        slug: 'appointment-new-cto',
        type: 'announcement',
        category: 'Nombramientos',
        title: 'Centhropy Appoints New Chief Technology Officer',
        excerpt: 'Renowned AI researcher joins our leadership team to drive innovation.',
        description: 'Renowned AI researcher joins our leadership team to drive innovation.',
        tags: ['Leadership', 'CTO', 'Talent'],
        authorId: 'author_ce_2',
        readTime: '2 min read',
        coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 864000000).toISOString()
    },

    // --- IMPACT STUDIES ---
    {
        id: '3',
        slug: 'retail-transformation-case-study',
        type: 'impact_study',
        category: 'Retail Intelligence',
        title: 'Retail Transformation Case Study',
        excerpt: 'How our data solutions increased efficiency by 40% for a leading retailer.',
        description: 'How our data solutions increased efficiency by 40% for a leading retailer.',
        tags: ['Retail', 'Case Study', 'Data'],
        authorId: 'author_ce_1',
        readTime: '4 min read',
        coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date().toISOString()
    },
    {
        id: '10',
        slug: 'autonomous-logistics-optimization',
        type: 'impact_study',
        category: 'Logística',
        title: 'Autonomous Logistics Optimization',
        excerpt: 'Reducing transit times by 25% using real-time predictive analytics.',
        description: 'Reducing transit times by 25% using real-time predictive analytics.',
        tags: ['Logistics', 'Predictive', 'Impact'],
        authorId: 'author_ce_1',
        readTime: '5 min read',
        coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 1209600000).toISOString()
    },
    {
        id: '11',
        slug: 'fintech-security-scaling',
        type: 'impact_study',
        category: 'Fintech',
        title: 'Scaling Security for Next-Gen Fintech',
        excerpt: 'Zero-trust architecture for high-frequency financial data processing.',
        description: 'Zero-trust architecture for high-frequency financial data processing.',
        tags: ['Security', 'Fintech', 'Scale'],
        authorId: 'author_ce_1',
        readTime: '6 min read',
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 1555200000).toISOString()
    },
    {
        id: '12',
        slug: 'predictive-maintenance-industrial',
        type: 'impact_study',
        category: 'Industrial',
        title: 'Predictive Maintenance in Heavy Industry',
        excerpt: 'Preventing downtime worth millions through loT data integration.',
        description: 'Preventing downtime worth millions through loT data integration.',
        tags: ['IoT', 'Industry', 'Analytics'],
        authorId: 'author_ce_1',
        readTime: '4 min read',
        coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        date: new Date(Date.now() - 1814400000).toISOString()
    }
];

const INITIAL_SLOTS = {
    news: '1',
    news2: '4',
    announcement: '2',
    impact: '3'
};

// ─────────────────────────────────────────────
// HOOK: useEditorial
// ─────────────────────────────────────────────

export const useEditorial = () => {

    // ── POSTS ──────────────────────────────────
    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem('ces_posts_v11');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.map(migratePost);
        }
        return INITIAL_POSTS;
    });

    // ── SLOTS ──────────────────────────────────
    const [slots, setSlots] = useState(() => {
        const saved = localStorage.getItem('ces_slots');
        return saved ? JSON.parse(saved) : INITIAL_SLOTS;
    });

    // ── AUTHORS ────────────────────────────────
    const [authors, setAuthors] = useState(() => {
        const saved = localStorage.getItem('ces_authors');
        return saved ? JSON.parse(saved) : INITIAL_AUTHORS;
    });

    // ── PERSISTENCE ────────────────────────────
    useEffect(() => {
        localStorage.setItem('ces_posts_v11', JSON.stringify(posts));
        // Keep legacy sync for current public pages' safety
        localStorage.setItem('ces_posts', JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        localStorage.setItem('ces_slots', JSON.stringify(slots));
    }, [slots]);

    useEffect(() => {
        localStorage.setItem('ces_authors', JSON.stringify(authors));
    }, [authors]);

    // ── POST OPERATIONS ───────────────────────

    const addPost = (postData) => {
        const slug = generateSlug(postData.title);
        const safeContent = Array.isArray(postData.content) ? postData.content : [];
        const newPost = {
            ...postData,
            id: generateId(),
            slug: slug || generateId(),
            date: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: postData.status || 'active',
            readTime: calculateReadTime(safeContent),
            // backward compat fields
            image: postData.coverImage || '',
            description: postData.excerpt || '',
        };
        setPosts(prev => [newPost, ...prev]);
        return newPost;
    };

    const updatePost = (id, updates) => {
        setPosts(prev => prev.map(p => {
            if (p.id !== id) return p;
            const safeContent = Array.isArray(updates.content) ? updates.content : p.content;
            const merged = {
                ...p,
                ...updates,
                updatedAt: new Date().toISOString(),
                readTime: calculateReadTime(safeContent),
                // keep backward compat in sync
                image: updates.coverImage ?? p.coverImage ?? p.image ?? '',
                description: updates.excerpt ?? p.excerpt ?? p.description ?? '',
            };
            // Auto-update slug if title changed
            if (updates.title && updates.title !== p.title) {
                merged.slug = generateSlug(updates.title) || merged.slug;
            }
            return merged;
        }));
    };

    const deletePost = (id) => {
        setPosts(prev => prev.filter(p => p.id !== id));
        // Clear from any slot
        const newSlots = { ...slots };
        let changed = false;
        Object.keys(newSlots).forEach(key => {
            if (newSlots[key] === id) { newSlots[key] = null; changed = true; }
        });
        if (changed) setSlots(newSlots);
    };

    const togglePostStatus = (id) => {
        setPosts(prev => prev.map(p =>
            p.id === id
                ? { ...p, status: p.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString() }
                : p
        ));
    };

    // ── SLOT OPERATIONS ───────────────────────

    const setSlot = (slotName, postId) => {
        setSlots(prev => ({ ...prev, [slotName]: postId }));
    };

    // ── AUTHOR OPERATIONS ─────────────────────

    const addAuthor = (authorData) => {
        const newAuthor = {
            ...authorData,
            id: `author_${generateId()}`,
            createdAt: new Date().toISOString()
        };
        setAuthors(prev => [...prev, newAuthor]);
        return newAuthor;
    };

    const updateAuthor = (id, updates) => {
        setAuthors(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const deleteAuthor = (id) => {
        // Don't allow deleting the last author
        if (authors.length <= 1) return;
        // Use a single setAuthors call that returns the updated list,
        // then derive `remaining` inside setPosts to avoid stale closure.
        let updatedAuthors;
        setAuthors(prev => {
            updatedAuthors = prev.filter(a => a.id !== id);
            return updatedAuthors;
        });
        // Reassign posts from deleted author to first remaining author.
        // We compute `remaining` fresh inside the posts updater to guarantee
        // it reflects the latest author list, not the closure snapshot.
        setPosts(prev => prev.map(p => {
            if (p.authorId !== id) return p;
            const remaining = (updatedAuthors ?? authors.filter(a => a.id !== id));
            return remaining.length > 0 ? { ...p, authorId: remaining[0].id } : p;
        }));
    };

    // ── QUERY HELPERS ─────────────────────────

    const getPostBySlug = (slug) => posts.find(p => p.slug === slug && p.status === 'active');
    const getPostById = (id) => posts.find(p => p.id === id);
    const getPostsByType = (type) => posts.filter(p => p.type === type && p.status === 'active');
    const getAuthorById = (id) => authors.find(a => a.id === id);

    return {
        // Posts
        posts,
        addPost,
        updatePost,
        deletePost,
        togglePostStatus,
        // Slots
        slots,
        setSlot,
        // Authors
        authors,
        addAuthor,
        updateAuthor,
        deleteAuthor,
        // Queries
        getPostBySlug,
        getPostById,
        getPostsByType,
        getAuthorById,
    };
};
