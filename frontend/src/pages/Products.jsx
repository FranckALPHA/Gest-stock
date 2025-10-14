import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { productService } from '../services/product.api.js'
import { categoryService } from '../services/category.api.js'
import { supplierService } from '../services/supplier.api.js'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'

/**
 * Page de gestion des produits avec pagination et filtres avancés
 * Permet de lister, créer, modifier et supprimer les produits
 * @returns {JSX.Element} - Page de gestion des produits
 */
function Products() {
  // États pour les données
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    supplier_id: '',
    page: 1,
    limit: 10
  })
  
  // États pour l'interface
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    supplier_id: '',
    price: '',
    quantity: '',
    alert_threshold: '10'
  })
  
  const { user, isAdmin } = useAuth()
  const { toasts, removeToast, success, error, warning } = useToast()

  /**
   * Charge la liste des produits avec pagination et filtres
   */
  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.category_id && { category_id: filters.category_id }),
        ...(filters.supplier_id && { supplier_id: filters.supplier_id })
      }
      
      const data = await productService.getAllProducts(params)
      setProducts(data.products || data)
      setPagination(data.pagination || {
        page: filters.page,
        limit: filters.limit,
        total: data.products?.length || data.length || 0,
        totalPages: 1
      })
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
   * Charge les catégories et fournisseurs pour les filtres
   */
  const loadFiltersData = async () => {
    try {
      const [categoriesData, suppliersData] = await Promise.all([
        categoryService.getAllCategories({ limit: 1000 }),
        supplierService.getAllSuppliers({ limit: 1000 })
      ])
      
      // Extraire les données des réponses avec pagination
      const categoriesList = categoriesData.categories || categoriesData
      const suppliersList = suppliersData.suppliers || suppliersData
      
      setCategories(Array.isArray(categoriesList) ? categoriesList : [])
      setSuppliers(Array.isArray(suppliersList) ? suppliersList : [])
    } catch (err) {
      console.error('Erreur lors du chargement des données de filtres:', err)
      setCategories([])
      setSuppliers([])
    }
  }

  /**
   * Gère les changements de filtres
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? '' : value,
      page: 1 // Reset à la première page lors d'un changement de filtre
    }))
  }

  /**
   * Gère la pagination
   */
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  /**
   * Gère la création d'un nouveau produit
   */
  const handleCreateProduct = async () => {
    if (!formData.name.trim()) {
      error('Erreur', 'Le nom du produit est obligatoire.')
      return
    }

    try {
      setIsSubmitting(true)
      const productData = {
        name: formData.name,
        description: formData.description || null,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0,
        alert_threshold: parseInt(formData.alert_threshold) || 10
      }
      
      await productService.createProduct(productData)
      await loadProducts()
      setIsCreateDialogOpen(false)
      resetForm()
      success('Produit créé', 'Le produit a été créé avec succès.')
    } catch (err) {
      if (err.response?.status === 400) {
        error('Erreur', err.response.data.message || 'Données invalides.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs peuvent créer des produits.')
      } else {
        error('Erreur', 'Impossible de créer le produit. Veuillez réessayer.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Gère la modification d'un produit
   */
  const handleUpdateProduct = async () => {
    if (!formData.name.trim()) {
      error('Erreur', 'Le nom du produit est obligatoire.')
      return
    }

    try {
      setIsSubmitting(true)
      const productData = {
        name: formData.name,
        description: formData.description || null,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0,
        alert_threshold: parseInt(formData.alert_threshold) || 10
      }
      
      await productService.updateProduct(editingProduct.id, productData)
      await loadProducts()
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      resetForm()
      success('Produit modifié', 'Le produit a été modifié avec succès.')
    } catch (err) {
      if (err.response?.status === 400) {
        error('Erreur', err.response.data.message || 'Données invalides.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs peuvent modifier des produits.')
      } else if (err.response?.status === 404) {
        error('Erreur', 'Produit non trouvé.')
      } else {
        error('Erreur', 'Impossible de modifier le produit. Veuillez réessayer.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Gère la suppression d'un produit
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

  /**
   * Ouvre le dialogue de modification
   */
  const openEditDialog = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category_id: product.category_id?.toString() || '',
      supplier_id: product.supplier_id?.toString() || '',
      price: product.price?.toString() || '',
      quantity: product.quantity?.toString() || '',
      alert_threshold: product.alert_threshold?.toString() || '10'
    })
    setIsEditDialogOpen(true)
  }

  /**
   * Remet à zéro le formulaire
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      supplier_id: '',
      price: '',
      quantity: '',
      alert_threshold: '10'
    })
  }

  /**
   * Gère les changements dans le formulaire
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === 'none' ? '' : value
    }))
  }

  /**
   * Efface tous les filtres
   */
  const clearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      supplier_id: '',
      page: 1,
      limit: 10
    })
  }

  // Charger les données au montage du composant
  useEffect(() => {
    loadProducts()
    loadFiltersData()
  }, [])

  // Recharger les produits quand les filtres changent
  useEffect(() => {
    loadProducts()
  }, [filters])

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Produits</h1>
          <p className="text-muted-foreground">
            Gérez les produits de votre stock avec pagination et filtres avancés
          </p>
        </div>
        {isAdmin() && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau produit</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau produit à votre stock.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Nom du produit */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nom du produit"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description du produit"
                    className="min-h-[80px]"
                  />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category_id || 'none'} onValueChange={(value) => handleInputChange('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune catégorie</SelectItem>
                      {Array.isArray(categories) && categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fournisseur */}
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fournisseur</Label>
                  <Select value={formData.supplier_id || 'none'} onValueChange={(value) => handleInputChange('supplier_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun fournisseur</SelectItem>
                      {Array.isArray(suppliers) && suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prix */}
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Quantité */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantité en stock</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="0"
                  />
                </div>

                {/* Seuil d'alerte */}
                <div className="space-y-2">
                  <Label htmlFor="alert_threshold">Seuil d'alerte</Label>
                  <Input
                    id="alert_threshold"
                    type="number"
                    min="0"
                    value={formData.alert_threshold}
                    onChange={(e) => handleInputChange('alert_threshold', e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    resetForm()
                  }}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

      {/* Filtres avancés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
          <CardDescription>
            Filtrez et recherchez parmi vos produits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Recherche */}
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom ou description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category-filter">Catégorie</Label>
              <Select value={filters.category_id || 'all'} onValueChange={(value) => handleFilterChange('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {Array.isArray(categories) && categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fournisseur */}
            <div className="space-y-2">
              <Label htmlFor="supplier-filter">Fournisseur</Label>
              <Select value={filters.supplier_id || 'all'} onValueChange={(value) => handleFilterChange('supplier_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les fournisseurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les fournisseurs</SelectItem>
                  {Array.isArray(suppliers) && suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Effacer
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
          <CardDescription>
            {pagination.total} produit{pagination.total !== 1 ? 's' : ''} trouvé{pagination.total !== 1 ? 's' : ''}
            {filters.search && ` pour "${filters.search}"`}
            {filters.category_id && ` dans la catégorie sélectionnée`}
            {filters.supplier_id && ` du fournisseur sélectionné`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement des produits...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">
                  Aucun produit trouvé
                </div>
                {isAdmin() && (
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le premier produit
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
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
                        <Badge variant="outline">
                          {product.supplier_name || 'Sans fournisseur'}
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
                          {product.quantity <= (product.alert_threshold || 10) && (
                            <AlertTriangle className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {isAdmin() && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(product)}
                              >
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} sur {pagination.totalPages} 
                    ({pagination.total} produit{pagination.total !== 1 ? 's' : ''})
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogue de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Nom du produit */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom du produit *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nom du produit"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description du produit"
                className="min-h-[80px]"
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Catégorie</Label>
              <Select value={formData.category_id || 'none'} onValueChange={(value) => handleInputChange('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune catégorie</SelectItem>
                  {Array.isArray(categories) && categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fournisseur */}
            <div className="space-y-2">
              <Label htmlFor="edit-supplier">Fournisseur</Label>
              <Select value={formData.supplier_id || 'none'} onValueChange={(value) => handleInputChange('supplier_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun fournisseur</SelectItem>
                  {Array.isArray(suppliers) && suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <Label htmlFor="edit-price">Prix (€)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Quantité */}
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantité en stock</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Seuil d'alerte */}
            <div className="space-y-2">
              <Label htmlFor="edit-alert_threshold">Seuil d'alerte</Label>
              <Input
                id="edit-alert_threshold"
                type="number"
                min="0"
                value={formData.alert_threshold}
                onChange={(e) => handleInputChange('alert_threshold', e.target.value)}
                placeholder="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingProduct(null)
                resetForm()
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpdateProduct}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Container des notifications toast */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Products