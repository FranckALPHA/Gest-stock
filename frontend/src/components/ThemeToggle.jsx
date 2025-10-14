import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'

/**
 * Composant de basculement entre les thèmes clair et sombre
 * @returns {JSX.Element} - Bouton de basculement de thème
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-10 h-10 p-0 hover:bg-muted/50 transition-colors"
      title={`Basculer vers le mode ${isDark ? 'clair' : 'sombre'}`}
    >
      <div className="relative w-5 h-5">
        {/* Icône du soleil (mode clair) */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        
        {/* Icône de la lune (mode sombre) */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      
      {/* Indicateur de thème actuel */}
      <span className="sr-only">
        Mode {isDark ? 'sombre' : 'clair'} actif
      </span>
    </Button>
  )
}

/**
 * Composant de sélecteur de thème avec menu déroulant
 * @returns {JSX.Element} - Sélecteur de thème
 */
export const ThemeSelector = () => {
  const { theme, setThemeMode, isDark } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setThemeMode('light')}
        className="flex items-center gap-2"
      >
        <Sun className="w-4 h-4" />
        Clair
      </Button>
      
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setThemeMode('dark')}
        className="flex items-center gap-2"
      >
        <Moon className="w-4 h-4" />
        Sombre
      </Button>
    </div>
  )
}

export default ThemeToggle
