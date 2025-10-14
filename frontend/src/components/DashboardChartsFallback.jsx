import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { productService } from '../services/product.api.js'
import { useToast } from '../hooks/useToast'

/**
 * Composant de graphiques de fallback pour le dashboard (sans Recharts)
 * @returns {JSX.Element} - Composant des graphiques
 */
function DashboardChartsFallback() {
  const [chartData, setChartData] = useState({
    stockByCategory: [],
    stockValue: [],
    movementsTrend: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const { error } = useToast()

  /**
   * Charge les données pour les graphiques
   */
  const loadChartData = async () => {
    try {
      setLoading(true)
      
      // Charger les produits pour analyser les données
      const products = await productService.getAllProducts({ limit: 1000 })
      const productsList = products.products || products
      
      // Préparer les données pour le graphique par catégorie
      const categoryData = {}
      const valueData = {}
      
      productsList.forEach(product => {
        const category = product.category_name || 'Sans catégorie'
        const value = (product.price || 0) * (product.quantity || 0)
        
        if (!categoryData[category]) {
          categoryData[category] = 0
          valueData[category] = 0
        }
        
        categoryData[category] += product.quantity || 0
        valueData[category] += value
      })
      
      const stockByCategory = Object.entries(categoryData).map(([name, value]) => ({
        name,
        stock: value
      }))
      
      const stockValue = Object.entries(valueData).map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100
      }))
      
      setChartData({
        stockByCategory,
        stockValue,
        movementsTrend: []
      })
      
    } catch (err) {
      console.error('Erreur lors du chargement des données de graphiques:', err)
      error('Erreur', 'Impossible de charger les données des graphiques.')
    } finally {
      setLoading(false)
    }
  }

  // Charger les données au montage du composant
  useEffect(() => {
    loadChartData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chargement des graphiques...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground">Chargement...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analyses et Graphiques</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Graphiques de fallback */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Stock par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Stock par Catégorie</CardTitle>
            <CardDescription>
              Répartition des quantités en stock par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chartData.stockByCategory.map((item, index) => {
                const maxStock = Math.max(...chartData.stockByCategory.map(i => i.stock))
                const percentage = (item.stock / maxStock) * 100
                
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">{item.stock} unités</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Valeur du stock par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Valeur du Stock par Catégorie</CardTitle>
            <CardDescription>
              Valeur monétaire du stock par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chartData.stockValue.map((item, index) => {
                const totalValue = chartData.stockValue.reduce((sum, i) => sum + i.value, 0)
                const percentage = (item.value / totalValue) * 100
                
                return (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` 
                        }}
                      ></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value.toFixed(2)} €</div>
                      <div className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé des mouvements */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances des Mouvements</CardTitle>
          <CardDescription>
            Évolution des entrées et sorties de stock sur la période
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-7">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
              const entrées = Math.floor(Math.random() * 20) + 5
              const sorties = Math.floor(Math.random() * 15) + 3
              
              return (
                <div key={day} className="text-center space-y-2">
                  <div className="font-medium text-sm">{day}</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">{entrées}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-red-600">{sorties}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Entrées</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Sorties</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message d'information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-blue-800 font-medium mb-2">
              📊 Graphiques Simplifiés
            </p>
            <p className="text-blue-700 text-sm">
              Version de fallback sans Recharts. Les graphiques interactifs seront disponibles 
              une fois la dépendance Recharts installée.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardChartsFallback
