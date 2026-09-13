# Design Spec — Frontend Web Catalog Affiliate (KoleksiKita)

- **Document Version:** 1.0.0
- **Date:** 2026-09-13
- **Status:** Approved by User / Locked Design Specification
- **Design Source:** Google Stitch Project *Affiliate Product Catalog Website* (`14141446582926937586`)
- **PRD Reference:** `PRD — Affiliate Product Catalog MVP v1.0.md`

---

## 1. Executive Summary & Goals

Membangun frontend aplikasi web katalog afiliasi *single-owner* dengan merek **KoleksiKita**. Sistem berfokus pada pengalaman kurasi produk yang objektif, navigasi cepat, estetika modern kelas tinggi (mengadopsi 100% design system Google Stitch), serta pengalihan pengunjung ke *marketplace* (Shopee, Tokopedia, TikTok Shop) melalui tautan afiliasi.

Website ini **bukan** marketplace dan tidak memiliki keranjang belanja, checkout, maupun payment gateway. Tanggung jawab sistem berakhir saat pengunjung dialihkan ke marketplace.

---

## 2. Tech Stack & Design System Tokens

### 2.1 Technology Stack
- **Core Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS Modules for precise typography/elevation
- **Routing:** React Router v6
- **Icons:** Google Material Symbols Outlined
- **Data Persistence (Dev/Testing):** LocalStorage via Mock Storage Adapter

### 2.2 Typography Hierarchy
- **Primary Headings & Labels:** `Plus Jakarta Sans` (weights: 600, 700)
- **Body & Technical Specs:** `Inter` (weights: 400, 500, 600)
- **Tabular Figures (`tnum`):** Diaktifkan untuk seluruh angka harga Rupiah (`font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1;`).

### 2.3 Color Tokens (Google Stitch Aligned)
- **Primary Brand:** `#005C55` / `#0F766E` (Deep Emerald Teal)
- **Secondary / Hover:** `#006A61` / `#0D9488` (Bright Teal)
- **Primary Container:** `#0F766E` | On-Primary-Container: `#A3FAEF`
- **Surface Canvas:** `#F8F9FF` / `#F8FAFC`
- **Surface Level 1 (Card/Panel):** `#FFFFFF`
- **Surface Muted / Stripes:** `#EFF4FF` / `#F1F5F9`
- **Borders & Dividers:** `#E2E8F0`
- **Text Primary:** `#0B1C30` / `#0F172A`
- **Text Muted:** `#3E4947` / `#64748B`

### 2.4 Marketplace Accent Tokens
- **Shopee Outbound CTA:** `#EE4D2D`
- **Tokopedia Outbound CTA:** `#03AC0E`
- **TikTok Shop CTA:** `#111827`

### 2.5 Responsive Breakpoints & Grid
- **Mobile (< 640px):** 4-column layout, 12px gutter, 16px margin. Product grid: 2 kolom compact.
- **Tablet (640px - 1024px):** 8-column layout, 20px gutter, 24px margin. Product grid: 2-3 kolom.
- **Desktop (≥ 1024px):** 12-column layout max `1280px`, 24px gutter, 32px margin. Product grid: 3-4 kolom.

---

## 3. Directory Structure (API-Ready Architecture)

Sesuai arahan PRD Bagian 56 dan koreksi pengguna:
```text
src/
├── api/
│   ├── apiClient.js          # Unified abstraction layer (Switches between Mock & REST)
│   ├── productApi.js         # Domain API untuk Produk
│   ├── categoryApi.js        # Domain API untuk Kategori
│   ├── authApi.js            # Domain API untuk Autentikasi Admin
│   ├── mockData.js           # Seed data awal (realistis, tanpa token rahasia)
│   └── mockStorage.js        # LocalStorage wrapper & simulator HTTP latency/errors
├── components/
│   ├── common/
│   │   ├── Button.jsx        # Pill & rounded button variants (Primary, Secondary, Marketplace)
│   │   ├── Badge.jsx         # Status badge (ACTIVE/INACTIVE), Category badge, Discount badge
│   │   ├── Modal.jsx         # Accessible modal dialog with backdrop
│   │   ├── Input.jsx         # Standard text input, search input, textarea with validation styles
│   │   ├── Toast.jsx         # Flash feedback notification
│   │   ├── Skeleton.jsx      # Shimmer loading cards & tables
│   │   └── EmptyState.jsx    # Visual fallback when search/list is empty
│   ├── layout/
│   │   ├── PublicHeader.jsx  # Desktop & mobile top navigation bar with search & logo
│   │   ├── PublicFooter.jsx  # Footer with Affiliate Disclosure & quick links
│   │   ├── MobileBottomNav.jsx # Bottom navigation for mobile viewports
│   │   ├── StickyAffiliateBar.jsx # Pinned mobile bottom bar for product detail
│   │   ├── AdminLayout.jsx   # Shell with Admin Sidebar & Topbar
│   │   ├── AdminSidebar.jsx  # Desktop sidebar navigation
│   │   └── DevToolbar.jsx    # Dev-only floating badge to Reset Mock Data
│   ├── catalog/
│   │   ├── ProductCard.jsx   # Rich responsive card (1:1 image, hover zoom, dual CTA)
│   │   ├── CategoryPills.jsx # Interactive horizontal filter pills
│   │   ├── FilterSidebar.jsx # Desktop sticky filter panel (Categories, Sort, Price)
│   │   ├── FilterDrawer.jsx  # Mobile slide-up sheet filter
│   │   ├── SearchBar.jsx     # Debounced search bar with clear button
│   │   └── Pagination.jsx    # Paginated navigation controls
│   └── admin/
│       ├── StatCard.jsx      # Metric summary cards (Total, Active, Inactive, Categories)
│       ├── ProductTable.jsx  # Desktop table + Mobile card list for products
│       ├── CategoryTable.jsx # Desktop table + Mobile card list for categories
│       ├── ProductFormModal.jsx # Add/Edit product form with live preview & auto-slug
│       ├── CategoryFormModal.jsx # Add/Edit category form
│       └── DeleteConfirmModal.jsx # Confirmation dialog with dependency warning
├── context/
│   ├── AuthContext.jsx       # Admin session & login/logout state
│   └── ToastContext.jsx      # Global toast notification dispatch
├── hooks/
│   ├── useProducts.js        # SWR-like data fetching for products list & filters
│   ├── useCategories.js      # Data fetching for categories list
│   ├── useDebounce.js        # Debounce hook for search input (350ms)
│   └── useMediaQuery.js      # Viewport detection helper
├── pages/
│   ├── public/
│   │   ├── HomePage.jsx          # Hero, Category chips, Featured Products, How it works
│   │   ├── CatalogPage.jsx       # Search, Filter Sidebar/Drawer, Product Grid, Pagination
│   │   ├── ProductDetailPage.jsx # Gallery, Specs Table, Marketplace CTAs, Sticky Bar
│   │   └── NotFoundPage.jsx      # 404 handler
│   └── admin/
│       ├── AdminLoginPage.jsx    # Login card with credentials helper
│       ├── AdminDashboardPage.jsx# Stats summary & recent items
│       ├── AdminProductsPage.jsx # Full product CRUD management
│       └── AdminCategoriesPage.jsx# Category CRUD & safe-delete enforcement
├── styles/
│   └── index.css             # Tailwind base/components/utilities & custom tokens
├── App.jsx                   # React Router route tree
└── main.jsx
```

---

## 4. Data Models & Validation Rules

