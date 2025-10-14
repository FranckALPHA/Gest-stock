import api from './api';

/**
 * Service pour la gestion des catégories
 * Gère toutes les opérations CRUD sur les catégories de produits
 */
export const categoryService = {
  /**
   * Récupérer toutes les catégories avec pagination et recherche
   * @param {Object} params - Paramètres de recherche et pagination
   * @param {string} [params.search] - Terme de recherche
   * @param {number} [params.page=1] - Numéro de page
   * @param {number} [params.limit=10] - Nombre d'éléments par page
   * @returns {Promise<Object>} Objet avec categories et pagination
   */
  async getAllCategories(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Récupérer une catégorie par son ID
   * @param {number} id - ID de la catégorie
   * @returns {Promise<Object>} Détails de la catégorie
   */
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle catégorie (admin/manager uniquement)
   * @param {Object} categoryData - Données de la catégorie
   * @param {string} categoryData.name - Nom de la catégorie
   * @param {string} [categoryData.description] - Description de la catégorie (optionnel)
   * @returns {Promise<Object>} Catégorie créée
   */
  async createCategory({ name, description }) {
    const response = await api.post('/categories', { name, description });
    return response.data;
  },

  /**
   * Mettre à jour une catégorie (admin/manager uniquement)
   * @param {number} id - ID de la catégorie
   * @param {Object} updates - Données à mettre à jour
   * @param {string} [updates.name] - Nouveau nom de la catégorie
   * @param {string} [updates.description] - Nouvelle description de la catégorie
   * @returns {Promise<Object>} Catégorie mise à jour
   */
  async updateCategory(id, { name, description }) {
    const response = await api.put(`/categories/${id}`, { name, description });
    return response.data;
  },

  /**
   * Supprimer une catégorie (admin/manager uniquement)
   * @param {number} id - ID de la catégorie à supprimer
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  /**
   * Vérifie si une catégorie peut être supprimée (non utilisée par des produits)
   * @param {number} id - ID de la catégorie
   * @returns {Promise<boolean>} true si la catégorie peut être supprimée
   */
  async canDeleteCategory(id) {
    try {
      // Implémentez cette logique si votre API fournit un moyen de vérifier
      // si une catégorie est utilisée par des produits
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification de suppression:', error);
      return false;
    }
  }
};
