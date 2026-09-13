# FRONTEND HANDOFF DOCUMENTATION (FE_HANDOFF.md)
# Affiliate Product Catalog — KoleksiKita MVP v1.0

- **Dokumen Versi:** 1.0.0
- **Tanggal Selesai FE:** 2026-09-13
- **Status:** Frontend Complete & API-Ready
- **Penanggung Jawab:** Frontend Development Team
- **Target Pembaca:** Backend Developer & Technical Architect

---

## 1. Overview & Project Structure

Aplikasi web **KoleksiKita** adalah katalog produk afiliasi *single-owner*. Frontend telah selesai dibangun menggunakan arsitektur modular yang **100% siap dihubungkan ke backend REST API**.

Saat ini frontend berjalan menggunakan **Mock Storage Adapter** (`LocalStorage`) dengan simulasi latency jaringan (~250ms), simulasi kode HTTP status (200, 401, 404, 409 Conflict, 422), dan pembagian layer yang bersih.

### Struktur Direktori Frontend:
```text
src/
├── api/
│   ├── apiClient.js          # Unified abstraction layer (Switches between Mock & REST)
│   ├── productApi.js         # Domain API untuk Produk (dipanggil oleh UI)
│   ├── categoryApi.js        # Domain API untuk Kategori (dipanggil oleh UI)
│   ├── authApi.js            # Domain API untuk Autentikasi Admin (dipanggil oleh UI)
│   ├── mockData.js           # Seed data awal kurasi produk & kategori
│   └── mockStorage.js        # LocalStorage adapter & simulasi error / status codes
├── components/
│   ├── common/               # Atoms: Button, Badge, Modal, Input, Toast, Skeleton, EmptyState
│   ├── layout/               # Shells: PublicHeader, PublicFooter, MobileBottomNav, AdminLayout
│   ├── catalog/              # ProductCard, CategoryPills, FilterSidebar, FilterDrawer, SearchBar, Pagination, StickyAffiliateBar
│   └── admin/                # ProductTable, CategoryTable, ProductFormModal, CategoryFormModal, StatCard, DeleteConfirmModal
├── context/
│   ├── AuthContext.jsx       # State login/session token admin
│   └── ToastContext.jsx      # Global flash toast dispatch
├── pages/
│   ├── public/               # HomePage, CatalogPage, ProductDetailPage, NotFoundPage
│   └── admin/                # AdminLoginPage, AdminDashboardPage, AdminProductsPage, AdminCategoriesPage
├── styles/                   # index.css (Tailwind layers & design tokens Stitch)
├── App.jsx                   # Route tree
└── main.jsx
```

---

## 2. Required REST API Endpoints List

Semua endpoint backend diharapkan menggunakan base prefix: `/api/v1`

