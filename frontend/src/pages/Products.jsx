import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { productService } from '../services/product.api.js'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'

/**
 * Page de gestion des produits
 * Permet de lister, créer, modifier et supprimer les produits
 * @returns {JSX.Element} - Page de gestion des produits
 */
function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { user, isAdmin } = useAuth()
  const { toasts, removeToast, success, error, warning } = useToast()

  /**
   * Charge la liste des produits depuis l'API
   */
  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err)
      if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else {
        error('Erreur', 'Impossible de charger les produits. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Effectue la recherche de produits via l'API
   * @param {string} term - Terme de recherche
   */
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    try {
      setIsSearching(true)
      const results = await productService.searchProducts(term)
      setSearchResults(results)
    } catch (err) {
      console.error('Erreur lors de la recherche:', err)
      error('Erreur', 'Impossible d\'effectuer la recherche. Veuillez réessayer.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  /**
   * Gère la suppression d'un produit
   * @param {number} productId - ID du produit à supprimer
   */
  const handleDeleteProduct = async (productId) => {
    if (!isAdmin()) {
      error('Permissions insuffisantes', 'Seuls les administrateurs peuvent supprimer des produits.')
      return
    }

    try {
      await productService.deleteProduct(productId)
      await loadProducts()
      success('Produit supprimé', 'Le produit a été supprimé avec succès.')
    } catch (err) {
      if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs peuvent supprimer des produits.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.data?.message) {
        error('Erreur', err.response.data.message)
      } else {
        error('Erreur', 'Impossible de supprimer le produit. Veuillez réessayer.')
      }
    }
  }

  // Produits à afficher (résultats de recherche ou tous les produits)
  const displayProducts = searchTerm.trim() ? searchResults : products

  // Charger les produits au montage du composant
  useEffect(() => {
    loadProducts()
  }, [])

  // Effectuer la recherche quand le terme change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm)
    }, 300) // Délai de 300ms pour éviter trop de requêtes

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Produits</h1>
          <p className="text-muted-foreground">
            Gérez les produits de votre stock
          </p>
        </div>
        {isAdmin() && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        )}
      </div>

      <Separator />

      {/* Message d'information sur les permissions */}
      {!isAdmin() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-blue-800">
              <strong>Mode lecture seule :</strong> Vous pouvez consulter les produits mais ne pouvez pas les modifier. 
              Seuls les administrateurs peuvent créer, modifier ou supprimer des produits.
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {isSearching && (
            <div className="absolute right-2 top-2.5">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
        <Badge variant="outline">
          {displayProducts.length} produit{displayProducts.length !== 1 ? 's' : ''}
          {searchTerm.trim() && ' trouvé(s)'}
        </Badge>
      </div>

      {/* Liste des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
          <CardDescription>
            {searchTerm.trim() 
              ? `Résultats de recherche pour "${searchTerm}"`
              : 'Tous les produits disponibles dans votre stock'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement des produits...</div>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">
                  {searchTerm.trim() 
                    ? `Aucun produit trouvé pour "${searchTerm}"`
                    : 'Aucun produit disponible'
                  }
                </div>
                {!searchTerm.trim() && isAdmin() && (
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le premier produit
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.description || 'Aucune description'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category_name || 'Sans catégorie'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {product.price ? `${product.price.toFixed(2)} €` : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          product.quantity <= (product.alert_threshold || 10) 
                            ? "destructive" 
                            : "secondary"
                        }
                      >
                        {product.quantity || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {isAdmin() && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Container des notifications toast */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Products
