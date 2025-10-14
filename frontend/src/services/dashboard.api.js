import api from './api';

/**
 * Service pour le tableau de bord
 * Gère les statistiques et données agrégées pour le dashboard
 */
export const dashboardService = {
  /**
   * Récupérer les statistiques générales du tableau de bord (Authentifié)
   * @returns {Promise<Object>} Statistiques du dashboard
   * @returns {Promise<{totalProducts: number, totalQuantity: number, totalValue: number}>}
   */
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Récupérer les alertes de stock faible (Authentifié)
   * @returns {Promise<Array>} Liste des produits avec stock faible
   */
  async getAlerts() {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },

  /**
   * Récupérer les mouvements récents (Authentifié)
   * @returns {Promise<Array>} Liste des mouvements récents (limite 20)
   */
  async getRecentMovements() {
    const response = await api.get('/dashboard/recent-movements');
    return response.data;
  }
};
