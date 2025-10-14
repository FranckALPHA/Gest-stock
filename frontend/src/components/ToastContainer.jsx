import { X } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

/**
 * Composant pour afficher les notifications toast
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.toasts - Liste des toasts à afficher
 * @param {Function} props.removeToast - Fonction pour supprimer un toast
 * @returns {JSX.Element} - Container des toasts
 */
function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-lg shadow-lg border max-w-sm",
            {
              "bg-green-50 border-green-200 text-green-800": toast.type === 'success',
              "bg-red-50 border-red-200 text-red-800": toast.type === 'error',
              "bg-yellow-50 border-yellow-200 text-yellow-800": toast.type === 'warning',
              "bg-blue-50 border-blue-200 text-blue-800": toast.type === 'info',
            }
          )}
        >
          <div className="flex-1">
            <div className="font-medium text-sm">{toast.title}</div>
            {toast.description && (
              <div className="text-xs mt-1 opacity-90">{toast.description}</div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeToast(toast.id)}
            className="ml-2 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
