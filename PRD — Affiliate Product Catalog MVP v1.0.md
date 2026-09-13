# PRODUCT REQUIREMENTS DOCUMENT
# Affiliate Product Catalog — MVP v1.0

**Status:** Ready for Development  
**Target:** Website katalog affiliate single-owner  
**Target Budget:** ± Rp500.000  
**Architecture:** Frontend → API Backend → Database  
**Admin Role:** 1 role — Admin/Owner  
**Checkout:** Tidak tersedia  
**Payment:** Tidak tersedia  
**Order:** Tidak tersedia  

---

# 1. PRODUCT OVERVIEW

Affiliate Product Catalog adalah website katalog produk yang digunakan oleh satu pemilik untuk menampilkan produk-produk rekomendasi dan mengarahkan pengunjung ke marketplace melalui affiliate link.

Website bukan marketplace dan bukan e-commerce.

Sistem hanya bertanggung jawab sampai:

> Pengunjung melihat produk → melihat detail → klik tombol affiliate → diarahkan ke marketplace.

Transaksi, pembayaran, pengiriman, stok, dan proses order sepenuhnya terjadi di platform marketplace.

---

# 2. PRODUCT GOALS

## Primary Goals

1. Menampilkan katalog produk secara profesional.
2. Memudahkan pengunjung mencari produk.
3. Memudahkan admin mengelola produk.
4. Memudahkan admin mengelola kategori.
5. Mengarahkan pengunjung ke affiliate URL.
6. Website cepat dan mobile-friendly.
7. API memiliki proteksi dasar terhadap abuse/bot.
8. Backend dan frontend memiliki kontrak data yang jelas.
9. Sistem tidak memiliki fitur berlebihan yang tidak diperlukan untuk budget MVP.

## Non-Goals

Sistem TIDAK akan menangani:

- Marketplace transaction
- Checkout
- Payment gateway
- Customer account
- Shopping cart
- Order
- Inventory
- Shipping
- Seller
- Multi-vendor
- Commission management
- Withdrawal
- Advanced analytics
- Customer review
- Chat
- POS

---

# 3. USER ROLES

Hanya terdapat satu role:

## ADMIN

Admin adalah pemilik website.

Hak akses:

- Login
- Logout
- Melihat dashboard
- Membuat produk
- Melihat produk
- Mengedit produk
- Menghapus produk
- Mengaktifkan/nonaktifkan produk
- Membuat kategori
- Mengedit kategori
- Menghapus kategori

Tidak ada:

- Super Admin
- Manager
- Editor
- Seller
- Customer account

---

# 4. SYSTEM ARCHITECTURE

Arsitektur utama:

```text
                    PUBLIC USER
                        │
                        ▼
                 FRONTEND WEBSITE
                        │
                        ▼
                    REST API
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
          DATABASE             MEDIA STORAGE
```

Admin:

```text
ADMIN
  │
  ▼
ADMIN FRONTEND
  │
  ▼
AUTHENTICATED REST API
  │
  ▼
DATABASE
```

Public API dan Admin API harus dipisahkan secara logical.

---

# 5. PUBLIC WEBSITE

## 5.1 Homepage

Homepage minimal memiliki:

### Hero

- Website/logo
- Headline
- Deskripsi singkat
- CTA menuju katalog

### Featured Products

Menampilkan produk yang ditandai admin sebagai featured.

Jika tidak ada featured product:

- Section tidak perlu ditampilkan.

### Categories

Menampilkan daftar kategori aktif.

### Latest Products

Menampilkan produk terbaru.

### Footer

Berisi:

- Nama website
- Copyright
- Social media jika tersedia
- Affiliate disclosure

---

# 6. PRODUCT CATALOG

Route:

```text
/catalog
```

Features:

- Product grid
- Search
- Category filter
- Pagination atau Load More
- Responsive layout

Product card minimal:

- Image
- Product name
- Price
- Category
- Badge jika tersedia
- CTA

Contoh:

```text
┌──────────────────────┐
│      PRODUCT IMAGE   │
├──────────────────────┤
│ Wireless Earbuds     │
│ Audio                │
│ Rp199.000            │
│                      │
│ [ Lihat Produk ]     │
└──────────────────────┘
```

