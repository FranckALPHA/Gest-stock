# Étape 3 – Authentification et sécurité

## 📋 Informations générales
- **Objectif :** Implémenter le système d'authentification JWT et la gestion des rôles
- **Durée estimée :** 3-4 heures
- **Statut :** 🔄 En attente
- **Date de début :** [À remplir]
- **Date de fin :** [À remplir]

## ✅ Tâches à accomplir
- [ ] Créer le middleware d'authentification JWT
- [ ] Implémenter les routes d'authentification (/auth/login, /auth/register)
- [ ] Créer le contrôleur d'authentification avec hashage des mots de passe
- [ ] Implémenter la gestion des rôles (Admin/Employé)
- [ ] Créer le middleware de protection des routes
- [ ] Tester l'authentification avec Postman ou curl

## 📦 Livrable attendu
Système d'authentification sécurisé avec JWT fonctionnel.

## 🔐 Fonctionnalités d'authentification
### Routes à implémenter :
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/register` - Inscription (admin seulement)
- `GET /auth/me` - Informations utilisateur connecté
- `POST /auth/logout` - Déconnexion

### Rôles utilisateur :
- **admin** : Accès complet à toutes les fonctionnalités
- **employee** : Accès limité (lecture stock, gestion des mouvements)

## 📝 Notes et observations
*[À remplir pendant le développement]*

## 🐛 Problèmes rencontrés
*[À remplir si des problèmes surviennent]*

## 🔗 Commandes utiles
```bash
# Installer les dépendances d'authentification
npm install jsonwebtoken bcryptjs cors

# Tester l'authentification
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📊 Progression
**0/6 tâches terminées (0%)**

---
*Dernière mise à jour : [Date à mettre à jour]*
