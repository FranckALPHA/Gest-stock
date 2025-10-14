import { useState, useEffect } from 'react'
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  Printer,
  User,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Alert, AlertDescription } from '../components/ui/alert'
import { dashboardService } from '../services/dashboard.api.js'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'
import PrintButton from '../components/PrintButton'
import LowStockAlerts from '../components/LowStockAlerts.jsx'
import DashboardCharts from '../components/DashboardCharts.jsx'

/**
 * Page du tableau de bord principal
 * Affiche les statistiques générales, alertes et mouvements récents
 * @returns {JSX.Element} - Page du tableau de bord
 */
function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    totalValue: 0
  })
  const [recentMovements, setRecentMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const { toasts, removeToast, success, error } = useToast()

  /**
   * Charge toutes les données du dashboard
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Charger les statistiques générales
      const statsData = await dashboardService.getStats()
      
      // Valider et nettoyer les données statistiques
      const validatedStats = {
        totalProducts: Number(statsData?.totalProducts) || 0,
        totalQuantity: Number(statsData?.totalQuantity) || 0,
        totalValue: Number(statsData?.totalValue) || 0
      }
      
      // Vérifier que les valeurs sont des nombres valides
      Object.keys(validatedStats).forEach(key => {
        if (isNaN(validatedStats[key]) || !isFinite(validatedStats[key])) {
          validatedStats[key] = 0
        }
      })
      
      setStats(validatedStats)
      
      // Charger les mouvements récents
      const movementsData = await dashboardService.getRecentMovements()
      // S'assurer que movementsData est un tableau
      setRecentMovements(Array.isArray(movementsData) ? movementsData : [])
      
    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err)
      
      // Réinitialiser les données en cas d'erreur
      setStats({ totalProducts: 0, totalQuantity: 0, totalValue: 0 })
      setRecentMovements([])
      
      if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else {
        error('Erreur', 'Impossible de charger les données du tableau de bord.')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Formate la date pour l'affichage
   * @param {string} dateString - Date ISO
   * @returns {string} Date formatée
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Formate un montant en FCFA
   * @param {number} amount - Montant à formater
   * @returns {string} Montant formaté
   */
  const formatCurrency = (amount) => {
    // Vérifier que le montant est un nombre valide
    const numericAmount = Number(amount)
    if (isNaN(numericAmount) || !isFinite(numericAmount)) {
      return '0,00 FCFA'
    }
    
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericAmount) + ' FCFA'
  }

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData()
  }, [])

  /**
   * Génère le HTML du dashboard pour l'impression
   * @returns {string} HTML du rapport
   */
  const generateDashboardHTML = () => {
    return `
      <div class="print-summary">
        <h2>Statistiques Générales</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div style="border: 1px solid #ddd; padding: 15px; text-align: center;">
            <h3>Total Produits</h3>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${stats.totalProducts}</p>
            <p style="color: #666; font-size: 12px;">Produits enregistrés</p>
          </div>
          <div style="border: 1px solid #ddd; padding: 15px; text-align: center;">
            <h3>Stock Total</h3>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${stats.totalQuantity}</p>
            <p style="color: #666; font-size: 12px;">Unités en stock</p>
          </div>
          <div style="border: 1px solid #ddd; padding: 15px; text-align: center;">
            <h3>Valeur Totale</h3>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${formatCurrency(stats.totalValue)}</p>
            <p style="color: #666; font-size: 12px;">Valeur du stock</p>
          </div>
        </div>
      </div>
      
      <div class="print-summary">
        <h2>Mouvements Récents</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            ${(Array.isArray(recentMovements) ? recentMovements : []).map(movement => `
              <tr>
                <td>${new Date(movement.created_at).toLocaleDateString('fr-FR')}</td>
                <td>${movement.product_name || 'N/A'}</td>
                <td>${movement.type === 'in' ? 'Entrée' : 'Sortie'}</td>
                <td>${movement.quantity}</td>
                <td>${movement.note || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre gestion de stock
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton
            title="Rapport du Tableau de Bord"
            variant="outline"
          >
            {generateDashboardHTML()}
          </PrintButton>
          <Button onClick={loadDashboardData} variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      <Separator />

      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(stats.totalProducts) ? 0 : stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produits enregistrés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(stats.totalQuantity) ? 0 : stats.totalQuantity}</div>
            <p className="text-xs text-muted-foreground">
              Unités en stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Valeur du stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes de stock faible */}
      <LowStockAlerts threshold={10} maxItems={5} />

      {/* Mouvements récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Mouvements Récents
          </CardTitle>
          <CardDescription>
            Derniers mouvements de stock enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement des données...</div>
            </div>
          ) : !Array.isArray(recentMovements) || recentMovements.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-muted-foreground">
                  Aucun mouvement récent
                </div>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Utilisateur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Array.isArray(recentMovements) ? recentMovements : []).slice(0, 10).map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(movement.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.product_name || 'Produit inconnu'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={movement.type === 'in' ? 'default' : 'destructive'}
                        className={movement.type === 'in' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {movement.type === 'in' ? (
                          <div className="flex items-center">
                            <ArrowUp className="mr-1 h-3 w-3" />
                            Entrée
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <ArrowDown className="mr-1 h-3 w-3" />
                            Sortie
                          </div>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.quantity}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {movement.user_name || 'Système'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Accès direct aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Gérer les Produits
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Mouvements de Stock
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Eye className="h-6 w-6 mb-2" />
              Voir les Catégories
            </Button>
            {isAdmin() && (
              <Button variant="outline" className="h-20 flex-col">
                <AlertTriangle className="h-6 w-6 mb-2" />
                Gestion Admin
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Graphiques et analyses */}
      <DashboardCharts />

      {/* Container des notifications toast */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Dashboard
