import api from './api';

/**
 * Service pour la gestion des fournisseurs
 * Gère toutes les opérations CRUD sur les fournisseurs
 */
export const supplierService = {
  /**
   * Récupérer tous les fournisseurs
   * @returns {Promise<Array>} Liste des fournisseurs
   */
  async getAllSuppliers() {
    const response = await api.get('/suppliers');
    return response.data;
  },

  /**
   * Récupérer un fournisseur par son ID
   * @param {number} id - ID du fournisseur
   * @returns {Promise<Object>} Données du fournisseur
   */
  async getSupplierById(id) {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau fournisseur (Admin uniquement)
   * @param {Object} supplierData - Données du fournisseur
   * @param {string} supplierData.name - Nom du fournisseur
   * @param {string} [supplierData.contact] - Contact du fournisseur (optionnel)
   * @param {string} [supplierData.email] - Email du fournisseur (optionnel)
   * @param {string} [supplierData.phone] - Téléphone du fournisseur (optionnel)
   * @param {string} [supplierData.address] - Adresse du fournisseur (optionnel)
   * @returns {Promise<Object>} Fournisseur créé
   */
  async createSupplier(supplierData) {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  },

  /**
   * Mettre à jour un fournisseur (Admin uniquement)
   * @param {number} id - ID du fournisseur
   * @param {Object} supplierData - Nouvelles données du fournisseur
   * @param {string} [supplierData.name] - Nouveau nom du fournisseur
   * @param {string} [supplierData.contact] - Nouveau contact du fournisseur
   * @param {string} [supplierData.email] - Nouvel email du fournisseur
   * @param {string} [supplierData.phone] - Nouveau téléphone du fournisseur
   * @param {string} [supplierData.address] - Nouvelle adresse du fournisseur
   * @returns {Promise<Object>} Fournisseur mis à jour
   */
  async updateSupplier(id, supplierData) {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  /**
   * Supprimer un fournisseur (Admin uniquement)
   * @param {number} id - ID du fournisseur
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteSupplier(id) {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  }
};
