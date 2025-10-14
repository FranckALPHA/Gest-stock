import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, login as apiLogin, setAuthToken } from '../services/api'

/**
 * Contexte d'authentification de l'application
 * Fournit l'état utilisateur, les actions de connexion/déconnexion et le chargement
 * @returns {import('react').Context}
 */
const AuthContext = createContext(null)

/**
 * Provider du contexte d'authentification
 * Initialise le token depuis localStorage et tente de récupérer l'utilisateur courant
 * @param {{children: import('react').ReactNode}} props - Enfants React
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      getMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('token')
          setAuthToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  /**
   * Connecte l'utilisateur via l'API et stocke le token
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<void>}
   */
  async function login(username, password) {
    const { token, user } = await apiLogin(username, password)
    localStorage.setItem('token', token)
    setAuthToken(token)
    setUser(user)
  }

  /**
   * Déconnecte l'utilisateur et nettoie le token
   * @returns {void}
   */
  function logout() {
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook d'accès rapide au contexte d'authentification
 * @returns {{user:any,loading:boolean,login:Function,logout:Function}}
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return ctx
}
