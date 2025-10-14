import axios from 'axios'

/**
 * Configuration de base pour les requêtes API
 * Gère l'authentification et les erreurs communes
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Intercepteur de requête pour ajouter le token d'authentification
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Intercepteur de réponse pour gérer les erreurs communes
 */
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response?.status === 401) {
      // Supprimer le token et rediriger vers la page de connexion
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Rediriger vers la page de connexion si on n'y est pas déjà
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
