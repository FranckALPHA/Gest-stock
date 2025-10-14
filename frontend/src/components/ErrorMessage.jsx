import { AlertTriangle, X, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'

/**
 * Composant pour afficher les messages d'erreur de manière élégante
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre de l'erreur
 * @param {string} props.message - Message d'erreur
 * @param {string} [props.type='error'] - Type d'erreur (error, warning, info)
 * @param {Function} [props.onRetry] - Fonction de retry
 * @param {Function} [props.onDismiss] - Fonction pour fermer le message
 * @param {boolean} [props.showRetry=true] - Afficher le bouton retry
 * @returns {JSX.Element} - Composant de message d'erreur
 */
function ErrorMessage({ 
  title, 
  message, 
  type = 'error', 
  onRetry, 
  onDismiss, 
  showRetry = true 
}) {
  const getAlertVariant = () => {
    switch (type) {
      case 'warning':
        return 'default'
      case 'info':
        return 'default'
      default:
        return 'destructive'
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-orange-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-red-600'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-red-200 bg-red-50'
    }
  }

  const getTextColor = () => {
    switch (type) {
      case 'warning':
        return 'text-orange-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-red-800'
    }
  }

  return (
    <Alert className={`${getBorderColor()} ${getTextColor()}`}>
      <AlertTriangle className={`h-4 w-4 ${getIconColor()}`} />
      <AlertDescription className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <div className="font-medium mb-1">
              {title}
            </div>
          )}
          <div className="text-sm">
            {message}
          </div>
          {showRetry && onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Réessayer
              </Button>
            </div>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="ml-2 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export default ErrorMessage
