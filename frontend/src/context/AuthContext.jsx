import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.api.js';

// Création du contexte d'authentification
const AuthContext = createContext();

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns {Object} Contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

/**
 * Fournisseur du contexte d'authentification
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} Composant AuthProvider
 */
export const AuthProvider = ({ children }) => {
  // États pour l'authentification
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Vérifier et mettre à jour l'état d'authentification
   */
  const checkAndUpdateAuth = useCallback(async () => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('Aucun token trouvé');
      }
      
      // Récupérer les informations à jour de l'utilisateur
      const userData = await authService.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('Aucune donnée utilisateur valide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    checkAndUpdateAuth();
  }, [checkAndUpdateAuth]);

  // Fonction pour forcer une actualisation des données utilisateur
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
      throw error;
    }
  }, []);

  /**
   * Fonction de connexion
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Données de l'utilisateur connecté
   */
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(username, password);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      // Réinitialiser l'état en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fonction de déconnexion
   */
  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param {string} role - Rôle à vérifier
   * @returns {boolean} True si l'utilisateur a le rôle
   */
  const hasRole = (role) => {
    return user && user.role === role;
  };

  /**
   * Vérifier si l'utilisateur est administrateur
   * @returns {boolean} True si l'utilisateur est admin
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  /**
   * Vérifier si l'utilisateur est gestionnaire
   * @returns {boolean} True si l'utilisateur est gestionnaire
   */
  const isManager = () => {
    return hasRole('manager');
  };

  /**
   * Vérifier si l'utilisateur peut accéder à une fonctionnalité
   * @param {string} permission - Permission à vérifier
   * @returns {boolean} True si l'utilisateur a la permission
   */
  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Logique de permissions basée sur les rôles
    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage_users'],
      manager: ['read', 'write'],
      user: ['read']
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    hasRole,
    isAdmin,
    isManager,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