---

# 7. SEARCH

Search digunakan untuk mencari produk berdasarkan:

- Product name
- Product description

Search tidak perlu menggunakan search engine kompleks untuk MVP.

Contoh:

```text
GET /api/products?search=earbuds
```

Backend wajib:

- Validasi search parameter
- Membatasi panjang query
- Menghindari raw SQL
- Menggunakan parameterized query/ORM
- Memberikan pagination

Search query harus memiliki batas panjang, misalnya:

```text
max 100 characters
```

---

# 8. CATEGORY FILTER

Contoh:

```text
GET /api/products?category=gaming
```

Backend wajib memvalidasi category.

Jangan langsung memasukkan input user ke query SQL.

Gunakan:

- ORM
- Query builder
- Parameter binding

---

# 9. PRODUCT DETAIL

Route:

```text
/product/{slug}
```

Informasi:

- Product image
- Product name
- Price
- Original price jika tersedia
- Description
- Category
- Affiliate CTA

Contoh:

```text
Wireless Earbuds X

Rp199.000

Earbuds wireless dengan...

[ BELI DI MARKETPLACE ]
```

Ketika tombol affiliate diklik:

```text
Website
   ↓
Affiliate URL
   ↓
Marketplace
```

Website tidak melakukan transaksi.

---

# 10. AFFILIATE DISCLOSURE

Website harus memiliki disclosure sederhana.

Contoh:

> Beberapa link di website ini merupakan affiliate link. Kami dapat menerima komisi apabila Anda melakukan pembelian melalui link tersebut, tanpa biaya tambahan bagi Anda.

Disclosure dapat ditempatkan di footer dan/atau halaman informasi.

---

# 11. ADMIN PANEL

Route:

```text
/admin/login
/admin
```

Admin dashboard terdiri dari:

```text
Dashboard
Products
Categories
Settings/Profile
Logout
```

Untuk MVP, dashboard tidak membutuhkan analytics kompleks.

---

# 12. ADMIN DASHBOARD

Dashboard menampilkan:

- Total products
- Active products
- Inactive products
- Total categories

Contoh:

```text
PRODUCTS       120
ACTIVE         112
INACTIVE         8
CATEGORIES      10
```

Tidak perlu:

- Revenue dashboard
- Commission dashboard
- Conversion tracking
- Visitor analytics

---

# 13. PRODUCT MANAGEMENT

Route:

```text
/admin/products
```

Features:

- List products
- Search
- Filter category
- Create
- Edit
- Delete
- Activate/deactivate

Table:

```text
Product
Category
Price
Status
Updated
Action
```

---

# 14. CREATE PRODUCT

Field:

```text
name
slug
category_id
description
price
original_price
image
affiliate_url
is_featured
status
```

## Required

- Name
- Category
- Price
- Image
- Affiliate URL

## Optional

- Original price
- Description
- Featured status

---

# 15. PRODUCT STATUS

Status:

```text
ACTIVE
INACTIVE
```

Only ACTIVE products appear publicly.

Inactive products remain available inside admin.

---

# 16. PRODUCT SLUG

Slug digunakan untuk public URL.

Contoh:

```text
Wireless Earbuds X
        ↓
wireless-earbuds-x
```

Slug harus:

- URL-safe
- Unique
- Tidak mengandung karakter berbahaya
- Tidak boleh menyebabkan route collision

Backend tetap harus melakukan validation.

Jangan mempercayai slug dari frontend.

---

# 17. CATEGORY MANAGEMENT

Route:

```text
/admin/categories
```

Features:

- List
- Create
- Edit
- Delete

Category fields:

```text
name
slug
description
status
```

Status:

```text
ACTIVE
INACTIVE
```

Kategori inactive tidak digunakan pada katalog publik.

---

# 18. CATEGORY DELETE RULE

Kategori yang masih memiliki product tidak boleh dihapus secara sembarangan.

Backend harus menentukan behavior yang aman.

Recommended:

```text
Jika category masih digunakan:
→ DELETE ditolak
→ Admin mendapatkan pesan:
"Category masih digunakan oleh beberapa produk."
```

Alternatif:

