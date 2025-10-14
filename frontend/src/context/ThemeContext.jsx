import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Contexte pour la gestion des thèmes (clair/sombre)
 */
const ThemeContext = createContext()

/**
 * Hook personnalisé pour utiliser le contexte de thème
 * @returns {Object} - Objet contenant le thème actuel et les fonctions de gestion
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  }
  return context
}

/**
 * Provider de thème qui gère l'état global du thème
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} - Provider de thème
 */
export const ThemeProvider = ({ children }) => {
  // État du thème avec valeur par défaut
  const [theme, setTheme] = useState(() => {
    // Récupérer le thème sauvegardé ou utiliser 'light' par défaut
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  })

  /**
   * Bascule entre les thèmes clair et sombre
   */
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      return newTheme
    })
  }

  /**
   * Définit un thème spécifique
   * @param {string} newTheme - Nouveau thème ('light' ou 'dark')
   */
  const setThemeMode = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)
    }
  }

  // Appliquer le thème au document HTML
  useEffect(() => {
    const root = document.documentElement
    
    // Supprimer les classes de thème précédentes
    root.classList.remove('light', 'dark')
    
    // Ajouter la classe du thème actuel
    root.classList.add(theme)
    
    // Mettre à jour l'attribut data-theme pour les composants qui en ont besoin
    root.setAttribute('data-theme', theme)
  }, [theme])

  // Valeur du contexte
  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext
