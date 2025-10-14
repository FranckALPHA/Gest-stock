import api from './api';

/**
 * Service pour la gestion des mouvements de stock
 * Gère les entrées et sorties de stock, l'historique des mouvements
 */
export const stockMovementService = {
  /**
   * Récupérer tous les mouvements de stock
   * @param {Object} [filters] - Filtres optionnels
   * @param {string} [filters.type] - Type de mouvement (in/out)
   * @param {number} [filters.productId] - ID du produit
   * @param {string} [filters.dateFrom] - Date de début (ISO string)
   * @param {string} [filters.dateTo] - Date de fin (ISO string)
   * @returns {Promise<Array>} Liste des mouvements
   */
  async getAllMovements(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.productId) params.append('productId', filters.productId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await api.get(`/stock-movements?${params.toString()}`);
    return response.data;
  },

  /**
   * Récupérer un mouvement de stock par son ID
   * @param {number} id - ID du mouvement
   * @returns {Promise<Object>} Détails du mouvement
   */
  async getMovementById(id) {
    const response = await api.get(`/stock-movements/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau mouvement de stock
   * @param {Object} movementData - Données du mouvement
   * @param {number} movementData.productId - ID du produit
   * @param {string} movementData.type - Type de mouvement ('in' ou 'out')
   * @param {number} movementData.quantity - Quantité
   * @param {string} [movementData.reason] - Raison du mouvement
   * @param {string} [movementData.notes] - Notes additionnelles
   * @returns {Promise<Object>} Mouvement créé
   */
  async createMovement(movementData) {
    const response = await api.post('/stock-movements', movementData);
    return response.data;
  },

  /**
   * Mettre à jour un mouvement de stock
   * @param {number} id - ID du mouvement
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Object>} Mouvement mis à jour
   */
  async updateMovement(id, updates) {
    const response = await api.put(`/stock-movements/${id}`, updates);
    return response.data;
  },

  /**
   * Supprimer un mouvement de stock
   * @param {number} id - ID du mouvement
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteMovement(id) {
    const response = await api.delete(`/stock-movements/${id}`);
    return response.data;
  },

  /**
   * Récupérer l'historique des mouvements pour un produit
   * @param {number} productId - ID du produit
   * @param {Object} [filters] - Filtres optionnels
   * @returns {Promise<Array>} Historique des mouvements du produit
   */
  async getProductMovementHistory(productId, filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.type) params.append('type', filters.type);
    
    const response = await api.get(`/stock-movements/product/${productId}?${params.toString()}`);
    return response.data;
  },

  /**
   * Récupérer les mouvements récents (derniers 30 jours par défaut)
   * @param {number} [days=30] - Nombre de jours à récupérer
   * @returns {Promise<Array>} Mouvements récents
   */
  async getRecentMovements(days = 30) {
    const response = await api.get(`/stock-movements/recent?days=${days}`);
    return response.data;
  },

  /**
   * Effectuer un ajustement de stock (correction d'inventaire)
   * @param {number} productId - ID du produit
   * @param {number} newQuantity - Nouvelle quantité en stock
   * @param {string} [reason] - Raison de l'ajustement
   * @returns {Promise<Object>} Mouvement d'ajustement créé
   */
  async adjustStock(productId, newQuantity, reason = 'Ajustement de stock') {
    const response = await api.post('/stock-movements/adjust', {
      productId,
      newQuantity,
      reason
    });
    return response.data;
  }
};