```text
Admin harus memindahkan produk terlebih dahulu.
```

---

# 19. AUTHENTICATION

Admin membutuhkan authentication.

Recommended:

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Security:

- Password wajib di-hash menggunakan password hashing yang aman.
- Jangan menyimpan plaintext password.
- Login harus memiliki rate limit.
- Session/token harus memiliki expiry.
- Endpoint admin harus membutuhkan authentication.
- Authentication harus diverifikasi di backend.

Frontend tidak boleh menjadi sumber kebenaran authorization.

---

# 20. AUTHORIZATION

Setiap endpoint admin wajib melakukan pengecekan:

```text
Authenticated?
       │
       ├── NO → 401
       │
       └── YES
             ↓
          Authorized?
             │
             ├── NO → 403
             │
             └── YES → Process
```

Jangan hanya menyembunyikan tombol admin di frontend.

---

# 21. REST API PRINCIPLES

API harus:

- Stateless
- Consistent
- Versioned
- Validated
- Paginated
- Rate limited
- Menggunakan HTTP status code yang benar
- Tidak mengembalikan data sensitif

Recommended base:

```text
/api/v1/
```

---

# 22. PUBLIC API

Minimal endpoint:

```text
GET /api/v1/products
GET /api/v1/products/{slug}
GET /api/v1/categories
GET /api/v1/categories/{slug}
```

Optional:

```text
GET /api/v1/products/featured
GET /api/v1/products/latest
```

Jika data dapat diperoleh dari endpoint products dengan query parameter, endpoint tambahan tidak wajib dibuat.

---

# 23. ADMIN API

```text
POST   /api/v1/admin/products
GET    /api/v1/admin/products
GET    /api/v1/admin/products/{id}
PUT    /api/v1/admin/products/{id}
DELETE /api/v1/admin/products/{id}

POST   /api/v1/admin/categories
GET    /api/v1/admin/categories
PUT    /api/v1/admin/categories/{id}
DELETE /api/v1/admin/categories/{id}
```

Authentication wajib.

---

# 24. API RESPONSE FORMAT

Response harus konsisten.

Success:

```json
{
  "success": true,
  "data": {},
  "message": null
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "message": "Invalid request"
}
```

Validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": [
      "Name is required."
    ]
  }
}
```

---

# 25. HTTP STATUS CODE

Gunakan status code yang sesuai.

```text
200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests

500 Internal Server Error
```

Jangan menggunakan HTTP 200 untuk semua error.

---

# 26. API PAGINATION

Public product endpoint wajib menggunakan pagination.

Contoh:

```text
GET /api/v1/products?page=1&per_page=20
```

Backend harus memberikan batas maksimal:

```text
per_page <= 50
```

Jika user mengirim:

```text
per_page=999999
```

backend harus membatasi atau menolak request.

Jangan pernah membiarkan client meminta seluruh database tanpa batas.

---

# 27. BOT & API ABUSE PROTECTION

Karena website publik dapat diakses bot, API harus memiliki protection dasar.

## Rate Limiting

Public:

```text
GET products
GET categories
```

boleh memiliki rate limit yang relatif longgar.

Endpoint sensitif:

```text
POST login
POST product
PUT product
DELETE product
```

harus lebih ketat.

Contoh konsep:

```text
Public API:
60–120 requests/minute/IP

Login:
5–10 attempts/minute/IP

Admin mutation:
lebih ketat + authentication
```

Angka final dapat disesuaikan dengan hosting.

---

# 28. RESPONSE CACHING

Endpoint yang datanya jarang berubah dapat menggunakan cache.

Contoh:

```text
GET /products
GET /categories
GET /products/{slug}
```

Cache dapat digunakan agar request berulang tidak selalu membaca database.

Ketika admin mengubah product/category:

```text
Update Database
      ↓
Invalidate relevant cache
      ↓
New data available
```

Jangan melakukan cache pada data admin yang sensitif secara sembarangan.

---

# 29. DATABASE QUERY OPTIMIZATION

Backend wajib menghindari:

## N+1 Query

Jangan:

```text
Get 20 products
→ query category 20 kali
```

Gunakan eager loading/join yang sesuai.

## SELECT *

Hindari mengambil kolom yang tidak dibutuhkan.

## Unbounded Query

Jangan:

```text
SELECT * FROM products
```

untuk public endpoint tanpa pagination.

Gunakan pagination.

---

# 30. DATABASE INDEX

Minimal index pada:

```text
products.slug
products.category_id
products.status

categories.slug
categories.status
```

Jika search menggunakan kolom tertentu, evaluasi index berdasarkan database engine dan query aktual.

Unique constraint:

```text
products.slug UNIQUE
categories.slug UNIQUE
```

---

# 31. INPUT VALIDATION

Semua input harus divalidasi di backend.

Contoh:

```text
name
→ required
→ max length

price
→ numeric
→ >= 0

affiliate_url
→ valid URL
→ allowed protocols

description
→ max length

category_id
→ valid existing category
```

Frontend validation hanya untuk UX.

Backend validation adalah security boundary.

---

# 32. SQL INJECTION PROTECTION

WAJIB:

- ORM
- Parameterized query
- Prepared statements
- Query builder

DILARANG:

```text
SQL string concatenation dengan input user
```

Contoh konsep berbahaya:

```text
"SELECT * FROM products WHERE name = '" + userInput + "'"
```

Jangan digunakan.

---

# 33. XSS PROTECTION

Product description dan input admin harus diperlakukan sebagai untrusted input.

Jika description hanya plain text:

- Escape saat rendering.

Jika HTML diperbolehkan:

- Gunakan HTML sanitizer yang terpercaya.
- Gunakan allowlist tag/attribute.

Jangan mempercayai HTML dari frontend.

---

# 34. CSRF PROTECTION

Jika authentication menggunakan cookie/session:

- Aktifkan CSRF protection pada request mutation.
- Gunakan SameSite cookie.
- Secure cookie ketika HTTPS.
- HttpOnly cookie untuk credential/session yang sesuai.

Jika menggunakan token-based API, implementasi CSRF harus mengikuti mekanisme authentication yang dipilih.

---

# 35. CORS

Jangan menggunakan:

```text
Access-Control-Allow-Origin: *
```

secara sembarangan terutama pada authenticated API.

Production harus membatasi allowed origin hanya kepada frontend yang diperlukan.

---

# 36. HTTP SECURITY

Production wajib menggunakan:

```text
HTTPS
```

Recommended security headers:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Strict-Transport-Security
- Frame protection sesuai kebutuhan

Konfigurasi harus disesuaikan dengan hosting dan frontend.

---

# 37. FILE UPLOAD SECURITY

Product image adalah salah satu attack surface.

Backend wajib:

- Validasi MIME type
- Validasi extension
- Batasi ukuran file
- Batasi dimensi jika diperlukan
- Generate nama file sendiri
- Jangan menggunakan filename asli sebagai path
- Jangan mengizinkan executable file
- Simpan upload pada lokasi yang tidak dapat dieksekusi

Contoh allowed:

```text
JPEG
PNG
WEBP
```

Ukuran maksimum ditentukan berdasarkan kebutuhan MVP.

---

# 38. AFFILIATE URL SECURITY

Admin memasukkan affiliate URL.

Backend harus:

- Validasi URL
- Hanya mengizinkan protocol yang aman seperti HTTPS
- Menolak javascript:
- Menolak data:
- Menolak URL malformed

Contoh yang harus ditolak:

```text
javascript:...
data:...
```

Jika memungkinkan, gunakan allowlist domain marketplace yang memang digunakan.

---

# 39. OPEN REDIRECT PROTECTION

Affiliate redirect tidak boleh menerima URL arbitrary dari query parameter publik seperti:

```text
/go?url=...
```

Jika sistem membutuhkan redirect endpoint, gunakan ID affiliate link yang tersimpan di database:

```text
/go/{affiliate_link_id}
```

Backend mengambil URL dari database.

Jangan membiarkan user menentukan arbitrary destination.

---

# 40. BOT PROTECTION

Tidak semua bot harus diblokir.

Public website membutuhkan crawler/search engine tertentu.

Prioritas:

```text
Rate limiting
+
Caching
+
Pagination
+
Query limits
+
Request size limits
+
Authentication protection
```

Jika abuse serius terjadi, dapat ditambahkan:

- CAPTCHA pada login
- WAF
- CDN
- IP throttling

Fitur tersebut bukan requirement MVP kecuali dibutuhkan.

---

# 41. REQUEST SIZE LIMIT

Backend harus memiliki limit terhadap:

- Request body
- Query parameter
- Search keyword
- Uploaded image
- JSON payload

Tujuannya mencegah oversized request yang menghabiskan resource server.

---

# 42. ERROR HANDLING

Production API tidak boleh membocorkan:

- SQL query
- Stack trace
- File path
- Environment variable
- Database credentials
- Internal server details

User mendapatkan error sederhana.

Developer dapat melihat detail melalui server logs.

---

# 43. LOGGING

Log minimal:

- Failed login
- Authentication error
- Server error
- Important admin mutations
- Suspicious request jika diperlukan

Jangan memasukkan:

- Password
- Token
- Secret key
- Sensitive credential

ke dalam log.

---

# 44. ENVIRONMENT VARIABLES

Secret configuration tidak boleh berada di repository/frontend.

Contoh:

```text
DATABASE_URL
APP_KEY
JWT_SECRET
SESSION_SECRET
STORAGE_KEY
```

Frontend tidak boleh menerima secret backend.

File `.env` tidak boleh di-commit.

---

# 45. FRONTEND SECURITY RULE

Frontend bukan security layer.

Contoh:

Jika tombol Delete hanya ditampilkan untuk admin:

```text
Frontend:
hide button
```

tetapi backend tetap harus:

```text
authenticate
authorize
validate
execute
```

---

# 46. PERFORMANCE REQUIREMENTS

Public website harus dioptimalkan untuk mobile.

Prioritas:

1. Optimized images
2. Lazy loading image
3. Pagination
4. API caching
5. Minimal JavaScript
6. Avoid unnecessary API calls
7. Avoid duplicate API requests
8. Compress assets
9. Efficient database queries

---

# 47. API REQUEST OPTIMIZATION

Frontend tidak boleh melakukan:

```text
GET categories
GET products
GET featured
GET latest
GET products again
```

tanpa alasan.

Gunakan endpoint/query yang efisien.

Contoh:

```text
GET /api/v1/products?featured=true&limit=8
```

atau gunakan satu response homepage jika nantinya memang diperlukan.

MVP tidak membutuhkan microservices.

---

# 48. API TIMEOUT & FAILURE

Frontend harus menangani:

```text
Loading
Success
Empty
Error
Timeout
```

Contoh:

```text
Loading products...
```

Jika API gagal:

```text
Produk gagal dimuat.
Silakan coba lagi.
```

Jangan menampilkan error internal backend kepada user.

---

# 49. EMPTY STATE

Jika tidak ada product:

```text
Belum ada produk tersedia.
```

Jika search tidak menemukan:

```text
Produk tidak ditemukan.
```

---

# 50. ADMIN PRODUCT WORKFLOW

```text
Admin Login
    ↓
