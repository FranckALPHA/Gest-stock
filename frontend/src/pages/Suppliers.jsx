import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Building2, Mail, Phone, MapPin, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { supplierService } from '../services/supplier.api.js'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'

/**
 * Page de gestion des fournisseurs
 * Permet de lister, créer, modifier et supprimer les fournisseurs
 * @returns {JSX.Element} - Page de gestion des fournisseurs
 */
function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSupplier, setEditingSupplier] = useState(null)
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [suppliersPerPage] = useState(10)
  const [totalSuppliers, setTotalSuppliers] = useState(0)
  const [pagination, setPagination] = useState({})
  
  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: ''
  })
  
  const { user, isAdmin } = useAuth()
  const { toasts, removeToast, success, error, warning } = useToast()

  /**
   * Charge la liste des fournisseurs depuis l'API
   */
  const loadSuppliers = async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: suppliersPerPage,
        ...(search && { search })
      }
      
      const data = await supplierService.getAllSuppliers(params)
      const suppliersList = data.suppliers || data
      const paginationData = data.pagination || {}
      
      setSuppliers(Array.isArray(suppliersList) ? suppliersList : [])
      setPagination(paginationData)
      setTotalSuppliers(paginationData.total || suppliersList.length || 0)
    } catch (err) {
      console.error('Erreur lors du chargement des fournisseurs:', err)
      if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else {
        error('Erreur', 'Impossible de charger les fournisseurs. Veuillez réessayer.')
      }
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Gère le changement de page
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    loadSuppliers(newPage, searchTerm)
  }

  /**
   * Gère la recherche avec debounce
   */
  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset à la première page lors d'une recherche
    loadSuppliers(1, value)
  }

  /**
   * Gère la création d'un nouveau fournisseur
   */
  const handleCreateSupplier = async () => {
    if (!formData.name.trim()) {
      error('Erreur', 'Le nom du fournisseur est obligatoire.')
      return
    }

    try {
      setIsSubmitting(true)
      await supplierService.createSupplier(formData)
      await loadSuppliers(currentPage, searchTerm)
      setIsCreateDialogOpen(false)
      resetForm()
      success('Fournisseur créé', 'Le fournisseur a été créé avec succès.')
    } catch (err) {
      if (err.response?.status === 400) {
        error('Erreur', err.response.data.message || 'Données invalides.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs peuvent créer des fournisseurs.')
      } else {
        error('Erreur', 'Impossible de créer le fournisseur. Veuillez réessayer.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Gère la modification d'un fournisseur
   */
  const handleUpdateSupplier = async () => {
    if (!formData.name.trim()) {
      error('Erreur', 'Le nom du fournisseur est obligatoire.')
      return
    }

    try {
      setIsSubmitting(true)
      await supplierService.updateSupplier(editingSupplier.id, formData)
      await loadSuppliers(currentPage, searchTerm)
      setIsEditDialogOpen(false)
      setEditingSupplier(null)
      resetForm()
      success('Fournisseur modifié', 'Le fournisseur a été modifié avec succès.')
    } catch (err) {
      if (err.response?.status === 400) {
        error('Erreur', err.response.data.message || 'Données invalides.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs peuvent modifier des fournisseurs.')
      } else if (err.response?.status === 404) {
        error('Erreur', 'Fournisseur non trouvé.')
      } else {
        error('Erreur', 'Impossible de modifier le fournisseur. Veuillez réessayer.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Gère la suppression d'un fournisseur
   */
  const handleDeleteSupplier = async (supplierId) => {
    if (!isAdmin()) {
      error('Permissions insuffisantes', 'Seuls les administrateurs peuvent supprimer des fournisseurs.')
      return
    }

    try {
      await supplierService.deleteSupplier(supplierId)
      await loadSuppliers(currentPage, searchTerm)
      success('Fournisseur supprimé', 'Le fournisseur a été supprimé avec succès.')
    } catch (err) {
      if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs peuvent supprimer des fournisseurs.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else if (err.response?.status === 404) {
        error('Erreur', 'Fournisseur non trouvé.')
      } else if (err.response?.data?.message) {
        error('Erreur', err.response.data.message)
      } else {
        error('Erreur', 'Impossible de supprimer le fournisseur. Veuillez réessayer.')
      }
    }
  }

  /**
   * Ouvre le dialogue de modification
   */
  const openEditDialog = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name || '',
      contact: supplier.contact || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    })
    setIsEditDialogOpen(true)
  }

  /**
   * Remet à zéro le formulaire
   */
  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: ''
    })
  }

  /**
   * Gère les changements dans le formulaire
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Filtre les fournisseurs selon le terme de recherche
   */
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.contact && supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Charger les données au montage du composant
  useEffect(() => {
    loadSuppliers()
  }, [])

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Fournisseurs</h1>
          <p className="text-muted-foreground">
            Gérez vos fournisseurs et leurs informations de contact
          </p>
        </div>
        {isAdmin() && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Fournisseur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau fournisseur</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau fournisseur à votre base de données.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Nom du fournisseur */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du fournisseur *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nom de l'entreprise"
                  />
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    placeholder="Nom du contact"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemple.com"
                  />
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Adresse complète"
                    className="min-h-[80px]"
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
                  onClick={handleCreateSupplier}
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
              <strong>Mode lecture seule :</strong> Vous pouvez consulter les fournisseurs mais ne pouvez pas les modifier.
              Seuls les administrateurs peuvent créer, modifier ou supprimer des fournisseurs.
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un fournisseur..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="outline">
          {totalSuppliers} fournisseur{totalSuppliers !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Liste des fournisseurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Fournisseurs</CardTitle>
          <CardDescription>
            Tous les fournisseurs enregistrés dans votre système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement des fournisseurs...</div>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">
                  {searchTerm.trim()
                    ? `Aucun fournisseur trouvé pour "${searchTerm}"`
                    : 'Aucun fournisseur enregistré'
                  }
                </div>
                {!searchTerm.trim() && isAdmin() && (
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le premier fournisseur
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        {supplier.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.contact ? (
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {supplier.contact}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.email ? (
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`mailto:${supplier.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {supplier.email}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.phone ? (
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`tel:${supplier.phone}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {supplier.phone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.address ? (
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{supplier.address}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {isAdmin() && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditDialog(supplier)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSupplier(supplier.id)}
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

      {/* Dialogue de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le fournisseur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du fournisseur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Nom du fournisseur */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom du fournisseur *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nom de l'entreprise"
              />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact</Label>
              <Input
                id="edit-contact"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder="Nom du contact"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemple.com"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="edit-address">Adresse</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Adresse complète"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingSupplier(null)
                resetForm()
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpdateSupplier}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Modification...' : 'Modifier'}
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

export default Suppliers
