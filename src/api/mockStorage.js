import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, DEMO_ADMIN } from './mockData.js';

const STORAGE_KEYS = {
  PRODUCTS: 'kk_products_v1',
  CATEGORIES: 'kk_categories_v1',
  AUTH_TOKEN: 'kk_auth_token_v1',
  AUTH_USER: 'kk_auth_user_v1',
};

// Artificial network latency simulation (250ms)
const simulateDelay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

class MockStorage {
  constructor() {
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return { success: true, message: 'Mock data berhasil di-reset ke pengaturan awal.' };
  }

  // --- CATEGORIES ---

  async getCategories({ includeInactive = false } = {}) {
    await simulateDelay();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');

    // Calculate product counts for each category
    const categoriesWithCount = categories
      .filter(cat => includeInactive || cat.status === 'ACTIVE')
      .map(cat => {
        const count = products.filter(p => p.category_id === cat.id).length;
        return {
          ...cat,
          product_count: count,
        };
      });

    return {
      success: true,
      data: categoriesWithCount,
      message: null,
    };
  }

  async getCategoryBySlug(slug) {
    await simulateDelay();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const category = categories.find(c => c.slug === slug);

    if (!category) {
      return {
        success: false,
        status: 404,
        message: 'Kategori tidak ditemukan.',
        data: null,
      };
    }

    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const count = products.filter(p => p.category_id === category.id).length;

    return {
      success: true,
      data: { ...category, product_count: count },
      message: null,
    };
  }

