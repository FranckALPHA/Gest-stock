import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour gérer les notifications toast
 * @returns {Object} Objet contenant les fonctions et l'état des toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  /**
   * Ajoute un nouveau toast
   * @param {Object} toast - Configuration du toast
   * @param {string} toast.title - Titre du toast
   * @param {string} toast.description - Description du toast
   * @param {string} toast.type - Type du toast (success, error, warning, info)
   * @param {number} toast.duration - Durée d'affichage en ms (défaut: 5000)
   */
  const addToast = useCallback(({ title, description, type = 'info', duration = 5000 }) => {
    const id = Date.now().toString()
    const newToast = {
      id,
      title,
      description,
      type,
      duration
    }

    setToasts(prev => [...prev, newToast])

    // Supprimer automatiquement le toast après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  /**
   * Supprime un toast par son ID
   * @param {string} id - ID du toast à supprimer
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  /**
   * Supprime tous les toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  /**
   * Affiche un toast de succès
   * @param {string} title - Titre du toast
   * @param {string} description - Description du toast
   */
  const success = useCallback((title, description) => {
    return addToast({ title, description, type: 'success' })
  }, [addToast])

  /**
   * Affiche un toast d'erreur
   * @param {string} title - Titre du toast
   * @param {string} description - Description du toast
   */
  const error = useCallback((title, description) => {
    return addToast({ title, description, type: 'error' })
  }, [addToast])

  /**
   * Affiche un toast d'avertissement
   * @param {string} title - Titre du toast
   * @param {string} description - Description du toast
   */
  const warning = useCallback((title, description) => {
    return addToast({ title, description, type: 'warning' })
  }, [addToast])

  /**
   * Affiche un toast d'information
   * @param {string} title - Titre du toast
   * @param {string} description - Description du toast
   */
  const info = useCallback((title, description) => {
    return addToast({ title, description, type: 'info' })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  }
}