Dashboard
    ↓
Products
    ↓
Add Product
    ↓
Input Data
    ↓
Backend Validation
    ↓
Database
    ↓
Product Active
    ↓
Public Catalog
```

---

# 51. ADMIN EDIT WORKFLOW

```text
Admin
 ↓
Product
 ↓
Edit
 ↓
Frontend Validation
 ↓
API
 ↓
Backend Validation
 ↓
Update Database
 ↓
Invalidate Cache
 ↓
Updated Product
```

---

# 52. DELETE WORKFLOW

Recommended soft-delete/archive behavior jika diperlukan.

Namun untuk MVP sederhana, dapat menggunakan hard delete dengan aturan:

```text
Jika product tidak memiliki dependency:
→ Delete
```

Jika nantinya membutuhkan audit/history, ubah menjadi soft delete.

---

# 53. FRONTEND DEVELOPMENT WORKFLOW

Frontend dikerjakan terlebih dahulu.

## Phase FE-01 — Project Setup

Task:

- Setup project
- Setup routing
- Setup global styles
- Setup responsive layout
- Setup reusable components
- Setup public pages
- Setup admin UI skeleton

Output:

```text
Working Frontend UI
```

---

# 54. FE-02 — Public Pages

Task:

- Homepage
- Catalog
- Product detail
- Category filter
- Search UI
- Responsive state
- Loading state
- Empty state
- Error state

---

# 55. FE-03 — Admin UI

Task:

- Login page
- Dashboard
- Product list
- Add product
- Edit product
- Category list
- Add category
- Edit category
- Delete confirmation
- Status toggle

Pada tahap ini frontend dapat menggunakan mock data.

---

# 56. FE-04 — API-READY FRONTEND

Frontend harus dipastikan tidak bergantung pada mock data secara permanen.

Pisahkan:

```text
UI
API service
Data model
```

Contoh:

```text
components/
pages/
services/
api/
types/
```

Jangan menaruh fetch API langsung secara acak di setiap component.

---

# 57. FE HANDOFF DOCUMENT

Setelah frontend selesai, WAJIB membuat file:

```text
FE_HANDOFF.md
```

File ini menjadi jembatan antara frontend dan backend.

Isinya:

## 1. Project structure

```text
src/
├── components/
├── pages/
├── services/
├── api/
├── types/
└── ...
```

## 2. Required API endpoints

Contoh:

```text
GET /api/v1/products
GET /api/v1/products/{slug}
GET /api/v1/categories
POST /api/v1/admin/products
...
```

## 3. Expected request

Contoh:

```json
{
  "name": "Wireless Earbuds X",
  "category_id": 1,
  "price": 199000,
  "description": "...",
  "affiliate_url": "https://...",
  "is_featured": true,
  "status": "ACTIVE"
}
```

## 4. Expected response

```json
{
  "success": true,
  "data": {}
}
```

## 5. Error states

Dokumentasikan:

```text
401
403
404
422
429
500
```

## 6. Data fields

Jelaskan setiap field:

```text
name
type: string
required: yes
max: ...
```

## 7. Authentication expectation

Jelaskan bagaimana frontend mengharapkan:

```text
login
session/token
logout
current admin
```

## 8. Loading/Error behavior

Dokumentasikan UI behavior.

## 9. Environment variables

Hanya public/frontend variables.

Jangan memasukkan secret backend.

---

# 58. BACKEND DEVELOPMENT WORKFLOW

Backend **tidak dimulai sebelum FE_HANDOFF.md selesai.**

Workflow:

```text
Frontend Complete
       ↓