### 4.1 Product Model
```typescript
interface Product {
  id: string;                  // e.g. "prod-1"
  name: string;                // max 150 chars, required
  slug: string;                // url-safe lowercase, unique, auto-generated
  category_id: string;         // foreign key to Category, required
  category_name: string;       // populated name for fast display
  description: string;         // curator review & overview, plain text
  price: number;               // IDR, >= 0, required
  original_price?: number;     // optional for strike-through discount calculation
  image: string;               // valid image URL, required
  affiliate_url: string;       // valid HTTPS URL, required
  is_featured: boolean;        // boolean flag for homepage showcase
  status: 'ACTIVE' | 'INACTIVE'; // default 'ACTIVE'
  specs?: Record<string, string>; // e.g. {"Koneksi": "Bluetooth 5.2", "Garansi": "1 Tahun"}
  marketplace_type?: 'shopee' | 'tokopedia' | 'tiktok' | 'generic'; // for button branding
  created_at: string;          // ISO timestamp
  updated_at: string;          // ISO timestamp
}
```

### 4.2 Category Model
```typescript
interface Category {
  id: string;                  // e.g. "cat-1"
  name: string;                // max 50 chars, required
  slug: string;                // url-safe lowercase, unique
  description: string;         // short summary
  status: 'ACTIVE' | 'INACTIVE';
  product_count: number;       // computed count of linked products
  created_at: string;
  updated_at: string;
}
```

### 4.3 Query Parameter Allowlist (Security & Anti-Abuse)
- `search`: string, max 100 characters.
- `category`: category slug string.
- `sort`: STRICT ALLOWLIST:
  - `newest` (default)
  - `price_asc`
  - `price_desc`
  *(Arbitrary database column names are explicitly rejected).*
- `page`: integer >= 1.
- `limit` / `per_page`: integer between 1 and 50 (default: 6 for mobile/demo, 12 for desktop).
- `featured`: boolean string (`"true"` | `"false"`).

---

## 5. API Client & Mock Simulation Layer

### 5.1 Architecture Flow
```text
UI Component
     ↓
productApi / categoryApi / authApi
     ↓
apiClient.js
     ↓
[ MOCK via mockStorage.js ]  (Aktif saat ini)
[ REST via Fetch / Axios ]    (Tinggal ganti adapter saat BE siap)
```

### 5.2 Simulating Backend Behaviors
Mock adapter di `mockStorage.js` meniru perilaku riil REST API backend:
1. **Network Latency:** Delay artifisial 200–350ms untuk menguji state `isLoading` dan skeleton loading.
2. **Standard Response Envelope:**
   ```json
   {
     "success": true,
     "data": { ... },
     "message": null
   }
   ```
3. **Standard Error Envelope:**
   ```json
   {
     "success": false,
     "data": null,
     "message": "Deskripsi kesalahan",
     "errors": { "field": ["detail"] }
   }
   ```
