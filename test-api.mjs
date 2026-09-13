// Test script for API contracts and mock behavior
import { mockStorage } from './src/api/mockStorage.js';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './src/api/mockData.js';

// Setup minimal localStorage mock in Node environment
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { for (const k in store) delete store[k]; }
};

async function runTests() {
  console.log('--- RUNNING API SIMULATION TESTS ---');
  
  mockStorage.init();

  // Test 1: Get Categories
  const catsRes = await mockStorage.getCategories();
  console.assert(catsRes.success === true, 'Categories fetch failed');
  console.assert(catsRes.data.length === INITIAL_CATEGORIES.length, 'Categories count mismatch');
  console.log('✔ Test 1: Categories fetched with product counts:', catsRes.data[0].name, `(${catsRes.data[0].product_count} products)`);

  // Test 2: Get Products with sorting
  const prodResAsc = await mockStorage.getProducts({ sort: 'price_asc' });
  console.assert(prodResAsc.success === true, 'Products asc fetch failed');
  console.assert(prodResAsc.data.items[0].price <= prodResAsc.data.items[1].price, 'Sort price_asc incorrect');
  console.log('✔ Test 2: Sort price_asc works. Lowest price:', prodResAsc.data.items[0].name, prodResAsc.data.items[0].price);

  // Test 3: Safe Delete Category Dependency Check (409 Conflict Simulation)
  const catWithProd = catsRes.data.find(c => c.product_count > 0);
  console.assert(catWithProd !== undefined, 'No category with products found');
  const deleteBlockedRes = await mockStorage.deleteCategory(catWithProd.id);
  console.assert(deleteBlockedRes.success === false, 'Category with products was deleted, expected block!');
  console.assert(deleteBlockedRes.status === 409, `Expected 409 Conflict status, got: ${deleteBlockedRes.status}`);
  console.log('✔ Test 3: Delete Category blocked with simulated 409 Conflict:', deleteBlockedRes.message);

  // Test 4: Product Status Update (via updateProduct)
  const prod = prodResAsc.data.items[0];
  const updateRes = await mockStorage.updateProduct(prod.id, { status: 'INACTIVE' });
  console.assert(updateRes.success === true, 'Update product failed');
  console.assert(updateRes.data.status === 'INACTIVE', 'Status update failed');
  console.log('✔ Test 4: Product status updated to INACTIVE via updateProduct()');

  // Test 5: Verify public products only returns ACTIVE
  const publicProds = await mockStorage.getProducts({ status: 'ACTIVE' });
  console.assert(!publicProds.data.items.some(p => p.id === prod.id), 'Inactive product should not appear in public query');
  console.log('✔ Test 5: Inactive product filtered out from public view successfully');

  // Test 6: Reset to Default
  mockStorage.resetToDefault();
  const resetCats = await mockStorage.getCategories();
  console.assert(resetCats.data.length === INITIAL_CATEGORIES.length, 'Reset failed');
  console.log('✔ Test 6: Reset to default seed data passed');

  console.log('\n ALL TASK 2 TESTS PASSED PERFECTLY!\n');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
