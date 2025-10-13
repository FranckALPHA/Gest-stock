# Étape 2 – Configuration de la base de données

## 📋 Informations générales
- **Objectif :** Mettre en place SQLite et créer le schéma de base de données
- **Durée estimée :** 2-3 heures
- **Statut :** 🔄 En attente
- **Date de début :** [À remplir]
- **Date de fin :** [À remplir]

## ✅ Tâches à accomplir
- [ ] Créer le fichier de configuration de la base de données (config/db.js)
- [ ] Créer les modèles de données (User, Product, Category, Supplier, StockMovement)
- [ ] Créer les tables SQLite avec les relations appropriées
- [ ] Ajouter des données de test (utilisateur admin par défaut)
- [ ] Tester la connexion à la base de données

## 📦 Livrable attendu
Base de données SQLite fonctionnelle avec schéma complet.

## 🗄️ Structure de la base de données
### Tables à créer :
- **users** : id, username, password_hash, role, created_at
- **categories** : id, name, description, created_at
- **suppliers** : id, name, contact, email, phone, address, created_at
- **products** : id, name, description, category_id, supplier_id, price, quantity, alert_threshold, created_at
- **stock_movements** : id, product_id, type, quantity, date, note, user_id, created_at

## 📝 Notes et observations
*[À remplir pendant le développement]*

## 🐛 Problèmes rencontrés
*[À remplir si des problèmes surviennent]*

## 🔗 Commandes utiles
```bash
# Installer SQLite3
npm install sqlite3

# Tester la connexion
node -e "const sqlite3 = require('sqlite3'); console.log('SQLite3 installé avec succès');"
```

## 📊 Progression
**0/5 tâches terminées (0%)**

---
*Dernière mise à jour : [Date à mettre à jour]*