  async createCategory(categoryData) {
    await simulateDelay();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');

    // Validation
    if (!categoryData.name || categoryData.name.trim() === '') {
      return {
        success: false,
        status: 422,
        message: 'Nama kategori wajib diisi.',
        errors: { name: ['Nama kategori wajib diisi.'] },
      };
    }

    const slug = categoryData.slug || categoryData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check slug uniqueness
    if (categories.some(c => c.slug === slug)) {
      return {
        success: false,
        status: 422,
        message: 'Slug kategori sudah digunakan.',
        errors: { slug: ['Slug kategori sudah digunakan.'] },
      };
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      slug,
      description: categoryData.description || '',
      status: categoryData.status || 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    categories.unshift(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

    return {
      success: true,
      data: { ...newCategory, product_count: 0 },
      message: 'Kategori berhasil ditambahkan.',
    };
  }

  async updateCategory(id, categoryData) {
    await simulateDelay();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return {
        success: false,
        status: 404,
        message: 'Kategori tidak ditemukan.',
        data: null,
      };
    }

    const updated = {
      ...categories[index],
      ...categoryData,
      updated_at: new Date().toISOString(),
    };

    categories[index] = updated;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const count = products.filter(p => p.category_id === id).length;

    return {
      success: true,
      data: { ...updated, product_count: count },
      message: 'Kategori berhasil diperbarui.',
    };
  }

  async deleteCategory(id) {
    await simulateDelay();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');

    const category = categories.find(c => c.id === id);
    if (!category) {
      return {
        success: false,
        status: 404,
        message: 'Kategori tidak ditemukan.',
      };
    }

    // Dependency check: simulate backend 409 Conflict rejection!
    const linkedProducts = products.filter(p => p.category_id === id);
    if (linkedProducts.length > 0) {
      return {
        success: false,
        status: 409,
        message: `Kategori masih digunakan oleh ${linkedProducts.length} produk. Pindahkan atau hapus produk terlebih dahulu.`,
      };
    }

    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

    return {
      success: true,
      data: null,
      message: 'Kategori berhasil dihapus.',
    };
  }

  // --- PRODUCTS ---

  async getProducts({
    search = '',
    category = '',
    sort = 'newest',
    page = 1,
    per_page = 6,
    featured = null,
    status = null, // null for public (defaults to ACTIVE), or explicit string
  } = {}) {
    await simulateDelay();
    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');

    // Public view only sees ACTIVE products
    if (status) {
      products = products.filter(p => p.status === status);
    } else {
      products = products.filter(p => p.status === 'ACTIVE');
    }

    // Featured filter
    if (featured !== null) {
      const isFeatured = String(featured) === 'true';
      products = products.filter(p => Boolean(p.is_featured) === isFeatured);
    }

    // Category filter (accepts category slug or id)
    if (category) {
      const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
      const targetCategory = categories.find(c => c.slug === category || c.id === category);
      if (targetCategory) {
        products = products.filter(p => p.category_id === targetCategory.id);
      } else {
        products = [];
      }
    }

    // Search filter (name and description)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting allowlist: newest, price_asc, price_desc
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    const total = products.length;
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(per_page, 10) || 6));
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (currentPage - 1) * limit;
    const paginatedItems = products.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        items: paginatedItems,
        pagination: {
          total,
          page: currentPage,
          per_page: limit,
          total_pages: totalPages,
        },
      },
      message: null,
    };
  }

  async getProductBySlug(slug) {
    await simulateDelay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const product = products.find(p => p.slug === slug);

    if (!product) {
      return {
        success: false,
        status: 404,
        message: 'Produk tidak ditemukan.',
        data: null,
      };
    }

    return {
      success: true,
      data: product,
      message: null,
    };
  }

  async createProduct(productData) {
    await simulateDelay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');

    // Validation
    const errors = {};
    if (!productData.name) errors.name = ['Nama produk wajib diisi.'];
    if (!productData.category_id) errors.category_id = ['Kategori wajib dipilih.'];
    if (productData.price === undefined || productData.price === null || productData.price < 0) {
      errors.price = ['Harga harus berupa angka valid minimal 0.'];
    }
    if (!productData.image) errors.image = ['URL gambar produk wajib diisi.'];
    if (!productData.affiliate_url) errors.affiliate_url = ['URL afiliasi wajib diisi.'];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        status: 422,
        message: 'Validasi form gagal. Mohon periksa kembali input Anda.',
        errors,
      };
    }

    const category = categories.find(c => c.id === productData.category_id);
    const categoryName = category ? category.name : 'Umum';

    const slug = productData.slug || productData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Determine marketplace type from affiliate url if not explicitly set
    let marketplaceType = productData.marketplace_type || 'generic';
    const urlLower = (productData.affiliate_url || '').toLowerCase();
    if (urlLower.includes('shopee')) marketplaceType = 'shopee';
    else if (urlLower.includes('tokopedia')) marketplaceType = 'tokopedia';
    else if (urlLower.includes('tiktok')) marketplaceType = 'tiktok';

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: productData.name.trim(),
      slug,
      category_id: productData.category_id,
      category_name: categoryName,
      description: productData.description || '',
      price: Number(productData.price),
      original_price: productData.original_price ? Number(productData.original_price) : undefined,
      image: productData.image,
      affiliate_url: productData.affiliate_url,
      marketplace_type: marketplaceType,
      is_featured: Boolean(productData.is_featured),
      status: productData.status || 'ACTIVE',
      specs: productData.specs || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return {
      success: true,
      data: newProduct,
      message: 'Produk berhasil ditambahkan ke katalog.',
    };
  }

  async updateProduct(id, productData) {
    await simulateDelay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return {
        success: false,
        status: 404,
        message: 'Produk tidak ditemukan.',
        data: null,
      };
    }

    let categoryName = products[index].category_name;
    if (productData.category_id && productData.category_id !== products[index].category_id) {
      const cat = categories.find(c => c.id === productData.category_id);
      if (cat) categoryName = cat.name;
    }

    let marketplaceType = productData.marketplace_type || products[index].marketplace_type || 'generic';
    if (productData.affiliate_url) {
      const urlLower = productData.affiliate_url.toLowerCase();
      if (urlLower.includes('shopee')) marketplaceType = 'shopee';
      else if (urlLower.includes('tokopedia')) marketplaceType = 'tokopedia';
      else if (urlLower.includes('tiktok')) marketplaceType = 'tiktok';
    }

    const updated = {
      ...products[index],
      ...productData,
      category_name: categoryName,
      marketplace_type: marketplaceType,
      price: productData.price !== undefined ? Number(productData.price) : products[index].price,
      original_price: productData.original_price !== undefined 
        ? (productData.original_price ? Number(productData.original_price) : undefined)
        : products[index].original_price,
      updated_at: new Date().toISOString(),
    };

    products[index] = updated;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return {
      success: true,
      data: updated,
      message: 'Produk berhasil diperbarui.',
    };
  }

  async deleteProduct(id) {
    await simulateDelay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return {
        success: false,
        status: 404,
        message: 'Produk tidak ditemukan.',
      };
    }

    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));

    return {
      success: true,
      data: null,
      message: 'Produk berhasil dihapus dari katalog.',
    };
  }

  // --- AUTH ---

  async login({ email, password }) {
    await simulateDelay();
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const token = `mock-token-${Date.now()}`;
      const user = {
        id: DEMO_ADMIN.id,
        email: DEMO_ADMIN.email,
        name: DEMO_ADMIN.name,
        role: DEMO_ADMIN.role,
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));

      return {
        success: true,
        data: { token, user },
        message: 'Login berhasil. Selamat datang di Admin Panel.',
      };
    }

    return {
      success: false,
      status: 401,
      message: 'Kombinasi email atau password salah. Silakan coba lagi.',
      data: null,
    };
  }

  async logout() {
    await simulateDelay(100);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    return {
      success: true,
      data: null,
      message: 'Anda telah berhasil logout.',
    };
  }

  async getMe() {
    await simulateDelay(100);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

    if (!token || !userStr) {
      return {
        success: false,
        status: 401,
        message: 'Session berakhir. Silakan login kembali.',
        data: null,
      };
    }

    return {
      success: true,
      data: JSON.parse(userStr),
      message: null,
    };
  }
}

export const mockStorage = new MockStorage();
