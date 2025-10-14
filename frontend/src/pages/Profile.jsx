import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Alert, AlertDescription } from '../components/ui/alert'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { userService } from '../services/user.api.js'
import { User, Key, Eye, EyeOff, Shield, UserCheck, Mail, Calendar, Save } from 'lucide-react'

/**
 * Page de profil utilisateur
 * Permet à chaque utilisateur de modifier ses propres informations
 * @returns {JSX.Element} - Composant de profil
 */
function Profile() {
  const { user, logout } = useAuth()
  const { success, error } = useToast()
  
  // États pour les données du profil
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    role: '',
    is_active: true,
    created_at: '',
    last_login: ''
  })
  
  // États pour les formulaires
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // États pour l'interface
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  /**
   * Charge les données du profil utilisateur
   */
  const loadProfile = async () => {
    try {
      setLoading(true)
      // Pour l'instant, on utilise les données du contexte
      // Dans une vraie app, on ferait un appel API pour récupérer les données complètes
      setProfileData({
        username: user?.username || user?.email || 'N/A',
        email: user?.email || 'N/A',
        role: user?.role || 'N/A',
        is_active: user?.is_active ?? true,
        created_at: user?.created_at || 'N/A',
        last_login: user?.last_login || 'N/A'
      })
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err)
      error('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Gère le changement de mot de passe
   */
  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      error('Veuillez remplir tous les champs')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Les nouveaux mots de passe ne correspondent pas')
      return
    }

    if (passwordData.newPassword.length < 6) {
      error('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      setSaving(true)
      
      // Appel API pour changer le mot de passe
      await userService.updateUserPassword(user.id, passwordData.newPassword)
      
      success('Mot de passe modifié avec succès')
      
      // Réinitialiser le formulaire
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
    } catch (err) {
      console.error('Erreur lors de la modification du mot de passe:', err)
      error('Erreur lors de la modification du mot de passe')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Formate la date
   * @param {string} dateString - Date à formater
   * @returns {string} - Date formatée
   */
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
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
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
    }
  }

  // Charger le profil au montage
  useEffect(() => {
    loadProfile()
  }, [user])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement du profil...</div>
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
            <User className="w-8 h-8" />
            Mon Profil
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos informations personnelles et votre mot de passe
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations du profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations du compte
            </CardTitle>
            <CardDescription>
              Vos informations personnelles et de compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={profileData.username}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Rôle</Label>
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(profileData.role)}`}>
                  {getRoleIcon(profileData.role)}
                  {profileData.role}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Statut</Label>
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  profileData.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {profileData.is_active ? 'Actif' : 'Inactif'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Compte créé le</Label>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(profileData.created_at)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Dernière connexion</Label>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(profileData.last_login)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Modifiez votre mot de passe pour sécuriser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Saisissez votre mot de passe actuel"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Saisissez votre nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Le mot de passe doit contenir au moins 6 caractères. 
                Choisissez un mot de passe fort pour sécuriser votre compte.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handlePasswordChange}
              disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Modification...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Modifier le mot de passe
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
