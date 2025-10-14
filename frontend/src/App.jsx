import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'
import Categories from './pages/Categories.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Separator } from './components/ui/separator.jsx'
import { Button } from './components/ui/button.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { Link } from 'react-router-dom'

/**
 * Composant de navigation principal
 * @returns {JSX.Element} - Barre de navigation
 */
function Navigation() {
  const { user, logout, isAdmin, isManager } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              Gestion de Stock
            </Link>
            {user?.role && (
              <Badge 
                variant="outline"
                className={`ml-2 ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-50' 
                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {user.role === 'admin' ? 'BOSS' : 'EMPLOYÉ'}
              </Badge>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Tableau de bord
            </Link>
            <Link 
              to="/products" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Produits
            </Link>
            <Link 
              to="/categories" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Catégories
            </Link>
          </nav>

          {/* Informations utilisateur et déconnexion */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.name || user?.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Composant de layout principal avec navigation
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} - Layout avec navigation
 */
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}

/**
 * Composant regroupant les routes de l'application avec protection
 * @returns {JSX.Element}
 */
function AppRoutes() {
  /**
   * Composant de tableau de bord protégé avec shadcn/ui
   * @returns {JSX.Element}
   */
  function Dashboard() {
    return (
      <div className="space-y-6">
        {/* En-tête du tableau de bord */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre gestion de stock
            </p>
          </div>
          <Badge variant="secondary">En ligne</Badge>
        </div>

        <Separator />

        {/* Cartes de statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stock Faible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Produits nécessitant un réapprovisionnement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mouvements Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Entrées et sorties de stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valeur Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€12,450</div>
              <p className="text-xs text-muted-foreground">
                Valeur totale du stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Section d'actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/products" className="flex items-center space-x-4 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Gestion des Produits
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Voir et gérer tous les produits
                  </p>
                </div>
              </Link>
              <Link to="/categories" className="flex items-center space-x-4 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Gestion des Catégories
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Organiser les catégories de produits
                  </p>
                </div>
              </Link>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Mouvement de Stock
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enregistrer une entrée ou sortie
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Rapports
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Consulter les statistiques détaillées
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Categories />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/**
 * Composant principal de l'application
 * @returns {JSX.Element} - Application React avec routing et authentification
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App