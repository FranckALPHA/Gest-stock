import api from './api';

/**
 * Service pour la gestion des produits
 * Gère toutes les opérations CRUD sur les produits
 */
export const productService = {
  /**
   * Récupérer tous les produits
   * @returns {Promise<Array>} Liste des produits
   */
  async getAllProducts() {
    const response = await api.get('/products');
    return response.data;
  },

  /**
   * Récupérer un produit par son ID
   * @param {number} id - ID du produit
   * @returns {Promise<Object>} Données du produit
   */
  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau produit
   * @param {Object} productData - Données du produit
   * @returns {Promise<Object>} Produit créé
   */
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Mettre à jour un produit
   * @param {number} id - ID du produit
   * @param {Object} productData - Nouvelles données du produit
   * @returns {Promise<Object>} Produit mis à jour
   */
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Supprimer un produit
   * @param {number} id - ID du produit
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Rechercher des produits par nom ou description
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<Array>} Liste des produits correspondants
   */
  async searchProducts(searchTerm) {
    const response = await api.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  /**
   * Récupérer les produits par catégorie
   * @param {number} categoryId - ID de la catégorie
   * @returns {Promise<Array>} Liste des produits de la catégorie
   */
  async getProductsByCategory(categoryId) {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  /**
   * Récupérer les produits avec stock faible
   * @param {number} [threshold=10] - Seuil de stock faible
   * @returns {Promise<Array>} Liste des produits avec stock faible
   */
  async getLowStockProducts(threshold = 10) {
    const response = await api.get(`/products/low-stock?threshold=${threshold}`);
    return response.data;
  }
};
