const express = require('express');
const { check } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const router = express.Router();

// GET /api/categories - Lister toutes les catégories
router.get('/', listCategories);

// GET /api/categories/:id - Obtenir une catégorie
router.get('/:id', getCategory);

// POST /api/categories - Créer une catégorie (admin)
router.post(
  '/',
  auth,
  isAdmin,
  [
    check('name', "Le nom de la catégorie est requis").trim().not().isEmpty(),
    check('description').optional().isString(),
  ],
  createCategory
);

// PUT /api/categories/:id - Modifier une catégorie (admin)
router.put(
  '/:id',
  auth,
  isAdmin,
  [
    check('name', "Le nom de la catégorie est requis").trim().not().isEmpty(),
    check('description').optional().isString(),
  ],
  updateCategory
);

// DELETE /api/categories/:id - Supprimer une catégorie (admin)
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;
