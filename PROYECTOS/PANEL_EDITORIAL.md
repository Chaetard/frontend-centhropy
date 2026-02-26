# Centhropy Editorial System (CES) - Documentación Técnica y Operativa

## 1. Estado Actual del Proyecto
- **Versión Actual**: v5.0 (Full Editorial Stack)
- **Estado**: Fase 1 y 2 Completadas — Blog Builder Operativo.
- **Última Actualización**: 2026-02-24
- **Ambiente**: Integrado con el Frontend de Centhropy Website.

---

## 2. Definición del Módulo (CES)
El **Centhropy Editorial System (CES)** es el motor administrativo diseñado bajo una estética "Military Tactical / Premium Minimalist" que permite la gestión dinámica del contenido en la plataforma Centhropy. A partir de v5.0, incluye un **Blog Builder completo** con editor de bloques, control SEO/GEO, y gestión de autores.

---

## 3. Arquitectura del Sistema v5.0

### A. Archivos Core
| Archivo | Rol |
|---|---|
| `src/hooks/useEditorial.js` | Motor de datos: estado, persistencia, CRUD de posts y autores, migraciones |
| `src/editorial/AdminLogin.jsx` | Punto de acceso restringido en `/terminal-x92-core` |
| `src/editorial/EditorialPanel.jsx` | Hub principal: vistas de Posts, Menú Slots y Autores |
| `src/editorial/PostEditor.jsx` | Editor de pantalla completa con 3 paneles (Metadata / Bloques / SEO) |
| `src/components/Navbar.jsx` | Consume `useEditorial` para renderizar contenido del menú en tiempo real |

### B. Flujo de Datos
```
useEditorial.js (localStorage)
       │
       ├──► EditorialPanel.jsx  → PostEditor.jsx (crear/editar posts)
       ├──► EditorialPanel.jsx  → MenuSlots (vincular posts a slots del menú)
       ├──► EditorialPanel.jsx  → AuthorsManager (CRUD de autores)
       └──► Navbar.jsx (solo lectura — renderiza contenido del menú)
```

### C. Modelo de Datos — Post (v5.0)
```js
{
  // Identidad
  id: string,
  slug: string,           // Auto-generado del título, editable
  type: 'news' | 'announcement' | 'impact_study',
  status: 'active' | 'draft' | 'inactive',

  // Metadata
  category: string,       // Subcategoría por sección
  tags: string[],         // Array de etiquetas
  authorId: string,       // Referencia a autor
  readTime: string,       // Calculado automáticamente (palabras / 200)
  date: string,           // ISO Date
  updatedAt: string,

  // Assets
  coverImage: string,     // Base64 o URL
  coverCaption: string,

  // Contenido estructurado (Blog Builder)
  content: Block[],       // Array de bloques (ver tipos abajo)
  excerpt: string,        // Resumen para listados (máx 200 chars)

  // SEO / GEO
  seo: {
    metaTitle: string,
    metaDescription: string,
    focusKeyword: string,
    canonicalUrl: string,
    ogImage: string,
    noIndex: boolean,
    geoSummary: string,       // Para LLMs (GEO)
    entityMentions: string[], // Entidades para Schema.org
  },

  // Backward compatibility (para Navbar.jsx y páginas legacy)
  image: string,          // = coverImage
  description: string,    // = excerpt
}
```

### D. Tipos de Bloques (Block Editor)
| Tipo | Campos | Descripción |
|---|---|---|
| `paragraph` | `text` | Texto de cuerpo estándar |
| `heading2` | `text` | Encabezado de sección H2 |
| `heading3` | `text` | Sub-encabezado H3 |
| `quote` | `text`, `attribution` | Blockquote editorial con atribución |
| `image` | `src`, `caption`, `align` | Imagen inline con caption (upload/URL) |
| `callout` | `text`, `variant` | Caja de insight o nota destacada |
| `list` | `items[]`, `ordered` | Lista de bullets o numerada |
| `divider` | — | Separador visual |

### E. Modelo de Datos — Autor
```js
{
  id: string,
  name: string,
  role: string,
  bio: string,
  avatar: string | null,   // Base64 o URL
  createdAt: string,
}
```

---

## 4. Funcionalidades por Versión

### v5.0 — Blog Builder (NUEVO)
- **Editor de página completa** (reemplaza el modal simple de v4)
- **Sistema de bloques**: 8 tipos de bloques para componer artículos ricos
- **Panel de Metadata** (izquierda): tipo, categoría, tags, autor, fecha, excerpt, portada, slug, estado
- **Block Editor** (centro): añadir, editar, reordenar y eliminar bloques
- **Panel SEO/GEO** (derecha): meta título/descripción con contador y análisis en tiempo real, keyword, canonical, OG image, GEO summary, entidades, noIndex
- **Gestión de Autores**: CRUD completo con avatar, nombre, rol y bio
- **Slugs automáticos**: generados del título, editables manualmente
- **Read Time automático**: calculado en base a palabras del contenido
- **3 estados de publicación**: Live (active), Draft (inactive/borrador), Off (inactive)

### v4.1 — Tactical Core (Base)
- CRUD de publicaciones con imagen de cabecera
- Control de Slots del menú (4 slots)
- Auth con localStorage

---

## 5. Guía de Interfaz (Aesthetic Rules)
- **Fondo**: Pure Black (#000000) con `bg-[#060606]` en paneles laterales
- **Bordes**: `border-white/10` a `border-white/20` — diseño quirúrgico sin ruido visual
- **Tipografía**: Font Funnel / Mono con peso **Medium**, tracking táctico
- **Estados SEO**: Verde `text-green-400` para OK, Amarillo `text-yellow-400` para advertencia
- **Micro-animaciones**: Transiciones de 150-300ms, hover states táctiles

---

## 6. Persistencia
| Key localStorage | Contenido |
|---|---|
| `ces_posts_v5` | Posts en formato v5.0 |
| `ces_posts` | Copia sync para compatibilidad con Navbar |
| `ces_slots` | Configuración de los 4 slots del menú |
| `ces_authors` | Array de autores |
| `ces_authorized` | Flag de autenticación del panel |

### Migración Automática
El hook detecta si los datos guardados son del formato legacy (v4) y los migra automáticamente al formato v5.0 sin pérdida de datos, generando slugs, excerpts y el array de `content` correcto.

---

## 7. Roadmap

### FASE 3 — Plantilla BlogPost Dinámica (Próximo)
- Reescribir `BlogPost.jsx` para consumir datos del `useEditorial`
- Renderizador de bloques para el cuerpo del artículo
- `react-helmet-async` para meta tags dinámicos en `<head>`
- Schema.org JSON-LD para GEO
- Navigación por slug (`/blog/:slug` en lugar de `/blog/:id`)
- Artículos relacionados al final del post

### FASE 4 — Conexión de Páginas de Listado
- `Newsroom.jsx` → consume `useEditorial` (filtro `type: 'news'`)
- `CorporateAnnouncements.jsx` → consume `useEditorial` (filtro `type: 'announcement'`)
- `ImpactStudies.jsx` → consume `useEditorial` (filtro `type: 'impact_study'`)
- Filtros de categoría funcionales
- Links de cards hacia `/blog/:slug`

### FASE 5 — Backend (Producción)
- Migración de `localStorage` a **Supabase** (Auth + Postgres + Storage)
- Bucket de Assets real para imágenes (en lugar de Base64)
- Roles de usuario: Admin de Sistema vs Editor de Contenido

---
**Proyecto**: Centhropy Website Core
**Última actualización por**: Antigravity AI — CES v5.0
**Rama**: `web`
