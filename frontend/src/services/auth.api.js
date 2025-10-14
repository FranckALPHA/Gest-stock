import api from './api';

/**
 * Service d'authentification
 * Gère la connexion, déconnexion et la gestion des sessions utilisateur
 */
export const authService = {
  /**
   * Connexion d'un utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Réponse de l'API avec le token et les données utilisateur
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Déconnexion de l'utilisateur
   * Supprime le token et les données utilisateur du localStorage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} True si connecté, false sinon
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Récupérer les informations de l'utilisateur connecté depuis le localStorage
   * @returns {Object|null} Informations utilisateur ou null
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Récupérer le token d'authentification
   * @returns {string|null} Token ou null
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Récupérer les informations de l'utilisateur connecté depuis l'API
   * @returns {Promise<Object>} Informations de l'utilisateur
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      // Mettre à jour le stockage local avec les dernières données utilisateur
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      // En cas d'erreur 401 (non autorisé), déconnecter l'utilisateur
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error;
    }
  }
};
