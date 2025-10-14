import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Alert, AlertDescription } from '../components/ui/alert'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { userService } from '../services/user.api.js'
import { Users as UsersIcon, UserCheck, UserX, Key, Eye, EyeOff, Shield, User } from 'lucide-react'

/**
 * Page de gestion des utilisateurs (Admin uniquement)
 * @returns {JSX.Element} - Composant de gestion des utilisateurs
 */
function Users() {
  const { user, isAdmin } = useAuth()
  const { success, error } = useToast()
  
  // États pour les données
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // États pour les modales
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // États pour les actions
  const [actionLoading, setActionLoading] = useState({})

  /**
   * Charge la liste des utilisateurs
   */
  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err)
      error('Erreur lors du chargement des utilisateurs')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Active ou désactive un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {boolean} isActive - Nouvel état d'activation
   */
  const handleToggleUser = async (userId, isActive) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }))
      
      await userService.toggleUserActive(userId, isActive)
      success(`Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`)
      
      // Recharger la liste
      await loadUsers()
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err)
      error('Erreur lors de la modification du statut utilisateur')
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  /**
   * Ouvre la modale de changement de mot de passe
   * @param {Object} user - Utilisateur sélectionné
   */
  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user)
    setNewPassword('')
    setShowPassword(false)
    setPasswordModalOpen(true)
  }

  /**
   * Ferme la modale de changement de mot de passe
   */
  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false)
    setSelectedUser(null)
    setNewPassword('')
    setShowPassword(false)
  }

  /**
   * Modifie le mot de passe d'un utilisateur
   */
  const handleUpdatePassword = async () => {
    if (!selectedUser || !newPassword.trim()) {
      error('Veuillez saisir un nouveau mot de passe')
      return
    }

    if (newPassword.length < 6) {
      error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      setActionLoading(prev => ({ ...prev, password: true }))
      
      await userService.updateUserPassword(selectedUser.id, newPassword)
      success('Mot de passe modifié avec succès')
      
      handleClosePasswordModal()
    } catch (err) {
      console.error('Erreur lors de la modification du mot de passe:', err)
      error('Erreur lors de la modification du mot de passe')
    } finally {
      setActionLoading(prev => ({ ...prev, password: false }))
    }
  }

  /**
   * Formate la date de création
   * @param {string} dateString - Date à formater
   * @returns {string} - Date formatée
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Obtient l'icône du rôle
   * @param {string} role - Rôle de l'utilisateur
   * @returns {JSX.Element} - Icône du rôle
   */
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />
      case 'manager':
        return <UserCheck className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  /**
   * Obtient la couleur du badge de rôle
   * @param {string} role - Rôle de l'utilisateur
   * @returns {string} - Classe CSS pour la couleur
   */
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Charger les utilisateurs au montage
  useEffect(() => {
    if (isAdmin()) {
      loadUsers()
    }
  }, [isAdmin])

  // Vérification des permissions
  if (!isAdmin()) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Accès refusé. Seuls les administrateurs peuvent gérer les utilisateurs.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement des utilisateurs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UsersIcon className="w-8 h-8" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les comptes utilisateurs, leurs statuts et leurs mots de passe
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {users.length} utilisateur{users.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <Separator />

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            Consultez et gérez tous les utilisateurs du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          <span className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.last_login)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Bouton d'activation/désactivation */}
                          <Button
                            variant={user.is_active ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleToggleUser(user.id, !user.is_active)}
                            disabled={actionLoading[user.id]}
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Activer
                              </>
                            )}
                          </Button>
                          
                          {/* Bouton de changement de mot de passe */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPasswordModal(user)}
                          >
                            <Key className="w-4 h-4 mr-1" />
                            Mot de passe
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modale de changement de mot de passe */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
            <DialogDescription>
              Changer le mot de passe pour {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Saisissez le nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClosePasswordModal}>
              Annuler
            </Button>
            <Button 
              onClick={handleUpdatePassword}
              disabled={actionLoading.password || !newPassword.trim()}
            >
              {actionLoading.password ? 'Modification...' : 'Modifier le mot de passe'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Users