### 2.1 Public Endpoints (Tanpa Autentikasi)
| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/v1/products` | Mengambil daftar produk publik (hanya status `ACTIVE`), mendukung filter, search, sort, pagination |
| `GET` | `/api/v1/products/{slug}` | Mengambil data detail satu produk aktif berdasarkan slug |
| `GET` | `/api/v1/categories` | Mengambil daftar kategori publik aktif beserta hitungan produk terkait |
| `GET` | `/api/v1/categories/{slug}` | Mengambil detail kategori berdasarkan slug |

### 2.2 Admin Endpoints (Wajib Autentikasi `Bearer <token>`)
| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Login admin (email & password), mengembalikan token & data user |
| `POST` | `/api/v1/auth/logout` | Invalidate token/session di backend |
| `GET` | `/api/v1/auth/me` | Memvalidasi session token & mengembalikan profil admin aktif |
| `GET` | `/api/v1/admin/products` | Mengambil seluruh produk (termasuk status `INACTIVE`) untuk tabel admin |
| `POST` | `/api/v1/admin/products` | Menambahkan produk baru ke katalog |
| `PUT` | `/api/v1/admin/products/{id}` | Mengedit informasi produk atau mengubah status (`ACTIVE` / `INACTIVE`) |
| `DELETE` | `/api/v1/admin/products/{id}` | Menghapus produk dari katalog |
| `GET` | `/api/v1/admin/categories` | Mengambil semua kategori (termasuk inactive) dengan hitungan produk |
| `POST` | `/api/v1/admin/categories` | Membuat kategori baru |
| `PUT` | `/api/v1/admin/categories/{id}` | Memperbarui nama/status kategori |
| `DELETE` | `/api/v1/admin/categories/{id}` | Menghapus kategori (**Wajib tolak 409 jika produk > 0**) |

---

## 3. Expected Request Payloads

### 3.1 Login (`POST /api/v1/auth/login`)
```json
{
  "email": "admin@koleksikita.com",
  "password": "password123"
}
```

### 3.2 Create / Update Product (`POST` atau `PUT /api/v1/admin/products/{id}`)
```json
{
  "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphone",
  "slug": "sony-wh-1000xm5-wireless-headphone",
  "category_id": "cat-1",
  "price": 3699000,
  "original_price": 4999000,
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "affiliate_url": "https://shopee.co.id/search?keyword=Sony%20WH-1000XM5",
  "marketplace_type": "shopee",
  "is_featured": true,
  "status": "ACTIVE",
  "description": "Peredam bising terdepan di industri dengan kenyamanan optimal seharian.",
  "specs": {
    "Tipe Driver": "30mm Carbon Fiber Dome",
    "Baterai": "Hingga 30 Jam (ANC On)",
    "Garansi": "1 Tahun Resmi Sony Indonesia"
  }
}
```

> **Catatan Status Mutation:** Perubahan status produk (toggle switch di tabel admin) **tetap menggunakan payload update**:
> `PUT /api/v1/admin/products/{id}` dengan body `{ "status": "ACTIVE" }` atau `{ "status": "INACTIVE" }`. Tidak dibuat endpoint khusus.

### 3.3 Create / Update Category (`POST` atau `PUT /api/v1/admin/categories/{id}`)
```json
{
  "name": "Setup Meja Kerja",
  "slug": "setup-meja-kerja",
  "description": "Perlengkapan estetik & fungsional untuk produktivitas kerja.",
  "status": "ACTIVE"
}
```

---

## 4. Expected Response Format & Standard Envelopes

Frontend mengharapkan seluruh API response dibungkus dalam amplop standar:

### 4.1 Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil dijalankan."
}
```

### 4.2 Error Response Envelope
```json
{
  "success": false,
  "data": null,
  "message": "Deskripsi pesan error untuk user.",
  "errors": {
    "field_name": ["Pesan validasi spesifik"]
  }
}
```

---

## 5. HTTP Status Codes Guidelines

Backend harus mengembalikan status code HTTP yang sesuai (bukan selalu `200 OK`):

| HTTP Code | Situasi Penggunaan |
|---|---|
| `200 OK` | Request GET, PUT, atau DELETE yang berhasil |
| `201 Created` | Request POST yang berhasil membuat resource produk/kategori |
| `400 Bad Request` | Request dengan format sintaks JSON yang rusak |
| `401 Unauthorized` | Token tidak ada, expired, atau kredensial login salah |
| `403 Forbidden` | Token valid tapi role user tidak memiliki izin |
| `404 Not Found` | Produk atau kategori dengan ID/slug tertentu tidak ditemukan |
| `409 Conflict` | **Wajib:** Ditolak saat menghapus kategori yang masih memiliki produk |
| `422 Unprocessable Entity` | Validasi input gagal (nama kosong, URL salah, slug duplikat) |
| `429 Too Many Requests` | Rate limit terlampaui |
| `500 Internal Server Error` | Terjadi kesalahan tidak terduga pada server backend |

---

## 6. Data Dictionary & Field Validations

### 6.1 Tabel / Model `products`
| Field | Tipe Data | Wajib? | Aturan Validasi Backend |
|---|---|---|---|
| `id` | String / UUID / Int | Auto | Primary key unik |
| `name` | String | Ya | Min 3 karakter, Maks 150 karakter |
| `slug` | String | Ya | URL-safe, huruf kecil, angka, tanda strip `-`, Unik |
| `category_id` | String / Int | Ya | Wajib merujuk ke ID kategori yang valid di database |
| `price` | Number (IDR) | Ya | Numerik integer / float, nilai minimal `>= 0` |
| `original_price`| Number (IDR) | Tidak | Opsional. Jika ada, harus numerik `>= 0` |
| `image` | String (URL) | Ya | URL gambar valid (JPEG, PNG, WEBP), max 2048 karakter |
| `affiliate_url` | String (URL) | Ya | Wajib URL dengan protokol `https://` yang aman |
| `marketplace_type`| String | Tidak | Enum: `'shopee'`, `'tokopedia'`, `'tiktok'`, `'generic'` |
| `is_featured` | Boolean | Tidak | Default `false`. Menentukan tampil di section kurasi beranda |
| `status` | String | Ya | Enum: `'ACTIVE'` atau `'INACTIVE'`, default `'ACTIVE'` |
| `description` | Text | Tidak | Teks ulasan produk, plain text disanitasi dari tag script |
| `specs` | JSON / Key-Value | Tidak | Objek spesifikasi teknis `{ "Koneksi": "Bluetooth" }` |
| `created_at` | Timestamp | Auto | Waktu pembuatan (ISO 8601) |
| `updated_at` | Timestamp | Auto | Waktu pembaruan terakhir (ISO 8601) |

