# Gestion des Catégories - Documentation

## Vue d'ensemble

Le module de gestion des catégories permet aux administrateurs et gestionnaires de créer, modifier, supprimer et consulter les catégories de produits dans le système de gestion de stock.

## Fonctionnalités

### 🔐 Permissions
- **Lecture** : Tous les utilisateurs connectés peuvent consulter les catégories
- **Écriture** : Seuls les utilisateurs avec le rôle `admin` ou `manager` peuvent créer, modifier ou supprimer des catégories

### 📋 Actions disponibles
- **Créer** une nouvelle catégorie avec nom et description
- **Modifier** une catégorie existante
- **Supprimer** une catégorie (avec confirmation)
- **Rechercher** dans les catégories par nom ou description
- **Consulter** la liste complète des catégories

## Architecture technique

### Composants principaux

#### `src/pages/Categories.jsx`
Page principale de gestion des catégories avec :
- Liste des catégories dans un tableau responsive
- Barre de recherche en temps réel
- Modales pour créer/modifier/supprimer
- Gestion des permissions et états de chargement

#### `src/components/CategoryForm.jsx`
Formulaire réutilisable pour créer et modifier les catégories :
- Validation avec Zod et react-hook-form
- Champs : nom (obligatoire) et description (optionnelle)
- Gestion des erreurs et états de soumission

#### `src/components/ToastContainer.jsx`
Système de notifications toast pour :
- Messages de succès/erreur
- Feedback utilisateur élégant
- Auto-dismiss après 5 secondes

#### `src/hooks/useToast.js`
Hook personnalisé pour gérer les notifications :
- Types : success, error, warning, info
- Gestion automatique de la durée d'affichage
- API simple pour afficher des messages

### Composants shadcn/ui utilisés

- **Dialog** : Modales pour les actions CRUD
- **Form** : Validation des formulaires avec react-hook-form
- **Table** : Affichage des catégories
- **Button, Input, Textarea** : Éléments d'interface
- **Badge, Card, Separator** : Mise en page et design

## API Integration

### Service `categoryService`
```javascript
// Méthodes disponibles
getAllCategories()     // Récupérer toutes les catégories
getCategoryById(id)    // Récupérer une catégorie par ID
createCategory(data)   // Créer une nouvelle catégorie
updateCategory(id, data) // Modifier une catégorie
deleteCategory(id)     // Supprimer une catégorie
```

### Gestion d'erreurs
- **403 Forbidden** : Permissions insuffisantes
- **401 Unauthorized** : Session expirée
- **400 Bad Request** : Données invalides
- **500 Server Error** : Erreur serveur

## Validation des données

### Schéma Zod
```javascript
const categorySchema = z.object({
  name: z.string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  description: z.string()
    .max(200, 'La description ne peut pas dépasser 200 caractères')
    .optional()
    .or(z.literal(''))
})
```

## Navigation

### Routes
- `/categories` : Page principale de gestion des catégories

### Liens de navigation
- Barre de navigation principale
- Actions rapides du tableau de bord
- Breadcrumbs (si implémentés)

## États de l'interface

### Chargement
- Indicateur de chargement lors des requêtes API
- États de soumission des formulaires
- Désactivation des boutons pendant les actions

### Messages utilisateur
- Notifications toast pour le feedback
- Messages d'erreur contextuels
- Confirmations d'actions destructives

## Responsive Design

- Tableau adaptatif pour mobile/desktop
- Modales responsive
- Navigation mobile-friendly
- Grilles flexibles avec Tailwind CSS

## Sécurité

- Vérification des permissions côté client et serveur
- Validation des données d'entrée
- Protection CSRF via tokens d'authentification
- Gestion sécurisée des sessions

## Performance

- Chargement paresseux des données
- Recherche en temps réel optimisée
- Mise en cache des requêtes (si implémenté)
- Composants optimisés avec React.memo (si nécessaire)
