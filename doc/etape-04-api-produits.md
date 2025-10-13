# Étape 4 – API Backend - Gestion des produits et catégories

## 📋 Informations générales
- **Objectif :** Créer les endpoints CRUD pour les produits et catégories
- **Durée estimée :** 4-5 heures
- **Statut :** 🔄 En attente
- **Date de début :** [À remplir]
- **Date de fin :** [À remplir]

## ✅ Tâches à accomplir
- [ ] Créer les routes pour les catégories (/api/categories)
- [ ] Créer les routes pour les produits (/api/products)
- [ ] Implémenter les contrôleurs avec validation des données
- [ ] Ajouter la gestion des erreurs et codes de statut HTTP
- [ ] Implémenter la recherche et filtrage des produits
- [ ] Tester toutes les routes avec des requêtes API

## 📦 Livrable attendu
API REST complète pour la gestion des produits et catégories.

## 🛠️ Routes à implémenter

### Catégories (/api/categories)
- `GET /api/categories` - Lister toutes les catégories
- `GET /api/categories/:id` - Obtenir une catégorie
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/:id` - Modifier une catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin)

### Produits (/api/products)
- `GET /api/products` - Lister tous les produits (avec filtres)
- `GET /api/products/:id` - Obtenir un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)
- `GET /api/products/search?q=term` - Rechercher des produits

## 📝 Notes et observations
*[À remplir pendant le développement]*

## 🐛 Problèmes rencontrés
*[À remplir si des problèmes surviennent]*

## 🔗 Commandes utiles
```bash
# Tester les routes des catégories
curl -X GET http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Tester les routes des produits
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Progression
**0/6 tâches terminées (0%)**

---
*Dernière mise à jour : [Date à mettre à jour]*