### 6.2 Tabel / Model `categories`
| Field | Tipe Data | Wajib? | Aturan Validasi Backend |
|---|---|---|---|
| `id` | String / UUID / Int | Auto | Primary key unik |
| `name` | String | Ya | Min 2 karakter, Maks 50 karakter |
| `slug` | String | Ya | URL-safe, unik |
| `description` | Text | Tidak | Maks 500 karakter |
| `status` | String | Ya | Enum: `'ACTIVE'` atau `'INACTIVE'`, default `'ACTIVE'` |
| `product_count` | Number | Computed| Dihitung otomatis oleh backend dari relasi produk |

---

## 7. Authentication & Token Header

1. **Format Header:**
   ```http
   Authorization: Bearer <jwt_or_session_token>
   ```
2. Frontend menyimpan token di `localStorage` (`kk_auth_token_v1`).
3. Pada setiap request ke endpoint `/admin/*`, `apiClient.js` otomatis menyisipkan header ini.
4. Jika backend merespons dengan HTTP `401 Unauthorized`, frontend otomatis mengarahkan admin ke halaman `/admin/login`.

---

## 8. Endpoint-to-UI Mapping

| Halaman UI | Rute Frontend | Endpoint Backend yang Dipanggil |
|---|---|---|
| **Beranda** | `/` | `GET /api/v1/products?featured=true&limit=6`<br>`GET /api/v1/categories` |
| **Katalog Produk** | `/catalog` | `GET /api/v1/products?category={}&search={}&sort={}&page={}&per_page=6`<br>`GET /api/v1/categories` |
| **Detail Produk** | `/product/:slug` | `GET /api/v1/products/{slug}`<br>`GET /api/v1/products?category={cat_id}&limit=3` (Related) |
| **Admin Login** | `/admin/login` | `POST /api/v1/auth/login` |
| **Admin Dashboard**| `/admin` | `GET /api/v1/admin/products?limit=50`<br>`GET /api/v1/products?status=ACTIVE`<br>`GET /api/v1/admin/categories` |
| **Admin Produk** | `/admin/products` | `GET /api/v1/admin/products`<br>`POST /api/v1/admin/products`<br>`PUT /api/v1/admin/products/{id}`<br>`DELETE /api/v1/admin/products/{id}` |
| **Admin Kategori**| `/admin/categories`| `GET /api/v1/admin/categories`<br>`POST /api/v1/admin/categories`<br>`PUT /api/v1/admin/categories/{id}`<br>`DELETE /api/v1/admin/categories/{id}` |

---

## 9. Query Parameter Allowlist (Security & Anti-Abuse)

Backend **wajib menolak atau memfilter** query parameter arbitrer. Frontend hanya mengirimkan parameter berikut:

1. `search`: String pencarian kata kunci (nama & deskripsi). Maksimal **100 karakter**.
2. `category`: Slug atau ID kategori.
3. `sort`: **STRICT ALLOWLIST**:
   - `newest` (Urut berdasarkan `created_at` menurun — default)
   - `price_asc` (Urut berdasarkan harga termurah ke termahal)
   - `price_desc` (Urut berdasarkan harga termahal ke termurah)
   *(Backend tidak boleh menerima nama kolom SQL mentah seperti `?sort=password`)*.
4. `page`: Integer positif `>= 1`.
5. `per_page`: Integer batasan per halaman (`6` s/d `50`). Nilai di atas 50 harus dibatasi otomatis oleh backend.
6. `featured`: Nilai `"true"` atau `"false"`.
7. `status`: Nilai `'ACTIVE'`, `'INACTIVE'`, atau `'ALL'` (khusus admin).

---

