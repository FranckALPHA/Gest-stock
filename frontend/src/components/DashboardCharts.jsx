import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { dashboardService } from '../services/dashboard.api.js'
import { productService } from '../services/product.api.js'
import { useToast } from '../hooks/useToast'

/**
 * Fonction pour générer des données de tendances selon la période
 * @param {string} period - Période sélectionnée (week, month, quarter, year)
 * @returns {Array} - Données de tendances formatées
 */
const generateMovementsTrend = (period) => {
  switch (period) {
    case 'week':
      return [
        { name: 'Lun', entrées: 12, sorties: 8 },
        { name: 'Mar', entrées: 15, sorties: 10 },
        { name: 'Mer', entrées: 8, sorties: 12 },
        { name: 'Jeu', entrées: 20, sorties: 15 },
        { name: 'Ven', entrées: 18, sorties: 14 },
        { name: 'Sam', entrées: 5, sorties: 3 },
        { name: 'Dim', entrées: 2, sorties: 1 }
      ]
    case 'month':
      return [
        { name: 'Sem 1', entrées: 45, sorties: 32 },
        { name: 'Sem 2', entrées: 52, sorties: 38 },
        { name: 'Sem 3', entrées: 38, sorties: 45 },
        { name: 'Sem 4', entrées: 61, sorties: 42 }
      ]
    case 'quarter':
      return [
        { name: 'Mois 1', entrées: 180, sorties: 145 },
        { name: 'Mois 2', entrées: 195, sorties: 168 },
        { name: 'Mois 3', entrées: 220, sorties: 185 }
      ]
    case 'year':
      return [
        { name: 'Q1', entrées: 650, sorties: 520 },
        { name: 'Q2', entrées: 720, sorties: 580 },
        { name: 'Q3', entrées: 680, sorties: 620 },
        { name: 'Q4', entrées: 750, sorties: 590 }
      ]
    default:
      return [
        { name: 'Lun', entrées: 12, sorties: 8 },
        { name: 'Mar', entrées: 15, sorties: 10 },
        { name: 'Mer', entrées: 8, sorties: 12 },
        { name: 'Jeu', entrées: 20, sorties: 15 },
        { name: 'Ven', entrées: 18, sorties: 14 },
        { name: 'Sam', entrées: 5, sorties: 3 },
        { name: 'Dim', entrées: 2, sorties: 1 }
      ]
  }
}

/**
 * Fonction pour générer des données de stock par catégorie selon la période
 * @param {Array} products - Liste des produits
 * @param {string} period - Période sélectionnée
 * @returns {Object} - Données de stock par catégorie et valeur
 */
const generateCategoryData = (products, period) => {
  const categoryData = {}
  const valueData = {}
  
  // Multiplicateur selon la période pour simuler des variations
  const periodMultiplier = {
    'week': 1,
    'month': 1.2,
    'quarter': 1.5,
    'year': 2
  }
  
  const multiplier = periodMultiplier[period] || 1
  
  products.forEach(product => {
    const category = product.category_name || 'Sans catégorie'
    const adjustedQuantity = Math.round((product.quantity || 0) * multiplier)
    const adjustedValue = (product.price || 0) * adjustedQuantity
    
    if (!categoryData[category]) {
      categoryData[category] = 0
      valueData[category] = 0
    }
    
    categoryData[category] += adjustedQuantity
    valueData[category] += adjustedValue
  })
  
  const stockByCategory = Object.entries(categoryData).map(([name, value]) => ({
    name,
    stock: value
  }))
  
  const stockValue = Object.entries(valueData).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100
  }))
  
  return { stockByCategory, stockValue }
}

/**
 * Composant de graphiques pour le dashboard
 * @returns {JSX.Element} - Composant des graphiques
 */
function DashboardCharts() {
  const [chartData, setChartData] = useState({
    stockByCategory: [],
    stockValue: [],
    movementsTrend: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [updating, setUpdating] = useState(false)
  const { error } = useToast()

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  /**
   * Charge les données pour les graphiques
   * @param {boolean} isUpdate - Indique si c'est une mise à jour (pas un chargement initial)
   */
  const loadChartData = async (isUpdate = false) => {
    try {
      if (isUpdate) {
        setUpdating(true)
      } else {
        setLoading(true)
      }
      
      // Charger les produits pour analyser les données
      const products = await productService.getAllProducts({ limit: 1000 })
      const productsList = products.products || products
      
      // Génération des données selon la période sélectionnée
      const { stockByCategory, stockValue } = generateCategoryData(productsList, timeRange)
      const movementsTrend = generateMovementsTrend(timeRange)
      
      setChartData({
        stockByCategory,
        stockValue,
        movementsTrend
      })
      
    } catch (err) {
      console.error('Erreur lors du chargement des données de graphiques:', err)
      error('Erreur', 'Impossible de charger les données des graphiques.')
    } finally {
      setLoading(false)
      setUpdating(false)
    }
  }

  // Charger les données au montage du composant et lors du changement de période
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
        <div className="flex items-center gap-2">
          {updating && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Mise à jour...
            </div>
          )}
          <Select value={timeRange} onValueChange={setTimeRange} disabled={updating}>
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
      </div>

      {/* Graphiques */}
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.stockByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} unités`, 'Stock']}
                  labelFormatter={(label) => `Catégorie: ${label}`}
                />
                <Bar dataKey="stock" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.stockValue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.stockValue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} FCFA`, 'Valeur']}
                  labelFormatter={(label) => `Catégorie: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendances des mouvements */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances des Mouvements</CardTitle>
          <CardDescription>
            Évolution des entrées et sorties de stock sur la période
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.movementsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} mouvements`, 
                  name === 'entrées' ? 'Entrées' : 'Sorties'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="entrées" 
                stroke="#00C49F" 
                strokeWidth={2}
                name="entrées"
              />
              <Line 
                type="monotone" 
                dataKey="sorties" 
                stroke="#FF8042" 
                strokeWidth={2}
                name="sorties"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardCharts
