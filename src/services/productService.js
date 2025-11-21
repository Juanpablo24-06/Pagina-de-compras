import { productsDB } from '../data/products';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getAll: async () => {
    await delay(300); // Simulate 300ms latency
    return [...productsDB];
  },

  getById: async (id) => {
    await delay(200);
    return productsDB.find(p => p.id === id) || null;
  },

  getByCategory: async (category) => {
    await delay(300);
    if (category === 'All') return [...productsDB];
    return productsDB.filter(p => p.category === category);
  },

  search: async (query) => {
      await delay(300);
      const lowerQuery = query.toLowerCase();
      return productsDB.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(lowerQuery)))
      );
  }
};
