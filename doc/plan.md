# 🧾 Plan de Développement - Application de Gestion de Stock (MVP)

## 📋 Vue d'ensemble du projet

**Objectif :** Développer un MVP fonctionnel d'application de gestion de stock en 3 jours.

**Technologies :**
- **Frontend :** React + Vite + Tailwind CSS  
- **Backend :** Node.js + Express  
- **Base de données :** SQLite  
- **Sécurité :** Authentification JWT  
- **Rôles utilisateurs :** Administrateur et Employé  

**Durée estimée :** 3 jours
- **Jours 1-2 :** Backend complet (Étapes 1-5)
- **Jour 3 :** Frontend et finalisation (Étapes 6-10)

---

## 🎯 Étapes de Développement

### Étape 1 – Initialisation du projet
**Objectif :** Créer la structure de base du projet avec backend et frontend fonctionnels.  
**Durée estimée :** 2-3 heures  
**Tâches :**
- [ ] Créer la structure des dossiers backend/ et frontend/
- [ ] Initialiser le projet Node.js backend avec package.json
- [ ] Installer les dépendances backend (Express, SQLite3, JWT, bcrypt, cors)
- [ ] Initialiser le projet React frontend avec Vite
- [ ] Installer les dépendances frontend (React, Tailwind CSS, Axios, React Router)
- [ ] Configurer les scripts de démarrage dans les package.json
**Livrable attendu :** Structure du projet prête avec serveurs de développement fonctionnels.

### Étape 2 – Configuration de la base de données
**Objectif :** Mettre en place SQLite et créer le schéma de base de données.  
**Durée estimée :** 2-3 heures  
**Tâches :**
- [ ] Créer le fichier de configuration de la base de données (config/db.js)
- [ ] Créer les modèles de données (User, Product, Category, Supplier, StockMovement)
- [ ] Créer les tables SQLite avec les relations appropriées
- [ ] Ajouter des données de test (utilisateur admin par défaut)
- [ ] Tester la connexion à la base de données
**Livrable attendu :** Base de données SQLite fonctionnelle avec schéma complet.

### Étape 3 – Authentification et sécurité
**Objectif :** Implémenter le système d'authentification JWT et la gestion des rôles.  
**Durée estimée :** 3-4 heures  
**Tâches :**
- [ ] Créer le middleware d'authentification JWT
- [ ] Implémenter les routes d'authentification (/auth/login, /auth/register)
- [ ] Créer le contrôleur d'authentification avec hashage des mots de passe
- [ ] Implémenter la gestion des rôles (Admin/Employé)
- [ ] Créer le middleware de protection des routes
- [ ] Tester l'authentification avec Postman ou curl
**Livrable attendu :** Système d'authentification sécurisé avec JWT fonctionnel.

### Étape 4 – API Backend - Gestion des produits et catégories
**Objectif :** Créer les endpoints CRUD pour les produits et catégories.  
**Durée estimée :** 4-5 heures  
**Tâches :**
- [ ] Créer les routes pour les catégories (/api/categories)
- [ ] Créer les routes pour les produits (/api/products)
- [ ] Implémenter les contrôleurs avec validation des données
- [ ] Ajouter la gestion des erreurs et codes de statut HTTP
- [ ] Implémenter la recherche et filtrage des produits
- [ ] Tester toutes les routes avec des requêtes API
**Livrable attendu :** API REST complète pour la gestion des produits et catégories.

### Étape 5 – API Backend - Gestion des fournisseurs et mouvements de stock
**Objectif :** Implémenter la gestion des fournisseurs et le suivi des mouvements de stock.  
**Durée estimée :** 4-5 heures  
**Tâches :**
- [ ] Créer les routes pour les fournisseurs (/api/suppliers)
- [ ] Créer les routes pour les mouvements de stock (/api/stock-movements)
- [ ] Implémenter la logique d'entrée/sortie de stock
- [ ] Ajouter la validation des quantités et seuils d'alerte
- [ ] Créer les endpoints de statistiques pour le dashboard
- [ ] Tester les fonctionnalités de gestion de stock
**Livrable attendu :** API complète pour la gestion des fournisseurs et mouvements de stock.

### Étape 6 – Frontend React - Structure et authentification
**Objectif :** Créer l'interface utilisateur de base avec système d'authentification.  
**Durée estimée :** 3-4 heures  
**Tâches :**
- [ ] Configurer React Router pour la navigation
- [ ] Créer le contexte d'authentification (AuthContext)
- [ ] Implémenter la page de connexion (Login.jsx)
- [ ] Créer le service API pour les appels backend
- [ ] Implémenter la gestion des tokens JWT côté client
- [ ] Créer le composant de protection des routes
**Livrable attendu :** Interface de connexion fonctionnelle avec authentification.

