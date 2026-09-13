# Affiliate Catalog Frontend (KoleksiKita) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive frontend web application for the KoleksiKita affiliate product catalog based on PRD MVP v1.0 and Google Stitch project `14141446582926937586`, featuring public pages (desktop & mobile), an API-ready mock service layer with LocalStorage, single-owner admin CRUD workflows, and the official `FE_HANDOFF.md` backend contract document.

**Architecture:** Unified React component architecture using Vite, Tailwind CSS, and React Router v6. Data flows strictly through `src/api/` via `apiClient.js` (swappable between Mock and REST), simulating realistic network latency, error status codes (401, 404, 409 Conflict, 422), and response envelopes.

**Tech Stack:** React 19, Vite, Tailwind CSS, React Router DOM v6, Google Material Symbols Outlined, Plus Jakarta Sans & Inter fonts.

**Spec:** [2026-09-13-affiliate-catalog-frontend-design.md](file:///d:/web%20catalog%20affiliate/docs/superpowers/specs/2026-09-13-affiliate-catalog-frontend-design.md)

## Global Constraints

- Strict adherence to Google Stitch design theme: Primary `#005C55` / `#0F766E`, Secondary `#006A61` / `#0D9488`, Surface `#F8F9FF`, Slate text, and marketplace accents (Shopee `#EE4D2D`, Tokopedia `#03AC0E`, TikTok Shop `#111827`).
- All numeric price displays must use tabular figures (`font-variant-numeric: tabular-nums`).
- Strict sorting allowlist: `newest`, `price_asc`, `price_desc`.
- Product status mutations must use `updateProduct(id, { status })` (no separate toggle endpoint).
- Category deletion must simulate backend 409 Conflict error when assigned products exist.
- Outbound marketplace affiliate links must use safe demonstration URLs without private tokens.
- Dev-only Reset Mock Data toolbar must be isolated to development mode (`DevToolbar.jsx`).
- Produce comprehensive `FE_HANDOFF.md` in workspace root covering all 15 required sections upon completion.

---

### Task 1: Project Scaffolding & Design Tokens Setup

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- Create: `src/main.jsx`, `src/App.jsx`, `src/styles/index.css`

**Interfaces:**
- Consumes: None
- Produces: Working React + Vite development environment with Stitch design tokens and fonts configured.

- [ ] **Step 1: Initialize Vite React application with Tailwind CSS and dependencies**
  - Run `npm init -y` or setup `package.json` with `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `postcss`, `autoprefixer`.
  - Install dependencies via npm.
- [ ] **Step 2: Configure `index.html` with Google Fonts**
  - Load `Plus Jakarta Sans` (600, 700), `Inter` (400, 500, 600), and `Material Symbols Outlined`.
- [ ] **Step 3: Configure Tailwind CSS tokens in `tailwind.config.js` and `src/styles/index.css`**
  - Add primary, secondary, surface, container, marketplace colors, font families, and custom utility classes for tabular nums (`.tnum`).
- [ ] **Step 4: Verify dev server and build**
  - Run `npm run build` to confirm zero compilation errors.
- [ ] **Step 5: Commit changes**
  - `git add . && git commit -m "feat: scaffold vite react app with stitch design tokens"`

---

### Task 2: Data Models, Seed Mock Data & API Client Layer

**Files:**
- Create: `src/api/mockData.js`
- Create: `src/api/mockStorage.js`
- Create: `src/api/apiClient.js`
- Create: `src/api/productApi.js`
- Create: `src/api/categoryApi.js`
- Create: `src/api/authApi.js`

**Interfaces:**
- Consumes: None
- Produces:
  - `productApi`: `getProducts(params)`, `getProductBySlug(slug)`, `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`
  - `categoryApi`: `getCategories(params)`, `getCategoryBySlug(slug)`, `createCategory(data)`, `updateCategory(id, data)`, `deleteCategory(id)`
  - `authApi`: `login(credentials)`, `logout()`, `getMe()`
  - `mockStorage.resetToDefault()`

- [ ] **Step 1: Create `src/api/mockData.js`**
  - Add realistic categories ("Audio & Headphone", "Setup Meja Kerja", "Perlengkapan Kerja", "Peralatan Dapur", "Gaya Hidup", "Aksesoris Gadget").
  - Add 6-8 curated products matching Stitch screens (Sony WH-1000XM5, Keychron K2 Pro, Pexio Regent Chair, Philips Airfryer XL, Stanley Quencher, Anker GaN Charger) with realistic specs, high-res images, and safe affiliate URLs.
- [ ] **Step 2: Create `src/api/mockStorage.js`**
  - Implement LocalStorage persistence with fallback to initial seed data.
  - Implement simulated network latency (250ms).
  - Implement query filtering: search (name & desc), category slug, sorting allowlist (`newest`, `price_asc`, `price_desc`), and pagination.
  - Implement 409 Conflict validation when deleting a category with associated products.
  - Implement reset helper `resetToDefault()`.
- [ ] **Step 3: Create `src/api/apiClient.js`**
  - Implement standard response envelopes `{ success: true, data, message }` and `{ success: false, data: null, message, errors }`.
- [ ] **Step 4: Create `productApi.js`, `categoryApi.js`, and `authApi.js`**
  - Expose domain methods delegating to `apiClient`.
- [ ] **Step 5: Test API service functions**
  - Create a test verification script or run an in-browser verification test to confirm CRUD, search, sorting, and category delete rejection work as specified.
- [ ] **Step 6: Commit changes**
  - `git commit -m "feat: add api client, mock storage, and domain apis with 409 conflict simulation"`

---

### Task 3: Common UI Components & State Contexts

**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `src/context/ToastContext.jsx`
- Create: `src/components/common/Button.jsx`
- Create: `src/components/common/Badge.jsx`
- Create: `src/components/common/Input.jsx`
- Create: `src/components/common/Modal.jsx`
- Create: `src/components/common/Toast.jsx`
- Create: `src/components/common/Skeleton.jsx`
- Create: `src/components/common/EmptyState.jsx`
- Create: `src/components/layout/DevToolbar.jsx`

**Interfaces:**
- Consumes: `authApi`, `mockStorage`
- Produces: Reusable atom components, `useAuth()`, `useToast()`, and dev reset toolbar.

- [ ] **Step 1: Implement `ToastContext.jsx` and `Toast.jsx`**
  - Provide `showToast(message, type)` with auto-dismiss (success, error, info).
- [ ] **Step 2: Implement `AuthContext.jsx`**
  - Provide `user`, `token`, `login({ email, password })`, `logout()`, `isAuthenticated`.
- [ ] **Step 3: Build Atom UI Components**
  - `Button.jsx`: Primary teal, Secondary, Outline, and Marketplace variants (Shopee `#EE4D2D`, Tokopedia `#03AC0E`).
  - `Badge.jsx`: Status (ACTIVE/INACTIVE), Category chip, and Discount percentage pill.
  - `Input.jsx`: Styled input, textarea, and select box with focus ring and error states.
  - `Modal.jsx`: Accessible modal dialog with backdrop blur.
  - `Skeleton.jsx`: Shimmer card and table placeholders.
  - `EmptyState.jsx`: Friendly empty illustration/icon with title, description, and action button.
- [ ] **Step 4: Build `DevToolbar.jsx`**
  - Floating pill at bottom-right in dev mode with "Reset Mock Data" button calling `mockStorage.resetToDefault()` and showing toast.
- [ ] **Step 5: Commit changes**
  - `git commit -m "feat: implement common ui components, contexts, and dev toolbar"`

---

### Task 4: Layout & Navigation Shells

**Files:**
- Create: `src/components/layout/PublicHeader.jsx`
- Create: `src/components/layout/PublicFooter.jsx`
- Create: `src/components/layout/MobileBottomNav.jsx`
- Create: `src/components/layout/PublicLayout.jsx`
- Create: `src/components/layout/AdminHeader.jsx`
- Create: `src/components/layout/AdminSidebar.jsx`
- Create: `src/components/layout/AdminLayout.jsx`

**Interfaces:**
- Consumes: `useAuth()`, `Button`, `Logo`
- Produces: `PublicLayout` and `AdminLayout` wrappers with responsive navigation.

- [ ] **Step 1: Implement `PublicHeader.jsx`**
  - Brand logo with KoleksiKita mark, navigation links (Beranda, Katalog, Rekomendasi, Tentang), quick search input, and admin login entry.
  - Mobile hamburger menu for quick access.
- [ ] **Step 2: Implement `PublicFooter.jsx`**
  - Brand section, navigation links, copyright, and official **Affiliate Disclosure** block (PRD Section 10).
- [ ] **Step 3: Implement `MobileBottomNav.jsx`**
  - Pinned bottom bar on mobile (<640px) with icons for Home, Catalog, Categories, and Admin.
- [ ] **Step 4: Implement `AdminSidebar.jsx` & `AdminHeader.jsx` in `AdminLayout.jsx`**
  - Desktop left sidebar (Dashboard, Products, Categories, Logout) + Mobile drawer toggle, with user info and active route indicator.
- [ ] **Step 5: Commit changes**
  - `git commit -m "feat: implement responsive public and admin layouts"`

---

### Task 5: Public Pages (Beranda, Katalog, Detail Produk)

**Files:**
- Create: `src/components/catalog/ProductCard.jsx`
- Create: `src/components/catalog/CategoryPills.jsx`
- Create: `src/components/catalog/FilterSidebar.jsx`
- Create: `src/components/catalog/FilterDrawer.jsx`
- Create: `src/components/catalog/SearchBar.jsx`
- Create: `src/components/catalog/Pagination.jsx`
- Create: `src/components/catalog/StickyAffiliateBar.jsx`
- Create: `src/pages/public/HomePage.jsx`
- Create: `src/pages/public/CatalogPage.jsx`
- Create: `src/pages/public/ProductDetailPage.jsx`
- Create: `src/pages/public/NotFoundPage.jsx`

**Interfaces:**
- Consumes: `productApi`, `categoryApi`, `Button`, `Badge`, `Skeleton`, `EmptyState`
- Produces: Fully interactive public pages matching Stitch desktop & mobile designs.

- [ ] **Step 1: Build `ProductCard.jsx`**
  - Responsive card: 1:1 image container with hover zoom, category badge, 2-line clamped title, description snippet, tabular price display, and dual buttons: [Detail Produk] & [Ke Marketplace ↗].
- [ ] **Step 2: Build `HomePage.jsx`**
  - Hero section with "Katalog Kurasi Mandiri" badge, headline, and interactive `CategoryPills`.
  - "Kurasi Produk Minggu Ini" featured products grid (3-col desktop, 2-col mobile).
  - Informational callout banner: "Bagaimana Katalog Ini Bekerja?".
- [ ] **Step 3: Build `CatalogPage.jsx`**
  - Sticky left `FilterSidebar.jsx` for desktop; floating filter button + `FilterDrawer.jsx` for mobile.
  - Category filter, debounced search (`SearchBar.jsx`), and strict sort allowlist (`newest`, `price_asc`, `price_desc`).
  - Product grid with Skeleton loading, EmptyState, and `Pagination.jsx`.
- [ ] **Step 4: Build `ProductDetailPage.jsx`**
  - Breadcrumbs navigation.
  - Image showcase, category badge, title, tabular price with original price strikethrough & discount tag.
  - Outbound affiliate action buttons with official marketplace colors (Shopee `#EE4D2D`, Tokopedia `#03AC0E`).
  - Curator description and structured specs table (`.tnum`).
  - Affiliate disclosure alert box.
  - `StickyAffiliateBar.jsx` pinned at bottom viewport on mobile showing lowest price & outbound CTA.
- [ ] **Step 5: Build `NotFoundPage.jsx`**
  - Clean 404 page with CTA back to homepage.
- [ ] **Step 6: Verify responsive rendering and outbound links**
  - Verify cards, modals, and sticky bar on both desktop and mobile viewports.
- [ ] **Step 7: Commit changes**
  - `git commit -m "feat: implement public catalog, homepage, and product detail pages"`

---

### Task 6: Admin Authentication & Dashboard

**Files:**
- Create: `src/components/admin/StatCard.jsx`
- Create: `src/pages/admin/AdminLoginPage.jsx`
- Create: `src/pages/admin/AdminDashboardPage.jsx`

**Interfaces:**
- Consumes: `useAuth()`, `productApi`, `categoryApi`
- Produces: Protected admin authentication flow and metrics dashboard.

- [ ] **Step 1: Build `AdminLoginPage.jsx`**
  - Card with email & password inputs, remember me, error alert, and demo credentials helper button (fills `admin@koleksikita.com` / `admin123`).
  - Redirects to `/admin` upon successful login.
- [ ] **Step 2: Build `StatCard.jsx` & `AdminDashboardPage.jsx`**
  - 4 Metric cards: Total Products, Active Products, Inactive Products, Total Categories.
  - Quick action buttons (+ Tambah Produk, + Tambah Kategori).
  - Recent products table preview with direct edit links.
- [ ] **Step 3: Protect `/admin/*` routes in `App.jsx`**
  - Non-authenticated visitors attempting to access `/admin` are redirected to `/admin/login`.
- [ ] **Step 4: Commit changes**
  - `git commit -m "feat: implement admin login and dashboard summary page"`

---

### Task 7: Admin Product & Category Management (CRUD)

**Files:**
- Create: `src/components/admin/ProductTable.jsx`
- Create: `src/components/admin/CategoryTable.jsx`
- Create: `src/components/admin/ProductFormModal.jsx`
- Create: `src/components/admin/CategoryFormModal.jsx`
- Create: `src/components/admin/DeleteConfirmModal.jsx`
- Create: `src/pages/admin/AdminProductsPage.jsx`
- Create: `src/pages/admin/AdminCategoriesPage.jsx`

**Interfaces:**
- Consumes: `productApi`, `categoryApi`, `useToast()`
- Produces: Complete CRUD interfaces with safe-delete simulation and auto-slug generation.

- [ ] **Step 1: Build `ProductTable.jsx` & `AdminProductsPage.jsx`**
  - Desktop data table + Mobile card list.
  - Search and category filter bar.
  - Status toggle switch calling `updateProduct(id, { status })`.
  - Edit button opening form modal; Delete button opening confirm modal.
- [ ] **Step 2: Build `ProductFormModal.jsx`**
  - Fields: Name, Auto-generated Slug, Category select, Price, Original Price, Affiliate URL (HTTPS validation), Image URL with live preview, Is Featured toggle, Status toggle, and specs editor.
  - Validation: Name, Category, Price, Image, and Affiliate URL are required.
  - Supports both Create and Edit modes.
- [ ] **Step 3: Build `CategoryTable.jsx`, `CategoryFormModal.jsx` & `AdminCategoriesPage.jsx`**
  - Category list displaying name, slug, status, and linked product count.
  - Add & Edit category modal.
  - Safe-delete simulation: when user tries to delete a category with >0 products, show warning alert and block deletion (simulating 409 Conflict). If 0 products, allow deletion with confirmation.
- [ ] **Step 4: Commit changes**
  - `git commit -m "feat: implement product and category admin management with safe delete"`

---

### Task 8: End-to-End Verification & Responsive Polish

**Files:**
- Modify: Any files needing bug fixes or aesthetic polish based on Google Stitch screens.

**Interfaces:**
- Consumes: Complete application
- Produces: Production-ready build verified on both desktop and mobile viewports.

- [ ] **Step 1: Test all user flows on Desktop (1280px+)**
  - Homepage browsing, category pills filtering, catalog search, sorting (`newest`, `price_asc`, `price_desc`), pagination, product detail specs & outbound button.
- [ ] **Step 2: Test all user flows on Mobile (<640px)**
  - Mobile header, bottom navigation bar, filter drawer sheet, 2-column cards, sticky mobile affiliate bar.
- [ ] **Step 3: Test full Admin workflow**
  - Login with demo credentials, inspect dashboard stats, create product, edit product, toggle status, test category safe deletion conflict rejection.
  - Test dev toolbar "Reset Mock Data" button.
- [ ] **Step 4: Verify production build**
  - Run `npm run build` to ensure clean build without warnings.
- [ ] **Step 5: Commit changes**
  - `git commit -m "chore: polish responsive styling and verify production build"`

---

### Task 9: Comprehensive `FE_HANDOFF.md` Document

**Files:**
- Create: `FE_HANDOFF.md` (in workspace root `d:\web catalog affiliate\FE_HANDOFF.md`)

**Interfaces:**
- Consumes: Completed frontend implementation & design spec
- Produces: The official 15-section handoff document for backend developers.

- [ ] **Step 1: Write `FE_HANDOFF.md` covering all 15 required sections**
  - 1. Overview & Directory Structure
  - 2. Required REST API Endpoints List (Public & Admin API)
  - 3. Expected Request Payloads
  - 4. Expected Response Format & Standard Envelopes
  - 5. HTTP Status Codes Guidelines
  - 6. Data Dictionary & Field Validations
  - 7. Authentication & Token Header
  - 8. Endpoint-to-UI Mapping
  - 9. Query Parameter Allowlist (`search`, `category`, `sort`, `page`, `per_page`)
  - 10. Pagination Contract
  - 11. Authentication State Behavior & Protected Routes
  - 12. Loading, Empty, and Error States in UI
  - 13. Mock vs Production Differences
  - 14. Security Assumptions
  - 15. Known Limitations & Backend Decisions Required
- [ ] **Step 2: Commit `FE_HANDOFF.md`**
  - `git add FE_HANDOFF.md && git commit -m "docs: add comprehensive fe handoff contract document"`
