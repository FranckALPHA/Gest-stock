import { useState, useEffect } from 'react'
import { AlertTriangle, Package, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { productService } from '../services/product.api.js'
import { useToast } from '../hooks/useToast'

/**
 * Composant pour afficher les alertes de stock faible
 * @param {Object} props - Propriétés du composant
 * @param {number} [props.threshold=10] - Seuil de stock faible
 * @param {boolean} [props.showHeader=true] - Afficher l'en-tête
 * @param {number} [props.maxItems=5] - Nombre maximum d'alertes à afficher
 * @returns {JSX.Element} - Composant des alertes de stock faible
 */
function LowStockAlerts({ threshold = 10, showHeader = true, maxItems = 5 }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const { error } = useToast()

  /**
   * Charge les alertes de stock faible
   */
  const loadAlerts = async () => {
    try {
      setLoading(true)
      const data = await productService.getLowStockProducts()
      // Filtrer les produits selon le seuil spécifié (côté client)
      const filteredData = data.filter(product => (product.quantity || 0) <= threshold)
      setAlerts(filteredData)
    } catch (err) {
      console.error('Erreur lors du chargement des alertes:', err)
      error('Erreur', 'Impossible de charger les alertes de stock faible.')
    } finally {
      setLoading(false)
    }
  }

  // Charger les alertes au montage du composant
  useEffect(() => {
    loadAlerts()
  }, [threshold])

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Alertes de Stock Faible
            </CardTitle>
            <CardDescription>
              Chargement des alertes...
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-green-500" />
              Stock en Bon État
            </CardTitle>
            <CardDescription>
              Aucun produit en stock faible
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-4">
            <Package className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <p className="text-green-600 font-medium">Tous les stocks sont suffisants</p>
            <p className="text-sm text-muted-foreground">
              Seuil d'alerte : {threshold} unités
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Alertes de Stock Faible
            </div>
            <Button variant="outline" size="sm" onClick={loadAlerts}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            {alerts.length} produit{alerts.length > 1 ? 's' : ''} nécessitant une attention
            (seuil : {threshold} unités)
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-2">
          {alerts.slice(0, maxItems).map((product) => (
            <Alert key={product.id} className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium">{product.name}</span>
                    {product.category_name && (
                      <span className="text-sm text-orange-700 ml-2">
                        ({product.category_name})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">
                      Stock: {product.quantity || 0}
                    </Badge>
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      Seuil: {product.alert_threshold || threshold}
                    </Badge>
                  </div>
                </div>
                {product.supplier_name && (
                  <p className="text-sm text-orange-700 mt-1">
                    Fournisseur: {product.supplier_name}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ))}
          {alerts.length > maxItems && (
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Et {alerts.length - maxItems} autre{alerts.length - maxItems > 1 ? 's' : ''} produit{alerts.length - maxItems > 1 ? 's' : ''}...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LowStockAlerts
