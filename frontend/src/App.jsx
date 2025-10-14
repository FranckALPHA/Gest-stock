import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Separator } from './components/ui/separator.jsx'

/**
 * Composant principal de l'application
 * @returns {JSX.Element} - Élément React
 */
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Ajouter un Produit
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Créer un nouveau produit dans le stock
                  </p>
                </div>
              </div>
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
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App