import api from './api';

/**
 * Service pour le tableau de bord
 * Gère les statistiques et données agrégées pour le dashboard
 */
export const dashboardService = {
  /**
   * Récupérer les statistiques générales du tableau de bord
   * @returns {Promise<Object>} Statistiques du dashboard
   */
  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Récupérer les statistiques des produits
   * @returns {Promise<Object>} Statistiques des produits
   */
  async getProductStats() {
    const response = await api.get('/dashboard/stats/products');
    return response.data;
  },

  /**
   * Récupérer les statistiques des mouvements de stock
   * @param {Object} [filters] - Filtres optionnels
   * @param {string} [filters.period] - Période (day, week, month, year)
   * @param {string} [filters.dateFrom] - Date de début
   * @param {string} [filters.dateTo] - Date de fin
   * @returns {Promise<Object>} Statistiques des mouvements
   */
  async getMovementStats(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.period) params.append('period', filters.period);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await api.get(`/dashboard/stats/movements?${params.toString()}`);
    return response.data;
  },

  /**
   * Récupérer les statistiques des catégories
   * @returns {Promise<Object>} Statistiques des catégories
   */
  async getCategoryStats() {
    const response = await api.get('/dashboard/stats/categories');
    return response.data;
  },

  /**
   * Récupérer les produits avec stock faible
   * @param {number} [threshold=10] - Seuil de stock faible
   * @returns {Promise<Array>} Liste des produits avec stock faible
   */
  async getLowStockProducts(threshold = 10) {
    const response = await api.get(`/dashboard/low-stock?threshold=${threshold}`);
    return response.data;
  },

  /**
   * Récupérer les mouvements récents
   * @param {number} [limit=10] - Nombre de mouvements à récupérer
   * @returns {Promise<Array>} Liste des mouvements récents
   */
  async getRecentMovements(limit = 10) {
    const response = await api.get(`/dashboard/recent-movements?limit=${limit}`);
    return response.data;
  },

  /**
   * Récupérer les tendances de stock sur une période
   * @param {Object} [filters] - Filtres optionnels
   * @param {string} [filters.period] - Période (week, month, quarter, year)
   * @param {number} [filters.productId] - ID du produit spécifique
   * @param {number} [filters.categoryId] - ID de la catégorie
   * @returns {Promise<Array>} Données de tendances
   */
  async getStockTrends(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.period) params.append('period', filters.period);
    if (filters.productId) params.append('productId', filters.productId);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    
    const response = await api.get(`/dashboard/trends?${params.toString()}`);
    return response.data;
  },

  /**
   * Récupérer les alertes et notifications
   * @returns {Promise<Array>} Liste des alertes
   */
  async getAlerts() {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },

  /**
   * Marquer une alerte comme lue
   * @param {number} alertId - ID de l'alerte
   * @returns {Promise<Object>} Confirmation
   */
  async markAlertAsRead(alertId) {
    const response = await api.put(`/dashboard/alerts/${alertId}/read`);
    return response.data;
  },

  /**
   * Récupérer les rapports de performance
   * @param {Object} [filters] - Filtres optionnels
   * @param {string} [filters.period] - Période du rapport
   * @param {string} [filters.type] - Type de rapport
   * @returns {Promise<Object>} Données du rapport
   */
  async getPerformanceReport(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.period) params.append('period', filters.period);
    if (filters.type) params.append('type', filters.type);
    
    const response = await api.get(`/dashboard/reports/performance?${params.toString()}`);
    return response.data;
  }
};
