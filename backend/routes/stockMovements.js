const express = require('express');
const { check } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const {
  listStockMovements,
  getStockMovement,
  getMovementsByProduct,
  createStockMovement,
} = require('../controllers/stockMovementController');

const router = express.Router();

// GET /api/stock-movements - Lister tous les mouvements (admin)
router.get('/', auth, isAdmin, listStockMovements);

// GET /api/stock-movements/:id - Obtenir un mouvement (admin)
router.get('/:id', auth, isAdmin, getStockMovement);

// GET /api/stock-movements/product/:productId - Historique d'un produit (auth)
router.get('/product/:productId', auth, getMovementsByProduct);

// POST /api/stock-movements - Créer un mouvement (auth)
router.post(
  '/',
  auth,
  [
    check('product_id', 'product_id est requis et doit être un entier').isInt(),
    check('type', "type doit être 'in' ou 'out'").isIn(['in', 'out', 'IN', 'OUT']),
    check('quantity', 'quantity doit être un entier positif').isInt({ min: 1 }),
    check('note').optional().isString(),
  ],
  createStockMovement
);

module.exports = router;
