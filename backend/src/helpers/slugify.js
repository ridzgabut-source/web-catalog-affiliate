// helpers/slugify.js
// Mengkonversi nama produk/kategori ke URL-safe slug
// Contoh: "Sony WH-1000XM5 Wireless Headphone!" → "sony-wh-1000xm5-wireless-headphone"

/**
 * Generate URL-safe slug dari string
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    // Ganti karakter aksent/unicode ke ASCII
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Ganti & menjadi 'dan'
    .replace(/&/g, 'dan')
    // Ganti spasi dan karakter non-alphanumeric dengan strip
    .replace(/[^a-z0-9]+/g, '-')
    // Hapus strip di awal dan akhir
    .replace(/^-+|-+$/g, '');
}

module.exports = { slugify };
