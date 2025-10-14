import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination'
import { categoryService } from '../services/category.api.js'
import { useAuth } from '../context/AuthContext'
import CategoryForm from '../components/CategoryForm'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'

/**
 * Page de gestion des catégories
 * Permet de lister, créer, modifier et supprimer les catégories
 * @returns {JSX.Element} - Page de gestion des catégories
 */
function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [categoriesPerPage] = useState(10)
  const [totalCategories, setTotalCategories] = useState(0)
  const [pagination, setPagination] = useState({})
  const { user, isAdmin, isManager } = useAuth()
  const { toasts, removeToast, success, error, warning } = useToast()

  /**
   * Charge la liste des catégories depuis l'API avec pagination et recherche
   */
  const loadCategories = async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: categoriesPerPage,
        ...(search && { search })
      }
      
      const data = await categoryService.getAllCategories(params)
      const categoriesList = data.categories || data
      const paginationData = data.pagination || {}
      
      setCategories(Array.isArray(categoriesList) ? categoriesList : [])
      setPagination(paginationData)
      setTotalCategories(paginationData.total || categoriesList.length || 0)
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Gère le changement de page
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    loadCategories(newPage, searchTerm)
  }

  /**
   * Gère la recherche avec debounce
   */
  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset à la première page lors d'une recherche
    loadCategories(1, value)
  }

  /**
   * Gère la création d'une nouvelle catégorie
   * @param {Object} categoryData - Données de la catégorie
   */
  const handleCreateCategory = async (categoryData) => {
    try {
      await categoryService.createCategory(categoryData)
      await loadCategories(currentPage, searchTerm)
      setIsCreateDialogOpen(false)
      success('Catégorie créée', 'La catégorie a été créée avec succès.')
    } catch (err) {
      // Gestion spécifique des erreurs
      if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs et gestionnaires peuvent créer des catégories.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.data?.message) {
        error('Erreur', err.response.data.message)
      } else {
        error('Erreur', 'Impossible de créer la catégorie. Veuillez réessayer.')
      }
      
      throw err
    }
  }

  /**
   * Gère la modification d'une catégorie
   * @param {Object} categoryData - Nouvelles données de la catégorie
   */
  const handleUpdateCategory = async (categoryData) => {
    try {
      await categoryService.updateCategory(selectedCategory.id, categoryData)
      await loadCategories(currentPage, searchTerm)
      setIsEditDialogOpen(false)
      setSelectedCategory(null)
      success('Catégorie modifiée', 'La catégorie a été modifiée avec succès.')
    } catch (err) {
      if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs et gestionnaires peuvent modifier des catégories.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.data?.message) {
        error('Erreur', err.response.data.message)
      } else {
        error('Erreur', 'Impossible de modifier la catégorie. Veuillez réessayer.')
      }
      throw err
    }
  }

  /**
   * Ouvre le dialog de modification pour une catégorie
   * @param {Object} category - Catégorie à modifier
   */
  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  /**
   * Ouvre le dialog de confirmation de suppression
   * @param {Object} category - Catégorie à supprimer
   */
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  /**
   * Confirme et exécute la suppression d'une catégorie
   */
  const confirmDeleteCategory = async () => {
    try {
      await categoryService.deleteCategory(categoryToDelete.id)
      await loadCategories(currentPage, searchTerm)
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      success('Catégorie supprimée', 'La catégorie a été supprimée avec succès.')
    } catch (err) {
      if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs et gestionnaires peuvent supprimer des catégories.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.data?.message) {
        error('Erreur', err.response.data.message)
      } else {
        error('Erreur', 'Impossible de supprimer la catégorie. Veuillez réessayer.')
      }
    }
  }

  // Charger les catégories au montage du composant
  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Catégories</h1>
          <p className="text-muted-foreground">
            Gérez les catégories de produits de votre stock
          </p>
        </div>
        {(isAdmin() || isManager()) && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Catégorie
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                <DialogDescription>
                  Ajoutez une nouvelle catégorie à votre système de gestion de stock.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm
                onSubmit={handleCreateCategory}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Separator />

      {/* Indicateur discret des permissions */}
      {!(isAdmin() || isManager()) && (
        <div className="flex items-center justify-end">
          <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Mode consultation
            </span>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="outline">
          {totalCategories} catégorie{totalCategories !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Liste des catégories */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Catégories</CardTitle>
          <CardDescription>
            Toutes les catégories disponibles dans votre système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement des catégories...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">
                  {searchTerm ? 'Aucune catégorie trouvée' : 'Aucune catégorie disponible'}
                </div>
                {!searchTerm && (isAdmin() || isManager()) && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer la première catégorie
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description || 'Aucune description'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {(isAdmin() || isManager()) && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category)}
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

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la catégorie "{selectedCategory?.name}".
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              initialData={selectedCategory}
              onSubmit={handleUpdateCategory}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedCategory(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.name}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setCategoryToDelete(null)
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCategory}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i
                  if (pageNum > pagination.totalPages) return null
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}

      {/* Container des notifications toast */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Categories