## 10. Pagination Contract

Struktur pagination pada `GET /api/v1/products` harus mengembalikan metadata berikut:

```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "prod-1", "name": "...", "price": 3699000, "..." : "..." }
    ],
    "pagination": {
      "total": 18,
      "page": 1,
      "per_page": 6,
      "total_pages": 3
    }
  },
  "message": null
}
```

---

## 11. Authentication State Behavior & Protected Routes

1. Rute `/admin/*` dilindungi oleh `AdminLayout.jsx`.
2. Jika admin belum login atau session habis (`401`), frontend melakukan redirect ke `/admin/login` dengan menyimpan rute asal (`state.from`).
3. Setelah login berhasil, admin dikembalikan ke rute asal yang dituju.
4. Pada saat logout, token dibersihkan dan dialihkan ke `/admin/login`.

---

## 12. Loading, Empty, and Error States in UI

Frontend telah memiliki penanganan visual lengkap untuk seluruh kondisi:
1. **Loading State:** Menggunakan shimmer placeholder (`ProductCardSkeleton`, `ProductTableSkeleton`).
2. **Empty State:** Menampilkan ilustrasi rapi dan tombol reset ketika pencarian/filter tidak menghasilkan data (`EmptyState.jsx`).
3. **Validation Error State:** Input form menampilkan border merah dan pesan error di bawah field yang bermasalah.
4. **Toast Flash Notifications:** Notifikasi status melayang otomatis muncul di kanan bawah layar untuk setiap aksi sukses atau gagal.

---

## 13. Mock vs Production Differences

| Fitur | Status Mock Frontend (Saat Ini) | Kebutuhan Production Backend |
|---|---|---|
| **Penyimpanan Data** | LocalStorage di browser | Database relational (PostgreSQL / MySQL / SQLite) |
| **Password Admin** | Plain text perbandingan di memory mock | Hashing kuat (Argon2id atau Bcrypt) |
| **Token Session** | String pseudo-random | JWT bertanda tangan aman atau HTTP-only session cookie |
| **Kategori Hapus (409)**| Pengecekan relasi array produk di mock | Pengecekan foreign key constraint di database |
| **Reset Data Toolbar**| Ada tombol di dev toolbar (`DevToolbar.jsx`) | **Tidak boleh diimplementasikan di production backend** |

---

## 14. Security Assumptions

1. **Frontend Bukan Lapisan Keamanan:**
   Meskipun frontend melakukan validasi form, backend **wajib melakukan re-validasi** terhadap semua data yang masuk.
2. **Affiliate URL Protocol:**
   Backend harus memastikan URL afiliasi hanya menggunakan skema `https://` untuk mencegah serangan `javascript:` atau XSS.
3. **No Open Redirect:**
   Sistem tidak mengizinkan query arbitrary redirect seperti `/go?url=http://attacker.com`. Outbound link menggunakan direct URL yang tersimpan di database.
4. **Sanitasi Deskripsi:**
   Teks deskripsi produk harus disanitasi dari tag script HTML sebelum disimpan ke database.

---

## 15. Known Limitations & Backend Decisions Required

1. **CORS Configuration:**
   Backend production harus mengizinkan origin domain tempat frontend di-host (misal: `https://koleksikita.com` atau `http://localhost:3000` saat development).
2. **Rate Limiting:**
   Disarankan menerapkan rate limiting:
   - Endpoint Publik: 60–120 request/menit per IP.
   - Endpoint Login: 5–10 percobaan/menit per IP.
3. **Image Upload / Hosting:**
   Frontend saat ini menerima direct URL gambar (misal dari CDN / Unsplash / cloud storage). Jika backend nantinya menyediakan endpoint upload file mandiri (`POST /api/v1/admin/upload`), backend harus memvalidasi tipe MIME (JPEG, PNG, WEBP) dan ukuran file maksimal (misal 2MB).
4. **Cara Beralih dari Mock ke REST API:**
   Ketika backend REST API telah online, frontend developer cukup mengubah file `.env`:
   ```bash
   VITE_API_MODE=REST
   VITE_API_BASE_URL=https://api.koleksikita.com/api/v1
   ```
   Seluruh komponen UI akan langsung beroperasi tanpa perlu merombak satu pun kode antarmuka.

---

*Dokumen ini menjadi jembatan resmi antara tim frontend dan backend developer untuk memulai fase pengembangan backend (BE-01).*
