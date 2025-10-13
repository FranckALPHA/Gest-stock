const express = require('express');
const { check } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require('../controllers/productController');

const router = express.Router();

// GET /api/products - Lister tous les produits (avec filtres à implémenter ultérieurement)
router.get('/', listProducts);

// GET /api/products/:id - Obtenir un produit
router.get('/:id', getProduct);

// GET /api/products/search?q=term - Rechercher des produits
router.get('/search', searchProducts);

// POST /api/products - Créer un produit (admin)
router.post(
  '/',
  auth,
  isAdmin,
  [
    check('name', "Le nom du produit est requis").trim().not().isEmpty(),
    check('description').optional().isString(),
    check('category_id').optional({ nullable: true }).isInt(),
    check('supplier_id').optional({ nullable: true }).isInt(),
    check('price', 'Le prix est requis et doit être un nombre').isFloat(),
    check('quantity').optional().isInt(),
    check('alert_threshold').optional().isInt(),
  ],
  createProduct
);

// PUT /api/products/:id - Modifier un produit (admin)
router.put(
  '/:id',
  auth,
  isAdmin,
  [
    check('name', "Le nom du produit est requis").trim().not().isEmpty(),
    check('description').optional().isString(),
    check('category_id').optional({ nullable: true }).isInt(),
    check('supplier_id').optional({ nullable: true }).isInt(),
    check('price').isFloat(),
    check('quantity').isInt(),
    check('alert_threshold').isInt(),
  ],
  updateProduct
);

// DELETE /api/products/:id - Supprimer un produit (admin)
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;
