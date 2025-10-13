# Étape 5 – API Backend - Gestion des fournisseurs et mouvements de stock

## 📋 Informations générales
- **Objectif :** Implémenter la gestion des fournisseurs et le suivi des mouvements de stock
- **Durée estimée :** 4-5 heures
- **Statut :** 🔄 En attente
- **Date de début :** [À remplir]
- **Date de fin :** [À remplir]

## ✅ Tâches à accomplir
- [ ] Créer les routes pour les fournisseurs (/api/suppliers)
- [ ] Créer les routes pour les mouvements de stock (/api/stock-movements)
- [ ] Implémenter la logique d'entrée/sortie de stock
- [ ] Ajouter la validation des quantités et seuils d'alerte
- [ ] Créer les endpoints de statistiques pour le dashboard
- [ ] Tester les fonctionnalités de gestion de stock

## 📦 Livrable attendu
API complète pour la gestion des fournisseurs et mouvements de stock.

## 🛠️ Routes à implémenter

### Fournisseurs (/api/suppliers)
- `GET /api/suppliers` - Lister tous les fournisseurs
- `GET /api/suppliers/:id` - Obtenir un fournisseur
- `POST /api/suppliers` - Créer un fournisseur (admin)
- `PUT /api/suppliers/:id` - Modifier un fournisseur (admin)
- `DELETE /api/suppliers/:id` - Supprimer un fournisseur (admin)

### Mouvements de stock (/api/stock-movements)
- `GET /api/stock-movements` - Lister tous les mouvements
- `GET /api/stock-movements/:id` - Obtenir un mouvement
- `POST /api/stock-movements` - Créer un mouvement (entrée/sortie)
- `GET /api/stock-movements/product/:productId` - Historique d'un produit

### Statistiques (/api/dashboard)
- `GET /api/dashboard/stats` - Statistiques générales
- `GET /api/dashboard/alerts` - Alertes de stock faible
- `GET /api/dashboard/recent-movements` - Mouvements récents

## 📊 Logique métier
### Types de mouvements :
- **IN** : Entrée de stock (achat, retour, etc.)
- **OUT** : Sortie de stock (vente, perte, etc.)

### Validation :
- Vérifier que la quantité est positive
- Pour les sorties, vérifier que le stock disponible est suffisant
- Mettre à jour automatiquement la quantité du produit

## 📝 Notes et observations
*[À remplir pendant le développement]*

## 🐛 Problèmes rencontrés
*[À remplir si des problèmes surviennent]*

## 🔗 Commandes utiles
```bash
# Tester un mouvement d'entrée
curl -X POST http://localhost:5000/api/stock-movements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"type":"IN","quantity":10,"note":"Réapprovisionnement"}'

# Obtenir les statistiques
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Progression
**0/6 tâches terminées (0%)**

---
*Dernière mise à jour : [Date à mettre à jour]*