### Étape 7 – Frontend React - Interface principale
**Objectif :** Développer les pages principales de l'application.  
**Durée estimée :** 4-5 heures  
**Tâches :**
- [ ] Créer le layout principal avec Sidebar et Navbar
- [ ] Implémenter la page Dashboard avec statistiques
- [ ] Créer la page de gestion des produits avec CRUD
- [ ] Créer la page de gestion des catégories
- [ ] Créer la page de gestion des fournisseurs
- [ ] Implémenter la page des mouvements de stock
**Livrable attendu :** Interface utilisateur complète pour toutes les fonctionnalités.

### Étape 8 – Frontend React - Fonctionnalités avancées
**Objectif :** Ajouter les fonctionnalités d'alerte et de visualisation.  
**Durée estimée :** 3-4 heures  
**Tâches :**
- [ ] Implémenter les alertes de stock faible
- [ ] Créer des graphiques pour le dashboard (Chart.js ou Recharts)
- [ ] Ajouter la recherche et filtrage dans les listes
- [ ] Implémenter la pagination pour les grandes listes
- [ ] Créer des modales pour les formulaires
- [ ] Ajouter la gestion des erreurs et messages de succès
**Livrable attendu :** Interface utilisateur complète avec fonctionnalités avancées.

### Étape 9 – Intégration et tests
**Objectif :** Connecter le frontend au backend et tester l'application complète.  
**Durée estimée :** 2-3 heures  
**Tâches :**
- [ ] Configurer les variables d'environnement (ports, URLs)
- [ ] Tester toutes les fonctionnalités end-to-end
- [ ] Corriger les bugs et problèmes d'intégration
- [ ] Optimiser les performances et la responsivité
- [ ] Ajouter la gestion d'erreurs globale
- [ ] Tester avec différents rôles utilisateur
**Livrable attendu :** Application complète et fonctionnelle.

### Étape 10 – Finalisation et packaging
**Objectif :** Préparer l'application pour le déploiement et l'utilisation.  
**Durée estimée :** 1-2 heures  
**Tâches :**
- [ ] Créer un script de démarrage unique (npm start)
- [ ] Ajouter la documentation d'utilisation
- [ ] Créer un fichier README avec instructions d'installation
- [ ] Optimiser le build de production
- [ ] Tester l'application en mode production
- [ ] Créer un package d'installation Windows (optionnel)
**Livrable attendu :** MVP prêt pour utilisation avec documentation complète.

---

## 📊 Structure du Projet

### Backend Structure
```
backend/
├── package.json
├── server.js
├── /config/
│   └── db.js
├── /models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Supplier.js
│   └── StockMovement.js
├── /routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── supplierRoutes.js
│   └── stockRoutes.js
├── /controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── supplierController.js
│   └── stockController.js
└── /middleware/
    ├── authMiddleware.js
    └── errorHandler.js
```

### Frontend Structure
```
frontend/
├── package.json
├── vite.config.js
├── index.html
├── /src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── /pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Suppliers.jsx
│   │   ├── Categories.jsx
│   │   └── Stock.jsx
│   ├── /components/
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── ProductForm.jsx
│   ├── /services/
│   │   └── api.js
│   └── /context/
│       └── AuthContext.jsx
```

---

## 🗄️ Base de Données

### Tables principales
| Table | Colonnes principales | Description |
|-------|---------------------|-------------|
| **users** | id, username, email, password_hash, role | Informations utilisateurs |
| **products** | id, name, category_id, price, quantity, alert_threshold | Gestion des produits |
| **categories** | id, name | Catégories de produits |
| **suppliers** | id, name, contact, email, phone | Fournisseurs |
| **stock_movements** | id, product_id, type (in/out), quantity, date, note | Mouvements de stock |

---

## 🔐 Fonctionnalités Principales

### A. Authentification et Sécurité
- Connexion / Déconnexion
- Création d'utilisateurs (par l'administrateur)
- Gestion des rôles :
  - **Administrateur** : accès complet
  - **Employé** : accès restreint au stock et fournisseurs
- Sécurisation des routes via **JWT (JSON Web Token)**

### B. Gestion du Stock
- CRUD Produits
- Suivi des quantités disponibles
- Alertes de stock faible (basées sur un seuil)
- Historique des entrées/sorties
- Association produit ↔ fournisseur

### C. Gestion des Fournisseurs
- Enregistrement et mise à jour des informations fournisseurs
- Lien entre fournisseurs et produits
- Historique des approvisionnements

### D. Tableau de Bord
- Statistiques globales :
  - Nombre total de produits
  - Nombre de catégories
  - Mouvements récents
- Graphiques d'évolution du stock (Chart.js ou Recharts)
- Alertes de stock bas affichées directement sur le tableau de bord

---

## 📝 Notes de Développement

- **Priorité :** Fonctionnalités essentielles d'abord, optimisations ensuite
- **Tests :** Tester chaque étape avant de passer à la suivante
- **Documentation :** Mettre à jour ce plan au fur et à mesure de l'avancement
- **Backup :** Sauvegarder régulièrement le code et la base de données

---

*Dernière mise à jour : [Date à mettre à jour]*
