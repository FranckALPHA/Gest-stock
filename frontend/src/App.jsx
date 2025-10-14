import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Categories from './pages/Categories.jsx'
import Suppliers from './pages/Suppliers.jsx'
import StockMovements from './pages/StockMovements.jsx'
import Users from './pages/Users.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { Link } from 'react-router-dom'
import { Badge } from './components/ui/badge.jsx'
import { Button } from './components/ui/button.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'

/**
 * Composant de navigation principal
 * @returns {JSX.Element} - Barre de navigation
 */
function Navigation() {
  const { user, logout, isAdmin, isManager } = useAuth();

  return (
    <nav className="border-b bg-background border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-foreground hover:text-muted-foreground transition-colors">
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
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tableau de bord
            </Link>
            <Link 
              to="/products" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Produits
            </Link>
            <Link 
              to="/categories" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Catégories
            </Link>
            <Link 
              to="/suppliers" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Fournisseurs
            </Link>
            <Link 
              to="/stock-movements" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mouvements
            </Link>
            {isAdmin() && (
              <Link 
                to="/users" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Utilisateurs
              </Link>
            )}
          </nav>

          {/* Informations utilisateur, thème et déconnexion */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{user?.name || user?.email}</span>
            </div>
            
            {/* Bouton de basculement de thème */}
            <ThemeToggle />
            
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
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suppliers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock-movements"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StockMovements />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Users />
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
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App