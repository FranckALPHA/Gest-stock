# Documentation API du Serveur de Gestion de Stock

Cette documentation décrit les endpoints disponibles pour l'API backend de l'application de gestion de stock. Le serveur fonctionne sur le port 5000 par défaut (configurable via la variable d'environnement PORT).

## Base URL
```
http://localhost:5000/api
```

## Authentification
Certaines routes nécessitent un token JWT dans l'en-tête `Authorization` sous la forme `Bearer <token>`.

## Endpoints

### Authentification

#### Inscription
- **URL** : `/auth/register`
- **Méthode** : POST
- **Accès** : Public
- **Body** :
  ```json
  {
    "username": "string",
    "password": "string (min 6 caractères)",
    "email": "string",
    "role": "string"
  }
  ```
- **Réponse** : Token JWT et informations utilisateur

#### Connexion
- **URL** : `/auth/login`
- **Méthode** : POST
- **Accès** : Public
- **Body** :
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Réponse** : Token JWT et informations utilisateur

#### Profil utilisateur
- **URL** : `/auth/me`
- **Méthode** : GET
- **Accès** : Privé (nécessite token)
- **Réponse** : Informations de l'utilisateur connecté

### Catégories

#### Lister toutes les catégories
- **URL** : `/categories?search=term&page=1&limit=10`
- **Méthode** : GET
- **Accès** : Public
- **Paramètres de requête** :
  - `search` (optionnel) : Rechercher par nom ou description
  - `page` (optionnel) : Numéro de page (défaut : 1)
  - `limit` (optionnel) : Nombre d'éléments par page (défaut : 10)
- **Réponse** : Objet avec `categories` et `pagination`

#### Obtenir une catégorie
- **URL** : `/categories/:id`
- **Méthode** : GET
- **Accès** : Public

#### Créer une catégorie
- **URL** : `/categories`
- **Méthode** : POST
- **Accès** : Admin (nécessite token et rôle admin)
- **Body** :
  ```json
  {
    "name": "string",
    "description": "string (optionnel)"
  }
  ```

#### Modifier une catégorie
- **URL** : `/categories/:id`
- **Méthode** : PUT
- **Accès** : Admin

#### Supprimer une catégorie
- **URL** : `/categories/:id`
- **Méthode** : DELETE
- **Accès** : Admin

### Produits

#### Lister tous les produits
- **URL** : `/products?page=1&limit=10&category_id=1&supplier_id=2&search=term`
- **Méthode** : GET
- **Accès** : Public
- **Paramètres de requête** :
  - `page` (optionnel) : Numéro de page (défaut : 1)
  - `limit` (optionnel) : Nombre d'éléments par page (défaut : 10)
  - `category_id` (optionnel) : Filtrer par catégorie
  - `supplier_id` (optionnel) : Filtrer par fournisseur
  - `search` (optionnel) : Rechercher par nom ou description
- **Réponse** : Objet avec `products` et `pagination`

#### Obtenir un produit
- **URL** : `/products/:id`
- **Méthode** : GET
- **Accès** : Public

#### Rechercher des produits
- **URL** : `/products/search?q=term`
- **Méthode** : GET
- **Accès** : Public

#### Produits en stock faible
- **URL** : `/products/low-stock`
- **Méthode** : GET
- **Accès** : Public

#### Créer un produit
- **URL** : `/products`
- **Méthode** : POST
- **Accès** : Admin
- **Body** :
  ```json
  {
    "name": "string",
    "description": "string (optionnel)",
    "category_id": "number (optionnel)",
    "supplier_id": "number (optionnel)",
    "price": "number",
    "quantity": "number (optionnel)",
    "alert_threshold": "number (optionnel)"
  }
  ```

#### Modifier un produit
- **URL** : `/products/:id`
- **Méthode** : PUT
- **Accès** : Admin

#### Supprimer un produit
- **URL** : `/products/:id`
- **Méthode** : DELETE
- **Accès** : Admin

### Fournisseurs

#### Lister tous les fournisseurs
- **URL** : `/suppliers?search=term&page=1&limit=10`
- **Méthode** : GET
- **Accès** : Public
- **Paramètres de requête** :
  - `search` (optionnel) : Rechercher par nom, contact, email, téléphone ou adresse
  - `page` (optionnel) : Numéro de page (défaut : 1)
  - `limit` (optionnel) : Nombre d'éléments par page (défaut : 10)
- **Réponse** : Objet avec `suppliers` et `pagination`

#### Obtenir un fournisseur
- **URL** : `/suppliers/:id`
- **Méthode** : GET
- **Accès** : Public

#### Créer un fournisseur
- **URL** : `/suppliers`
- **Méthode** : POST
- **Accès** : Admin
- **Body** :
  ```json
  {
    "name": "string",
    "contact": "string (optionnel)",
    "email": "string (optionnel)",
    "phone": "string (optionnel)",
    "address": "string (optionnel)"
  }
  ```

#### Modifier un fournisseur
- **URL** : `/suppliers/:id`
- **Méthode** : PUT
- **Accès** : Admin

#### Supprimer un fournisseur
- **URL** : `/suppliers/:id`
- **Méthode** : DELETE
- **Accès** : Admin

### Mouvements de Stock

#### Lister tous les mouvements
- **URL** : `/stock-movements`
- **Méthode** : GET
- **Accès** : Admin

#### Obtenir un mouvement
- **URL** : `/stock-movements/:id`
- **Méthode** : GET
- **Accès** : Admin

#### Historique d'un produit
- **URL** : `/stock-movements/product/:productId`
- **Méthode** : GET
- **Accès** : Authentifié

#### Créer un mouvement
- **URL** : `/stock-movements`
- **Méthode** : POST
- **Accès** : Authentifié
- **Body** :
  ```json
  {
    "product_id": "number",
    "type": "string ('in' ou 'out')",
    "quantity": "number",
    "note": "string (optionnel)"
  }
  ```

### Dashboard

#### Statistiques générales
- **URL** : `/dashboard/stats`
- **Méthode** : GET
- **Accès** : Authentifié

#### Alertes de stock faible
- **URL** : `/dashboard/alerts`
- **Méthode** : GET
- **Accès** : Authentifié

#### Mouvements récents
- **URL** : `/dashboard/recent-movements`
- **Méthode** : GET
- **Accès** : Authentifié

## Utilisation côté Frontend

### Exemple d'utilisation avec JavaScript/Fetch

```javascript
// Exemple de connexion
async function login(username, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

// Exemple d'utilisation d'un endpoint protégé
async function getProducts() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/products', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
}
```

Assure-toi de gérer les erreurs et les tokens d'authentification côté frontend.
