import api from './api.js'

/**
 * Service pour la gestion des utilisateurs
 * Toutes les opérations nécessitent des privilèges d'administrateur
 */

/**
 * Récupérer tous les utilisateurs
 * @returns {Promise} - Promesse avec la liste des utilisateurs
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    throw error
  }
}

/**
 * Activer ou désactiver un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @param {boolean} isActive - État d'activation
 * @returns {Promise} - Promesse avec la réponse
 */
export const toggleUserActive = async (userId, isActive) => {
  try {
    const response = await api.put(`/users/${userId}/toggle-active`, {
      is_active: isActive
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la modification du statut utilisateur:', error)
    throw error
  }
}

/**
 * Activer un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise} - Promesse avec la réponse
 */
export const activateUser = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}/activate`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de l\'activation de l\'utilisateur:', error)
    throw error
  }
}

/**
 * Désactiver un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise} - Promesse avec la réponse
 */
export const deactivateUser = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}/deactivate`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la désactivation de l\'utilisateur:', error)
    throw error
  }
}

/**
 * Modifier le mot de passe d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise} - Promesse avec la réponse
 */
export const updateUserPassword = async (userId, newPassword) => {
  try {
    const response = await api.put(`/users/${userId}/password`, {
      new_password: newPassword
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la modification du mot de passe:', error)
    throw error
  }
}

// Export du service complet
export const userService = {
  getAllUsers,
  toggleUserActive,
  activateUser,
  deactivateUser,
  updateUserPassword
}
