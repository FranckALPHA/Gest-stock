import { useState, useEffect } from 'react'
import { AlertTriangle, Package, RefreshCw, Printer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { productService } from '../services/product.api.js'
import { useToast } from '../hooks/useToast'
import PrintButton from './PrintButton'

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

  /**
   * Génère le HTML du tableau des alertes pour l'impression
   * @returns {string} HTML du tableau
   */
  const generateAlertsTableHTML = () => {
    return `
      <div class="print-summary">
        <p><strong>Seuil d'alerte :</strong> ${threshold} unités</p>
        <p><strong>Nombre de produits en alerte :</strong> ${alerts.length}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Stock Actuel</th>
            <th>Seuil d'Alerte</th>
            <th>Fournisseur</th>
            <th>Prix (FCFA)</th>
          </tr>
        </thead>
        <tbody>
          ${alerts.map(product => `
            <tr>
              <td>${product.name}</td>
              <td>${product.category_name || 'N/A'}</td>
              <td style="color: red; font-weight: bold;">${product.quantity || 0}</td>
              <td>${product.alert_threshold || threshold}</td>
              <td>${product.supplier_name || 'N/A'}</td>
              <td>${product.price ? product.price.toFixed(2) : 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  }

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
            <div className="flex items-center gap-2">
              <PrintButton
                title="Rapport de Stock Faible"
                variant="outline"
                size="sm"
              >
                {generateAlertsTableHTML()}
              </PrintButton>
              <Button variant="outline" size="sm" onClick={loadAlerts}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            {alerts.length} produit{alerts.length > 1 ? 's' : ''} nécessitant une attention
            (seuil : {threshold} unités)
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {alerts.slice(0, maxItems).map((product) => (
            <Card key={product.id} className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* En-tête avec icône d'alerte */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <h4 className="font-semibold text-foreground text-sm leading-tight">
                        {product.name}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Catégorie */}
                  {product.category_name && (
                    <div>
                      <Badge variant="secondary" className="text-xs">
                        {product.category_name}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Informations de stock */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <Badge variant="destructive" className="text-xs">
                        {product.quantity || 0}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Seuil:</span>
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-400">
                        {product.alert_threshold || threshold}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Fournisseur */}
                  {product.supplier_name && (
                    <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fournisseur:</span>
                        <span className="font-medium text-foreground text-xs">
                          {product.supplier_name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {alerts.length > maxItems && (
          <div className="text-center pt-4 mt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Et {alerts.length - maxItems} autre{alerts.length - maxItems > 1 ? 's' : ''} produit{alerts.length - maxItems > 1 ? 's' : ''}...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LowStockAlerts
