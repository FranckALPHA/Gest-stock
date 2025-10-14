import axios from 'axios'

/**
 * Crée et configure une instance Axios pour l'API backend
 * @returns {import('axios').AxiosInstance} - Instance Axios configurée
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const api = axios.create({ baseURL: `${API_URL}/api` })

/**
 * Définit ou supprime le header Authorization pour Axios
 * @param {string|null} token - Token JWT ou null pour supprimer
 * @returns {void}
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

/**
 * Effectue la requête de connexion
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<{token:string,user:any}>} - Réponse backend
 */
export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password })
  return data
}

/**
 * Récupère les informations de l'utilisateur courant
 * @returns {Promise<any>} - Données utilisateur
 */
export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}