FE_HANDOFF.md
       ↓
API Contract Review
       ↓
Backend Architecture
       ↓
Database
       ↓
Authentication
       ↓
Public API
       ↓
Admin API
       ↓
Security
       ↓
Integration
       ↓
Testing
```

---

# 59. BACKEND TASKS

## BE-01 — Project Setup

- Setup backend framework
- Environment configuration
- Database connection
- API versioning
- Error handling
- Logging
- CORS
- Security headers

---

## BE-02 — Database

Create:

```text
users
categories
products
```

Optional:

```text
affiliate_links
```

Untuk budget Rp500k, affiliate URL dapat langsung berada pada `products`.

Tidak perlu membuat tabel terpisah kecuali memang ada kebutuhan multiple affiliate link.

---

# 60. RECOMMENDED MVP DATABASE

## users

```text
id
name
email
password_hash
created_at
updated_at
```

## categories

```text
id
name
slug
description
status
created_at
updated_at
```

## products

```text
id
category_id
name
slug
description
price
original_price
image
affiliate_url
is_featured
status
created_at
updated_at
```

Untuk MVP, jangan membuat schema terlalu kompleks.

---

# 61. BE-03 — Authentication

Task:

- Admin login
- Password hashing
- Session/token
- Logout
- Current user
- Rate limiting
- Authentication middleware

---

# 62. BE-04 — Public API

Implement:

```text
GET /api/v1/products
GET /api/v1/products/{slug}
GET /api/v1/categories
GET /api/v1/categories/{slug}
```

Requirements:

- Pagination
- Filtering
- Search
- Validation
- Cache jika diperlukan
- Consistent response

---

# 63. BE-05 — Admin API

Implement CRUD:

```text
Products
Categories
```

Semua mutation:

```text
Authentication
+
Authorization
+
Validation
+
Database transaction jika diperlukan
```

---

# 64. BE-06 — Security Hardening

Checklist:

```text
[ ] SQL Injection protection
[ ] XSS protection
[ ] CSRF protection sesuai auth architecture
[ ] CORS restriction
[ ] Rate limiting
[ ] Request size limits
[ ] Input validation
[ ] File upload validation
[ ] Affiliate URL validation
[ ] Authentication
[ ] Authorization
[ ] Secure password hashing
[ ] Secure cookies/token handling
[ ] Error sanitization
[ ] Security headers
[ ] Secret management
```

---

# 65. BE-07 — API PERFORMANCE

Checklist:

```text
[ ] Pagination
[ ] Database indexes
[ ] No N+1 queries
[ ] Avoid SELECT *
[ ] Cache public read endpoints where useful
[ ] Limit request payload
[ ] Limit search length
[ ] Rate limiting
[ ] Efficient serialization
```

Tujuan utama:

> Bot tidak boleh dengan mudah membuat database bekerja berat hanya dengan spam request.

---

# 66. BE-08 — FRONTEND INTEGRATION

Setelah backend siap:

```text
Mock API
   ↓
