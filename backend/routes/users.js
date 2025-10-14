const express = require('express');
const { check } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  listUsers,
  toggleUserActive,
  activateUser,
  deactivateUser,
  updateUserPassword,
} = require('../controllers/userController');

const router = express.Router();

// GET /api/users - Lister tous les utilisateurs (admin)
router.get('/', auth, isAdmin, listUsers);

// PUT /api/users/:id/toggle-active - Activer/désactiver un utilisateur (admin)
router.put(
  '/:id/toggle-active',
  auth,
  isAdmin,
  [
    check('is_active', 'is_active doit être un booléen').isBoolean(),
  ],
  toggleUserActive
);

// PUT /api/users/:id/activate - Activer un utilisateur (admin)
router.put('/:id/activate', auth, isAdmin, activateUser);

// PUT /api/users/:id/deactivate - Désactiver un utilisateur (admin)
router.put('/:id/deactivate', auth, isAdmin, deactivateUser);

// PUT /api/users/:id/password - Modifier le mot de passe d'un utilisateur (admin)
router.put(
  '/:id/password',
  auth,
  isAdmin,
  [
    check('new_password', 'Le nouveau mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 }),
  ],
  updateUserPassword
);

module.exports = router;
