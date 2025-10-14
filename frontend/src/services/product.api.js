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
   * Créer un nouveau produit (Admin uniquement)
   * @param {Object} productData - Données du produit
   * @param {string} productData.name - Nom du produit
   * @param {string} [productData.description] - Description du produit (optionnel)
   * @param {number} [productData.category_id] - ID de la catégorie (optionnel)
   * @param {number} [productData.supplier_id] - ID du fournisseur (optionnel)
   * @param {number} productData.price - Prix du produit
   * @param {number} [productData.quantity] - Quantité en stock (optionnel, défaut: 0)
   * @param {number} [productData.alert_threshold] - Seuil d'alerte (optionnel, défaut: 10)
   * @returns {Promise<Object>} Produit créé
   */
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Mettre à jour un produit (Admin uniquement)
   * @param {number} id - ID du produit
   * @param {Object} productData - Nouvelles données du produit
   * @param {string} [productData.name] - Nouveau nom du produit
   * @param {string} [productData.description] - Nouvelle description du produit
   * @param {number} [productData.category_id] - Nouvel ID de la catégorie
   * @param {number} [productData.supplier_id] - Nouvel ID du fournisseur
   * @param {number} [productData.price] - Nouveau prix du produit
   * @param {number} [productData.quantity] - Nouvelle quantité en stock
   * @param {number} [productData.alert_threshold] - Nouveau seuil d'alerte
   * @returns {Promise<Object>} Produit mis à jour
   */
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Supprimer un produit (Admin uniquement)
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
  }
};