Real API
```

Task:

- Replace mock product data
- Connect catalog
- Connect product detail
- Connect search
- Connect category
- Connect admin login
- Connect CRUD products
- Connect CRUD categories
- Handle errors
- Handle authentication expiry

---

# 67. INTEGRATION TEST

Test:

### Public

```text
Open homepage
Open catalog
Search product
Filter category
Open detail
Click affiliate
```

### Admin

```text
Login
Create category
Create product
Edit product
Deactivate product
Activate product
Delete product
Logout
```

---

# 68. SECURITY TEST

Test minimum:

### Authentication

```text
Wrong password
Brute-force login
Expired session/token
Unauthenticated admin API
```

### Authorization

```text
Public user → admin endpoint
```

Expected:

```text
401 / 403
```

### Injection

Test malicious input pada:

- Search
- Product name
- Description
- Slug
- Category
- IDs

Expected:

```text
No SQL execution
No server crash
No data leakage
```

### XSS

Test payload pada text fields.

Expected:

```text
Payload tidak dieksekusi.
```

### Upload

Test:

- Oversized file
- Invalid MIME
- Executable file
- Malicious filename

---

# 69. API LOAD / ABUSE TEST

Test:

```text
Repeated GET /products
Repeated search
Repeated login
Large pagination value
Very long search query
Large request body
Concurrent requests
```

Expected:

```text
Rate limit bekerja
Server tetap responsive
Database tidak menerima query unlimited
Error response tetap konsisten
```

---

# 70. DEFINITION OF DONE

Project dianggap selesai apabila:

### Frontend

```text
[ ] Semua public page selesai
[ ] Admin UI selesai
[ ] Responsive
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] FE_HANDOFF.md selesai
[ ] API contract terdokumentasi
```

### Backend

```text
[ ] Database selesai
[ ] Authentication selesai
[ ] Public API selesai
[ ] Admin API selesai
[ ] Validation selesai
[ ] Security hardening selesai
[ ] Rate limiting selesai
[ ] Pagination selesai
[ ] Database indexes selesai
```

### Integration

```text
[ ] FE terhubung ke BE
[ ] CRUD berjalan
[ ] Search berjalan
[ ] Category berjalan
[ ] Affiliate redirect berjalan
[ ] Error handling berjalan
```

### Security

```text
[ ] SQL injection test
[ ] XSS test
[ ] Auth test
[ ] Authorization test
[ ] Rate-limit test
[ ] Upload security test
```

---

# 71. DEVELOPMENT PRIORITY

Prioritas wajib:

```text
P0 — Core

Frontend
Backend
Product
Category
Admin
Authentication
Affiliate URL
REST API
Database
Security
```

Prioritas tidak diperlukan untuk MVP:

```text
P1
Analytics
Click tracking
Multiple marketplace
Advanced SEO
Banner management
```

P1 hanya boleh dibuat jika budget dan waktu bertambah.

---

# 72. FINAL MVP SCOPE

Produk final versi Rp500k:

```text
PUBLIC
├── Homepage
├── Catalog
├── Search
├── Category Filter
├── Product Detail
└── Affiliate Redirect


