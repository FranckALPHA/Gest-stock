import api from './api';

/**
 * Service pour la gestion des mouvements de stock
 * Gère les entrées et sorties de stock, l'historique des mouvements
 */
export const stockMovementService = {
  /**
   * Récupérer tous les mouvements de stock (Admin uniquement)
   * @returns {Promise<Array>} Liste des mouvements
   */
  async getAllMovements() {
    const response = await api.get('/stock-movements');
    return response.data;
  },

  /**
   * Récupérer un mouvement de stock par son ID (Admin uniquement)
   * @param {number} id - ID du mouvement
   * @returns {Promise<Object>} Détails du mouvement
   */
  async getMovementById(id) {
    const response = await api.get(`/stock-movements/${id}`);
    return response.data;
  },

  /**
   * Récupérer l'historique des mouvements pour un produit (Authentifié)
   * @param {number} productId - ID du produit
   * @returns {Promise<Array>} Historique des mouvements du produit
   */
  async getMovementsByProduct(productId) {
    const response = await api.get(`/stock-movements/product/${productId}`);
    return response.data;
  },

  /**
   * Créer un nouveau mouvement de stock (Authentifié)
   * @param {Object} movementData - Données du mouvement
   * @param {number} movementData.product_id - ID du produit
   * @param {string} movementData.type - Type de mouvement ('in' ou 'out')
   * @param {number} movementData.quantity - Quantité
   * @param {string} [movementData.note] - Note du mouvement (optionnel)
   * @returns {Promise<Object>} Mouvement créé
   */
  async createMovement(movementData) {
    const response = await api.post('/stock-movements', movementData);
    return response.data;
  }
};
