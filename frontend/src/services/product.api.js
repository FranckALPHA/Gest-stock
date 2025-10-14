import api from './api';

/**
 * Service pour la gestion des produits
 * Gère toutes les opérations CRUD sur les produits
 */
export const productService = {
  /**
   * Récupérer tous les produits avec pagination et filtres
   * @param {Object} [params] - Paramètres de requête
   * @param {number} [params.page=1] - Numéro de page
   * @param {number} [params.limit=10] - Nombre d'éléments par page
   * @param {number} [params.category_id] - Filtrer par catégorie
   * @param {number} [params.supplier_id] - Filtrer par fournisseur
   * @param {string} [params.search] - Rechercher par nom ou description
   * @returns {Promise<Object>} Objet avec products et pagination
   */
  async getAllProducts(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.supplier_id) queryParams.append('supplier_id', params.supplier_id);
    if (params.search) queryParams.append('search', params.search);
    
    const response = await api.get(`/products?${queryParams.toString()}`);
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