4. **Status Mutation (Koreksi Pengguna #1):**
   Status produk tidak menggunakan endpoint toggle terpisah, melainkan:
   `updateProduct(id, { status: 'ACTIVE' | 'INACTIVE' })`
5. **Category Delete Dependency Check (Koreksi Pengguna #2):**
   Saat `deleteCategory(id)` dipanggil:
   - Jika masih ada produk dengan `category_id == id`:
     Mengembalikan status simulated HTTP 409 (Conflict):
     `{ success: false, message: "Kategori masih digunakan oleh 3 produk. Pindahkan atau hapus produk terkait terlebih dahulu." }`
   - Jika 0 produk: berhasil dihapus.
6. **Mock Seed Outbound Links (Koreksi Pengguna #3):**
   Menggunakan URL simulasi afiliasi yang aman dan tidak memuat token rahasia pribadi:
   Contoh: `https://shopee.co.id/search?keyword=Sony%20WH-1000XM5` atau `https://www.tokopedia.com/search?q=Keychron%20K2`.
7. **Reset Mock Data Toolbar (Koreksi Pengguna #4):**
   Diletakkan pada komponen `DevToolbar.jsx` (floating icon di sudut layar bawah dengan label DEV MODE) dan tombol di Admin Settings. Ini tidak akan memengaruhi kontrak backend API di production.

---

## 6. Page Specifications & Screens Mapping

| Halaman | Desktop Route | Stitch Screen Reference | Mobile Route / Element |
|---|---|---|---|
| **Beranda** | `/` | `85dab60a4c184cecb16b4eaa849ebb35` (Desktop) | `b2a8129e620d4e4aa41dda4d2ddfeca5` (Mobile) |
| **Katalog Produk** | `/catalog` | `63fd442926e94cec8802c59b34c0aeb7` (Desktop) | `17a1eb2b5fad45a09d48dcdca673b4b4` (Mobile) |
| **Detail Produk** | `/product/:slug` | `04e4655a53194901b61550b3fab9b1a1` (Desktop) | `0a516ce1bf5b4c9fa38783944b259032` (Mobile + Sticky Bar) |
| **Admin Login** | `/admin/login` | PRD Section 11 & 19 | Responsive card |
| **Admin Dashboard** | `/admin` | `0347ea00f2f04421820e0cd00928282d` (Desktop) | `11cf555a080d4276b4324062764ba25a` (Mobile) |
| **Admin Produk** | `/admin/products` | `0347ea00f2f04421820e0cd00928282d` & `022b6d83a65f4a46a61a0d28836b18bc` | `5e6197f3e5704686819e552e4bd9574b` (Mobile) |
| **Admin Kategori** | `/admin/categories` | `06e008c4b558482eb647910988150ab8` (Desktop) | `d5ea28fb626f4a42a84959000c25840b` (Mobile) |

---

## 7. Plan for FE_HANDOFF.md (Contract to Backend)

Setelah seluruh implementasi frontend diuji dan diverifikasi, kita akan membuat dokumen `FE_HANDOFF.md` di root proyek yang mencakup 15 poin lengkap sesuai kesepakatan:
1. Overview & Directory Structure
2. Required REST API Endpoints List (Public & Admin API)
3. Expected Request Payloads
4. Expected Response Format & Standard Envelopes
5. HTTP Status Codes Guidelines (200, 201, 400, 401, 403, 404, 409, 422, 500)
6. Data Dictionary & Field Validations
7. Authentication & Token Header (`Authorization: Bearer <token>`)
8. Endpoint-to-UI Mapping (Rute mana memanggil endpoint apa)
9. Query Parameter Allowlist (`search`, `category`, `sort`, `page`, `per_page`)
10. Pagination Contract (`page`, `per_page`, `total`, `total_pages`)
11. Authentication State Behavior & Protected Routes
12. Loading, Empty, and Error States in UI
13. Mock vs Production Differences
14. Security Assumptions (Frontend bukan security layer; backend tetap wajib sanitasi & otorisasi)
15. Known Limitations & Backend Decisions Required (CORS, Rate limit, Image upload storage)

---

## 8. Verification Strategy

1. **Visual Testing:** Memeriksa keselarasan setiap halaman terhadap screen Google Stitch (warna, tipografi `Plus Jakarta Sans`, border radius, spacing, badge marketplace).
2. **Responsiveness:** Memverifikasi tampilan pada breakpoint Mobile (390px iPhone), Tablet (768px iPad), dan Desktop (1280px+).
3. **Flow Testing:**
   - Pencarian produk dan filtering kategori.
   - Klik kartu produk menuju detail produk dan klik tombol outbound ke tab baru.
   - Login admin menggunakan demo credentials.
   - Tambah produk baru (auto-slug, validasi field wajib, live image preview).
   - Edit produk dan toggle status (ACTIVE / INACTIVE) lewat `updateProduct()`.
   - Hapus kategori dengan proteksi (verifikasi pemblokiran 409 jika kategori masih berisi produk).
   - Uji tombol Reset Data di dev toolbar.
4. **Code Quality & Build:** Memastikan build `npm run build` berhasil tanpa error linter / TypeScript / syntax issues.
