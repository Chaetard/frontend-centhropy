# 05 — Page Templates

## 1. Directory Pages
`Newsroom.jsx`, `ImpactStudies.jsx`, and `CorporateAnnouncements.jsx` act as content aggregators.
- **Fetching**: They use `useEditorial` to filter posts by `type`.
- **Filtering**: Support for searching by title and sub-category.
- **Cards**: Display post metadata, cover images, and direct links to the article.

---

## 2. BlogPost Template
The core rendering engine for long-form content.

### Visual Architecture
- **Column-centric**: Strict 720px width for all elements (Title, Text, Media, Quotes).
- **Legibility**: Uses the `Unna` serif font for body text and `Funnel Display` for headings.
- **Reading Progress**: A fixed progress bar at the top indicates scroll depth.

### Structured Rendering
The `BlockRenderer` maps each block type from the CMS to a specific functional React component:
- **Heading 2**: Uppercase, bold, tracking-tighter.
- **Quote**: Left-border accent with italics.
- **Image**: Framed with captions, no negative margins.

### SEO Injection
Uses `react-helmet-async` to dynamically update the document `<head>`:
- **Open Graph**: Title, description, and share images.
- **Twitter Cards**: Summary Large Image format.
- **JSON-LD**: Generates a `Schema.org/Article` object with author, date, and keyword metadata for search engine indexing.

---

## 3. Terminal Core (Dashboard)
A specialized administrative view utilizing a full-width sidebar layout.
- **Theme**: "Editorial Clear" (Light theme).
- **Navigation**: Persistent left sidebar for quick access to Posts, Slots, and Authors.
