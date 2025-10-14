# Services API - Documentation

## Vue d'ensemble

Les services API ont été réorganisés en modules séparés pour une meilleure maintenabilité et organisation du code. Chaque service est maintenant dans son propre fichier avec des responsabilités claires.

## Structure des fichiers

```
src/services/
├── api.js                    # Configuration de base axios
├── index.js                  # Export centralisé de tous les services
├── auth.api.js              # Services d'authentification
├── category.api.js          # Services de gestion des catégories
├── product.api.js           # Services de gestion des produits
├── stock-movement.api.js    # Services de gestion des mouvements de stock
└── dashboard.api.js         # Services du tableau de bord
```

## Services disponibles

### 🔐 `auth.api.js` - Authentification
```javascript
import { authService } from '../services/auth.api.js';

// Méthodes disponibles
authService.login(username, password)
authService.logout()
authService.isAuthenticated()
authService.getCurrentUser()
authService.getToken()
```

### 📁 `category.api.js` - Gestion des catégories
```javascript
import { categoryService } from '../services/category.api.js';

// Méthodes disponibles
categoryService.getAllCategories()
categoryService.getCategoryById(id)
categoryService.createCategory({ name, description })
categoryService.updateCategory(id, { name, description })
categoryService.deleteCategory(id)
categoryService.canDeleteCategory(id)
```

### 📦 `product.api.js` - Gestion des produits
```javascript
import { productService } from '../services/product.api.js';

// Méthodes disponibles
productService.getAllProducts()
productService.getProductById(id)
productService.createProduct(productData)
productService.updateProduct(id, productData)
productService.deleteProduct(id)
productService.searchProducts(searchTerm)
productService.getProductsByCategory(categoryId)
productService.getLowStockProducts(threshold)
```

### 📊 `stock-movement.api.js` - Mouvements de stock
```javascript
import { stockMovementService } from '../services/stock-movement.api.js';

// Méthodes disponibles
stockMovementService.getAllMovements(filters)
stockMovementService.getMovementById(id)
stockMovementService.createMovement(movementData)
stockMovementService.updateMovement(id, updates)
stockMovementService.deleteMovement(id)
stockMovementService.getProductMovementHistory(productId, filters)
stockMovementService.getRecentMovements(days)
stockMovementService.adjustStock(productId, newQuantity, reason)
```

### 📈 `dashboard.api.js` - Tableau de bord
```javascript
import { dashboardService } from '../services/dashboard.api.js';

// Méthodes disponibles
dashboardService.getDashboardStats()
dashboardService.getProductStats()
dashboardService.getMovementStats(filters)
dashboardService.getCategoryStats()
dashboardService.getLowStockProducts(threshold)
dashboardService.getRecentMovements(limit)
dashboardService.getStockTrends(filters)
dashboardService.getAlerts()
dashboardService.markAlertAsRead(alertId)
dashboardService.getPerformanceReport(filters)
```

## Configuration de base

### `api.js` - Instance axios
```javascript
import api from '../services/api.js';

// Configuration automatique :
// - Base URL : http://localhost:3001/api
// - Headers : Content-Type: application/json
// - Intercepteurs pour l'authentification
// - Gestion automatique des erreurs 401
```

### `index.js` - Export centralisé
```javascript
// Import de tous les services depuis un seul endroit
import { 
  authService, 
  categoryService, 
  productService, 
  stockMovementService, 
  dashboardService 
} from '../services/index.js';
```

## Avantages de cette structure

### 🎯 **Séparation des responsabilités**
- Chaque service a une responsabilité claire
- Code plus facile à maintenir et déboguer
- Équipes peuvent travailler sur différents services indépendamment

### 📦 **Modularité**
- Import uniquement des services nécessaires
- Réduction de la taille des bundles
- Meilleure organisation du code

### 🔧 **Maintenabilité**
- Modifications isolées par service
- Tests unitaires plus faciles
- Documentation claire par domaine

### 🚀 **Performance**
- Lazy loading possible des services
- Tree shaking optimisé
- Imports spécifiques uniquement

## Migration depuis l'ancien système

### Avant (ancien api.js)
```javascript
import { categoryService, authService } from '../services/api';
```

### Après (nouveau système)
```javascript
// Option 1 : Import spécifique
import { categoryService } from '../services/category.api.js';
import { authService } from '../services/auth.api.js';

// Option 2 : Import centralisé
import { categoryService, authService } from '../services/index.js';
```

## Gestion d'erreurs

Tous les services utilisent la même configuration axios avec :
- **Intercepteurs automatiques** pour l'authentification
- **Gestion des erreurs 401** (redirection automatique vers login)
- **Headers automatiques** (Content-Type, Authorization)
- **Base URL configurable** via les variables d'environnement

## Variables d'environnement

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Bonnes pratiques

### ✅ **Imports recommandés**
```javascript
// Préférer les imports spécifiques
import { categoryService } from '../services/category.api.js';

// Ou utiliser l'index pour plusieurs services
import { categoryService, productService } from '../services/index.js';
```

### ✅ **Gestion d'erreurs**
```javascript
try {
  const categories = await categoryService.getAllCategories();
} catch (error) {
  // Gestion d'erreur spécifique
  if (error.response?.status === 403) {
    // Permissions insuffisantes
  }
}
```

### ✅ **Types de données**
Tous les services sont documentés avec JSDoc pour une meilleure intégration TypeScript future.

## Tests

Chaque service peut être testé indépendamment :
```javascript
// Exemple de test unitaire
import { categoryService } from '../services/category.api.js';

// Mock de l'API
jest.mock('../services/api.js');

describe('categoryService', () => {
  it('should fetch all categories', async () => {
    // Test du service
  });
});
```
