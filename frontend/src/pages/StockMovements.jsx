import { useState, useEffect } from 'react'
import { Plus, ArrowUp, ArrowDown, Package, Calendar, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { stockMovementService } from '../services/stock-movement.api.js'
import { productService } from '../services/product.api.js'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'

/**
 * Page de gestion des mouvements de stock
 * Permet de lister, créer et consulter les mouvements de stock
 * @returns {JSX.Element} - Page de gestion des mouvements de stock
 */
function StockMovements() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [movementType, setMovementType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const { user, isAdmin } = useAuth()
  const { toasts, removeToast, success, error, warning } = useToast()

  /**
   * Charge la liste des mouvements de stock depuis l'API (Admin uniquement)
   */
  const loadMovements = async () => {
    // Ne charger les mouvements que si l'utilisateur est admin
    if (!isAdmin()) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await stockMovementService.getAllMovements()
      setMovements(data)
    } catch (err) {
      console.error('Erreur lors du chargement des mouvements:', err)
      if (err.response?.status === 403) {
        error('Permissions insuffisantes', 'Seuls les administrateurs peuvent consulter tous les mouvements.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else {
        error('Erreur', 'Impossible de charger les mouvements. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Charge la liste des produits pour le formulaire de création
   */
  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err)
      error('Erreur', 'Impossible de charger la liste des produits.')
    }
  }

  /**
   * Gère la création d'un nouveau mouvement de stock
   */
  const handleCreateMovement = async () => {
    if (!selectedProduct || !movementType || !quantity) {
      error('Erreur', 'Veuillez remplir tous les champs obligatoires.')
      return
    }

    if (parseInt(quantity) <= 0) {
      error('Erreur', 'La quantité doit être supérieure à 0.')
      return
    }

    try {
      setIsSubmitting(true)
      await stockMovementService.createMovement({
        product_id: parseInt(selectedProduct),
        type: movementType,
        quantity: parseInt(quantity),
        note: note.trim() || null
      })
      
      await loadMovements()
      setIsCreateDialogOpen(false)
      resetForm()
      success('Mouvement créé', 'Le mouvement de stock a été enregistré avec succès.')
    } catch (err) {
      if (err.response?.status === 400) {
        error('Erreur', err.response.data.message || 'Données invalides.')
      } else if (err.response?.status === 401) {
        error('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.')
      } else {
        error('Erreur', 'Impossible de créer le mouvement. Veuillez réessayer.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Remet à zéro le formulaire
   */
  const resetForm = () => {
    setSelectedProduct('')
    setMovementType('')
    setQuantity('')
    setNote('')
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

  // Charger les données au montage du composant
  useEffect(() => {
    loadMovements()
    loadProducts()
  }, [])

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mouvements de Stock</h1>
          <p className="text-muted-foreground">
            Gérez les entrées et sorties de stock
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Mouvement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un mouvement de stock</DialogTitle>
              <DialogDescription>
                Enregistrez une entrée ou sortie de stock pour un produit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Sélection du produit */}
              <div className="space-y-2">
                <Label htmlFor="product">Produit *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - Stock: {product.quantity || 0}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type de mouvement */}
              <div className="space-y-2">
                <Label htmlFor="type">Type de mouvement *</Label>
                <Select value={movementType} onValueChange={setMovementType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">
                      <div className="flex items-center">
                        <ArrowUp className="mr-2 h-4 w-4 text-green-600" />
                        Entrée de stock
                      </div>
                    </SelectItem>
                    <SelectItem value="out">
                      <div className="flex items-center">
                        <ArrowDown className="mr-2 h-4 w-4 text-red-600" />
                        Sortie de stock
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantité */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantité"
                />
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Note (optionnel)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Raison du mouvement, référence, etc."
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
                onClick={handleCreateMovement}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Message d'information sur les permissions */}
      {!isAdmin() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-blue-800">
              <strong>Mode limité :</strong> Vous pouvez créer des mouvements de stock mais ne pouvez pas consulter l'historique complet. 
              Seuls les administrateurs peuvent voir tous les mouvements.
            </div>
          </div>
        </div>
      )}

      {/* Statistiques rapides - Admin uniquement */}
      {isAdmin() && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mouvements</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{movements.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entrées Aujourd'hui</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {movements.filter(m => 
                  m.type === 'in' && 
                  new Date(m.created_at).toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sorties Aujourd'hui</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {movements.filter(m => 
                  m.type === 'out' && 
                  new Date(m.created_at).toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des mouvements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Mouvements</CardTitle>
          <CardDescription>
            {isAdmin() ? 'Tous les mouvements de stock enregistrés' : 'Accès limité - Seuls les administrateurs peuvent consulter l\'historique complet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAdmin() ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-muted-foreground mb-4">
                  <Package className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Accès limité</p>
                  <p>Vous pouvez créer des mouvements de stock mais ne pouvez pas consulter l'historique complet.</p>
                  <p className="mt-2">Seuls les administrateurs ont accès à la liste de tous les mouvements.</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un mouvement
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement des mouvements...</div>
            </div>
          ) : movements.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">
                  Aucun mouvement de stock enregistré
                </div>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer le premier mouvement
                </Button>
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
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
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
                    <TableCell className="text-muted-foreground">
                      {movement.note || '-'}
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

export default StockMovements
