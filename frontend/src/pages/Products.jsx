import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Alert, AlertDescription } from '../components/ui/alert.jsx'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table.jsx'

/**
 * Composant de gestion des produits avec shadcn/ui
 * @returns {JSX.Element} - Élément React
 */
function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Ordinateur Portable",
      category: "Informatique",
      stock: 15,
      price: 899.99,
      status: "En stock"
    },
    {
      id: 2,
      name: "Souris Sans Fil",
      category: "Informatique",
      stock: 3,
      price: 29.99,
      status: "Stock faible"
    },
    {
      id: 3,
      name: "Clavier Mécanique",
      category: "Informatique",
      stock: 0,
      price: 149.99,
      status: "Rupture de stock"
    },
    {
      id: 4,
      name: "Écran 24 pouces",
      category: "Informatique",
      stock: 8,
      price: 199.99,
      status: "En stock"
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  /**
   * Filtre les produits selon le terme de recherche
   */
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /**
   * Détermine la variante du badge selon le statut
   * @param {string} status - Statut du produit
   * @returns {string} - Variante du badge
   */
  const getStatusVariant = (status) => {
    switch (status) {
      case 'En stock':
        return 'default'
      case 'Stock faible':
        return 'secondary'
      case 'Rupture de stock':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre inventaire de produits
          </p>
        </div>
        <Button>Ajouter un Produit</Button>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher des Produits</CardTitle>
          <CardDescription>
            Trouvez rapidement un produit dans votre inventaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="search">Recherche</Label>
            <Input
              id="search"
              placeholder="Nom du produit ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alertes de stock */}
      {products.some(p => p.status === 'Rupture de stock') && (
        <Alert variant="destructive">
          <AlertDescription>
            ⚠️ Attention : {products.filter(p => p.status === 'Rupture de stock').length} produit(s) en rupture de stock
          </AlertDescription>
        </Alert>
      )}

      {products.some(p => p.status === 'Stock faible') && (
        <Alert>
          <AlertDescription>
            📦 {products.filter(p => p.status === 'Stock faible').length} produit(s) avec un stock faible
          </AlertDescription>
        </Alert>
      )}

      {/* Tableau des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des Produits</CardTitle>
          <CardDescription>
            Liste de tous les produits ({filteredProducts.length} produit(s))
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>€{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        Mouvement
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Products