ADMIN
├── Login
├── Dashboard
├── Product CRUD
├── Category CRUD
└── Logout


BACKEND
├── REST API
├── Authentication
├── Validation
├── Pagination
├── Rate Limiting
├── Caching
├── Database Optimization
└── Security Hardening
```

---

# 73. IMPORTANT DEVELOPMENT RULE

Jangan menambahkan fitur hanya karena fitur tersebut technically possible.

Setiap fitur baru harus menjawab:

> "Apakah fitur ini diperlukan agar Affiliate Product Catalog MVP dapat menjual/mendistribusikan produk dengan baik?"

Jika jawabannya tidak:

> Masukkan ke backlog, jangan masuk MVP.

---

# 74. RECOMMENDED AI DEVELOPMENT WORKFLOW

## STEP 1 — FRONTEND AI

Berikan PRD ini kepada AI frontend.

Instruksikan:

```text
Kerjakan seluruh frontend berdasarkan PRD.

Jangan mengimplementasikan backend.

Gunakan mock data untuk kebutuhan UI.

Pastikan seluruh halaman, component, state,
form, loading, empty state, error state,
dan responsive behavior selesai.

Setelah frontend selesai, buat FE_HANDOFF.md
yang mendokumentasikan seluruh kebutuhan API,
data model, request, response, authentication,
error state, dan integration contract yang dibutuhkan
backend.

Jangan menghapus atau mengubah requirement PRD
tanpa alasan teknis yang jelas.
```

---

# 75. STEP 2 — FRONTEND AUDIT

Sebelum backend:

```text
Review seluruh frontend.

Pastikan:

- Tidak ada halaman yang belum selesai.
- Tidak ada mock dependency yang tersembunyi.
- Semua API requirement terdokumentasi.
- Semua field yang dibutuhkan backend terdokumentasi.
- Semua error state terdokumentasi.
- Authentication flow terdokumentasi.
- API contract konsisten.
- FE_HANDOFF.md lengkap.
```

Output:

```text
Frontend FINAL
+
FE_HANDOFF.md
```

---

# 76. STEP 3 — BACKEND AI

Baru setelah FE selesai, berikan:

```text
PRD
+
FE source code
+
FE_HANDOFF.md
```

kepada AI backend.

Instruksi:

```text
Implementasikan backend berdasarkan PRD dan
FE_HANDOFF.md.

Baca frontend terlebih dahulu.

Jangan menebak API contract jika requirement
sudah tersedia di FE_HANDOFF.md.

Pastikan response backend kompatibel dengan
frontend.

Implementasikan authentication, validation,
authorization, pagination, rate limiting,
database optimization, caching yang relevan,
dan security hardening.

Backend tidak boleh mempercayai validation dari
frontend.

Setiap input dari client dianggap untrusted.
```

---

# 77. STEP 4 — INTEGRATION

Setelah backend selesai:

```text
Frontend
    +
Backend
    ↓
Integration
```

AI harus:

- Connect API
- Remove mock data
- Test API response
- Fix mismatch
- Test authentication
- Test CRUD
- Test errors
- Test mobile
- Test security boundary

---

# 78. FINAL PRINCIPLE

Arsitektur yang digunakan:

```text
             ┌─────────────────┐
             │    VISITOR      │
             └────────┬────────┘
                      ↓
             ┌─────────────────┐
             │   FRONTEND      │
             └────────┬────────┘
                      ↓
             ┌─────────────────┐
             │    REST API     │
             └────────┬────────┘
                      ↓
             ┌─────────────────┐
             │    DATABASE     │
             └─────────────────┘
```

Admin:

```text
ADMIN
  ↓
ADMIN FRONTEND
  ↓
AUTHENTICATED API
  ↓
DATABASE
```

Security principle:

```text
Frontend validation
        ≠
Security
```

Security selalu ditegakkan oleh backend.

Performance principle:

```text
Pagination
+
Caching
+
Rate Limiting
+
Query Optimization
+
Request Limits
```

lebih penting untuk MVP ini daripada membuat sistem analytics atau fitur kompleks.

---

# END OF PRD